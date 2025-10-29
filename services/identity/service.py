"""Service layer adapters for tenant-aware authentication."""

from __future__ import annotations

from datetime import timedelta

from fastapi import status
from sqlalchemy.orm import Session

from services.core.security import AuthenticationError, AuthenticationService

from .repositories import TenantAccessError, TenantAccessRepository


class TenantAwareAuthenticationService(AuthenticationService):
    """Wraps the core authentication service enforcing tenant membership."""

    def __init__(
        self,
        session: Session,
        repository: TenantAccessRepository,
        *,
        session_timeout: timedelta | None = None,
        max_attempts: int = 5,
        lockout_window: timedelta | None = None,
    ) -> None:
        super().__init__(
            session,
            session_timeout=session_timeout,
            max_attempts=max_attempts,
            lockout_window=lockout_window,
        )
        self._repository = repository

    def _lookup_agent(self, email: str):  # type: ignore[override]
        return self._repository.require_agent_by_email(email)

    def verify_mfa(self, session_id: str, code: str, *, method: str | None = "totp"):
        auth_session = super().verify_mfa(session_id, code, method=method)
        try:
            self._repository.ensure_agent_authorized(auth_session.agent_id)
        except TenantAccessError as error:
            raise AuthenticationError(status.HTTP_403_FORBIDDEN, error.detail) from error
        return auth_session


__all__ = ["TenantAwareAuthenticationService"]
