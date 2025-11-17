"""Push notification integration for mobile clients."""
from __future__ import annotations

import logging
import threading
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Iterable, List, MutableMapping

from .events import Notification

logger = logging.getLogger(__name__)


@dataclass
class PushDevice:
    """Registered push notification target."""

    owner_id: int
    token: str
    platform: str
    device_name: str | None = None
    enabled: bool = True
    last_seen_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))


class PushDeviceRegistry:
    """In-memory registry of push notification devices."""

    def __init__(self) -> None:
        self._devices: MutableMapping[str, PushDevice] = {}
        self._lock = threading.Lock()

    def register(self, device: PushDevice) -> PushDevice:
        with self._lock:
            existing = self._devices.get(device.token)
            if existing:
                existing.platform = device.platform
                existing.device_name = device.device_name
                existing.enabled = True
                existing.last_seen_at = datetime.now(timezone.utc)
                logger.debug(
                    "push_device_updated",
                    extra={"token": device.token, "owner": device.owner_id},
                )
                return existing
            self._devices[device.token] = device
            logger.info(
                "push_device_registered",
                extra={"token": device.token, "owner": device.owner_id},
            )
            return device

    def disable(self, token: str) -> None:
        with self._lock:
            if token in self._devices:
                self._devices[token].enabled = False
                logger.info("push_device_disabled", extra={"token": token})

    def list_for_owner(self, owner_id: int) -> List[PushDevice]:
        with self._lock:
            return [
                device
                for device in self._devices.values()
                if device.owner_id == owner_id and device.enabled
            ]

    def remove_for_owner(self, owner_id: int, token: str) -> None:
        with self._lock:
            if token in self._devices and self._devices[token].owner_id == owner_id:
                del self._devices[token]
                logger.info(
                    "push_device_removed", extra={"token": token, "owner": owner_id}
                )


class PushGateway:
    """Abstract push notification transport."""

    async def send(
        self, notification: Notification, devices: Iterable[PushDevice]
    ) -> None:  # pragma: no cover - interface
        raise NotImplementedError


class LoggingPushGateway(PushGateway):
    """No-op push gateway that records dispatch attempts for web clients."""

    async def send(self, notification: Notification, devices: Iterable[PushDevice]) -> None:
        targets = list(devices)
        logger.info(
            "push_delivery_logged",
            extra={
                "notification": notification.id,
                "target_count": len(targets),
                "category": notification.category,
            },
        )


class PushNotificationService:
    """Bridge notifications from NotificationCenter to push devices."""

    def __init__(
        self,
        registry: PushDeviceRegistry | None = None,
        gateway: PushGateway | None = None,
    ) -> None:
        self.registry = registry or PushDeviceRegistry()
        self.gateway = gateway or LoggingPushGateway()

    def register_device(
        self,
        owner_id: int,
        token: str,
        platform: str,
        device_name: str | None = None,
    ) -> PushDevice:
        device = PushDevice(
            owner_id=owner_id,
            token=token,
            platform=platform,
            device_name=device_name,
        )
        return self.registry.register(device)

    def unregister_device(self, owner_id: int, token: str) -> None:
        self.registry.remove_for_owner(owner_id, token)

    def list_devices(self, owner_id: int) -> List[PushDevice]:
        return self.registry.list_for_owner(owner_id)

    async def dispatch(self, notification: Notification) -> None:
        devices = self.registry.list_for_owner(notification.owner_id)
        if not devices:
            logger.debug(
                "push_skipped_no_devices", extra={"owner": notification.owner_id}
            )
            return
        try:
            await self.gateway.send(notification, devices)
        except Exception as exc:  # pragma: no cover - logging safety
            logger.exception("push_dispatch_failed", exc_info=exc)


class NotificationRelay:
    """Async dispatcher executed from synchronous contexts."""

    def __init__(self, service: PushNotificationService) -> None:
        self.service = service

    def handle(self, notification: Notification) -> None:
        import anyio

        logger.debug("push_notification_received", extra={"notification": notification.id})
        anyio.from_thread.run(self.service.dispatch, notification)


__all__ = [
  "PushDevice",
  "PushDeviceRegistry",
  "PushGateway",
  "LoggingPushGateway",
  "PushNotificationService",
  "NotificationRelay",
]
