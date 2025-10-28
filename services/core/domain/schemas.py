"""Esquemas de entrada e saída para a API core."""
from __future__ import annotations

from datetime import date, datetime
from typing import Any

from uuid import uuid4

from pydantic import BaseModel, EmailStr, Field, ConfigDict

from .models import AgentRole, HousekeepingStatus, ReservationStatus, SLAStatus


class PropertyCreate(BaseModel):
    name: str
    timezone: str = "UTC"
    address: str | None = None
    units: int = Field(ge=1, default=1)


class PropertyRead(PropertyCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class WorkspaceCreate(BaseModel):
    name: str = Field(min_length=1)
    timezone: str = "UTC"
    team_size: int = Field(ge=1)
    primary_use_case: str = Field(min_length=1)
    communication_channel: str
    quarterly_goal: str = Field(min_length=1)
    invite_emails: list[EmailStr] = Field(default_factory=list)
    team_roles: list[str] = Field(min_length=1)
    enable_sandbox: bool = True
    require_mfa: bool = True
    security_notes: str | None = None


class WorkspaceRead(WorkspaceCreate):
    id: int
    slug: str
    created_at: datetime

    class Config:
        from_attributes = True


class AgentCreate(BaseModel):
    name: str
    email: EmailStr
    role: AgentRole


class AgentRead(AgentCreate):
    id: int
    active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ReservationCreate(BaseModel):
    property_id: int
    guest_name: str
    guest_email: EmailStr
    check_in: datetime
    check_out: datetime


class ReservationRead(BaseModel):
    id: int
    property_id: int
    guest_name: str
    guest_email: EmailStr
    status: ReservationStatus
    check_in: datetime
    check_out: datetime
    created_at: datetime

    class Config:
        from_attributes = True


class ReservationUpdateStatus(BaseModel):
    status: ReservationStatus


class HousekeepingTaskCreate(BaseModel):
    property_id: int
    scheduled_date: datetime
    reservation_id: int | None = None
    assigned_agent_id: int | None = None
    notes: str | None = None


class HousekeepingTaskRead(BaseModel):
    id: int
    property_id: int
    reservation_id: int | None
    assigned_agent_id: int | None
    status: HousekeepingStatus
    scheduled_date: datetime
    notes: str | None
    created_at: datetime

    class Config:
        from_attributes = True


class PaginationMeta(BaseModel):
    page: int
    page_size: int
    total: int
    total_pages: int


class HousekeepingTaskCollection(BaseModel):
    items: list[HousekeepingTaskRead]
    pagination: PaginationMeta


class OTASyncJobRead(BaseModel):
    id: int
    property_id: int
    reservation_id: int | None
    channel_id: int
    status: str
    payload: str
    created_at: datetime

    class Config:
        from_attributes = True


class HousekeepingStatusUpdate(BaseModel):
    status: HousekeepingStatus


class PartnerSummary(BaseModel):
    id: int
    name: str
    slug: str
    category: str | None

    class Config:
        from_attributes = True


class PartnerSLARead(BaseModel):
    id: int
    metric: str
    metric_label: str
    target_minutes: int
    warning_minutes: int | None
    breach_minutes: int
    current_minutes: int | None
    status: SLAStatus
    last_violation_at: datetime | None
    updated_at: datetime
    partner: PartnerSummary

    class Config:
        from_attributes = True


class PartnerWebhookPayload(BaseModel):
    event_id: str
    partner_slug: str
    metric: str
    status: str
    elapsed_minutes: int
    occurred_at: datetime


class PermissionBase(BaseModel):
    key: str = Field(min_length=3)
    label: str = Field(min_length=1)
    description: str | None = None
    category: str | None = None


class PermissionCreate(PermissionBase):
    pass


class PermissionUpdate(BaseModel):
    label: str | None = None
    description: str | None = None
    category: str | None = None


class PermissionRead(PermissionBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PropertySummary(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class RolePolicyBase(BaseModel):
    role: AgentRole
    name: str = Field(min_length=1)
    persona: str | None = Field(default=None, max_length=120)
    property_id: int | None = None
    permissions: list[str] = Field(default_factory=list)
    inherits: list[AgentRole] = Field(default_factory=list)
    is_default: bool = False


class RolePolicyCreate(RolePolicyBase):
    pass


class RolePolicyUpdate(BaseModel):
    name: str | None = None
    persona: str | None = None
    property_id: int | None = None
    permissions: list[str] | None = None
    inherits: list[AgentRole] | None = None
    is_default: bool | None = None


class RolePolicyRead(RolePolicyBase):
    id: int
    created_at: datetime
    updated_at: datetime
    property: PropertySummary | None = Field(default=None, alias="property_ref")

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class GovernanceAuditRead(BaseModel):
    id: int
    action: str
    detail: dict[str, Any]
    created_at: datetime
    actor_id: int | None


class OccupancySnapshot(BaseModel):
    date: date
    occupied_units: int
    total_units: int
    occupancy_rate: float


class CriticalAlertExample(BaseModel):
    task_id: int
    property_id: int
    status: HousekeepingStatus
    scheduled_date: datetime


class CriticalAlertSummary(BaseModel):
    total: int
    blocked: int
    overdue: int
    examples: list[CriticalAlertExample]


class PlaybookAdoptionSummary(BaseModel):
    period_start: datetime
    period_end: datetime
    total_executions: int
    completed: int
    adoption_rate: float
    active_properties: int


class DashboardMetricsRead(BaseModel):
    occupancy: OccupancySnapshot
    critical_alerts: CriticalAlertSummary
    playbook_adoption: PlaybookAdoptionSummary


class PlaybookTemplateBase(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    summary: str = Field(min_length=1)
    tags: list[str] = Field(default_factory=list)
    steps: list[str] = Field(default_factory=list)


class PlaybookTemplateCreate(PlaybookTemplateBase):
    pass


class PlaybookTemplateRead(PlaybookTemplateBase):
    id: int
    execution_count: int
    last_executed_at: datetime | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PlaybookExecutionRequest(BaseModel):
    initiated_by: str | None = None
    context: dict[str, str] = Field(default_factory=dict)


class PlaybookExecutionRead(BaseModel):
    run_id: str = Field(default_factory=lambda: uuid4().hex)
    playbook_id: int
    status: str
    initiated_by: str | None = None
    started_at: datetime
    finished_at: datetime | None
    message: str

    class Config:
        from_attributes = True
