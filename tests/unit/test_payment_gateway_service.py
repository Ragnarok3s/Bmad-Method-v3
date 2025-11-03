from __future__ import annotations

import hmac
import json
from datetime import date
from decimal import Decimal

import pytest

from services.payments import CardData, PaymentGatewayService
from services.payments.gateways import InMemoryGatewayDriver


@pytest.fixture()
def service() -> PaymentGatewayService:
    svc = PaymentGatewayService(secret_key=b"unit-test-secret")
    svc.register_driver(InMemoryGatewayDriver("stripe", webhook_secret="whsec_test"))
    return svc


def test_tokenization_stores_masked_token(service: PaymentGatewayService) -> None:
    card = CardData(pan="4111111111111111", expiry_month=12, expiry_year=2030, cvv="123")

    stored = service.tokenize(card, gateway="stripe", customer_reference="guest-42")

    assert stored.masked_pan.endswith("1111")
    assert stored.network == "visa"
    assert stored.metadata["customer_reference"] == "guest-42"

    driver = service.require_driver("stripe")
    assert service.vault.verify_checksum(stored.token_reference, driver._tokens[stored.token_reference].token)


def test_authorization_and_capture_flow(service: PaymentGatewayService) -> None:
    card = CardData(pan="4111111111111111", expiry_month=1, expiry_year=2032, cvv="321")
    stored = service.tokenize(card, gateway="stripe")

    authorization = service.preauthorize(
        stored.token_reference,
        gateway="stripe",
        amount=Decimal("150.00"),
        currency="BRL",
        capture=True,
        idempotency_key="idem-001",
    )

    assert authorization.status == "approved"
    assert authorization.capture_pending is True
    assert authorization.gateway_reference == stored.token_reference

    capture = service.capture(authorization.authorization_id, gateway="stripe")

    assert capture.authorization_id == authorization.authorization_id
    assert capture.amount == Decimal("150.00")
    assert capture.status == "captured"

    summary = service.reconcile(gateway="stripe", settlement_date=date(2024, 7, 29))
    assert summary.records
    assert summary.gross_volume == Decimal("150.00")
    assert summary.gateway == "stripe"


def test_refund_flow(service: PaymentGatewayService) -> None:
    card = CardData(pan="4111111111111111", expiry_month=3, expiry_year=2032, cvv="555")
    stored = service.tokenize(card, gateway="stripe")

    authorization = service.preauthorize(
        stored.token_reference,
        gateway="stripe",
        amount=Decimal("100.00"),
        currency="BRL",
        capture=True,
    )
    capture = service.capture(authorization.authorization_id, gateway="stripe")

    partial_refund = service.refund(
        capture.capture_id,
        gateway="stripe",
        amount=Decimal("30.00"),
    )
    assert partial_refund.status == "partially_refunded"
    assert partial_refund.amount == Decimal("30.00")

    final_refund = service.refund(
        capture.capture_id,
        gateway="stripe",
        amount=Decimal("70.00"),
    )
    assert final_refund.status == "refunded"
    assert final_refund.amount == Decimal("70.00")


def test_authorization_decline_for_invalid_card(service: PaymentGatewayService) -> None:
    card = CardData(pan="4000000000000002", expiry_month=9, expiry_year=2031, cvv="123")
    stored = service.tokenize(card, gateway="stripe")

    result = service.preauthorize(
        stored.token_reference,
        gateway="stripe",
        amount=Decimal("75.00"),
        currency="BRL",
    )

    assert result.status == "declined"
    assert result.metadata.get("reason") == "invalid_card"


def test_authorization_gateway_error(service: PaymentGatewayService) -> None:
    card = CardData(pan="4111111111111111", expiry_month=4, expiry_year=2033, cvv="111")
    stored = service.tokenize(card, gateway="stripe")

    with pytest.raises(RuntimeError):
        service.preauthorize(
            stored.token_reference,
            gateway="stripe",
            amount=Decimal("80.00"),
            currency="BRL",
            metadata={"test_outcome": "error"},
        )


def test_webhook_dispatch_validates_signature(service: PaymentGatewayService) -> None:
    captured_events: list[str] = []

    def handler(event):
        captured_events.append(event.event_type)
        assert event.signature_valid is True

    service.webhooks.register_handler("stripe", handler)

    driver = service.require_driver("stripe")
    payload = {"type": "payment.captured", "data": {"id": "evt_123"}}
    raw_payload = json.dumps(payload, separators=(",", ":"), sort_keys=True).encode("utf-8")

    invalid_event = service.webhooks.dispatch(
        "stripe",
        payload,
        {"X-Gateway-Signature": "invalid"},
        raw_body=raw_payload,
    )

    assert invalid_event.signature_valid is False
    assert captured_events == []

    signature_header = hmac.new(driver._webhook_secret, raw_payload, digestmod="sha256").hexdigest()
    event = service.webhooks.dispatch(
        "stripe",
        payload,
        {"X-Gateway-Signature": signature_header},
        raw_body=raw_payload,
    )

    assert event.signature_valid is True
    assert captured_events == ["payment.captured"]
