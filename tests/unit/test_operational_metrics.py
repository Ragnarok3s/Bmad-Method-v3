from __future__ import annotations

from datetime import datetime, time, timedelta, timezone

from services.core.config import CoreSettings
from services.core.database import Database
from services.core.domain.models import Base, HousekeepingStatus, HousekeepingTask
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

    with database.session_scope() as session:
        service = OperationalMetricsService(session)
        overview = service.get_overview(now.date())

    expected_occupancy_rate = round(1 / 15, 4)

    assert overview.occupancy.total_units == 15
    assert overview.occupancy.occupied_units == 1
    assert overview.occupancy.date == now.date()
    assert overview.occupancy.occupancy_rate == expected_occupancy_rate

    assert overview.critical_alerts.total == 3
    assert overview.critical_alerts.blocked == 1
    assert overview.critical_alerts.overdue == 3
    assert len(overview.critical_alerts.examples) == 3

    assert overview.playbook_adoption.total_executions == 3
    assert overview.playbook_adoption.completed == 1
    assert overview.playbook_adoption.adoption_rate == round(1 / 3, 4)
    assert overview.playbook_adoption.active_properties == 1
    assert overview.playbook_adoption.period_end >= overview.playbook_adoption.period_start
