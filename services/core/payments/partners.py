"""Billing and webhook helpers for marketplace partners."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import UTC, datetime
from decimal import Decimal
from typing import Iterable


@dataclass(slots=True)
class UsageRecord:
    partner_id: str
    metric: str
    quantity: Decimal
    unit_price: Decimal
    recorded_at: datetime = field(default_factory=lambda: datetime.now(UTC))
    metadata: dict[str, str] = field(default_factory=dict)

    @property
    def amount(self) -> Decimal:
        return self.quantity * self.unit_price


@dataclass(slots=True)
class Invoice:
    partner_id: str
    period_start: datetime
    period_end: datetime
    line_items: list[UsageRecord]
    issued_at: datetime = field(default_factory=lambda: datetime.now(UTC))

    @property
    def total(self) -> Decimal:
        return sum((item.amount for item in self.line_items), start=Decimal("0"))


@dataclass(slots=True)
class WebhookPayload:
    event: str
    partner_id: str
    payload: dict[str, str]
    delivered_at: datetime = field(default_factory=lambda: datetime.now(UTC))


class PartnerBillingService:
    """Coordinates partner webhooks and billing statements."""

    def __init__(self) -> None:
        self._usage: dict[str, list[UsageRecord]] = {}
        self._webhook_log: list[WebhookPayload] = []

    def record_usage(
        self,
        partner_id: str,
        *,
        metric: str,
        quantity: Decimal,
        unit_price: Decimal,
        metadata: dict[str, str] | None = None,
    ) -> UsageRecord:
        record = UsageRecord(
            partner_id=partner_id,
            metric=metric,
            quantity=quantity,
            unit_price=unit_price,
            metadata=metadata or {},
        )
        self._usage.setdefault(partner_id, []).append(record)
        return record

    def emit_webhook(self, event: str, partner_id: str, payload: dict[str, str]) -> WebhookPayload:
        webhook = WebhookPayload(event=event, partner_id=partner_id, payload=payload)
        self._webhook_log.append(webhook)
        return webhook

    def generate_invoice(
        self,
        partner_id: str,
        *,
        period_start: datetime,
        period_end: datetime,
    ) -> Invoice:
        usage = [record for record in self._usage.get(partner_id, []) if period_start <= record.recorded_at <= period_end]
        invoice = Invoice(
            partner_id=partner_id,
            period_start=period_start,
            period_end=period_end,
            line_items=usage,
        )
        return invoice

    def list_webhook_events(self, partner_id: str | None = None) -> Iterable[WebhookPayload]:
        if partner_id is None:
            return list(self._webhook_log)
        return [event for event in self._webhook_log if event.partner_id == partner_id]

    def reset(self) -> None:
        self._usage.clear()
        self._webhook_log.clear()
