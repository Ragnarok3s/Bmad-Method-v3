from __future__ import annotations

from datetime import datetime, timedelta, timezone

import pytest
from fastapi.testclient import TestClient

from services.core.config import CoreSettings, TenantSettings
from services.core.database import get_database
from services.core.domain.models import ReconciliationSource, ReconciliationStatus
from services.core.inventory import InventoryReconciliationService
from services.core.main import build_application
from quality import privacy


pytestmark = pytest.mark.integration


def build_client(tmp_path) -> TestClient:
    settings = CoreSettings(
        database_url=f"sqlite:///{tmp_path}/integration-reservations.db",
        tenancy=TenantSettings(platform_token="platform-secret"),
    )
    app = build_application(settings)
    return TestClient(app, headers={"x-tenant-slug": settings.tenancy.default_slug})


@pytest.mark.reservations
def test_property_calendar_and_reconciliation_views(tmp_path, monkeypatch) -> None:
    monkeypatch.setattr(privacy, "SYNTHETIC_EMAIL_DOMAIN", "example.com")
    client = build_client(tmp_path)

    property_payload = {
        "name": "Casa Atlântica",
        "timezone": "Europe/Lisbon",
        "address": "Avenida Marítima, 12",
        "units": 8,
    }
    property_response = client.post("/properties", json=property_payload)
    assert property_response.status_code == 201
    property_id = property_response.json()["id"]

    now = datetime.now(timezone.utc)
    first_payload = {
        "property_id": property_id,
        "guest_name": "Paulo Calendario",
        "guest_email": "paulo@example.com",
        "check_in": (now + timedelta(days=1)).isoformat(),
        "check_out": (now + timedelta(days=3)).isoformat(),
    }
    second_payload = {
        "property_id": property_id,
        "guest_name": "Ana Recon",
        "guest_email": "ana@example.com",
        "check_in": (now + timedelta(days=4)).isoformat(),
        "check_out": (now + timedelta(days=7)).isoformat(),
    }

    first_reservation = client.post(
        f"/properties/{property_id}/reservations", json=first_payload
    )
    assert first_reservation.status_code == 201
    first_reservation_id = first_reservation.json()["id"]

    second_reservation = client.post(
        f"/properties/{property_id}/reservations", json=second_payload
    )
    assert second_reservation.status_code == 201

    list_response = client.get(f"/properties/{property_id}/reservations")
    assert list_response.status_code == 200
    reservations = list_response.json()
    assert len(reservations) == 2
    assert all(
        item["guest_email"].endswith(f"@{privacy.SYNTHETIC_EMAIL_DOMAIN}")
        for item in reservations
    )

    database = client.app.dependency_overrides[get_database]()
    with database.session_scope() as session:
        service = InventoryReconciliationService(session)
        service.enqueue(
            property_id=property_id,
            reservation_id=first_reservation_id,
            payload={"diff": "dates_out_of_sync"},
            external_booking_id="OTA-555",
            source=ReconciliationSource.OTA,
        )
        service.enqueue(
            property_id=property_id,
            reservation_id=None,
            payload={"diff": "unmapped_listing"},
            source=ReconciliationSource.DIRECT,
            status=ReconciliationStatus.IN_REVIEW,
        )

    calendar_response = client.get(f"/properties/{property_id}/calendar")
    assert calendar_response.status_code == 200
    calendar = calendar_response.json()
    assert calendar["property_id"] == property_id
    assert calendar["reservations_count"] == 2
    assert calendar["reconciliation_count"] == 2
    assert all(
        reservation["guest_email"].endswith(f"@{privacy.SYNTHETIC_EMAIL_DOMAIN}")
        for reservation in calendar["reservations"]
    )
    assert {item["status"] for item in calendar["reconciliation_items"]} == {
        "pending",
        "in_review",
    }

    reconciliation_response = client.get(
        f"/properties/{property_id}/inventory/reconciliation"
    )
    assert reconciliation_response.status_code == 200
    reconciliation = reconciliation_response.json()
    assert reconciliation["pending_count"] == 2
    assert reconciliation["property_id"] == property_id
    assert {item["payload"]["diff"] for item in reconciliation["items"]} == {
        "dates_out_of_sync",
        "unmapped_listing",
    }
