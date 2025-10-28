from __future__ import annotations

from datetime import datetime, time, timedelta, timezone

from services.core.analytics import PIPELINE
from services.core.config import CoreSettings
from services.core.database import Database
from services.core.domain.models import (
    Base,
    ExperienceSurveyResponse,
    ExperienceSurveyTouchpoint,
    HousekeepingStatus,
    HousekeepingTask,
    OTAChannel,
    OTASyncQueue,
    OTASyncStatus,
    Partner,
    PartnerSLA,
    SLAStatus,
)
from services.core.domain.schemas import PropertyCreate, ReservationCreate
from services.core.services import (
    OperationalMetricsService,
    PropertyService,
    ReservationService,
)


def setup_database(db_url: str) -> Database:
    settings = CoreSettings(database_url=db_url)
    database = Database(settings)
    database.create_all(Base)
    return database


def test_operational_metrics_overview(tmp_path) -> None:
    database = setup_database(f"sqlite:///{tmp_path}/operational_metrics.db")
    now = datetime.now(timezone.utc)
    check_in = datetime.combine(now.date(), time.min, tzinfo=timezone.utc)
    check_out = check_in + timedelta(days=2)

    with database.session_scope() as session:
        property_service = PropertyService(session)
        primary_property = property_service.create(
            PropertyCreate(name="Hotel Atlas", timezone="UTC", units=10)
        )
        secondary_property = property_service.create(
            PropertyCreate(name="Hotel Aurora", timezone="UTC", units=5)
        )

        reservation_service = ReservationService(session)
        reservation = reservation_service.create(
            ReservationCreate(
                property_id=primary_property.id,
                guest_name="Marina Observadora",
                guest_email="marina@example.com",
                check_in=check_in,
                check_out=check_out,
            )
        )

        session.add_all(
            [
                HousekeepingTask(
                    property_id=primary_property.id,
                    reservation_id=reservation.id,
                    status=HousekeepingStatus.BLOCKED,
                    scheduled_date=now - timedelta(hours=3),
                    notes="Playbook suíte premium",
                ),
                HousekeepingTask(
                    property_id=primary_property.id,
                    reservation_id=reservation.id,
                    status=HousekeepingStatus.IN_PROGRESS,
                    scheduled_date=now - timedelta(days=1, hours=2),
                ),
                HousekeepingTask(
                    property_id=primary_property.id,
                    reservation_id=reservation.id,
                    status=HousekeepingStatus.COMPLETED,
                    scheduled_date=now - timedelta(days=2),
                ),
                HousekeepingTask(
                    property_id=secondary_property.id,
                    reservation_id=None,
                    status=HousekeepingStatus.PENDING,
                    scheduled_date=now - timedelta(hours=5),
                ),
            ]
        )

        session.add_all(
            [
                ExperienceSurveyResponse(
                    touchpoint=ExperienceSurveyTouchpoint.OPERATIONS,
                    score=10,
                    submitted_at=now - timedelta(hours=1),
                ),
                ExperienceSurveyResponse(
                    touchpoint=ExperienceSurveyTouchpoint.OPERATIONS,
                    score=9,
                    submitted_at=now - timedelta(days=1),
                ),
                ExperienceSurveyResponse(
                    touchpoint=ExperienceSurveyTouchpoint.SUPPORT,
                    score=6,
                    submitted_at=now - timedelta(days=8),
                ),
                ExperienceSurveyResponse(
                    touchpoint=ExperienceSurveyTouchpoint.ONBOARDING,
                    score=7,
                    submitted_at=now - timedelta(days=9),
                ),
            ]
        )

        partner_a = Partner(name="Canal Supra", slug="canal-supra")
        partner_b = Partner(name="Suporte Ágil", slug="suporte-agil")
        session.add_all([partner_a, partner_b])
        session.flush()

        session.add_all(
            [
                PartnerSLA(
                    partner_id=partner_a.id,
                    metric="first_response",
                    metric_label="Primeira resposta",
                    target_minutes=30,
                    warning_minutes=45,
                    breach_minutes=60,
                    current_minutes=70,
                    status=SLAStatus.BREACHED,
                ),
                PartnerSLA(
                    partner_id=partner_a.id,
                    metric="resolution",
                    metric_label="Tempo resolução",
                    target_minutes=120,
                    warning_minutes=150,
                    breach_minutes=180,
                    current_minutes=110,
                    status=SLAStatus.ON_TRACK,
                ),
                PartnerSLA(
                    partner_id=partner_b.id,
                    metric="triage",
                    metric_label="Tempo triagem",
                    target_minutes=20,
                    warning_minutes=25,
                    breach_minutes=35,
                    current_minutes=28,
                    status=SLAStatus.AT_RISK,
                ),
            ]
        )

        channel_a = OTAChannel(name="Booking Integrator")
        channel_b = OTAChannel(name="Channel Bridge")
        session.add_all([channel_a, channel_b])
        session.flush()

        session.add_all(
            [
                OTASyncQueue(
                    property_id=primary_property.id,
                    channel_id=channel_a.id,
                    payload="{}",
                    status=OTASyncStatus.PENDING,
                ),
                OTASyncQueue(
                    property_id=primary_property.id,
                    channel_id=channel_a.id,
                    payload="{}",
                    status=OTASyncStatus.FAILED,
                ),
                OTASyncQueue(
                    property_id=secondary_property.id,
                    channel_id=channel_b.id,
                    payload="{}",
                    status=OTASyncStatus.SUCCESS,
                ),
            ]
        )

    with database.session_scope() as session:
        PIPELINE.reset()
        service = OperationalMetricsService(session)
        overview = service.get_overview(now.date())

    expected_occupancy_rate = round(1 / 15, 4)

    assert overview.occupancy.total_units == 15
    assert overview.occupancy.occupied_units == 1
    assert overview.occupancy.date == now.date()
    assert overview.occupancy.occupancy_rate == expected_occupancy_rate

    assert overview.operational.critical_alerts.total == 3
    assert overview.operational.critical_alerts.blocked == 1
    assert overview.operational.critical_alerts.overdue == 3
    assert len(overview.operational.critical_alerts.examples) == 3

    assert overview.operational.playbook_adoption.total_executions == 3
    assert overview.operational.playbook_adoption.completed == 1
    assert overview.operational.playbook_adoption.adoption_rate == round(1 / 3, 4)
    assert overview.operational.playbook_adoption.active_properties == 1
    assert (
        overview.operational.playbook_adoption.period_end
        >= overview.operational.playbook_adoption.period_start
    )

    assert overview.nps.total_responses == 4
    assert overview.nps.promoters == 2
    assert overview.nps.detractors == 1
    assert overview.nps.passives == 1
    assert overview.nps.score == 25.0
    assert overview.nps.trend_7d == 150.0
    assert overview.nps.last_response_at is not None
    assert (
        overview.nps.touchpoint_distribution[ExperienceSurveyTouchpoint.OPERATIONS]
        == 50.0
    )

    assert overview.sla.total == 3
    assert overview.sla.on_track == 1
    assert overview.sla.at_risk == 1
    assert overview.sla.breached == 1
    assert any("Primeira resposta" in offender for offender in overview.sla.worst_offenders)

    assert overview.operational.housekeeping_completion_rate.value == 25.0
    assert overview.operational.housekeeping_completion_rate.status == "breached"
    assert overview.operational.ota_sync_backlog.value == 3.0
    assert overview.operational.ota_sync_backlog.status == "on_track"
