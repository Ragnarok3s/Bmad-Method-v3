from datetime import datetime, timedelta, timezone

import pytest
from fastapi.testclient import TestClient

from services.core.config import CoreSettings
from services.core.database import get_database
from services.core.domain.models import Partner, PartnerSLA, SLAStatus
from services.core.main import build_application


def build_client(tmp_path) -> TestClient:
    settings = CoreSettings(database_url=f"sqlite:///{tmp_path}/integration.db")
    app = build_application(settings)
    return TestClient(app)


@pytest.mark.reservations
def test_full_reservation_flow(tmp_path) -> None:
    client = build_client(tmp_path)

    property_payload = {
        "name": "Residencial Porto",
        "timezone": "Europe/Lisbon",
        "address": "Rua das Flores, 100",
        "units": 12,
    }
    property_response = client.post("/properties", json=property_payload)
    assert property_response.status_code == 201
    property_id = property_response.json()["id"]

    agent_payload = {"name": "Joana", "email": "joana@example.com", "role": "property_manager"}
    agent_response = client.post("/agents", json=agent_payload)
    assert agent_response.status_code == 201
    agent_id = agent_response.json()["id"]

    now = datetime.now(timezone.utc)
    reservation_payload = {
        "property_id": property_id,
        "guest_name": "Carlos Lima",
        "guest_email": "carlos@example.com",
        "check_in": now.isoformat(),
        "check_out": (now + timedelta(days=3)).isoformat(),
    }
    reservation_response = client.post(
        f"/properties/{property_id}/reservations", json=reservation_payload
    )
    assert reservation_response.status_code == 201
    reservation_id = reservation_response.json()["id"]

    conflict_response = client.post(
        f"/properties/{property_id}/reservations", json=reservation_payload
    )
    assert conflict_response.status_code == 409

    status_update_response = client.patch(
        f"/reservations/{reservation_id}", json={"status": "checked_in"}
    )
    assert status_update_response.status_code == 200
    assert status_update_response.json()["status"] == "checked_in"

    task_payload = {
        "property_id": property_id,
        "reservation_id": reservation_id,
        "assigned_agent_id": agent_id,
        "scheduled_date": datetime.now(timezone.utc).isoformat(),
    }
    task_response = client.post("/housekeeping/tasks", json=task_payload)
    assert task_response.status_code == 201
    task_id = task_response.json()["id"]

    unauthorized = client.patch(
        f"/housekeeping/tasks/{task_id}",
        params={"actor_id": 999},
        json={"status": "completed"},
    )
    assert unauthorized.status_code == 404

    update_response = client.patch(
        f"/housekeeping/tasks/{task_id}",
        params={"actor_id": agent_id},
        json={"status": "completed"},
    )
    assert update_response.status_code == 200
    assert update_response.json()["status"] == "completed"

    graphql_query = {
        "query": "{ properties { id name } }"
    }
    gql_response = client.post("/graphql", json=graphql_query)
    assert gql_response.status_code == 200
    assert gql_response.json()["data"]["properties"][0]["name"] == "Residencial Porto"


def test_partner_sla_webhook_reconciliation(tmp_path) -> None:
    client = build_client(tmp_path)
    database = client.app.dependency_overrides[get_database]()

    with database.session_scope() as session:
        laundry = Partner(name="AirLaundry", slug="airlaundry", category="lavandaria")
        maintenance = Partner(name="FixItNow", slug="fixitnow", category="manutencao")
        ota = Partner(name="Partner OTA Hub", slug="partner-ota-hub", category="ota")
        session.add_all([laundry, maintenance, ota])
        session.flush()

        session.add_all(
            [
                PartnerSLA(
                    partner_id=laundry.id,
                    metric="pickup_window",
                    metric_label="Janela de recolha",
                    target_minutes=45,
                    warning_minutes=60,
                    breach_minutes=90,
                    current_minutes=45,
                    status=SLAStatus.ON_TRACK,
                ),
                PartnerSLA(
                    partner_id=maintenance.id,
                    metric="repair_dispatch",
                    metric_label="Despacho manutenção",
                    target_minutes=60,
                    warning_minutes=75,
                    breach_minutes=90,
                    current_minutes=60,
                    status=SLAStatus.ON_TRACK,
                ),
                PartnerSLA(
                    partner_id=ota.id,
                    metric="api_availability",
                    metric_label="Disponibilidade API",
                    target_minutes=15,
                    warning_minutes=30,
                    breach_minutes=45,
                    current_minutes=10,
                    status=SLAStatus.ON_TRACK,
                ),
            ]
        )

    now = datetime.now(timezone.utc)

    on_track_response = client.post(
        "/partners/webhooks/reconcile",
        json={
            "event_id": "evt-sla-001",
            "partner_slug": "airlaundry",
            "metric": "pickup_window",
            "status": "delivered",
            "elapsed_minutes": 38,
            "occurred_at": now.isoformat(),
        },
    )
    assert on_track_response.status_code == 202
    on_track_body = on_track_response.json()
    assert on_track_body["status"] == "on_track"

    at_risk_response = client.post(
        "/partners/webhooks/reconcile",
        json={
            "event_id": "evt-sla-002",
            "partner_slug": "fixitnow",
            "metric": "repair_dispatch",
            "status": "delivered",
            "elapsed_minutes": 72,
            "occurred_at": (now + timedelta(minutes=5)).isoformat(),
        },
    )
    assert at_risk_response.status_code == 202
    assert at_risk_response.json()["status"] == "at_risk"

    breached_response = client.post(
        "/partners/webhooks/reconcile",
        json={
            "event_id": "evt-sla-003",
            "partner_slug": "partner-ota-hub",
            "metric": "api_availability",
            "status": "failed",
            "elapsed_minutes": 58,
            "occurred_at": (now + timedelta(minutes=10)).isoformat(),
        },
    )
    assert breached_response.status_code == 202
    breached_body = breached_response.json()
    assert breached_body["status"] == "breached"
    assert breached_body["last_violation_at"] is not None

    stale_response = client.post(
        "/partners/webhooks/reconcile",
        json={
            "event_id": "evt-sla-004",
            "partner_slug": "airlaundry",
            "metric": "pickup_window",
            "status": "delivered",
            "elapsed_minutes": 120,
            "occurred_at": (now - timedelta(minutes=3)).isoformat(),
        },
    )
    assert stale_response.status_code == 202
    stale_body = stale_response.json()
    assert stale_body["status"] == "on_track"
    assert stale_body["current_minutes"] == on_track_body["current_minutes"]
    stale_updated_at = datetime.fromisoformat(
        stale_body["updated_at"].replace("Z", "+00:00")
    )
    if stale_updated_at.tzinfo is None:
        stale_updated_at = stale_updated_at.replace(tzinfo=timezone.utc)
    on_track_updated_at = datetime.fromisoformat(
        on_track_body["updated_at"].replace("Z", "+00:00")
    )
    if on_track_updated_at.tzinfo is None:
        on_track_updated_at = on_track_updated_at.replace(tzinfo=timezone.utc)
    assert stale_updated_at == on_track_updated_at

    list_response = client.get("/partners/slas")
    assert list_response.status_code == 200
    payload = list_response.json()
    statuses = {item["partner"]["slug"]: item for item in payload}

    assert statuses["airlaundry"]["status"] == "on_track"
    assert statuses["fixitnow"]["status"] == "at_risk"
    assert statuses["partner-ota-hub"]["status"] == "breached"
    assert statuses["partner-ota-hub"]["metric_label"] == "Disponibilidade API"
