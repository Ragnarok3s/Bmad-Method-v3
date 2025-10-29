from __future__ import annotations

from datetime import datetime, timedelta, timezone

import pytest
from fastapi.testclient import TestClient

from services.core.config import CoreSettings, TenantSettings
from services.core.main import build_application


def build_client(tmp_path) -> TestClient:
    settings = CoreSettings(
        database_url=f"sqlite:///{tmp_path}/guest-experience.db",
        tenancy=TenantSettings(platform_token="platform-secret"),
    )
    app = build_application(settings)
    return TestClient(app, headers={"x-tenant-slug": settings.tenancy.default_slug})


@pytest.mark.e2e
def test_digital_guest_flow_end_to_end(tmp_path) -> None:
    client = build_client(tmp_path)

    # 1. Criar propriedade e reserva base.
    property_payload = {
        "name": "Hotel Aurora",
        "timezone": "Europe/Lisbon",
        "address": "Rua do Progresso, 200",
        "units": 20,
    }
    property_response = client.post("/properties", json=property_payload)
    assert property_response.status_code == 201
    property_id = property_response.json()["id"]

    now = datetime.now(timezone.utc)
    reservation_payload = {
        "property_id": property_id,
        "guest_name": "Laura Digital",
        "guest_email": "laura@example.com",
        "check_in": (now + timedelta(days=2)).isoformat(),
        "check_out": (now + timedelta(days=5)).isoformat(),
    }
    reservation_response = client.post(f"/properties/{property_id}/reservations", json=reservation_payload)
    assert reservation_response.status_code == 201
    reservation_id = reservation_response.json()["id"]

    status_response = client.patch(
        f"/reservations/{reservation_id}", json={"status": "checked_in"}
    )
    assert status_response.status_code == 200

    # 2. Sincronizar preferências e satisfação.
    snapshot_payload = {
        "reservation_id": reservation_id,
        "guest_email": reservation_payload["guest_email"],
        "guest_name": reservation_payload["guest_name"],
        "preferences": {"identity_verified": True, "preferred_channel": "whatsapp"},
        "journey_stage": "in_stay.experience",
        "satisfaction_score": 8.5,
        "check_in_completed": True,
        "upsell_acceptance": 0.25,
        "response_minutes": 8.0,
        "response_channel": "whatsapp",
    }
    sync_response = client.post("/guest-experience/journey", json=snapshot_payload)
    assert sync_response.status_code == 202
    assert sync_response.json()["enqueued"] == 0

    # 3. Disparar check-in digital.
    checkin_message = client.post(
        "/communications/send",
        json={
            "template_id": "guest_prearrival_checkin",
            "channel": "email",
            "recipient": reservation_payload["guest_email"],
            "locale": "pt-BR",
            "variables": {
                "guest_name": reservation_payload["guest_name"],
                "property_name": property_payload["name"],
                "days_to_check_in": 2,
                "check_in_url": "https://guest.bmad/checkin/abc",
            },
            "context": {
                "reservation_id": reservation_id,
                "journey_stage": "check_in.pre_arrival",
            },
        },
    )
    assert checkin_message.status_code == 202
    checkin_message_id = checkin_message.json()["id"]

    # 4. Registrar upsell e aceite via canal inbound.
    upsell_message = client.post(
        "/communications/send",
        json={
            "template_id": "guest_upsell_local_experience",
            "channel": "whatsapp",
            "recipient": "+5511999999999",
            "locale": "pt-BR",
            "variables": {
                "guest_name": reservation_payload["guest_name"],
                "experience_name": "Spa Sunrise",
                "date_label": "amanhã às 10h",
                "price_formatted": "R$ 320,00",
                "conversion_probability": 0.72,
            },
            "context": {
                "reservation_id": reservation_id,
                "journey_stage": "in_stay.experience",
                "upsell_offer": "spa-sunrise",
            },
        },
    )
    assert upsell_message.status_code == 202
    upsell_message_id = upsell_message.json()["id"]

    inbound_response = client.post(
        "/communications/messages/inbound",
        json={
            "channel": "whatsapp",
            "sender": reservation_payload["guest_email"],
            "body": "Sim, quero reservar o spa!",
            "locale": "pt-BR",
            "context": {
                "reservation_id": reservation_id,
                "journey_stage": "in_stay.experience",
                "upsell_offer": "spa-sunrise",
                "upsell_response": "accepted",
            },
            "in_reply_to": upsell_message_id,
        },
    )
    assert inbound_response.status_code == 201

    # Registrar agradecimento pós-estadia para ajustar satisfação.
    feedback_message = client.post(
        "/communications/send",
        json={
            "template_id": "guest_post_stay_feedback",
            "channel": "email",
            "recipient": reservation_payload["guest_email"],
            "locale": "pt-BR",
            "variables": {
                "guest_name": reservation_payload["guest_name"],
                "property_name": property_payload["name"],
            },
            "context": {
                "reservation_id": reservation_id,
                "journey_stage": "post_stay.feedback",
            },
        },
    )
    assert feedback_message.status_code == 202

    # 5. Consultar visão consolidada da jornada.
    overview_response = client.get(f"/guest-experience/{reservation_id}")
    assert overview_response.status_code == 200
    overview = overview_response.json()

    assert overview["reservation"]["guest_email"] == reservation_payload["guest_email"]
    assert overview["satisfaction_score"] == pytest.approx(8.5)
    assert any(step["completed"] for step in overview["check_in"])
    assert any(message["direction"] == "inbound" for message in overview["chat"])

    upsells = {item["status"] for item in overview["upsells"]}
    assert "accepted" in upsells
    assert overview["preferences"]["preferred_channel"] == "whatsapp"

    # 6. Monitoramento de mensagens.
    summary_response = client.get("/communications/delivery/summary")
    assert summary_response.status_code == 200
    summary = summary_response.json()
    assert summary["total"] >= 3
    assert summary["status_counts"]["sent"] >= 3
    assert summary["upsell"]["accepted"] == 1
    assert summary["pending_followups"] >= 2
    assert summary["inbound_engagement_rate"] == pytest.approx(1 / 3, rel=1e-3)
    assert summary["templates"]["guest_upsell_local_experience"] == 1
    assert summary["last_message_at"] is not None

    # 7. Dashboard deve refletir jornada ativa.
    metrics_response = client.get("/metrics/overview")
    assert metrics_response.status_code == 200
    metrics = metrics_response.json()
    guest_metrics = metrics["guest_experience"]
    assert guest_metrics["active_journeys"] >= 1
    assert guest_metrics["check_in_completion_rate"] >= 0.0
    assert guest_metrics["avg_response_minutes"] is not None
