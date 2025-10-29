"""Data contracts used by the marketplace services and public API."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import UTC, datetime
from enum import Enum
from typing import Iterable, Sequence


class ConsentScope(str, Enum):
    """Well known scopes that partners can request during installation."""

    ANALYTICS = "analytics"
    BOOKINGS = "bookings"
    PAYMENTS = "payments"
    PROFILE = "profile"
    SANDBOX = "sandbox"


@dataclass(slots=True)
class PublicContract:
    """Public contract describing how an integration behaves."""

    version: str
    summary: str
    scopes: Sequence[ConsentScope]
    webhook_endpoints: Sequence[str]
    rate_limit_per_minute: int = 120
    sandbox_required: bool = False

    def requires_scope(self, scope: ConsentScope) -> bool:
        return scope in self.scopes


@dataclass(slots=True)
class PartnerApp:
    """Metadata for a marketplace listing."""

    id: str
    name: str
    description: str
    categories: Sequence[str]
    contract: PublicContract
    listed: bool = True
    sandbox_only: bool = False
    icon_url: str | None = None

    def matches_filter(self, *, categories: Iterable[str] | None = None) -> bool:
        if categories:
            sought = {c.lower() for c in categories}
            return bool(set(map(str.lower, self.categories)) & sought)
        return True


@dataclass(slots=True)
class InstallationConsent:
    """Represents a granular consent approval given by an operator."""

    granted_scopes: Sequence[ConsentScope]
    expires_at: datetime | None = None
    granted_by: str | None = None

    def includes(self, scope: ConsentScope) -> bool:
        return scope in self.granted_scopes


@dataclass(slots=True)
class PartnerInstallRequest:
    """Installation attempt initiated from the marketplace hub."""

    partner_id: str
    workspace_id: str
    consent: InstallationConsent
    created_at: datetime = field(default_factory=lambda: datetime.now(UTC))
    sandbox_requested: bool = False
    correlation_id: str | None = None


@dataclass(slots=True)
class InstallationAuditEvent:
    """Audit trail entry for partner installation lifecycle."""

    timestamp: datetime
    partner_id: str
    workspace_id: str
    actor: str
    action: str
    metadata: dict[str, str] = field(default_factory=dict)


@dataclass(slots=True)
class SandboxEnvironment:
    """Represents a sandbox token for a partner app."""

    id: str
    partner_id: str
    created_at: datetime
    expires_at: datetime
    credentials: dict[str, str]
