"""Esquemas de entrada e saída para a API core."""
from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, EmailStr, Field

from .models import AgentRole, HousekeepingStatus, ReservationStatus


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
