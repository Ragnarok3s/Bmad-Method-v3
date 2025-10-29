from __future__ import annotations

from datetime import date
from decimal import Decimal
from typing import Iterable, Mapping, Protocol, runtime_checkable

from .models import (
    AuthorizationRequest,
    AuthorizationResult,
    CardData,
    CaptureResult,
    ReconciliationRecord,
    TokenizedCard,
)
from .webhooks import WebhookEvent


@runtime_checkable
class PaymentGatewayDriver(Protocol):
    """Contract every payment gateway integration must satisfy."""

    name: str

    def tokenize(self, card: CardData, *, customer_reference: str | None = None) -> TokenizedCard: ...

    def preauthorize(self, request: AuthorizationRequest) -> AuthorizationResult: ...

    def capture(
        self,
        authorization_id: str,
        *,
        amount: Decimal | None = None,
        metadata: Mapping[str, str] | None = None,
    ) -> CaptureResult: ...

    def fetch_reconciliation(self, settlement_date: date) -> Iterable[ReconciliationRecord]: ...

    def validate_webhook(self, payload: bytes, headers: Mapping[str, str]) -> bool: ...

    def parse_webhook(self, payload: Mapping[str, object]) -> WebhookEvent: ...


class DriverNotRegisteredError(RuntimeError):
    def __init__(self, gateway: str) -> None:
        super().__init__(f"Gateway driver '{gateway}' is not registered")
        self.gateway = gateway


class DriverRegistry:
    """Keeps track of configured drivers and resolves them by name."""

    def __init__(self) -> None:
        self._drivers: dict[str, PaymentGatewayDriver] = {}

    def register(self, driver: PaymentGatewayDriver) -> None:
        if not isinstance(driver, PaymentGatewayDriver):  # type: ignore[arg-type]
            raise TypeError("driver must implement PaymentGatewayDriver protocol")
        key = driver.name.lower()
        self._drivers[key] = driver

    def get(self, name: str) -> PaymentGatewayDriver:
        try:
            return self._drivers[name.lower()]
        except KeyError as exc:  # pragma: no cover - defensive
            raise DriverNotRegisteredError(name) from exc

    def clear(self) -> None:
        self._drivers.clear()

    def __contains__(self, name: object) -> bool:
        if not isinstance(name, str):
            return False
        return name.lower() in self._drivers

    def __iter__(self):
        return iter(self._drivers.values())
