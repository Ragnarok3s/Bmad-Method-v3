from __future__ import annotations

from datetime import date
from decimal import Decimal

import pytest
from fastapi.testclient import TestClient

from services.billing.api import create_app


@pytest.fixture()
def client() -> TestClient:
    app = create_app()
    return TestClient(app)


@pytest.fixture()
def valid_card() -> dict[str, object]:
    return {
        "pan": "4111111111111111",
        "expiry_month": 12,
        "expiry_year": 2032,
        "cvv": "123",
        "holder_name": "Test Guest",
    }


@pytest.fixture()
def invalid_card() -> dict[str, object]:
    card = {
        "pan": "4000000000000002",
        "expiry_month": 11,
        "expiry_year": 2031,
        "cvv": "321",
        "holder_name": "Declined Guest",
    }
    return card


@pytest.mark.e2e
@pytest.mark.payments
def test_full_payment_flow_with_refund(client: TestClient, valid_card: dict[str, object]) -> None:
    token_response = client.post(
        "/billing/tokenize",
        json={"gateway": "sandbox", "card": valid_card, "customer_reference": "guest-001"},
    )
    assert token_response.status_code == 201, token_response.text
    token = token_response.json()

    auth_response = client.post(
        "/billing/authorizations",
        json={
            "gateway": "sandbox",
            "token_reference": token["token_reference"],
            "amount": "150.00",
            "currency": "BRL",
            "capture": True,
        },
    )
    assert auth_response.status_code == 200, auth_response.text
    authorization = auth_response.json()
    assert authorization["status"] == "approved"
    assert authorization["capture_pending"] is True

    capture_response = client.post(
        "/billing/captures",
        json={
            "gateway": "sandbox",
            "authorization_id": authorization["authorization_id"],
        },
    )
    assert capture_response.status_code == 200, capture_response.text
    capture = capture_response.json()
    assert capture["status"] in {"captured", "partially_captured"}

    refund_response = client.post(
        "/billing/refunds",
        json={
            "gateway": "sandbox",
            "capture_id": capture["capture_id"],
            "amount": "150.00",
        },
    )
    assert refund_response.status_code == 200, refund_response.text
    refund = refund_response.json()
    assert refund["status"] == "refunded"

    reconciliation = client.get(
        "/billing/reconciliation",
        params={"gateway": "sandbox", "settlement_date": date.today().isoformat()},
    )
    assert reconciliation.status_code == 200, reconciliation.text
    data = reconciliation.json()
    assert Decimal(str(data["gross_volume"])) >= Decimal("150.00")
    assert any(record["authorization_id"] == authorization["authorization_id"] for record in data["records"])


@pytest.mark.e2e
@pytest.mark.payments
def test_invalid_card_decline(client: TestClient, invalid_card: dict[str, object]) -> None:
    token_response = client.post("/billing/tokenize", json={"gateway": "sandbox", "card": invalid_card})
    assert token_response.status_code == 201, token_response.text
    token = token_response.json()

    auth_response = client.post(
        "/billing/authorizations",
        json={
            "gateway": "sandbox",
            "token_reference": token["token_reference"],
            "amount": "55.00",
            "currency": "BRL",
        },
    )
    assert auth_response.status_code == 200, auth_response.text
    payload = auth_response.json()
    assert payload["status"] == "declined"
    assert payload["metadata"]["reason"] == "invalid_card"


@pytest.mark.e2e
@pytest.mark.payments
def test_gateway_failure_returns_502(client: TestClient, valid_card: dict[str, object]) -> None:
    token_response = client.post("/billing/tokenize", json={"gateway": "sandbox", "card": valid_card})
    token = token_response.json()

    error_response = client.post(
        "/billing/authorizations",
        json={
            "gateway": "sandbox",
            "token_reference": token["token_reference"],
            "amount": "45.00",
            "currency": "BRL",
            "metadata": {"test_outcome": "error"},
        },
    )
    assert error_response.status_code == 502
    assert "Falha" in error_response.json()["detail"]
