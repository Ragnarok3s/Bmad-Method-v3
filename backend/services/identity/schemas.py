"""Pydantic contracts for the identity service."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from services.core.domain.models import AgentRole


class TenantLoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class TenantLoginResponse(BaseModel):
    tenant: str
    session_id: str
    agent_id: int
    mfa_required: bool
    expires_at: datetime
    session_timeout_seconds: int | None = None
    recovery_codes_remaining: int = 0


class TenantMFAVerificationRequest(BaseModel):
    session_id: str
    code: str = Field(min_length=1)
    method: str = Field(default="totp")


class RoleAssignmentUpdate(BaseModel):
    role: AgentRole


class RoleAssignmentRead(BaseModel):
    tenant_id: int
    agent_id: int
    agent_email: EmailStr
    role: AgentRole
    assigned_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


__all__ = [
    "TenantLoginRequest",
    "TenantLoginResponse",
    "TenantMFAVerificationRequest",
    "RoleAssignmentUpdate",
    "RoleAssignmentRead",
]
