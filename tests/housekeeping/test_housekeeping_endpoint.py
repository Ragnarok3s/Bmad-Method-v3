from datetime import datetime, timedelta, timezone

from fastapi.testclient import TestClient

from services.core.config import CoreSettings
from services.core.main import build_application


def build_client(tmp_path) -> TestClient:
    settings = CoreSettings(database_url=f"sqlite:///{tmp_path}/housekeeping_contract.db")
    app = build_application(settings)
    return TestClient(app)


def create_property(client: TestClient) -> int:
    payload = {
        "name": "Hotel Atlântico",
        "timezone": "Europe/Lisbon",
        "address": "Rua do Sol, 42",
        "units": 18,
    }
    response = client.post("/properties", json=payload)
    assert response.status_code == 201
    return response.json()["id"]


def create_agent(client: TestClient) -> int:
    payload = {
        "name": "Beatriz Sousa",
        "email": "beatriz@example.com",
        "role": "property_manager",
    }
    response = client.post("/agents", json=payload)
    assert response.status_code == 201
    return response.json()["id"]


def schedule_task(
    client: TestClient,
    *,
    property_id: int,
    assigned_agent_id: int,
    scheduled_date: datetime,
    notes: str | None = None,
) -> int:
    payload = {
        "property_id": property_id,
        "assigned_agent_id": assigned_agent_id,
        "scheduled_date": scheduled_date.isoformat(),
        "notes": notes,
    }
    response = client.post("/housekeeping/tasks", json=payload)
    assert response.status_code == 201
    return response.json()["id"]


def update_task_status(
    client: TestClient,
    *,
    task_id: int,
    actor_id: int,
    status: str,
) -> None:
    response = client.patch(
        f"/housekeeping/tasks/{task_id}",
        params={"actor_id": actor_id},
        json={"status": status},
    )
    assert response.status_code == 200


def test_housekeeping_list_supports_filters_and_pagination(tmp_path) -> None:
    client = build_client(tmp_path)
    property_id = create_property(client)
    agent_id = create_agent(client)

    base_date = datetime.now(timezone.utc).replace(microsecond=0)

    first_task = schedule_task(
        client,
        property_id=property_id,
        assigned_agent_id=agent_id,
        scheduled_date=base_date,
        notes="Preparar amenities premium",
    )
    second_task = schedule_task(
        client,
        property_id=property_id,
        assigned_agent_id=agent_id,
        scheduled_date=base_date + timedelta(hours=2),
        notes="Revisar minibar",
    )
    third_task = schedule_task(
        client,
        property_id=property_id,
        assigned_agent_id=agent_id,
        scheduled_date=base_date + timedelta(hours=4),
        notes="Check-out tardio",
    )
    fourth_task = schedule_task(
        client,
        property_id=property_id,
        assigned_agent_id=agent_id,
        scheduled_date=base_date + timedelta(days=1),
        notes="Intervenção de manutenção",
    )

    update_task_status(client, task_id=second_task, actor_id=agent_id, status="in_progress")
    update_task_status(client, task_id=third_task, actor_id=agent_id, status="completed")
    update_task_status(client, task_id=fourth_task, actor_id=agent_id, status="blocked")

    list_response = client.get(
        f"/properties/{property_id}/housekeeping",
        params={"page_size": 2},
    )
    assert list_response.status_code == 200
    payload = list_response.json()

    assert payload["pagination"] == {
        "page": 1,
        "page_size": 2,
        "total": 4,
        "total_pages": 2,
    }
    assert len(payload["items"]) == 2
    assert payload["items"][0]["id"] == first_task

    second_page = client.get(
        f"/properties/{property_id}/housekeeping",
        params={"page": 2, "page_size": 2},
    )
    assert second_page.status_code == 200
    second_payload = second_page.json()
    assert second_payload["pagination"]["page"] == 2
    assert len(second_payload["items"]) == 2

    filtered_by_status = client.get(
        f"/properties/{property_id}/housekeeping",
        params={"status": "completed"},
    )
    assert filtered_by_status.status_code == 200
    status_payload = filtered_by_status.json()
    assert len(status_payload["items"]) == 1
    assert status_payload["items"][0]["id"] == third_task

    filtered_by_date = client.get(
        f"/properties/{property_id}/housekeeping",
        params={
            "start_date": (base_date + timedelta(hours=1)).isoformat(),
            "end_date": (base_date + timedelta(hours=5)).isoformat(),
        },
    )
    assert filtered_by_date.status_code == 200
    date_payload = filtered_by_date.json()
    assert {item["id"] for item in date_payload["items"]} == {second_task, third_task}

    far_page = client.get(
        f"/properties/{property_id}/housekeeping",
        params={"page": 10, "page_size": 2},
    )
    assert far_page.status_code == 200
    far_payload = far_page.json()
    assert far_payload["pagination"]["page"] == 2
    assert len(far_payload["items"]) == 2

    missing_property = client.get("/properties/9999/housekeeping")
    assert missing_property.status_code == 404
