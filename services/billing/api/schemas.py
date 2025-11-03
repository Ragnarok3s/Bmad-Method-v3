"""Pydantic schemas for the Billing gateway HTTP API."""

from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from typing import Any, Mapping

from pydantic import BaseModel, ConfigDict, Field


class CardDetails(BaseModel):
    """Sensitive card payload received during tokenization."""

    pan: str = Field(min_length=12, max_length=19)
    expiry_month: int = Field(ge=1, le=12)
    expiry_year: int = Field(ge=2020, le=2100)
    cvv: str | None = Field(default=None, min_length=3, max_length=4)
    holder_name: str | None = Field(default=None, max_length=96)


class TokenizeRequest(BaseModel):
    gateway: str = Field(description="Identificador do gateway configurado")
    card: CardDetails
    customer_reference: str | None = Field(default=None, max_length=128)
    metadata: Mapping[str, str] | None = None


class TokenizedCardResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    token_reference: str
    masked_pan: str
    network: str | None = None
    fingerprint: str | None = None
    created_at: datetime
    metadata: Mapping[str, Any] = Field(default_factory=dict)


class AuthorizationRequest(BaseModel):
    gateway: str
    token_reference: str
    amount: Decimal = Field(gt=Decimal("0"))
    currency: str = Field(min_length=3, max_length=3)
    capture: bool = False
    idempotency_key: str | None = Field(default=None, max_length=128)
    metadata: Mapping[str, str] | None = None


class AuthorizationResponse(BaseModel):
    authorization_id: str
    status: str
    amount: Decimal
    currency: str
    capture_pending: bool
    gateway_reference: str | None = None
    created_at: datetime
    metadata: Mapping[str, Any] = Field(default_factory=dict)


class CaptureRequest(BaseModel):
    gateway: str
    authorization_id: str
    amount: Decimal | None = Field(default=None, gt=Decimal("0"))
    metadata: Mapping[str, str] | None = None


class CaptureResponse(BaseModel):
    capture_id: str
    authorization_id: str
    amount: Decimal
    currency: str
    status: str
    processed_at: datetime
    metadata: Mapping[str, Any] = Field(default_factory=dict)


class RefundRequest(BaseModel):
    gateway: str
    capture_id: str
    amount: Decimal | None = Field(default=None, gt=Decimal("0"))
    metadata: Mapping[str, str] | None = None


class RefundResponse(BaseModel):
    refund_id: str
    capture_id: str
    authorization_id: str
    amount: Decimal
    currency: str
    status: str
    processed_at: datetime
    metadata: Mapping[str, Any] = Field(default_factory=dict)


class ReconciliationQuery(BaseModel):
    gateway: str
    settlement_date: date


class ReconciliationRecordResponse(BaseModel):
    authorization_id: str
    capture_id: str | None = None
    settlement_amount: Decimal
    settlement_currency: str
    settlement_date: date
    status: str
    fee_amount: Decimal
    metadata: Mapping[str, Any] = Field(default_factory=dict)


class ReconciliationResponse(BaseModel):
    gateway: str
    date: date
    gross_volume: Decimal
    net_volume: Decimal
    total_fees: Decimal
    records: list[ReconciliationRecordResponse]
    generated_at: datetime


class WebhookPayload(BaseModel):
    gateway: str
    headers: Mapping[str, str] = Field(default_factory=dict)
    body: Mapping[str, Any] = Field(default_factory=dict)
    raw_body: bytes | None = None


class WebhookResponse(BaseModel):
    gateway: str
    event_type: str
    signature_valid: bool
    received_at: datetime
    payload: Mapping[str, Any] = Field(default_factory=dict)
