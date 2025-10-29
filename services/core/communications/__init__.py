from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Any
from uuid import uuid4

from ..localization import normalize_locale
from ..metrics import (
    record_guest_message_delivery,
    record_guest_message_failure,
)


class CommunicationChannel(str, Enum):
    EMAIL = "email"
    WHATSAPP = "whatsapp"


class DeliveryStatus(str, Enum):
    SENT = "sent"
    FAILED = "failed"
    QUEUED = "queued"


def _safe_format(template: str, variables: dict[str, Any]) -> str:
    class _SafeDict(dict):
        def __missing__(self, key: str) -> str:
            return "{" + key + "}"

    return template.format_map(_SafeDict(**variables))


@dataclass(slots=True)
class TemplateTranslation:
    locale: str
    subject: str | None
    body: str

    def render(self, variables: dict[str, Any]) -> tuple[str | None, str]:
        rendered_subject = _safe_format(self.subject, variables) if self.subject else None
        rendered_body = _safe_format(self.body, variables)
        return rendered_subject, rendered_body


@dataclass(slots=True)
class CommunicationTemplate:
    id: str
    name: str
    category: str
    description: str | None = None
    channels: set[CommunicationChannel] = field(default_factory=set)
    default_locale: str = "pt-BR"
    translations: dict[str, TemplateTranslation] = field(default_factory=dict)
    tags: set[str] = field(default_factory=set)
    metadata: dict[str, Any] = field(default_factory=dict)
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

    def resolve(self, locale: str | None = None) -> TemplateTranslation:
        normalized = normalize_locale(locale or self.default_locale)
        translation = self.translations.get(normalized)
        if translation:
            return translation
        return self.translations.get(self.default_locale) or next(iter(self.translations.values()))

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "description": self.description,
            "channels": sorted(channel.value for channel in self.channels),
            "default_locale": self.default_locale,
            "translations": [
                {
                    "locale": translation.locale,
                    "subject": translation.subject,
                    "body": translation.body,
                }
                for translation in self.translations.values()
            ],
            "tags": sorted(self.tags),
            "metadata": self.metadata,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }


@dataclass(slots=True)
class CommunicationMessage:
    id: str
    template_id: str
    channel: CommunicationChannel
    recipient: str
    direction: str
    author: str
    status: DeliveryStatus
    locale: str
    subject: str | None
    body: str
    sent_at: datetime
    context: dict[str, Any] = field(default_factory=dict)
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "template_id": self.template_id,
            "channel": self.channel.value,
            "direction": self.direction,
            "author": self.author,
            "status": self.status.value,
            "recipient": self.recipient,
            "locale": self.locale,
            "subject": self.subject,
            "body": self.body,
            "sent_at": self.sent_at,
            "context": self.context,
            "metadata": self.metadata,
        }


class CommunicationService:
    """Orquestra o ciclo de vida de comunicações com hóspedes."""

    def __init__(self) -> None:
        self._templates: dict[str, CommunicationTemplate] = {}
        self._messages: list[CommunicationMessage] = []

    def register_template(self, template: CommunicationTemplate) -> None:
        self._templates[template.id] = template

    def list_templates(self) -> list[CommunicationTemplate]:
        return sorted(self._templates.values(), key=lambda template: template.name)

    def get_template(self, template_id: str) -> CommunicationTemplate:
        if template_id not in self._templates:
            raise KeyError(template_id)
        return self._templates[template_id]

    def render_template(
        self,
        template_id: str,
        *,
        locale: str | None = None,
        variables: dict[str, Any] | None = None,
    ) -> tuple[str | None, str, str]:
        template = self.get_template(template_id)
        translation = template.resolve(locale)
        normalized = normalize_locale(locale or translation.locale)
        subject, body = translation.render(variables or {})
        return subject, body, normalized

    def send_message(
        self,
        template_id: str,
        *,
        channel: CommunicationChannel,
        recipient: str,
        locale: str | None = None,
        variables: dict[str, Any] | None = None,
        context: dict[str, Any] | None = None,
        author: str = "automation",
    ) -> CommunicationMessage:
        template = self.get_template(template_id)
        if channel not in template.channels:
            record_guest_message_failure(channel.value, template_id)
            raise ValueError(f"Template {template_id} não suporta canal {channel.value}")

        subject, body, normalized = self.render_template(
            template_id, locale=locale, variables=variables
        )
        message = CommunicationMessage(
            id=uuid4().hex,
            template_id=template_id,
            channel=channel,
            recipient=recipient,
            direction="outbound",
            author=author,
            status=DeliveryStatus.SENT,
            locale=normalized,
            subject=subject,
            body=body,
            sent_at=datetime.now(timezone.utc),
            context=context or {},
            metadata={"variables": variables or {}},
        )
        self._messages.append(message)
        record_guest_message_delivery(channel.value, template_id)
        return message

    def record_failure(
        self,
        template_id: str,
        *,
        channel: CommunicationChannel,
        recipient: str,
        error: str,
        context: dict[str, Any] | None = None,
    ) -> CommunicationMessage:
        message = CommunicationMessage(
            id=uuid4().hex,
            template_id=template_id,
            channel=channel,
            recipient=recipient,
            direction="outbound",
            author="automation",
            status=DeliveryStatus.FAILED,
            locale=normalize_locale(None),
            subject=None,
            body=error,
            sent_at=datetime.now(timezone.utc),
            context=context or {},
        )
        self._messages.append(message)
        record_guest_message_failure(channel.value, template_id)
        return message

    def record_inbound_message(
        self,
        *,
        channel: CommunicationChannel,
        sender: str,
        body: str,
        locale: str | None = None,
        context: dict[str, Any] | None = None,
        in_reply_to: str | None = None,
        author: str = "guest",
    ) -> CommunicationMessage:
        payload_context = context or {}
        if in_reply_to:
            payload_context = {**payload_context, "in_reply_to": in_reply_to}
        message = CommunicationMessage(
            id=uuid4().hex,
            template_id=payload_context.get("template_id", "inbound.freeform"),
            channel=channel,
            recipient=sender,
            direction="inbound",
            author=author,
            status=DeliveryStatus.SENT,
            locale=normalize_locale(locale),
            subject=None,
            body=body,
            sent_at=datetime.now(timezone.utc),
            context=payload_context,
        )
        self._messages.append(message)
        return message

    def history_for_reservation(self, reservation_id: int) -> list[CommunicationMessage]:
        return [
            message
            for message in self._messages
            if message.context.get("reservation_id") == reservation_id
        ]

    def messages(self) -> list[CommunicationMessage]:
        return list(self._messages)

    def delivery_summary(self) -> dict[str, Any]:
        total = len(self._messages)
        status_counts: dict[str, int] = {}
        channel_counts: dict[str, dict[str, int]] = {}
        template_usage: dict[str, int] = {}
        messages_by_id = {message.id: message for message in self._messages}
        response_deltas: list[float] = []
        upsell_offers = 0
        upsell_accepted = 0
        journey_events: dict[str, int] = {}
        replied_messages: set[str] = set()
        inbound_total = 0
        outbound_total = 0
        last_message_at: datetime | None = None

        for message in self._messages:
            status_counts[message.status.value] = status_counts.get(message.status.value, 0) + 1
            channel_stats = channel_counts.setdefault(message.channel.value, {"total": 0, "failed": 0})
            channel_stats["total"] += 1
            if message.status == DeliveryStatus.FAILED:
                channel_stats["failed"] += 1

            template_usage[message.template_id] = template_usage.get(message.template_id, 0) + 1

            if message.direction == "inbound":
                inbound_total += 1
            else:
                outbound_total += 1

            if last_message_at is None or message.sent_at > last_message_at:
                last_message_at = message.sent_at

            stage = message.context.get("journey_stage")
            if stage:
                journey_events[stage] = journey_events.get(stage, 0) + 1

            if message.direction == "outbound" and message.context.get("upsell_offer"):
                upsell_offers += 1

            if message.direction == "inbound":
                reply_to = message.context.get("in_reply_to") if message.context else None
                if reply_to and reply_to in messages_by_id:
                    origin = messages_by_id[reply_to]
                    delta = (message.sent_at - origin.sent_at).total_seconds() / 60
                    response_deltas.append(delta)
                    replied_messages.add(reply_to)
                if message.context and message.context.get("upsell_response") == "accepted":
                    upsell_accepted += 1

        average_response = sum(response_deltas) / len(response_deltas) if response_deltas else None
        upsell_conversion = (upsell_accepted / upsell_offers) if upsell_offers else None
        engagement_rate = (
            inbound_total / outbound_total
            if outbound_total and inbound_total
            else (1.0 if inbound_total and not outbound_total else None)
        )
        pending_followups = sum(
            1
            for message in self._messages
            if message.direction == "outbound" and message.id not in replied_messages
        )

        return {
            "total": total,
            "status_counts": status_counts,
            "channels": channel_counts,
            "average_response_minutes": average_response,
            "upsell": {
                "offers": upsell_offers,
                "accepted": upsell_accepted,
                "conversion_rate": upsell_conversion,
            },
            "journey_events": journey_events,
            "templates": template_usage,
            "last_message_at": last_message_at,
            "inbound_engagement_rate": engagement_rate,
            "pending_followups": pending_followups,
        }


__all__ = [
    "CommunicationChannel",
    "CommunicationMessage",
    "CommunicationService",
    "CommunicationTemplate",
    "DeliveryStatus",
    "TemplateTranslation",
]
