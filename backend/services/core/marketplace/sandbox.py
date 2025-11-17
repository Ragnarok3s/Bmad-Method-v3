"""Sandbox provisioning utilities for partner integrations."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from secrets import token_urlsafe

from .contracts import SandboxEnvironment


@dataclass(slots=True)
class SandboxPolicy:
    duration: timedelta = timedelta(days=30)
    token_length: int = 32


class SandboxManager:
    """Creates synthetic sandbox credentials for partner contract testing."""

    def __init__(self, policy: SandboxPolicy | None = None) -> None:
        self._policy = policy or SandboxPolicy()
        self._store: dict[str, SandboxEnvironment] = {}

    def issue(self, partner_id: str) -> SandboxEnvironment:
        now = datetime.now(UTC)
        env = SandboxEnvironment(
            id=token_urlsafe(12),
            partner_id=partner_id,
            created_at=now,
            expires_at=now + self._policy.duration,
            credentials={
                "client_id": token_urlsafe(self._policy.token_length // 2),
                "client_secret": token_urlsafe(self._policy.token_length),
            },
        )
        self._store[env.id] = env
        return env

    def get(self, sandbox_id: str) -> SandboxEnvironment | None:
        env = self._store.get(sandbox_id)
        if env and env.expires_at <= datetime.now(UTC):
            self._store.pop(sandbox_id, None)
            return None
        return env

    def revoke(self, sandbox_id: str) -> None:
        self._store.pop(sandbox_id, None)
