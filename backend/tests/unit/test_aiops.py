from datetime import datetime, timedelta, timezone
from pathlib import Path

import pytest

from services.core.automation import anomaly_trigger
from services.core.config import CoreSettings
from services.core.database import Database
from services.core.domain.models import Base, PartnerSLA, Property, Reservation, ReservationStatus, SLAStatus
from services.core import observability
from services.core.aiops import (
    AIOpsAnomalyDetector,
    AIOpsHistoricalObservation,
    AIOpsPerformanceMonitor,
    AIOpsTrainer,
    ModelRegistry,
)
from services.core.recommendations.engine import Recommendation


@pytest.fixture()
def registry(tmp_path: Path) -> ModelRegistry:
    base_path = tmp_path / "models" / "aiops"
    return ModelRegistry(base_path=base_path)


def setup_database(tmp_path: Path) -> Database:
    settings = CoreSettings(database_url=f"sqlite:///{tmp_path}/aiops.db")
    database = Database(settings)
    database.create_all(Base)
    return database


def test_aiops_trainer_persists_artifacts(registry: ModelRegistry) -> None:
    trainer = AIOpsTrainer(registry)
    observations = [
        AIOpsHistoricalObservation(
            timestamp=datetime(2024, 5, 1, tzinfo=timezone.utc),
            reservations_confirmed=120,
            sla_breach_rate=0.05,
            telemetry_lag_seconds={"metrics": 30.0, "logs": 20.0},
        ),
        AIOpsHistoricalObservation(
            timestamp=datetime(2024, 5, 2, tzinfo=timezone.utc),
            reservations_confirmed=130,
            sla_breach_rate=0.04,
            telemetry_lag_seconds={"metrics": 25.0, "logs": 18.0},
        ),
    ]

    artifacts = trainer.train(observations)

    assert len(artifacts) == 4  # reservas, SLA e 2 sinais de telemetria
    saved_files = list(registry.base_path.glob("*.json"))
    assert saved_files, "Artefactos devem ser persistidos em disco"
    for artifact in artifacts:
        assert artifact.thresholds["upper"] > artifact.statistics["mean"]
        assert artifact.thresholds["lower"] <= artifact.statistics["mean"]


def test_aiops_detector_identifies_anomalies(tmp_path: Path, registry: ModelRegistry, monkeypatch: pytest.MonkeyPatch) -> None:
    now = datetime(2024, 6, 10, 10, 0, tzinfo=timezone.utc)
    trainer = AIOpsTrainer(registry)
    trainer.train(
        [
            AIOpsHistoricalObservation(
                timestamp=now - timedelta(days=3),
                reservations_confirmed=180,
                sla_breach_rate=0.08,
                telemetry_lag_seconds={"metrics": 120.0, "logs": 90.0},
            ),
            AIOpsHistoricalObservation(
                timestamp=now - timedelta(days=2),
                reservations_confirmed=200,
                sla_breach_rate=0.07,
                telemetry_lag_seconds={"metrics": 110.0, "logs": 60.0},
            ),
        ]
    )

    database = setup_database(tmp_path)
    with database.session_scope() as session:
        property_obj = Property(name="AIOps Suites", timezone="UTC")
        session.add(property_obj)
        session.flush()
        session.add(
            Reservation(
                property_id=property_obj.id,
                guest_name="Marina Figueiredo",
                guest_email="marina@example.com",
                status=ReservationStatus.CONFIRMED,
                check_in=now + timedelta(hours=2),
                check_out=now + timedelta(days=2),
                created_at=now - timedelta(hours=1),
            )
        )
        session.add_all(
            [
                PartnerSLA(
                    partner_id=10,
                    metric="response_time",
                    metric_label="Primeira resposta",
                    target_minutes=30,
                    warning_minutes=45,
                    breach_minutes=60,
                    current_minutes=120,
                    status=SLAStatus.BREACHED,
                ),
                PartnerSLA(
                    partner_id=11,
                    metric="resolution_time",
                    metric_label="Tempo de resolução",
                    target_minutes=90,
                    warning_minutes=120,
                    breach_minutes=150,
                    current_minutes=130,
                    status=SLAStatus.AT_RISK,
                ),
            ]
        )

    metrics_state = observability._STATE.signals["metrics"]
    logs_state = observability._STATE.signals["logs"]
    original_metrics_last_event = metrics_state.last_event_at
    original_metrics_expected = metrics_state.expected
    original_logs_last_event = logs_state.last_event_at
    original_logs_expected = logs_state.expected
    try:
        metrics_state.expected = True
        metrics_state.last_event_at = now - timedelta(minutes=20)
        logs_state.expected = True
        logs_state.last_event_at = now - timedelta(seconds=70)

        alerts: list[tuple[str, str | None, dict | None, str]] = []
        monkeypatch.setattr(
            "services.core.aiops.detector.record_critical_alert",
            lambda name, detail=None, context=None, severity="critical": alerts.append((name, detail, context, severity)),
        )

        with database.session_scope() as session:
            detector = AIOpsAnomalyDetector(
                session,
                registry,
                now_provider=lambda: now,
                alert_on_missing_baseline=False,
            )
            results = detector.detect()

        metrics = {result.metric for result in results}
        assert "reservations.daily_volume" in metrics
        assert "slas.breach_rate" in metrics
        assert "telemetry.metrics.lag_seconds" in metrics
        assert "telemetry.logs.lag_seconds" not in metrics

        telemetry_result = next(item for item in results if item.metric == "telemetry.metrics.lag_seconds")
        assert telemetry_result.severity == "critical"
        recommendation = telemetry_result.to_recommendation(now_provider=lambda: now)
        assert recommendation.metadata["aiops_metric"] == "telemetry.metrics.lag_seconds"
        assert recommendation.actions

        assert not alerts, "Não deve acionar alerta crítico quando baseline existe"
    finally:
        metrics_state.last_event_at = original_metrics_last_event
        metrics_state.expected = original_metrics_expected
        logs_state.last_event_at = original_logs_last_event
        logs_state.expected = original_logs_expected


def test_anomaly_trigger_filters_recommendations() -> None:
    trigger = anomaly_trigger("reservations.daily_volume", min_score=0.7)
    now = datetime.now(timezone.utc)
    recommendation = Recommendation(
        key="aiops:reservations.daily_volume:1",
        title="Anomalia",
        summary="Queda de volume",
        score=0.8,
        source="aiops",
        created_at=now,
        signals=[],
        metadata={"aiops_metric": "reservations.daily_volume"},
        actions=["Investigar canais"],
    )

    assert trigger.predicate(recommendation) is True
    assert trigger.predicate(
        Recommendation(
            key="aiops:reservations.daily_volume:2",
            title="Anomalia",
            summary="Queda",
            score=0.6,
            source="aiops",
            created_at=now,
            signals=[],
            metadata={"aiops_metric": "reservations.daily_volume"},
            actions=[],
        )
    ) is False

    other_metric = Recommendation(
        key="aiops:slas.breach_rate:1",
        title="SLA",
        summary="Breach",
        score=0.9,
        source="aiops",
        created_at=now,
        signals=[],
        metadata={"aiops_metric": "slas.breach_rate"},
        actions=[],
    )
    assert trigger.predicate(other_metric) is False


def test_performance_monitor_alerts(monkeypatch: pytest.MonkeyPatch) -> None:
    alerts: list[tuple[str, str | None, dict | None, str]] = []
    monkeypatch.setattr(
        "services.core.aiops.monitoring.record_critical_alert",
        lambda name, detail=None, context=None, severity="critical": alerts.append((name, detail, context, severity)),
    )

    monitor = AIOpsPerformanceMonitor()
    drift_report = monitor.evaluate_drift(
        metric="reservations.daily_volume",
        baseline=[100.0, 110.0, 95.0],
        current=[60.0, 58.0, 62.0],
        threshold=0.2,
    )
    assert drift_report.drift_detected is True

    precision_report = monitor.evaluate_precision(
        metric="reservations.daily_volume",
        predicted_positive=[True, False, True, False],
        actual_positive=[True, False, False, True],
        min_precision=0.8,
        min_recall=0.7,
    )
    assert precision_report.passed is False

    alert_names = [name for name, *_ in alerts]
    assert "aiops_drift_detected" in alert_names
    assert "aiops_precision_alert" in alert_names
