from __future__ import annotations

from datetime import date
from decimal import Decimal

import pytest

from services.payments import CardData, DriverNotRegisteredError, PaymentGatewayService
from services.payments.gateways import InMemoryGatewayDriver


pytestmark = pytest.mark.integration


def test_end_to_end_payment_flow() -> None:
    service = PaymentGatewayService(secret_key=b"integration-secret")
    service.register_driver(InMemoryGatewayDriver("stripe", webhook_secret="whsec_int"))
    service.register_driver(InMemoryGatewayDriver("adyen", webhook_secret="whsec_alt"))

    card = CardData(pan="4000000000009999", expiry_month=8, expiry_year=2031, cvv="999")

    stripe_token = service.tokenize(card, gateway="stripe", customer_reference="guest-1")
    adyen_token = service.tokenize(card, gateway="adyen", customer_reference="guest-1")

    assert stripe_token.masked_pan == adyen_token.masked_pan
    assert len(service.vault.list_tokens()) == 2

    stripe_auth = service.preauthorize(
        stripe_token.token_reference,
        gateway="stripe",
        amount=Decimal("250.00"),
        currency="USD",
        capture=True,
    )
    assert stripe_auth.status == "approved"

    stripe_capture = service.capture(
        stripe_auth.authorization_id,
        gateway="stripe",
        amount=Decimal("250.00"),
    )

    adyen_auth = service.preauthorize(
        adyen_token.token_reference,
        gateway="adyen",
        amount=Decimal("85.00"),
        currency="EUR",
        capture=False,
    )
    assert adyen_auth.status == "approved"
    adyen_capture = service.capture(adyen_auth.authorization_id, gateway="adyen", amount=Decimal("85.00"))

    stripe_summary = service.reconcile(gateway="stripe", settlement_date=date(2024, 7, 30))
    adyen_summary = service.reconcile(gateway="adyen", settlement_date=date(2024, 7, 30))

    assert stripe_summary.gross_volume == Decimal("250.00")
    assert stripe_summary.net_volume == Decimal("242.50")
    assert adyen_summary.gross_volume == Decimal("85.00")
    assert adyen_summary.records[0].metadata["token_reference"] == adyen_token.token_reference

    assert stripe_capture.authorization_id == stripe_auth.authorization_id
    assert adyen_capture.authorization_id == adyen_auth.authorization_id

    with pytest.raises(DriverNotRegisteredError):
        service.require_driver("braintree")
