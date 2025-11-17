from datetime import UTC, datetime, timedelta
from decimal import Decimal

from services.core.payments.partners import PartnerBillingService


def test_usage_records_generate_invoice() -> None:
    service = PartnerBillingService()
    before = datetime.now(UTC) - timedelta(days=1)
    after = datetime.now(UTC) + timedelta(days=1)
    service.record_usage(
        "smart-pricing",
        metric="reservation_synced",
        quantity=Decimal("5"),
        unit_price=Decimal("3"),
    )
    invoice = service.generate_invoice("smart-pricing", period_start=before, period_end=after)
    assert invoice.total == Decimal("15")
    assert invoice.line_items[0].amount == Decimal("15")


def test_webhook_emission_logged() -> None:
    service = PartnerBillingService()
    service.emit_webhook(
        "billing.usage.recorded",
        partner_id="smart-pricing",
        payload={"metric": "reservation_synced", "quantity": "5"},
    )
    events = list(service.list_webhook_events("smart-pricing"))
    assert len(events) == 1
    assert events[0].payload["metric"] == "reservation_synced"
