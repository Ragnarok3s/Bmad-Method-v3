from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone

import pytest
from fastapi.testclient import TestClient
from opentelemetry import trace

from services.core.config import CoreSettings, TenantSettings
from services.core.database import get_database
from services.core.domain.models import ReconciliationSource, ReconciliationStatus
from services.core.inventory import InventoryReconciliationService
from services.core.main import build_application
from services.core.metrics import record_dashboard_request
from quality import privacy


def build_client(tmp_path) -> TestClient:
    settings = CoreSettings(
        database_url=f"sqlite:///{tmp_path}/reservations-e2e.db",
        tenancy=TenantSettings(platform_token="platform-secret"),
    )
    app = build_application(settings)
    return TestClient(app, headers={"x-tenant-slug": settings.tenancy.default_slug})


@pytest.mark.e2e
def test_reservations_reconciliation_and_observability(tmp_path, monkeypatch) -> None:
    monkeypatch.setattr(privacy, "SYNTHETIC_EMAIL_DOMAIN", "example.com")
    client = build_client(tmp_path)
    logging.getLogger("opentelemetry").setLevel(logging.ERROR)
    logging.getLogger("opentelemetry.sdk.metrics").setLevel(logging.ERROR)
    logging.getLogger("opentelemetry.sdk.metrics._internal").setLevel(logging.ERROR)
    logging.getLogger("opentelemetry.exporter.otlp.proto.grpc.exporter").setLevel(
        logging.ERROR
    )
    logging.getLogger("opentelemetry.instrumentation.instrumentor").setLevel(
        logging.ERROR
    )

    property_payload = {
        "name": "Hotel Horizonte",
        "timezone": "Europe/Lisbon",
        "address": "Rua do Sol, 500",
        "units": 15,
    }
    property_response = client.post("/properties", json=property_payload)
    assert property_response.status_code == 201
    property_id = property_response.json()["id"]

    now = datetime.now(timezone.utc)
    reservation_payload = {
        "property_id": property_id,
        "guest_name": "Thiago Observador",
        "guest_email": "thiago@example.com",
        "check_in": (now + timedelta(days=1)).isoformat(),
        "check_out": (now + timedelta(days=4)).isoformat(),
    }
    first_reservation = client.post(
        f"/properties/{property_id}/reservations", json=reservation_payload
    )
    assert first_reservation.status_code == 201
    first_reservation_id = first_reservation.json()["id"]

    second_payload = {
        "property_id": property_id,
        "guest_name": "Marina Recon",
        "guest_email": "marina@example.com",
        "check_in": (now + timedelta(days=5)).isoformat(),
        "check_out": (now + timedelta(days=8)).isoformat(),
    }
    second_reservation = client.post(
        f"/properties/{property_id}/reservations", json=second_payload
    )
    assert second_reservation.status_code == 201

    status_response = client.patch(
        f"/reservations/{first_reservation_id}", json={"status": "checked_in"}
    )
    assert status_response.status_code == 200
    assert status_response.json()["status"] == "checked_in"

    reservations_response = client.get(f"/properties/{property_id}/reservations")
    assert reservations_response.status_code == 200
    reservations = reservations_response.json()
    assert len(reservations) == 2
    assert {item["status"] for item in reservations} == {"confirmed", "checked_in"}
    assert all(
        item["guest_email"].endswith(f"@{privacy.SYNTHETIC_EMAIL_DOMAIN}")
        for item in reservations
    )

    database = client.app.dependency_overrides[get_database]()
    with database.session_scope() as session:
        reconciliation = InventoryReconciliationService(session)
        reconciliation.enqueue(
            property_id=property_id,
            reservation_id=first_reservation_id,
            payload={"diff": "rate_mismatch", "channel": "otahub"},
            external_booking_id="OTA-9001",
            source=ReconciliationSource.OTA,
        )
        reconciliation.enqueue(
            property_id=property_id,
            reservation_id=None,
            payload={"diff": "missing_booking"},
            source=ReconciliationSource.MANUAL,
            status=ReconciliationStatus.IN_REVIEW,
            next_action_at=now + timedelta(hours=6),
        )

    reconciliation_response = client.get(
        f"/properties/{property_id}/inventory/reconciliation"
    )
    assert reconciliation_response.status_code == 200
    reconciliation_payload = reconciliation_response.json()
    assert reconciliation_payload["pending_count"] == 2
    assert reconciliation_payload["property_id"] == property_id
    reconciliation_statuses = {
        item["status"] for item in reconciliation_payload["items"]
    }
    assert reconciliation_statuses == {"pending", "in_review"}
    assert {item["payload"]["diff"] for item in reconciliation_payload["items"]} == {
        "rate_mismatch",
        "missing_booking",
    }

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

    record_dashboard_request("overview", True)
    log_message = "reservations-e2e-observability"
    logging.getLogger("tests.e2e.reservations").info(log_message)
    tracer = trace.get_tracer(__name__)
    with tracer.start_as_current_span("reservations-observability-span"):
        pass

    health_response = client.get("/health/otel")
    assert health_response.status_code == 200
    health_payload = health_response.json()
    assert health_payload["ready"] is True
    assert health_payload["status"] in {"ok", "warming"}

    signals = health_payload["signals"]
    metrics_event = signals["metrics"]["last_event"]
    assert metrics_event is not None
    assert metrics_event["name"] == "bmad_core_dashboard_request_total"
    assert metrics_event["attributes"]["metric"] == "overview"

    logs_event = signals["logs"]["last_event"]
    assert logs_event is not None
    assert logs_event["attributes"].get("message")

    traces_event = signals["traces"]["last_event"]
    assert traces_event is not None
    assert traces_event["name"] == "reservations-observability-span"
