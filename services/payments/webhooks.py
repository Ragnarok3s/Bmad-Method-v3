from __future__ import annotations

from dataclasses import dataclass, field
from datetime import UTC, datetime
from typing import Any, Callable, Mapping


@dataclass(slots=True)
class WebhookEvent:
    gateway: str
    event_type: str
    payload: Mapping[str, Any]
    signature_valid: bool
    received_at: datetime = field(default_factory=lambda: datetime.now(UTC))


class WebhookRegistry:
    """Routes webhook payloads to registered callbacks after validation."""

    def __init__(self, resolver: Callable[[str], Any]) -> None:
        self._resolver = resolver
        self._handlers: dict[str, list[Callable[[WebhookEvent], None]]] = {}

    def register_handler(self, gateway: str, handler: Callable[[WebhookEvent], None]) -> None:
        key = gateway.lower()
        self._handlers.setdefault(key, []).append(handler)

    def dispatch(self, gateway: str, payload: Mapping[str, Any], headers: Mapping[str, str]) -> WebhookEvent:
        driver = self._resolver(gateway)
        raw_payload = repr(payload).encode("utf-8")
        signature_valid = driver.validate_webhook(raw_payload, headers)
        event = driver.parse_webhook(payload)
        event.gateway = gateway
        event.signature_valid = signature_valid
        for handler in self._handlers.get(gateway.lower(), []):
            handler(event)
        return event

    def clear(self) -> None:
        self._handlers.clear()
