"""Service orchestrating partner marketplace flows."""

from __future__ import annotations

from collections import defaultdict
from datetime import UTC, datetime, timedelta
from typing import Iterable, Sequence

from .contracts import (
    ConsentScope,
    InstallationAuditEvent,
    InstallationConsent,
    PartnerApp,
    PartnerInstallRequest,
    PublicContract,
    SandboxEnvironment,
)
from .sandbox import SandboxManager
from .throttling import MarketplaceThrottler, RateLimitExceeded, ThrottlePolicy


class UnknownPartnerError(LookupError):
    pass


class MarketplaceService:
    """Coordinator responsible for partner contract lifecycle."""

    def __init__(
        self,
        *,
        throttler: MarketplaceThrottler | None = None,
        sandbox: SandboxManager | None = None,
    ) -> None:
        policy = ThrottlePolicy(requests=120, period=timedelta(minutes=1))
        self._default_throttler = throttler or MarketplaceThrottler(policy)
        self._sandbox = sandbox or SandboxManager()
        self._apps: dict[str, PartnerApp] = {}
        self._audit: list[InstallationAuditEvent] = []
        self._installs: dict[str, list[PartnerInstallRequest]] = defaultdict(list)
        self._throttlers: dict[str, MarketplaceThrottler] = {}

    # region contract registry
    def register(self, app: PartnerApp) -> None:
        self._apps[app.id] = app
        policy = ThrottlePolicy(
            requests=app.contract.rate_limit_per_minute,
            period=timedelta(minutes=1),
        )
        self._throttlers[app.id] = MarketplaceThrottler(policy)

    def get(self, partner_id: str) -> PartnerApp:
        try:
            return self._apps[partner_id]
        except KeyError as exc:
            raise UnknownPartnerError(partner_id) from exc

    def list(self, *, categories: Iterable[str] | None = None) -> Sequence[PartnerApp]:
        return [app for app in self._apps.values() if app.listed and app.matches_filter(categories=categories)]

    def get_contract(self, partner_id: str) -> PublicContract:
        return self.get(partner_id).contract

    # endregion

    def request_install(self, request: PartnerInstallRequest) -> SandboxEnvironment | None:
        app = self.get(request.partner_id)
        throttler = self._throttlers.get(app.id, self._default_throttler)
        throttler.allow(request.partner_id)

        if not all(app.contract.requires_scope(scope) for scope in request.consent.granted_scopes):
            raise PermissionError("Consent includes scopes not defined in contract")

        if app.contract.sandbox_required and not request.sandbox_requested:
            raise PermissionError("Sandbox is required for this integration")

        audit = InstallationAuditEvent(
            timestamp=datetime.now(UTC),
            partner_id=request.partner_id,
            workspace_id=request.workspace_id,
            actor=request.consent.granted_by or "system",
            action="install.requested",
            metadata={
                "scopes": ",".join(scope.value for scope in request.consent.granted_scopes),
                "sandbox": str(request.sandbox_requested).lower(),
            },
        )
        self._audit.append(audit)
        self._installs[request.workspace_id].append(request)

        sandbox_env: SandboxEnvironment | None = None
        if request.sandbox_requested or app.sandbox_only:
            sandbox_env = self._sandbox.issue(request.partner_id)
            self._audit.append(
                InstallationAuditEvent(
                    timestamp=datetime.now(UTC),
                    partner_id=request.partner_id,
                    workspace_id=request.workspace_id,
                    actor="system",
                    action="sandbox.issued",
                    metadata={"sandbox_id": sandbox_env.id},
                )
            )
        return sandbox_env

    def list_audit_events(self, partner_id: str | None = None) -> Sequence[InstallationAuditEvent]:
        if partner_id is None:
            return list(self._audit)
        return [event for event in self._audit if event.partner_id == partner_id]

    def list_installs(self, workspace_id: str) -> Sequence[PartnerInstallRequest]:
        return list(self._installs.get(workspace_id, []))

    def throttler_for(self, partner_id: str) -> MarketplaceThrottler:
        return self._throttlers.get(partner_id, self._default_throttler)

    @property
    def sandbox(self) -> SandboxManager:
        return self._sandbox
