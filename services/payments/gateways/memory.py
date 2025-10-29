from __future__ import annotations

import hmac
from dataclasses import dataclass
from datetime import UTC, date, datetime
from decimal import Decimal
from secrets import token_hex
from typing import Iterable, Mapping

from ..drivers import PaymentGatewayDriver
from ..models import (
    AuthorizationRequest,
    AuthorizationResult,
    CardData,
    CaptureResult,
    ReconciliationRecord,
    TokenizedCard,
)
from ..webhooks import WebhookEvent


@dataclass(slots=True)
class _AuthorizationState:
    result: AuthorizationResult
    captured_amount: Decimal = Decimal("0")
    capture_status: str = "pending"


class InMemoryGatewayDriver(PaymentGatewayDriver):
    """Reference driver used for tests, docs and local development."""

    def __init__(self, name: str, *, webhook_secret: str) -> None:
        self.name = name
        self._webhook_secret = webhook_secret.encode("utf-8")
        self._tokens: dict[str, TokenizedCard] = {}
        self._authorizations: dict[str, _AuthorizationState] = {}
        self._captures: dict[str, CaptureResult] = {}

    def tokenize(self, card: CardData, *, customer_reference: str | None = None) -> TokenizedCard:
        token_value = token_hex(12)
        token_reference = f"{self.name}_tok_{len(self._tokens) + 1:06d}"
        token = TokenizedCard(
            token=token_value,
            token_reference=token_reference,
            masked_pan=card.masked(),
            network="visa",
            fingerprint=hmac.new(
                self._webhook_secret, card.pan.encode("utf-8"), digestmod="sha256"
            ).hexdigest(),
            metadata={"customer_reference": customer_reference} if customer_reference else {},
        )
        self._tokens[token_reference] = token
        return token

    def preauthorize(self, request: AuthorizationRequest) -> AuthorizationResult:
        authorization_id = f"{self.name}_auth_{len(self._authorizations) + 1:06d}"
        result = AuthorizationResult(
            authorization_id=authorization_id,
            amount=request.amount,
            currency=request.currency,
            status="approved",
            capture_pending=request.capture,
            gateway_reference=request.token_reference,
            metadata=dict(request.metadata),
        )
        self._authorizations[authorization_id] = _AuthorizationState(result=result)
        return result

    def capture(
        self,
        authorization_id: str,
        *,
        amount: Decimal | None = None,
        metadata: Mapping[str, str] | None = None,
    ) -> CaptureResult:
        state = self._authorizations[authorization_id]
        capture_amount = amount or state.result.amount
        capture_id = f"{self.name}_cap_{len(self._captures) + 1:06d}"
        result = CaptureResult(
            capture_id=capture_id,
            authorization_id=authorization_id,
            amount=capture_amount,
            currency=state.result.currency,
            status="captured",
            metadata=dict(metadata or {}),
        )
        state.captured_amount += capture_amount
        state.capture_status = "captured"
        self._captures[capture_id] = result
        return result

    def fetch_reconciliation(self, settlement_date: date) -> Iterable[ReconciliationRecord]:
        for capture in self._captures.values():
            state = self._authorizations[capture.authorization_id]
            yield ReconciliationRecord(
                authorization_id=capture.authorization_id,
                capture_id=capture.capture_id,
                settlement_amount=capture.amount,
                settlement_currency=capture.currency,
                settlement_date=settlement_date,
                status="settled",
                fee_amount=(capture.amount * Decimal("0.03")).quantize(Decimal("0.01")),
                metadata={
                    "token_reference": state.result.gateway_reference or "",
                    "captured_at": capture.processed_at.isoformat(),
                },
            )

    def validate_webhook(self, payload: bytes, headers: Mapping[str, str]) -> bool:
        provided = headers.get("X-Gateway-Signature", "")
        expected = hmac.new(self._webhook_secret, payload, digestmod="sha256").hexdigest()
        return hmac.compare_digest(provided, expected)

    def parse_webhook(self, payload: Mapping[str, object]) -> WebhookEvent:
        event_type = str(payload.get("type", "unknown"))
        return WebhookEvent(
            gateway=self.name,
            event_type=event_type,
            payload=payload,
            signature_valid=False,
            received_at=datetime.now(UTC),
        )

    # Utility methods for tests -------------------------------------------------
    def get_authorization(self, authorization_id: str) -> AuthorizationResult:
        return self._authorizations[authorization_id].result

    def get_capture(self, capture_id: str) -> CaptureResult:
        return self._captures[capture_id]

    def reset(self) -> None:
        self._tokens.clear()
        self._authorizations.clear()
        self._captures.clear()
