"""Persistence helpers for tenant-scoped identity operations."""

from __future__ import annotations

import json
import logging
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any

from fastapi import status
from sqlalchemy import Select, delete, select
from sqlalchemy.orm import Session, joinedload

from services.core.domain.models import Agent, AgentRole, AuditLog, Tenant
from services.core.observability import record_audit_event

from .models import TenantAgentAccess


logger = logging.getLogger("bmad.identity.tenants")


class TenantAccessError(Exception):
    """Raised when an identity operation violates tenant isolation."""

    def __init__(self, detail: str, status_code: int = status.HTTP_403_FORBIDDEN) -> None:
        super().__init__(detail)
        self.detail = detail
        self.status_code = status_code


@dataclass(slots=True)
class TenantContext:
    """Lightweight holder for tenant context during a request."""

    tenant: Tenant
    session: Session


class TenantAccessRepository:
    """Encapsulates tenant-aware lookup and role assignment logic."""

    def __init__(self, context: TenantContext) -> None:
        self._context = context

    @property
    def tenant(self) -> Tenant:
        return self._context.tenant

    @property
    def session(self) -> Session:
        return self._context.session

    def _base_query(self) -> Select[TenantAgentAccess]:
        return (
            select(TenantAgentAccess)
            .where(TenantAgentAccess.tenant_id == self.tenant.id)
            .options(joinedload(TenantAgentAccess.agent))
        )

    def _persist_audit(
        self,
        action: str,
        *,
        agent_id: int | None,
        detail: dict[str, Any],
        severity: str = "info",
    ) -> None:
        record_audit_event(action, actor_id=agent_id, detail=detail, severity=severity)
        payload = AuditLog(action=action, agent_id=agent_id, detail=json.dumps(detail))
        self.session.add(payload)

    def _audit_denied(
        self,
        *,
        agent_id: int | None,
        email: str,
        reason: str,
        status_code: int,
    ) -> None:
        detail = {
            "tenant_id": self.tenant.id,
            "tenant_slug": self.tenant.slug,
            "email": email,
            "reason": reason,
            "status_code": status_code,
        }
        logger.warning(
            "tenant_access_denied",
            extra={
                "tenant": self.tenant.slug,
                "email": email,
                "reason": reason,
                "status_code": status_code,
            },
        )
        self._persist_audit(
            "tenant_access_denied",
            agent_id=agent_id,
            detail=detail,
            severity="warning",
        )

    def require_agent_by_email(self, email: str) -> Agent:
        """Return the tenant-bound agent for the given email."""

        normalized = email.strip().lower()
        query = self._base_query().join(TenantAgentAccess.agent).where(Agent.email == normalized)
        assignment = self.session.execute(query).scalar_one_or_none()
        if assignment is None or assignment.agent is None:
            self._audit_denied(
                agent_id=None,
                email=normalized,
                reason="assignment_missing",
                status_code=status.HTTP_401_UNAUTHORIZED,
            )
            raise TenantAccessError("Credenciais inválidas", status.HTTP_401_UNAUTHORIZED)
        if not assignment.agent.active:
            self._audit_denied(
                agent_id=assignment.agent.id,
                email=normalized,
                reason="agent_inactive",
                status_code=status.HTTP_403_FORBIDDEN,
            )
            raise TenantAccessError("Agente desativado", status.HTTP_403_FORBIDDEN)
        return assignment.agent

    def ensure_agent_authorized(self, agent_id: int) -> None:
        lookup = self.session.get(
            TenantAgentAccess, {"tenant_id": self.tenant.id, "agent_id": agent_id}
        )
        if lookup is None:
            agent = self.session.get(Agent, agent_id)
            self._audit_denied(
                agent_id=agent_id,
                email=agent.email if agent else "unknown",
                reason="assignment_missing",
                status_code=status.HTTP_403_FORBIDDEN,
            )
            raise TenantAccessError("Agente não autorizado para este tenant", status.HTTP_403_FORBIDDEN)
        agent = lookup.agent
        if agent is not None and not agent.active:
            self._audit_denied(
                agent_id=agent.id,
                email=agent.email,
                reason="agent_inactive",
                status_code=status.HTTP_403_FORBIDDEN,
            )
            raise TenantAccessError("Agente desativado", status.HTTP_403_FORBIDDEN)

    def assign_role(self, agent: Agent, role: AgentRole) -> TenantAgentAccess:
        assignment = self.session.get(
            TenantAgentAccess, {"tenant_id": self.tenant.id, "agent_id": agent.id}
        )
        now = datetime.now(timezone.utc)
        if assignment is None:
            assignment = TenantAgentAccess(
                tenant_id=self.tenant.id,
                agent_id=agent.id,
                role=role,
                assigned_at=now,
                updated_at=now,
            )
            self.session.add(assignment)
            event = "created"
        else:
            assignment.role = role
            assignment.updated_at = now
            self.session.add(assignment)
            event = "updated"
        logger.info(
            "tenant_role_assigned",
            extra={
                "tenant": self.tenant.slug,
                "agent_id": agent.id,
                "role": role.value,
                "event": event,
            },
        )
        self._persist_audit(
            "tenant_role_assigned",
            agent_id=agent.id,
            detail={
                "tenant_id": self.tenant.id,
                "tenant_slug": self.tenant.slug,
                "role": role.value,
                "event": event,
            },
        )
        return assignment

    def list_assignments(self) -> list[TenantAgentAccess]:
        statement = self._base_query().order_by(TenantAgentAccess.assigned_at.desc())
        return list(self.session.execute(statement).scalars())

    def remove_assignment(self, agent_id: int) -> bool:
        result = self.session.execute(
            delete(TenantAgentAccess).where(
                TenantAgentAccess.tenant_id == self.tenant.id,
                TenantAgentAccess.agent_id == agent_id,
            )
        )
        removed = bool(result.rowcount)
        if removed:
            logger.info(
                "tenant_role_revoked",
                extra={
                    "tenant": self.tenant.slug,
                    "agent_id": agent_id,
                },
            )
            self._persist_audit(
                "tenant_role_revoked",
                agent_id=agent_id,
                detail={
                    "tenant_id": self.tenant.id,
                    "tenant_slug": self.tenant.slug,
                },
            )
        return removed


__all__ = [
    "TenantAccessRepository",
    "TenantAccessError",
    "TenantContext",
]
