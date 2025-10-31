#!/usr/bin/env python3.14
"""Simulate PCI-aligned tokenization, authorization and reconciliation locally."""

from __future__ import annotations

import argparse
from datetime import date
from decimal import Decimal
from typing import Optional

from services.payments import CardData, PaymentGatewayService
from services.payments.gateways import InMemoryGatewayDriver


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("amount", type=Decimal, help="Transaction amount (decimal value, e.g. 125.00)")
    parser.add_argument("currency", type=str, help="ISO currency code (e.g. BRL, USD)")
    parser.add_argument("--gateway", default="stripe", help="Gateway alias registered in the service")
    parser.add_argument("--customer", default="guest-cli", help="Customer reference for audit trail")
    parser.add_argument("--webhook-secret", default="whsec_cli", help="Shared secret used for webhook signatures")
    parser.add_argument(
        "--settlement-date",
        type=lambda value: date.fromisoformat(value),
        default=date.today(),
        help="Settlement date used for reconciliation report (YYYY-MM-DD)",
    )
    parser.add_argument(
        "--card-pan",
        default="4242424242424242",
        help="PAN used only for local simulation; never persisted.",
    )
    parser.add_argument("--card-expiry", default="12/2030", help="Expiry in the format MM/YYYY")
    parser.add_argument("--card-cvv", default="123", help="CVV for simulation")
    parser.add_argument(
        "--skip-capture",
        action="store_true",
        help="Pre-authorize only (capture skipped)",
    )
    return parser


def parse_card(expiry: str, pan: str, cvv: Optional[str]) -> CardData:
    month_str, year_str = expiry.split("/")
    return CardData(
        pan=pan,
        expiry_month=int(month_str),
        expiry_year=int(year_str),
        cvv=cvv,
    )


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    service = PaymentGatewayService(secret_key=b"payments-cli-secret")
    service.register_driver(InMemoryGatewayDriver(args.gateway, webhook_secret=args.webhook_secret))

    card = parse_card(args.card_expiry, args.card_pan, args.card_cvv)
    token = service.tokenize(card, gateway=args.gateway, customer_reference=args.customer)
    authorization = service.preauthorize(
        token.token_reference,
        gateway=args.gateway,
        amount=args.amount,
        currency=args.currency,
        capture=not args.skip_capture,
    )

    capture_id = None
    if not args.skip_capture:
        capture = service.capture(authorization.authorization_id, gateway=args.gateway, amount=args.amount)
        capture_id = capture.capture_id

    summary = service.reconcile(gateway=args.gateway, settlement_date=args.settlement_date)

    print("=== Payments Simulation Summary ===")
    print(f"Gateway: {args.gateway}")
    print(f"Token reference: {token.token_reference} ({token.masked_pan})")
    print(f"Authorization: {authorization.authorization_id} status={authorization.status}")
    if capture_id:
        print(f"Capture: {capture_id} amount={args.amount}")
    print(
        "Reconciliation: gross={gross} fees={fees} net={net}".format(
            gross=summary.gross_volume,
            fees=summary.total_fees,
            net=summary.net_volume,
        )
    )
    for record in summary.records:
        print(f"  - {record.authorization_id} -> {record.capture_id} status={record.status}")


if __name__ == "__main__":
    main()
