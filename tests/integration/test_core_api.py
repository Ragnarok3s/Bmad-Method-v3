from datetime import datetime, timedelta, timezone

from fastapi.testclient import TestClient

from services.core.config import CoreSettings
from services.core.main import build_application


def build_client(tmp_path) -> TestClient:
    settings = CoreSettings(database_url=f"sqlite:///{tmp_path}/integration.db")
    app = build_application(settings)
    return TestClient(app)


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
