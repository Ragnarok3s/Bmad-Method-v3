from __future__ import annotations

from datetime import date
from decimal import Decimal
from secrets import token_bytes
from typing import Mapping

from .drivers import DriverRegistry, DriverNotRegisteredError, PaymentGatewayDriver
from .models import (
    AuthorizationRequest,
    AuthorizationResult,
    CardData,
    CaptureResult,
    ReconciliationSummary,
    RefundResult,
)
from .storage import SecureTokenVault, StoredToken
from .webhooks import WebhookRegistry


class PaymentGatewayService:
    """Facade responsible for tokenization, authorization and reconciliation flows."""

    def __init__(
        self,
        *,
        drivers: DriverRegistry | None = None,
        vault: SecureTokenVault | None = None,
        secret_key: bytes | None = None,
    ) -> None:
        self._drivers = drivers or DriverRegistry()
        if vault is not None:
            self._vault = vault
        else:
            key = secret_key or token_bytes(32)
            self._vault = SecureTokenVault(secret_key=key)
        self.webhooks = WebhookRegistry(self._drivers.get)

    def register_driver(self, driver: PaymentGatewayDriver) -> None:
        self._drivers.register(driver)

    def tokenize(
        self,
        card: CardData,
        *,
        gateway: str,
        customer_reference: str | None = None,
        metadata: Mapping[str, str] | None = None,
    ) -> StoredToken:
        driver = self._drivers.get(gateway)
        tokenized = driver.tokenize(card, customer_reference=customer_reference)
        if metadata:
            tokenized.metadata.update(metadata)
        stored = self._vault.store(tokenized)
        return stored

    def preauthorize(
        self,
        token_reference: str,
        *,
        gateway: str,
        amount: Decimal,
        currency: str,
        capture: bool = False,
        idempotency_key: str | None = None,
        metadata: Mapping[str, str] | None = None,
    ) -> AuthorizationResult:
        driver = self._drivers.get(gateway)
        request = AuthorizationRequest(
            token_reference=token_reference,
            amount=amount,
            currency=currency,
            capture=capture,
            idempotency_key=idempotency_key,
            metadata=dict(metadata or {}),
        )
        return driver.preauthorize(request)

    def capture(
        self,
        authorization_id: str,
        *,
        gateway: str,
        amount: Decimal | None = None,
        metadata: Mapping[str, str] | None = None,
    ) -> CaptureResult:
        driver = self._drivers.get(gateway)
        return driver.capture(authorization_id, amount=amount, metadata=metadata)

    def refund(
        self,
        capture_id: str,
        *,
        gateway: str,
        amount: Decimal | None = None,
        metadata: Mapping[str, str] | None = None,
    ) -> RefundResult:
        driver = self._drivers.get(gateway)
        return driver.refund(capture_id, amount=amount, metadata=metadata)

    def reconcile(self, *, gateway: str, settlement_date: date) -> ReconciliationSummary:
        driver = self._drivers.get(gateway)
        records = list(driver.fetch_reconciliation(settlement_date))
        summary = ReconciliationSummary(date=settlement_date, gateway=gateway, records=list(records))
        return summary

    @property
    def vault(self) -> SecureTokenVault:
        return self._vault

    def require_driver(self, name: str) -> PaymentGatewayDriver:
        if name not in self._drivers:
            raise DriverNotRegisteredError(name)
        return self._drivers.get(name)
