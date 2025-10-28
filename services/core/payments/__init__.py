"""Integração com provedores de pagamento (Stripe/Adyen) para o core."""
from __future__ import annotations

import hashlib
import logging
import secrets
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Any, Protocol, runtime_checkable, TYPE_CHECKING

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..config import PaymentGatewaySettings
from ..domain.models import (
    AuditLog,
    Invoice,
    InvoiceStatus,
    PaymentIntent,
    PaymentIntentStatus,
    PaymentMethod,
    PaymentMethodStatus,
    PaymentProvider,
    PaymentReconciliationLog,
    PaymentReconciliationStatus,
    PaymentTransaction,
    PaymentTransactionStatus,
    PaymentTransactionType,
    PaymentWebhookEvent,
    PaymentWebhookStatus,
    Reservation,
)
from ..metrics import (
    record_invoice_issued,
    record_payment_capture,
    record_payment_failure,
    record_payment_preauthorized,
    record_payment_reconciliation,
    record_payment_tokenized,
)

if TYPE_CHECKING:  # pragma: no cover - tipos estáticos
    from ..domain.schemas import PaymentAuthorizationRequest, PaymentMethodCreate


logger = logging.getLogger("bmad.core.payments")


class PaymentGatewayError(RuntimeError):
    """Erro base para integrações com PSPs."""


class PaymentGatewayNotConfiguredError(PaymentGatewayError):
    """Lançado quando não há configuração válida."""


class PaymentProcessingError(PaymentGatewayError):
    """Falhas durante tokenização, pré-autorização ou captura."""


@dataclass(slots=True)
class TokenizedPaymentMethod:
    token: str
    fingerprint: str
    customer_reference: str
    raw: dict[str, Any]


@dataclass(slots=True)
class PreauthorizationResult:
    reference: str
    amount_minor: int
    currency: str
    expires_at: datetime | None
    raw: dict[str, Any]


@dataclass(slots=True)
class CaptureResult:
    reference: str
    amount_minor: int
    currency: str
    succeeded: bool
    raw: dict[str, Any]


@runtime_checkable
class PaymentGateway(Protocol):
    """Contratos mínimos esperados de um PSP."""

    def tokenize(self, payload: "PaymentMethodCreate") -> TokenizedPaymentMethod:
        raise NotImplementedError

    def preauthorize(
        self,
        payment_method: TokenizedPaymentMethod,
        payload: "PaymentAuthorizationRequest",
    ) -> PreauthorizationResult:
        raise NotImplementedError

    def capture(self, intent: PaymentIntent) -> CaptureResult:
        raise NotImplementedError


class _SimulatedGateway(PaymentGateway):
    def __init__(self, provider: PaymentProvider, settings: PaymentGatewaySettings) -> None:
        self.provider = provider
        self.settings = settings

    def _fingerprint(self, value: str) -> str:
        return hashlib.sha256(value.encode("utf-8")).hexdigest()

    def tokenize(self, payload: "PaymentMethodCreate") -> TokenizedPaymentMethod:
        nonce = payload.payment_method_nonce.strip()
        if not nonce:
            raise PaymentProcessingError("Tokenização requer um nonce válido")
        fingerprint = self._fingerprint(f"{self.provider.value}:{nonce}")
        token = self._fingerprint(f"{nonce}:{secrets.token_hex(8)}")
        raw = {
            "nonce_length": len(nonce),
            "provider": self.provider.value,
        }
        return TokenizedPaymentMethod(
            token=token,
            fingerprint=fingerprint,
            customer_reference=payload.customer_reference,
            raw=raw,
        )

    def preauthorize(
        self,
        payment_method: TokenizedPaymentMethod,
        payload: "PaymentAuthorizationRequest",
    ) -> PreauthorizationResult:
        if payload.amount_minor <= 0:
            raise PaymentProcessingError("Valor para pré-autorização inválido")
        reference = f"{self.provider.value}-{secrets.token_hex(6)}"
        expires_at = datetime.now(timezone.utc) + timedelta(days=2)
        raw = {
            "provider": self.provider.value,
            "fingerprint": payment_method.fingerprint,
            "metadata": payload.metadata or {},
        }
        return PreauthorizationResult(
            reference=reference,
            amount_minor=payload.amount_minor,
            currency=payload.currency.upper(),
            expires_at=expires_at,
            raw=raw,
        )

    def capture(self, intent: PaymentIntent) -> CaptureResult:
        raw = {
            "provider": self.provider.value,
            "reference": intent.provider_reference,
            "amount_minor": intent.amount_minor,
        }
        return CaptureResult(
            reference=f"{intent.provider_reference}-capture",
            amount_minor=intent.amount_minor,
            currency=intent.currency_code,
            succeeded=True,
            raw=raw,
        )


class StripeGateway(_SimulatedGateway):
    def __init__(self, settings: PaymentGatewaySettings) -> None:
        super().__init__(PaymentProvider.STRIPE, settings)


class AdyenGateway(_SimulatedGateway):
    def __init__(self, settings: PaymentGatewaySettings) -> None:
        super().__init__(PaymentProvider.ADYEN, settings)


def build_gateway(settings: PaymentGatewaySettings) -> PaymentGateway:
    provider = settings.provider.lower().strip()
    if provider == PaymentProvider.STRIPE.value:
        return StripeGateway(settings)
    if provider == PaymentProvider.ADYEN.value:
        return AdyenGateway(settings)
    raise PaymentGatewayNotConfiguredError(f"PSP '{settings.provider}' não suportado")


class PaymentService:
    """Orquestra tokenização, pré-autorização, captura e reconciliação."""

    def __init__(self, session: Session, settings: PaymentGatewaySettings) -> None:
        if not settings or not settings.provider:
            raise PaymentGatewayNotConfiguredError("Configuração de PSP ausente")
        self.session = session
        self.settings = settings
        self._gateway = build_gateway(settings)

    # region helpers
    def _audit(self, reservation: Reservation | None, action: str, detail: str) -> None:
        log = AuditLog(
            reservation_id=reservation.id if reservation else None,
            action=action,
            detail=detail,
        )
        self.session.add(log)

    def _resolve_provider(self, provider: str) -> PaymentProvider:
        try:
            return PaymentProvider(provider.lower())
        except ValueError as exc:  # pragma: no cover - validação defensiva
            raise PaymentProcessingError(f"Provedor desconhecido: {provider}") from exc

    # endregion helpers

    def tokenize_payment_method(
        self,
        reservation: Reservation,
        payload: "PaymentMethodCreate",
    ) -> PaymentMethod:
        if not self.settings.allow_tokenization:
            raise PaymentProcessingError("Tokenização está desabilitada por configuração")
        gateway_payload = self._gateway.tokenize(payload)
        guest_email = payload.guest_email or reservation.guest_email
        provider = payload.provider if isinstance(payload.provider, PaymentProvider) else self._resolve_provider(payload.provider)
        method = PaymentMethod(
            reservation_id=reservation.id,
            provider=provider,
            customer_reference=gateway_payload.customer_reference,
            guest_email=guest_email,
            token=gateway_payload.token,
            fingerprint=gateway_payload.fingerprint,
            details=payload.metadata,
        )
        self.session.add(method)
        self.session.flush()
        record_payment_tokenized(method.provider.value, reservation.property_id)
        self._audit(reservation, "payment_method_tokenized", f"method_id={method.id}")
        logger.info(
            "payment_method_tokenized",
            extra={
                "reservation_id": reservation.id,
                "provider": method.provider.value,
                "method_id": method.id,
            },
        )
        return method

    def preauthorize(
        self,
        reservation: Reservation,
        request: "PaymentAuthorizationRequest",
        method: PaymentMethod,
    ) -> PaymentIntent:
        result = self._gateway.preauthorize(
            TokenizedPaymentMethod(
                token=method.token,
                fingerprint=method.fingerprint,
                customer_reference=method.customer_reference,
                raw=method.details or {},
            ),
            request,
        )
        intent = PaymentIntent(
            reservation_id=reservation.id,
            payment_method_id=method.id,
            provider=method.provider,
            amount_minor=result.amount_minor,
            currency_code=result.currency,
            status=PaymentIntentStatus.PREAUTHORIZED,
            provider_reference=result.reference,
            context={"raw": result.raw, "request": request.metadata or {}},
            expires_at=result.expires_at,
        )
        transaction = PaymentTransaction(
            intent=intent,
            transaction_type=PaymentTransactionType.AUTHORIZATION,
            status=PaymentTransactionStatus.SUCCEEDED,
            amount_minor=result.amount_minor,
            raw_response=result.raw,
            processed_at=datetime.now(timezone.utc),
        )
        self.session.add(intent)
        self.session.add(transaction)
        self.session.flush()
        record_payment_preauthorized(
            method.provider.value,
            reservation.property_id,
            result.amount_minor,
        )
        self._audit(
            reservation,
            "payment_preauthorized",
            f"intent_id={intent.id};amount={result.amount_minor}",
        )
        logger.info(
            "payment_preauthorized",
            extra={
                "reservation_id": reservation.id,
                "intent_id": intent.id,
                "provider": method.provider.value,
            },
        )
        return intent

    def capture_for_check_in(self, reservation: Reservation) -> Invoice | None:
        intent = next(
            (i for i in reservation.payment_intents if i.status == PaymentIntentStatus.PREAUTHORIZED),
            None,
        )
        if not intent:
            logger.debug(
                "no_preauthorized_intent",
                extra={"reservation_id": reservation.id},
            )
            return None
        result = self._gateway.capture(intent)
        status = PaymentTransactionStatus.SUCCEEDED if result.succeeded else PaymentTransactionStatus.FAILED
        transaction = PaymentTransaction(
            intent=intent,
            transaction_type=PaymentTransactionType.CAPTURE,
            status=status,
            amount_minor=result.amount_minor,
            raw_response=result.raw,
            processed_at=datetime.now(timezone.utc),
        )
        self.session.add(transaction)
        if not result.succeeded:
            intent.status = PaymentIntentStatus.FAILED
            record_payment_failure(intent.provider.value, reservation.property_id)
            self._audit(
                reservation,
                "payment_capture_failed",
                f"intent_id={intent.id}",
            )
            raise PaymentProcessingError("Falha ao capturar pré-autorização")

        intent.status = PaymentIntentStatus.CAPTURED
        intent.captured_at = datetime.now(timezone.utc)
        record_payment_capture(intent.provider.value, reservation.property_id, intent.amount_minor)

        invoice = Invoice(
            reservation_id=reservation.id,
            amount_minor=intent.amount_minor,
            currency_code=intent.currency_code,
            status=InvoiceStatus.ISSUED,
            issued_at=datetime.now(timezone.utc),
            payload={"provider_reference": result.reference},
        )
        self.session.add(invoice)
        record_invoice_issued(reservation.property_id, intent.amount_minor, intent.currency_code)
        reservation.capture_on_check_in = False
        self._audit(
            reservation,
            "payment_capture_success",
            f"intent_id={intent.id};invoice_id={invoice.id if invoice.id else 'pending'}",
        )
        logger.info(
            "payment_capture_success",
            extra={
                "reservation_id": reservation.id,
                "intent_id": intent.id,
                "invoice_amount_minor": intent.amount_minor,
            },
        )
        return invoice

    def handle_webhook_event(self, provider: str, payload: dict[str, Any]) -> PaymentWebhookEvent:
        resolved_provider = self._resolve_provider(provider)
        intent_reference = payload.get("intent_reference") or payload.get("payment_intent")
        status = str(payload.get("status", "")).lower()
        intent = None
        if intent_reference:
            intent = self.session.execute(
                select(PaymentIntent).where(PaymentIntent.provider_reference == intent_reference)
            ).scalar_one_or_none()
        event = PaymentWebhookEvent(
            provider=resolved_provider,
            event_type=str(payload.get("event", status or "update")),
            status=PaymentWebhookStatus.RECEIVED,
            reservation_id=intent.reservation_id if intent else None,
            intent_id=intent.id if intent else None,
            payload=payload,
        )
        self.session.add(event)
        if intent and status:
            if status in {"failed", "failure"}:
                intent.status = PaymentIntentStatus.FAILED
                record_payment_failure(resolved_provider.value, intent.reservation.property_id)
                event.status = PaymentWebhookStatus.PROCESSED
                event.processed_at = datetime.now(timezone.utc)
                self._audit(intent.reservation, "payment_failed", f"intent_id={intent.id}")
            elif status in {"captured", "succeeded", "paid"}:
                intent.status = PaymentIntentStatus.CAPTURED
                intent.captured_at = intent.captured_at or datetime.now(timezone.utc)
                event.status = PaymentWebhookStatus.PROCESSED
                event.processed_at = datetime.now(timezone.utc)
        logger.info(
            "payment_webhook_received",
            extra={
                "provider": resolved_provider.value,
                "intent_reference": intent_reference,
                "status": status,
            },
        )
        return event

    def run_daily_reconciliation(self) -> PaymentReconciliationLog:
        now = datetime.now(timezone.utc)
        intents = self.session.execute(
            select(PaymentIntent).where(PaymentIntent.status == PaymentIntentStatus.PREAUTHORIZED)
        ).scalars()
        pending = list(intents)
        discrepancies = [
            intent for intent in pending if intent.expires_at and intent.expires_at < now
        ]
        status = PaymentReconciliationStatus.SUCCESS
        notes = None
        if discrepancies:
            status = PaymentReconciliationStatus.WARN
            notes = f"{len(discrepancies)} intents expirados"
        log_entry = PaymentReconciliationLog(
            status=status,
            total_intents=len(pending),
            discrepancies=len(discrepancies),
            notes=notes,
        )
        self.session.add(log_entry)
        record_payment_reconciliation(status.value, len(pending), len(discrepancies))
        logger.info(
            "payment_reconciliation_run",
            extra={
                "status": status.value,
                "total_intents": len(pending),
                "discrepancies": len(discrepancies),
            },
        )
        return log_entry
