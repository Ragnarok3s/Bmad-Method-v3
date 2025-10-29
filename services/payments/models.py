from __future__ import annotations

from dataclasses import dataclass, field
from datetime import UTC, date, datetime
from decimal import Decimal
from typing import Any, Literal


@dataclass(slots=True)
class CardData:
    """Sensitive card details provided by the guest/customer."""

    pan: str
    expiry_month: int
    expiry_year: int
    cvv: str | None = None
    holder_name: str | None = None

    def masked(self) -> str:
        suffix = self.pan[-4:]
        return f"**** **** **** {suffix}".strip()


@dataclass(slots=True)
class TokenizedCard:
    """Represents the gateway token returned during tokenization."""

    token: str
    token_reference: str
    masked_pan: str
    expires_at: datetime | None = None
    network: str | None = None
    fingerprint: str | None = None
    created_at: datetime = field(default_factory=lambda: datetime.now(UTC))
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass(slots=True)
class AuthorizationRequest:
    token_reference: str
    amount: Decimal
    currency: str
    capture: bool = False
    idempotency_key: str | None = None
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass(slots=True)
class AuthorizationResult:
    authorization_id: str
    amount: Decimal
    currency: str
    status: Literal["approved", "declined", "pending"]
    capture_pending: bool
    gateway_reference: str | None = None
    created_at: datetime = field(default_factory=lambda: datetime.now(UTC))
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass(slots=True)
class CaptureResult:
    capture_id: str
    authorization_id: str
    amount: Decimal
    currency: str
    status: Literal["captured", "partially_captured", "failed"]
    processed_at: datetime = field(default_factory=lambda: datetime.now(UTC))
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass(slots=True)
class ReconciliationRecord:
    authorization_id: str
    capture_id: str | None
    settlement_amount: Decimal
    settlement_currency: str
    settlement_date: date
    status: Literal["settled", "pending", "disputed"]
    fee_amount: Decimal = Decimal("0")
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass(slots=True)
class ReconciliationSummary:
    date: date
    gateway: str
    records: list[ReconciliationRecord] = field(default_factory=list)
    generated_at: datetime = field(default_factory=lambda: datetime.now(UTC))

    @property
    def gross_volume(self) -> Decimal:
        return sum((record.settlement_amount for record in self.records), start=Decimal("0"))

    @property
    def total_fees(self) -> Decimal:
        return sum((record.fee_amount for record in self.records), start=Decimal("0"))

    @property
    def net_volume(self) -> Decimal:
        return self.gross_volume - self.total_fees
