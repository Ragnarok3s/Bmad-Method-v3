"""Persistence helpers for tenant-scoped identity operations."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone

from fastapi import status
from sqlalchemy import Select, delete, select
from sqlalchemy.orm import Session, joinedload

from services.core.domain.models import Agent, AgentRole, Tenant

from .models import TenantAgentAccess


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

    def require_agent_by_email(self, email: str) -> Agent:
        """Return the tenant-bound agent for the given email."""

        normalized = email.strip().lower()
        query = self._base_query().join(TenantAgentAccess.agent).where(Agent.email == normalized)
        assignment = self.session.execute(query).scalar_one_or_none()
        if assignment is None or assignment.agent is None:
            raise TenantAccessError("Credenciais inválidas", status.HTTP_401_UNAUTHORIZED)
        if not assignment.agent.active:
            raise TenantAccessError("Agente desativado", status.HTTP_403_FORBIDDEN)
        return assignment.agent

    def ensure_agent_authorized(self, agent_id: int) -> None:
        lookup = self.session.get(
            TenantAgentAccess, {"tenant_id": self.tenant.id, "agent_id": agent_id}
        )
        if lookup is None:
            raise TenantAccessError("Agente não autorizado para este tenant", status.HTTP_403_FORBIDDEN)
        agent = lookup.agent
        if agent is not None and not agent.active:
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
        else:
            assignment.role = role
            assignment.updated_at = now
            self.session.add(assignment)
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
        return bool(result.rowcount)


__all__ = [
    "TenantAccessRepository",
    "TenantAccessError",
    "TenantContext",
]
