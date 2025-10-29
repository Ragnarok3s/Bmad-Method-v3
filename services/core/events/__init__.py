from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass
from datetime import datetime, timezone
import hashlib
import hmac
import threading
import uuid
from typing import Any, Callable, Dict, Iterable, List, MutableMapping, Optional

EventListener = Callable[["Event"], None]


@dataclass(frozen=True)
class Event:
    name: str
    payload: Dict[str, Any]
    occurred_at: datetime


@dataclass
class Notification:
    id: str
    owner_id: int
    title: str
    message: str
    category: str
    created_at: datetime
    read: bool = False


@dataclass(frozen=True)
class WebhookSubscription:
    id: str
    event_name: str
    target_url: str
    secret: Optional[str]
    created_at: datetime


@dataclass(frozen=True)
class WebhookDelivery:
    subscription_id: str
    event_name: str
    payload: Dict[str, Any]
    delivered_at: datetime
    signature: str


class EventBus:
    """Simple in-memory event bus used to orchestrate domain events."""

    def __init__(self) -> None:
        self._subscribers: MutableMapping[str, List[EventListener]] = defaultdict(list)
        self._lock = threading.Lock()

    def subscribe(self, event_name: str, listener: EventListener) -> None:
        with self._lock:
            self._subscribers[event_name].append(listener)

    def publish(self, event_name: str, payload: Optional[Dict[str, Any]] = None) -> Event:
        if payload is None:
            payload = {}
        event = Event(
            name=event_name,
            payload=payload,
            occurred_at=datetime.now(timezone.utc),
        )
        listeners = self._listeners_for(event_name)
        for listener in listeners:
            listener(event)
        return event

    def _listeners_for(self, event_name: str) -> Iterable[EventListener]:
        with self._lock:
            direct = list(self._subscribers.get(event_name, ()))
            wildcard = list(self._subscribers.get("*", ()))
        return [*direct, *wildcard]


class NotificationCenter:
    """Collects notifications emitted from domain events."""

    def __init__(self, bus: Optional[EventBus] = None) -> None:
        self._notifications: MutableMapping[int, List[Notification]] = defaultdict(list)
        self._lock = threading.Lock()
        if bus is not None:
            self.bind(bus)

    def bind(self, bus: EventBus) -> None:
        bus.subscribe("owner.payment.processed", self._handle_payment_event)
        bus.subscribe("owner.incident.reported", self._handle_incident_event)
        bus.subscribe("owner.payout_preferences.updated", self._handle_payout_update)
        bus.subscribe("owner.kyc.submitted", self._handle_kyc_event)

    def list(self, owner_id: int) -> List[Notification]:
        with self._lock:
            return list(self._notifications.get(owner_id, ()))

    def add(self, notification: Notification) -> Notification:
        with self._lock:
            items = self._notifications.setdefault(notification.owner_id, [])
            items.append(notification)
        return notification

    def mark_read(self, owner_id: int, notification_id: str) -> None:
        with self._lock:
            for item in self._notifications.get(owner_id, ()):
                if item.id == notification_id:
                    item.read = True
                    break

    def unread_count(self, owner_id: int) -> int:
        with self._lock:
            return sum(1 for item in self._notifications.get(owner_id, ()) if not item.read)

    def _handle_payment_event(self, event: Event) -> None:
        owner_id = int(event.payload.get("owner_id", 0))
        if not owner_id:
            return
        amount = event.payload.get("amount")
        reference = event.payload.get("reference")
        message = (
            f"Pagamento de {amount:.2f} processado (ref. {reference})."
            if amount is not None and reference
            else "Pagamento processado com sucesso."
        )
        self._push(
            owner_id,
            title="Pagamento confirmado",
            message=message,
            category="payment",
        )

    def _handle_incident_event(self, event: Event) -> None:
        owner_id = int(event.payload.get("owner_id", 0))
        if not owner_id:
            return
        incident = event.payload.get("incident") or "Incidente registado"
        self._push(
            owner_id,
            title="Novo incidente",
            message=str(incident),
            category="incident",
        )

    def _handle_payout_update(self, event: Event) -> None:
        owner_id = int(event.payload.get("owner_id", 0))
        if not owner_id:
            return
        method = event.payload.get("method")
        self._push(
            owner_id,
            title="Preferências de pagamento actualizadas",
            message=f"Método activo: {method}.",
            category="settings",
        )

    def _handle_kyc_event(self, event: Event) -> None:
        owner_id = int(event.payload.get("owner_id", 0))
        if not owner_id:
            return
        document_type = event.payload.get("document_type", "documento")
        self._push(
            owner_id,
            title="Documento submetido",
            message=f"{document_type} recebido e em revisão manual.",
            category="compliance",
        )

    def _push(self, owner_id: int, title: str, message: str, category: str) -> None:
        notification = Notification(
            id=str(uuid.uuid4()),
            owner_id=owner_id,
            title=title,
            message=message,
            category=category,
            created_at=datetime.now(timezone.utc),
        )
        self.add(notification)


class WebhookDispatcher:
    """Registers webhooks and records deliveries for auditing."""

    def __init__(self, bus: Optional[EventBus] = None) -> None:
        self._subscriptions: MutableMapping[str, List[WebhookSubscription]] = defaultdict(list)
        self._deliveries: List[WebhookDelivery] = []
        self._lock = threading.Lock()
        if bus is not None:
            self.bind(bus)

    def bind(self, bus: EventBus) -> None:
        bus.subscribe("*", self._handle_event)

    def register(self, event_name: str, target_url: str, secret: Optional[str] = None) -> WebhookSubscription:
        subscription = WebhookSubscription(
            id=str(uuid.uuid4()),
            event_name=event_name,
            target_url=target_url,
            secret=secret,
            created_at=datetime.now(timezone.utc),
        )
        with self._lock:
            self._subscriptions[event_name].append(subscription)
        return subscription

    def deliveries(self) -> List[WebhookDelivery]:
        with self._lock:
            return list(self._deliveries)

    def _handle_event(self, event: Event) -> None:
        with self._lock:
            targets = list(self._subscriptions.get(event.name, ()))
        if not targets:
            return
        for subscription in targets:
            signature = self._sign(event, subscription.secret)
            delivery = WebhookDelivery(
                subscription_id=subscription.id,
                event_name=event.name,
                payload=event.payload,
                delivered_at=datetime.now(timezone.utc),
                signature=signature,
            )
            self._deliveries.append(delivery)

    @staticmethod
    def _sign(event: Event, secret: Optional[str]) -> str:
        body = repr((event.name, event.payload, event.occurred_at.isoformat())).encode()
        key = (secret or "").encode()
        digest = hmac.new(key, body, hashlib.sha256).hexdigest()
        return digest


__all__ = [
    "Event",
    "EventBus",
    "Notification",
    "NotificationCenter",
    "WebhookDelivery",
    "WebhookDispatcher",
    "WebhookSubscription",
]
