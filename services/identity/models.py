"""Additional ORM models required by the identity service."""

from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql.sqltypes import Enum as SAEnum

from services.core.domain.models import Agent, AgentRole, Base, Tenant


class TenantAgentAccess(Base):
    """Associates agents to tenants with tenant-scoped roles."""

    __tablename__ = "tenant_agent_access"

    tenant_id: Mapped[int] = mapped_column(ForeignKey("tenants.id"), primary_key=True)
    agent_id: Mapped[int] = mapped_column(ForeignKey("agents.id"), primary_key=True)
    role: Mapped[AgentRole] = mapped_column(SAEnum(AgentRole), nullable=False)
    assigned_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    tenant: Mapped[Tenant] = relationship("Tenant")
    agent: Mapped[Agent] = relationship("Agent")


__all__ = ["TenantAgentAccess"]
