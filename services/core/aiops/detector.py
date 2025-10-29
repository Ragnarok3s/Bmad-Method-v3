"""Deteção de anomalias operacionais usando artefactos treinados."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from typing import Any, Callable

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..domain.models import PartnerSLA, Reservation, ReservationStatus, SLAStatus
from ..observability import get_signal_health_snapshot, mark_signal_event, record_critical_alert
from ..recommendations.engine import Recommendation, RecommendationSignal
from .repository import ModelRegistry


@dataclass(slots=True)
class AnomalyDetectionResult:
    """Resultado de deteção de anomalia incluindo recomendações sugeridas."""

    metric: str
    severity: str
    message: str
    score: float
    observed_value: float
    expected_range: tuple[float, float]
    metadata: dict[str, Any] = field(default_factory=dict)
    actions: list[str] = field(default_factory=list)

    def to_recommendation(self, *, now_provider: Callable[[], datetime] | None = None) -> Recommendation:
        now = now_provider() if now_provider else datetime.now(timezone.utc)
        signals = [
            RecommendationSignal(
                source="aiops",
                description=self.message,
                weight=max(0.0, min(self.score, 1.0)),
                metadata={"metric": self.metric},
            )
        ]
        summary = self.message
        title = f"Anomalia detectada: {self.metric}"
        return Recommendation(
            key=f"aiops:{self.metric}:{int(now.timestamp())}",
            title=title,
            summary=summary,
            score=max(0.1, min(self.score, 1.0)),
            source="aiops",
            created_at=now,
            signals=signals,
            metadata={"aiops_metric": self.metric, **self.metadata},
            actions=self.actions,
        )


class AIOpsAnomalyDetector:
    """Executa deteção de anomalias para reservas, SLAs e telemetria."""

    def __init__(
        self,
        session: Session,
        registry: ModelRegistry,
        *,
        now_provider: Callable[[], datetime] | None = None,
        alert_on_missing_baseline: bool = True,
    ) -> None:
        self.session = session
        self.registry = registry
        self._now_provider = now_provider or (lambda: datetime.now(timezone.utc))
        self.alert_on_missing_baseline = alert_on_missing_baseline

    def detect(self) -> list[AnomalyDetectionResult]:
        results: list[AnomalyDetectionResult] = []
        results.extend(self._detect_reservations())
        results.extend(self._detect_slas())
        results.extend(self._detect_telemetry())
        return results

    def detect_recommendations(self) -> list[Recommendation]:
        return [result.to_recommendation(now_provider=self._now_provider) for result in self.detect()]

    def _detect_reservations(self) -> list[AnomalyDetectionResult]:
        baseline = self.registry.load_latest("reservations.daily_volume")
        if baseline is None:
            if self.alert_on_missing_baseline:
                record_critical_alert(
                    "aiops_baseline_missing",
                    detail="Baseline de reservas não treinado.",
                    context={"metric": "reservations.daily_volume"},
                )
            return []
        now = self._now_provider()
        window_start = now - timedelta(hours=24)
        stmt = (
            select(func.count())
            .select_from(Reservation)
            .where(Reservation.status == ReservationStatus.CONFIRMED)
            .where(Reservation.created_at >= window_start)
        )
        count = float(self.session.scalar(stmt) or 0.0)
        return self._evaluate_metric(
            metric="reservations.daily_volume",
            observed=count,
            baseline=baseline,
            message=f"Volume diário de reservas em {count:.0f}",
            actions=["Lançar campanha de captação", "Rever segmentação de canais"],
        )

    def _detect_slas(self) -> list[AnomalyDetectionResult]:
        baseline = self.registry.load_latest("slas.breach_rate")
        if baseline is None:
            if self.alert_on_missing_baseline:
                record_critical_alert(
                    "aiops_baseline_missing",
                    detail="Baseline de SLAs não treinado.",
                    context={"metric": "slas.breach_rate"},
                )
            return []
        stmt_total = select(func.count()).select_from(PartnerSLA)
        total = float(self.session.scalar(stmt_total) or 0.0)
        if total == 0:
            return []
        stmt_breach = (
            select(func.count())
            .select_from(PartnerSLA)
            .where(PartnerSLA.status.in_((SLAStatus.BREACHED, SLAStatus.AT_RISK)))
        )
        breaches = float(self.session.scalar(stmt_breach) or 0.0)
        rate = breaches / total
        return self._evaluate_metric(
            metric="slas.breach_rate",
            observed=rate,
            baseline=baseline,
            message=f"Taxa de violação de SLA em {rate:.2%}",
            actions=["Acionar plano de contingência", "Rever escala de suporte"],
        )

    def _detect_telemetry(self) -> list[AnomalyDetectionResult]:
        snapshot = get_signal_health_snapshot()
        results: list[AnomalyDetectionResult] = []
        now = self._now_provider()
        for signal, detail in snapshot.items():
            baseline = self.registry.load_latest(f"telemetry.{signal}.lag_seconds")
            if baseline is None:
                if self.alert_on_missing_baseline:
                    record_critical_alert(
                        "aiops_baseline_missing",
                        detail="Baseline de telemetria não treinado.",
                        context={"metric": f"telemetry.{signal}.lag_seconds"},
                    )
                continue
            last_seen = detail.get("last_event_at")
            if last_seen is None:
                observed = float("inf")
            else:
                if isinstance(last_seen, str):
                    last_seen_dt = datetime.fromisoformat(last_seen)
                else:
                    last_seen_dt = last_seen
                observed = max((now - last_seen_dt).total_seconds(), 0.0)
            results.extend(
                self._evaluate_metric(
                    metric=f"telemetry.{signal}.lag_seconds",
                    observed=observed,
                    baseline=baseline,
                    message=f"Lag do sinal {signal} em {observed:.0f}s",
                    actions=["Verificar exportador OTLP", "Confirmar conectividade com collector"],
                    extra_metadata={"last_event_at": detail.get("last_event_at")},
                )
            )
        return results

    def _evaluate_metric(
        self,
        *,
        metric: str,
        observed: float,
        baseline,
        message: str,
        actions: list[str],
        extra_metadata: dict[str, Any] | None = None,
    ) -> list[AnomalyDetectionResult]:
        lower = float(baseline.thresholds.get("lower", 0.0))
        upper = float(baseline.thresholds.get("upper", lower))
        avg = float(baseline.statistics.get("mean", (lower + upper) / 2))
        spread = max(avg - lower, upper - avg, 1.0)
        score = min(1.0, abs(observed - avg) / spread)
        severity = "critical" if observed < lower or observed > upper else "info"
        if severity == "info" and score < 0.6:
            return []
        severity = "critical" if score >= 0.8 else "warning"
        mark_signal_event(
            "metrics",
            f"aiops:{metric}",
            {"score": f"{score:.2f}", "observed": f"{observed:.4f}", "expected": f"{avg:.4f}"},
        )
        metadata = {
            "observed": observed,
            "expected_mean": avg,
            "threshold_lower": lower,
            "threshold_upper": upper,
        }
        if extra_metadata:
            metadata.update(extra_metadata)
        return [
            AnomalyDetectionResult(
                metric=metric,
                severity=severity,
                message=message,
                score=score,
                observed_value=observed,
                expected_range=(lower, upper),
                metadata=metadata,
                actions=actions,
            )
        ]
