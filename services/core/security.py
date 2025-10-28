"""Governança de acesso para operações do core."""
from __future__ import annotations

from typing import Iterable

from fastapi import HTTPException, status

from .domain.models import Agent, AgentRole


ROLE_HIERARCHY: dict[AgentRole, set[AgentRole]] = {
    AgentRole.ADMIN: {AgentRole.ADMIN, AgentRole.PROPERTY_MANAGER, AgentRole.HOUSEKEEPING, AgentRole.OTA},
    AgentRole.PROPERTY_MANAGER: {AgentRole.PROPERTY_MANAGER, AgentRole.HOUSEKEEPING},
    AgentRole.HOUSEKEEPING: {AgentRole.HOUSEKEEPING},
    AgentRole.OTA: {AgentRole.OTA},
}


def assert_role(agent: Agent, allowed: Iterable[AgentRole]) -> None:
    """Valida se o agente possui alguma das roles permitidas."""

    allowed_set = set(allowed)
    if not agent.active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Agente inativo")

    effective_roles = ROLE_HIERARCHY.get(agent.role, {agent.role})
    if not effective_roles.intersection(allowed_set):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acesso negado")
