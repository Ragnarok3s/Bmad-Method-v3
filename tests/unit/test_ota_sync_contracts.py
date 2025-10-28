from __future__ import annotations

import json
from datetime import datetime, timedelta, timezone

import pytest

from sqlalchemy import select

from services.core.config import CoreSettings
from services.core.database import Database
from services.core.domain.models import (
    Base,
    InventoryReconciliationQueue,
    OTASyncQueue,
    OTASyncStatus,
    Partner,
    PartnerSLA,
    Property,
    ReconciliationStatus,
)
from services.core.inventory import InventoryReconciliationService
from services.core.ota_sync import OTAIngestionContract, OTAReturnContract, OTASyncService


def setup_database(db_url: str) -> Database:
    settings = CoreSettings(database_url=db_url)
    database = Database(settings)
    database.create_all(Base)
    return database


@pytest.mark.ota
def test_booking_ingestion_under_sla_creates_job(tmp_path) -> None:
    database = setup_database(f"sqlite:///{tmp_path}/ota_ingest.db")
    now = datetime.now(timezone.utc)

    with database.session_scope() as session:
        property_obj = Property(name="Hotel Solaris", timezone="UTC", units=20)
        session.add(property_obj)
        session.flush()

        service = OTASyncService(session, InventoryReconciliationService(session))
        contract = OTAIngestionContract(
            channel_slug="booking-com",
            partner_name="Booking.com",
            external_id="BK-123",
            property_id=property_obj.id,
            reservation_id=None,
            status="confirmed",
            emitted_at=now - timedelta(minutes=2),
            received_at=now,
            payload={"guest": "Ana", "nights": 3},
        )

        result = service.ingest(contract)
        assert isinstance(result, OTASyncQueue)
        assert result.status == OTASyncStatus.PENDING
        payload = json.loads(result.payload)
        assert payload["external_id"] == "BK-123"

        sla = session.execute(
            select(PartnerSLA)
            .join(Partner)
            .where(Partner.slug == "booking-com", PartnerSLA.metric == "reservation_ingest")
        ).scalar_one()
        assert sla.current_version is not None
        assert sla.current_version.version == 1
        assert sla.current_minutes == 2


@pytest.mark.ota
def test_airbnb_ingestion_breach_goes_to_reconciliation(tmp_path) -> None:
    database = setup_database(f"sqlite:///{tmp_path}/ota_ingest_conflict.db")
    now = datetime.now(timezone.utc)

    with database.session_scope() as session:
        property_obj = Property(name="Casa Horizonte", timezone="UTC", units=4)
        session.add(property_obj)
        session.flush()

        service = OTASyncService(session, InventoryReconciliationService(session))
        contract = OTAIngestionContract(
            channel_slug="airbnb",
            partner_name="Airbnb",
            external_id="AB-777",
            property_id=property_obj.id,
            reservation_id=None,
            status="modified",
            emitted_at=now - timedelta(minutes=8),
            received_at=now,
            payload={"guest": "Bruno", "nights": 5},
        )

        result = service.ingest(contract)
        assert isinstance(result, InventoryReconciliationQueue)
        assert result.status == ReconciliationStatus.CONFLICT
        payload = json.loads(result.payload)
        assert payload["latency_minutes"] == 8
        assert result.sla_version_id is not None


@pytest.mark.ota
def test_expedia_return_within_sla_marks_success(tmp_path) -> None:
    database = setup_database(f"sqlite:///{tmp_path}/ota_return.db")
    now = datetime.now(timezone.utc)

    with database.session_scope() as session:
        property_obj = Property(name="Expedia Palace", timezone="UTC", units=12)
        session.add(property_obj)
        session.flush()

        service = OTASyncService(session, InventoryReconciliationService(session))
        ingest_contract = OTAIngestionContract(
            channel_slug="expedia",
            partner_name="Expedia",
            external_id="EX-888",
            property_id=property_obj.id,
            reservation_id=None,
            status="confirmed",
            emitted_at=now - timedelta(minutes=3),
            received_at=now,
            payload={"guest": "Clara", "nights": 2},
        )
        job = service.ingest(ingest_contract)
        assert isinstance(job, OTASyncQueue)

        response = service.finalize(
            OTAReturnContract(
                job_id=job.id,
                partner_slug="expedia",
                partner_name="Expedia",
                status="acknowledged",
                processed_at=job.created_at + timedelta(minutes=4),
                payload={"external_id": "EX-888", "status": "published"},
            )
        )

        assert isinstance(response, dict)
        assert response["status"] == OTASyncStatus.SUCCESS.value
        assert response["job_id"] == job.id

        queue_items = session.execute(select(InventoryReconciliationQueue)).scalars().all()
        assert queue_items == []

        return_sla = session.execute(
            select(PartnerSLA)
            .join(Partner)
            .where(Partner.slug == "expedia", PartnerSLA.metric == "reservation_return")
        ).scalar_one()
        assert return_sla.current_version is not None
        assert return_sla.current_version.version == 1
        assert return_sla.current_minutes == 4
