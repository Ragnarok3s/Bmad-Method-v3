from datetime import datetime, timedelta, timezone

from services.core.config import CoreSettings
from services.core.database import Database
from services.core.domain.models import (
    Base,
    HousekeepingStatus,
    HousekeepingTask,
    PartnerSLA,
    Property,
    Reservation,
    ReservationStatus,
    SLAStatus,
)
from services.core.recommendations import PrecisionRecallMonitor, RecommendationEngine
from services.core.domain.schemas import RecommendationPriority


def setup_database(tmp_path) -> Database:
    settings = CoreSettings(database_url=f"sqlite:///{tmp_path}/recommendations.db")
    database = Database(settings)
    database.create_all(Base)
    return database


def seed_telemetry(database: Database, now: datetime) -> dict[str, int]:
    with database.session_scope() as session:
        property_obj = Property(name="Aurora Suites", timezone="UTC")
        session.add(property_obj)
        session.flush()

        reservation_housekeeping = Reservation(
            property_id=property_obj.id,
            guest_name="Laura Campos",
            guest_email="laura@example.com",
            status=ReservationStatus.CONFIRMED,
            check_in=now + timedelta(hours=3),
            check_out=now + timedelta(days=2),
            total_amount_minor=42000,
            currency_code="BRL",
        )
        reservation_overdue = Reservation(
            property_id=property_obj.id,
            guest_name="Diego Martins",
            guest_email="diego@example.com",
            status=ReservationStatus.CONFIRMED,
            check_in=now - timedelta(hours=2),
            check_out=now + timedelta(days=1),
            total_amount_minor=38000,
            currency_code="BRL",
        )
        session.add_all([reservation_housekeeping, reservation_overdue])
        session.flush()

        session.add_all(
            [
                HousekeepingTask(
                    property_id=property_obj.id,
                    reservation_id=reservation_housekeeping.id,
                    status=HousekeepingStatus.PENDING,
                    scheduled_date=now - timedelta(hours=1),
                    notes="Quarto precisa de higienização profunda",
                ),
                HousekeepingTask(
                    property_id=property_obj.id,
                    reservation_id=reservation_housekeeping.id,
                    status=HousekeepingStatus.BLOCKED,
                    scheduled_date=now - timedelta(hours=2),
                    notes="Aguardando manutenção para liberar limpeza",
                ),
            ]
        )

        sla = PartnerSLA(
            partner_id=44,
            metric="first_response",
            metric_label="Tempo de primeira resposta",
            target_minutes=30,
            warning_minutes=45,
            breach_minutes=60,
            current_minutes=70,
            status=SLAStatus.AT_RISK,
        )
        session.add(sla)
        session.flush()

        return {
            "reservation_housekeeping": reservation_housekeeping.id,
            "reservation_overdue": reservation_overdue.id,
            "sla": sla.id,
        }


def test_recommendation_engine_prioritizes_operational_risks(tmp_path) -> None:
    now = datetime(2024, 5, 10, 12, 0, tzinfo=timezone.utc)
    database = setup_database(tmp_path)
    identifiers = seed_telemetry(database, now)

    with database.session_scope() as session:
        engine = RecommendationEngine(session, now_provider=lambda: now)
        recommendations = engine.generate()

    assert recommendations, "Engine deveria gerar pelo menos uma recomendação"
    keys = {item.key for item in recommendations}
    assert f"reservation:{identifiers['reservation_housekeeping']}:housekeeping_backlog" in keys
    assert f"sla:{identifiers['sla']}:at_risk" in keys
    assert f"reservation:{identifiers['reservation_overdue']}:overdue_check_in" in keys

    priorities = {item.key: item.priority for item in recommendations}
    assert priorities[f"reservation:{identifiers['reservation_housekeeping']}:housekeeping_backlog"] == RecommendationPriority.HIGH

    schemas = [item.to_schema() for item in recommendations]
    assert schemas[0].explainability, "Recomendação deve expor justificativas"

    monitor = PrecisionRecallMonitor()
    expected_relevant = {
        f"reservation:{identifiers['reservation_housekeeping']}:housekeeping_backlog",
        f"reservation:{identifiers['reservation_overdue']}:overdue_check_in",
    }
    result = monitor.evaluate(keys, expected_relevant, evaluated_at=now)
    assert result.report.precision >= 0.66
    assert result.report.recall == 1.0
    monitor.assert_thresholds(min_precision=0.6, min_recall=0.8)
