"""Modelos relacionais que suportam os módulos do MVP."""
from __future__ import annotations

from datetime import datetime, timezone

from enum import Enum

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum as SAEnum,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class Property(Base):
    __tablename__ = "properties"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    timezone: Mapped[str] = mapped_column(String(64), nullable=False, default="UTC")
    address: Mapped[str] = mapped_column(Text, nullable=True)

    units: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    reservations: Mapped[list["Reservation"]] = relationship("Reservation", back_populates="property", cascade="all, delete-orphan")
    housekeeping_tasks: Mapped[list["HousekeepingTask"]] = relationship("HousekeepingTask", back_populates="property", cascade="all, delete-orphan")


class AgentRole(str, Enum):
    ADMIN = "admin"
    PROPERTY_MANAGER = "property_manager"
    HOUSEKEEPING = "housekeeping"
    OTA = "ota"


class Agent(Base):
    __tablename__ = "agents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(120), nullable=False, unique=True)
    role: Mapped[AgentRole] = mapped_column(SAEnum(AgentRole), nullable=False)
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)

    housekeeping_tasks: Mapped[list["HousekeepingTask"]] = relationship("HousekeepingTask", back_populates="assigned_agent")


class ReservationStatus(str, Enum):
    DRAFT = "draft"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    CHECKED_IN = "checked_in"
    CHECKED_OUT = "checked_out"


class Reservation(Base):
    __tablename__ = "reservations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    property_id: Mapped[int] = mapped_column(ForeignKey("properties.id"), nullable=False)
    guest_name: Mapped[str] = mapped_column(String(120), nullable=False)
    guest_email: Mapped[str] = mapped_column(String(120), nullable=False)
    status: Mapped[ReservationStatus] = mapped_column(
        SAEnum(ReservationStatus), nullable=False, default=ReservationStatus.DRAFT
    )
    check_in: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    check_out: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)

    property: Mapped[Property] = relationship("Property", back_populates="reservations")
    audit_events: Mapped[list["AuditLog"]] = relationship("AuditLog", back_populates="reservation")


class HousekeepingStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    BLOCKED = "blocked"


class HousekeepingTask(Base):
    __tablename__ = "housekeeping_tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    property_id: Mapped[int] = mapped_column(ForeignKey("properties.id"), nullable=False)
    reservation_id: Mapped[int | None] = mapped_column(ForeignKey("reservations.id"), nullable=True)
    assigned_agent_id: Mapped[int | None] = mapped_column(ForeignKey("agents.id"), nullable=True)
    status: Mapped[HousekeepingStatus] = mapped_column(
        SAEnum(HousekeepingStatus), nullable=False, default=HousekeepingStatus.PENDING
    )
    scheduled_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)

    property: Mapped[Property] = relationship("Property", back_populates="housekeeping_tasks")
    reservation: Mapped[Reservation | None] = relationship("Reservation")
    assigned_agent: Mapped[Agent | None] = relationship("Agent", back_populates="housekeeping_tasks")


class OTAChannel(Base):
    __tablename__ = "ota_channels"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)


class OTASyncStatus(str, Enum):
    PENDING = "pending"
    IN_FLIGHT = "in_flight"
    SUCCESS = "success"
    FAILED = "failed"


class OTASyncQueue(Base):
    __tablename__ = "ota_sync_queue"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    reservation_id: Mapped[int | None] = mapped_column(ForeignKey("reservations.id"), nullable=True)
    property_id: Mapped[int] = mapped_column(ForeignKey("properties.id"), nullable=False)
    channel_id: Mapped[int] = mapped_column(ForeignKey("ota_channels.id"), nullable=False)
    payload: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[OTASyncStatus] = mapped_column(
        SAEnum(OTASyncStatus), nullable=False, default=OTASyncStatus.PENDING
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    reservation_id: Mapped[int | None] = mapped_column(ForeignKey("reservations.id"), nullable=True)
    agent_id: Mapped[int | None] = mapped_column(ForeignKey("agents.id"), nullable=True)
    action: Mapped[str] = mapped_column(String(80), nullable=False)
    detail: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)

    reservation: Mapped[Reservation | None] = relationship("Reservation", back_populates="audit_events")
    agent: Mapped[Agent | None] = relationship("Agent")


class Partner(Base):
    __tablename__ = "partners"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    slug: Mapped[str] = mapped_column(String(80), nullable=False, unique=True)
    category: Mapped[str | None] = mapped_column(String(80), nullable=True)
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)

    slas: Mapped[list["PartnerSLA"]] = relationship(
        "PartnerSLA",
        back_populates="partner",
        cascade="all, delete-orphan",
    )
    webhook_events: Mapped[list["PartnerWebhookEvent"]] = relationship(
        "PartnerWebhookEvent",
        back_populates="partner",
        cascade="all, delete-orphan",
    )


class SLAStatus(str, Enum):
    ON_TRACK = "on_track"
    AT_RISK = "at_risk"
    BREACHED = "breached"


class PartnerSLA(Base):
    __tablename__ = "partner_slas"
    __table_args__ = (
        UniqueConstraint("partner_id", "metric", name="uq_partner_metric"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    partner_id: Mapped[int] = mapped_column(ForeignKey("partners.id"), nullable=False)
    metric: Mapped[str] = mapped_column(String(120), nullable=False)
    metric_label: Mapped[str] = mapped_column(String(160), nullable=False)
    target_minutes: Mapped[int] = mapped_column(Integer, nullable=False)
    warning_minutes: Mapped[int | None] = mapped_column(Integer, nullable=True)
    breach_minutes: Mapped[int] = mapped_column(Integer, nullable=False)
    current_minutes: Mapped[int | None] = mapped_column(Integer, nullable=True)
    status: Mapped[SLAStatus] = mapped_column(
        SAEnum(SLAStatus), nullable=False, default=SLAStatus.ON_TRACK
    )
    last_violation_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    partner: Mapped[Partner] = relationship("Partner", back_populates="slas")


class PartnerWebhookEvent(Base):
    __tablename__ = "partner_webhook_events"
    __table_args__ = (
        UniqueConstraint("partner_id", "external_id", name="uq_partner_webhook"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    partner_id: Mapped[int] = mapped_column(ForeignKey("partners.id"), nullable=False)
    sla_id: Mapped[int] = mapped_column(ForeignKey("partner_slas.id"), nullable=False)
    external_id: Mapped[str] = mapped_column(String(120), nullable=False)
    metric: Mapped[str] = mapped_column(String(120), nullable=False)
    status: Mapped[str] = mapped_column(String(60), nullable=False)
    payload: Mapped[str] = mapped_column(Text, nullable=False)
    elapsed_minutes: Mapped[int | None] = mapped_column(Integer, nullable=True)
    resolved_sla_status: Mapped[SLAStatus | None] = mapped_column(SAEnum(SLAStatus), nullable=True)
    received_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    processed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    partner: Mapped[Partner] = relationship("Partner", back_populates="webhook_events")
    sla: Mapped[PartnerSLA] = relationship("PartnerSLA")
