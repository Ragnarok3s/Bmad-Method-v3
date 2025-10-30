"""Modelos relacionais que suportam os módulos do MVP."""
from __future__ import annotations

import json
from datetime import datetime, timezone

from enum import Enum
from typing import Any, Iterable

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum as SAEnum,
    Float,
    ForeignKey,
    Integer,
    JSON,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class Tenant(Base):
    __tablename__ = "tenants"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String(120), nullable=False, unique=True)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )
    _attributes: Mapped[dict[str, Any] | None] = mapped_column(
        "attributes", JSON, nullable=True, default=None
    )

    workspaces: Mapped[list["Workspace"]] = relationship(
        "Workspace", back_populates="tenant", cascade="all, delete-orphan"
    )
    properties: Mapped[list["Property"]] = relationship(
        "Property", back_populates="tenant", cascade="all, delete-orphan"
    )
    limits: Mapped[list["TenantLimit"]] = relationship(
        "TenantLimit", back_populates="tenant", cascade="all, delete-orphan"
    )
    migrations: Mapped[list["TenantMigrationState"]] = relationship(
        "TenantMigrationState", back_populates="tenant", cascade="all, delete-orphan"
    )

    @property
    def attributes(self) -> dict[str, Any]:
        return dict(self._attributes or {})

    @attributes.setter
    def attributes(self, values: dict[str, Any]) -> None:
        self._attributes = dict(values)


class TenantLimit(Base):
    __tablename__ = "tenant_limits"

    tenant_id: Mapped[int] = mapped_column(ForeignKey("tenants.id"), primary_key=True)
    key: Mapped[str] = mapped_column(String(80), primary_key=True)
    value: Mapped[int | None] = mapped_column(Integer, nullable=True)
    enforced: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    tenant: Mapped[Tenant] = relationship("Tenant", back_populates="limits")


class TenantMigrationState(Base):
    __tablename__ = "tenant_migrations"

    tenant_id: Mapped[int] = mapped_column(ForeignKey("tenants.id"), primary_key=True)
    name: Mapped[str] = mapped_column(String(160), primary_key=True)
    applied_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)

    tenant: Mapped[Tenant] = relationship("Tenant", back_populates="migrations")


class Workspace(Base):
    __tablename__ = "workspaces"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String(120), nullable=False, unique=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    timezone: Mapped[str] = mapped_column(String(64), nullable=False, default="UTC")
    team_size: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    primary_use_case: Mapped[str] = mapped_column(String(120), nullable=False)
    communication_channel: Mapped[str] = mapped_column(String(40), nullable=False)
    quarterly_goal: Mapped[str | None] = mapped_column(Text, nullable=True)
    _invite_emails: Mapped[str] = mapped_column("invite_emails", Text, nullable=False, default="[]")
    _team_roles: Mapped[str] = mapped_column("team_roles", Text, nullable=False, default="[]")
    enable_sandbox: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    require_mfa: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    security_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    tenant_id: Mapped[int | None] = mapped_column(ForeignKey("tenants.id"), nullable=True, index=True)

    tenant: Mapped[Tenant | None] = relationship("Tenant", back_populates="workspaces")

    @property
    def invite_emails(self) -> list[str]:
        try:
            data = json.loads(self._invite_emails or "[]")
        except json.JSONDecodeError:
            return []
        return [str(item) for item in data if isinstance(item, str)]

    @invite_emails.setter
    def invite_emails(self, value: list[str]) -> None:
        self._invite_emails = json.dumps(value)

    @property
    def team_roles(self) -> list[str]:
        try:
            data = json.loads(self._team_roles or "[]")
        except json.JSONDecodeError:
            return []
        return [str(item) for item in data if isinstance(item, str)]

    @team_roles.setter
    def team_roles(self, value: list[str]) -> None:
        self._team_roles = json.dumps(value)


class Property(Base):
    __tablename__ = "properties"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    timezone: Mapped[str] = mapped_column(String(64), nullable=False, default="UTC")
    address: Mapped[str | None] = mapped_column(Text, nullable=True)

    units: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    tenant_id: Mapped[int | None] = mapped_column(ForeignKey("tenants.id"), nullable=True, index=True)

    tenant: Mapped[Tenant | None] = relationship("Tenant", back_populates="properties")
    reservations: Mapped[list["Reservation"]] = relationship(
        "Reservation", back_populates="property", cascade="all, delete-orphan"
    )
    housekeeping_tasks: Mapped[list["HousekeepingTask"]] = relationship(
        "HousekeepingTask", back_populates="property", cascade="all, delete-orphan"
    )


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
    credentials: Mapped["AgentCredential | None"] = relationship(
        "AgentCredential", back_populates="agent", uselist=False, cascade="all, delete-orphan"
    )
    sessions: Mapped[list["AuthSession"]] = relationship(
        "AuthSession", back_populates="agent", cascade="all, delete-orphan"
    )
    recommendation_feedback: Mapped[list["RecommendationFeedback"]] = relationship(
        "RecommendationFeedback",
        back_populates="agent",
        cascade="all, delete-orphan",
    )


class AgentCredential(Base):
    __tablename__ = "agent_credentials"

    agent_id: Mapped[int] = mapped_column(ForeignKey("agents.id"), primary_key=True)
    password_hash: Mapped[str] = mapped_column(Text, nullable=False, default="")
    mfa_secret: Mapped[str | None] = mapped_column(String(80), nullable=True)
    mfa_enrolled: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    _recovery_codes: Mapped[str] = mapped_column("recovery_codes", Text, nullable=False, default="[]")
    failed_attempts: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    locked_until: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    agent: Mapped[Agent] = relationship("Agent", back_populates="credentials")

    @property
    def recovery_codes(self) -> list[str]:
        try:
            data = json.loads(self._recovery_codes or "[]")
        except json.JSONDecodeError:
            return []
        return [str(item) for item in data if isinstance(item, str)]

    @recovery_codes.setter
    def recovery_codes(self, values: Iterable[str]) -> None:
        self._recovery_codes = json.dumps([str(item) for item in values])


class AuthSession(Base):
    __tablename__ = "auth_sessions"

    id: Mapped[str] = mapped_column(String(120), primary_key=True)
    agent_id: Mapped[int] = mapped_column(ForeignKey("agents.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    last_active_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    mfa_verified_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    ip_address: Mapped[str | None] = mapped_column(String(45), nullable=True)
    user_agent: Mapped[str | None] = mapped_column(String(160), nullable=True)

    agent: Mapped[Agent] = relationship("Agent", back_populates="sessions")


class PermissionDefinition(Base):
    __tablename__ = "permission_definitions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    key: Mapped[str] = mapped_column(String(120), nullable=False, unique=True)
    label: Mapped[str] = mapped_column(String(160), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    category: Mapped[str | None] = mapped_column(String(80), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )


class RolePolicy(Base):
    __tablename__ = "role_policies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    role: Mapped[AgentRole] = mapped_column(SAEnum(AgentRole), nullable=False)
    name: Mapped[str] = mapped_column(String(160), nullable=False)
    persona: Mapped[str | None] = mapped_column(String(120), nullable=True)
    property_id: Mapped[int | None] = mapped_column(ForeignKey("properties.id"), nullable=True)
    is_default: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    _permissions: Mapped[str] = mapped_column("permissions", Text, nullable=False, default="[]")
    _inherits: Mapped[str] = mapped_column("inherits", Text, nullable=False, default="[]")
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    property_ref: Mapped[Property | None] = relationship("Property")

    __table_args__ = (
        UniqueConstraint("role", "name", "persona", "property_id", name="uq_role_policy_scope"),
    )

    @property
    def permissions(self) -> list[str]:
        try:
            data = json.loads(self._permissions or "[]")
        except json.JSONDecodeError:
            return []
        return [str(item) for item in data if isinstance(item, str)]

    @permissions.setter
    def permissions(self, value: list[str]) -> None:
        self._permissions = json.dumps(sorted({item.strip() for item in value if item.strip()}))

    @property
    def inherits(self) -> list[str]:
        try:
            data = json.loads(self._inherits or "[]")
        except json.JSONDecodeError:
            return []
        return [str(item) for item in data if isinstance(item, str)]

    @inherits.setter
    def inherits(self, value: list[str]) -> None:
        self._inherits = json.dumps(sorted({item.strip() for item in value if item.strip()}))

    @property
    def property(self) -> Property | None:  # type: ignore[override]
        return self.property_ref


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
    total_amount_minor: Mapped[int | None] = mapped_column(Integer, nullable=True)
    currency_code: Mapped[str | None] = mapped_column(String(3), nullable=True)
    capture_on_check_in: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)

    property: Mapped[Property] = relationship("Property", back_populates="reservations")
    audit_events: Mapped[list["AuditLog"]] = relationship("AuditLog", back_populates="reservation")
    payment_intents: Mapped[list["PaymentIntent"]] = relationship(
        "PaymentIntent",
        back_populates="reservation",
        cascade="all, delete-orphan",
    )
    invoices: Mapped[list["Invoice"]] = relationship(
        "Invoice",
        back_populates="reservation",
        cascade="all, delete-orphan",
    )


class PaymentProvider(str, Enum):
    STRIPE = "stripe"
    ADYEN = "adyen"


class PaymentMethodStatus(str, Enum):
    ACTIVE = "active"
    REVOKED = "revoked"


class PaymentIntentStatus(str, Enum):
    PREAUTHORIZED = "preauthorized"
    CAPTURED = "captured"
    CANCELLED = "cancelled"
    FAILED = "failed"


class PaymentTransactionType(str, Enum):
    AUTHORIZATION = "authorization"
    CAPTURE = "capture"
    REFUND = "refund"
    VOID = "void"


class PaymentTransactionStatus(str, Enum):
    SUCCEEDED = "succeeded"
    FAILED = "failed"
    PENDING = "pending"


class InvoiceStatus(str, Enum):
    ISSUED = "issued"
    SENT = "sent"
    PAID = "paid"
    VOID = "void"


class PaymentReconciliationStatus(str, Enum):
    SUCCESS = "success"
    WARN = "warn"
    FAILED = "failed"


class PaymentWebhookStatus(str, Enum):
    RECEIVED = "received"
    PROCESSED = "processed"
    FAILED = "failed"


class PaymentMethod(Base):
    __tablename__ = "payment_methods"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    reservation_id: Mapped[int | None] = mapped_column(ForeignKey("reservations.id"), nullable=True)
    provider: Mapped[PaymentProvider] = mapped_column(SAEnum(PaymentProvider), nullable=False)
    customer_reference: Mapped[str] = mapped_column(String(120), nullable=False)
    guest_email: Mapped[str] = mapped_column(String(120), nullable=False)
    token: Mapped[str] = mapped_column(String(255), nullable=False)
    fingerprint: Mapped[str] = mapped_column(String(120), nullable=False)
    status: Mapped[PaymentMethodStatus] = mapped_column(
        SAEnum(PaymentMethodStatus), nullable=False, default=PaymentMethodStatus.ACTIVE
    )
    details: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    reservation: Mapped[Reservation | None] = relationship("Reservation")


class PaymentIntent(Base):
    __tablename__ = "payment_intents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    reservation_id: Mapped[int] = mapped_column(ForeignKey("reservations.id"), nullable=False)
    payment_method_id: Mapped[int | None] = mapped_column(ForeignKey("payment_methods.id"), nullable=True)
    provider: Mapped[PaymentProvider] = mapped_column(SAEnum(PaymentProvider), nullable=False)
    amount_minor: Mapped[int] = mapped_column(Integer, nullable=False)
    currency_code: Mapped[str] = mapped_column(String(3), nullable=False)
    status: Mapped[PaymentIntentStatus] = mapped_column(
        SAEnum(PaymentIntentStatus), nullable=False, default=PaymentIntentStatus.PREAUTHORIZED
    )
    provider_reference: Mapped[str] = mapped_column(String(120), nullable=False)
    context: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    captured_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    reservation: Mapped[Reservation] = relationship(
        "Reservation", back_populates="payment_intents"
    )
    payment_method: Mapped[PaymentMethod | None] = relationship("PaymentMethod")
    transactions: Mapped[list["PaymentTransaction"]] = relationship(
        "PaymentTransaction",
        back_populates="intent",
        cascade="all, delete-orphan",
    )


class PaymentTransaction(Base):
    __tablename__ = "payment_transactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    intent_id: Mapped[int] = mapped_column(ForeignKey("payment_intents.id"), nullable=False)
    transaction_type: Mapped[PaymentTransactionType] = mapped_column(
        SAEnum(PaymentTransactionType), nullable=False
    )
    status: Mapped[PaymentTransactionStatus] = mapped_column(
        SAEnum(PaymentTransactionStatus), nullable=False, default=PaymentTransactionStatus.PENDING
    )
    amount_minor: Mapped[int] = mapped_column(Integer, nullable=False)
    raw_response: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    processed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    intent: Mapped[PaymentIntent] = relationship("PaymentIntent", back_populates="transactions")


class Invoice(Base):
    __tablename__ = "invoices"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    reservation_id: Mapped[int] = mapped_column(ForeignKey("reservations.id"), nullable=False)
    amount_minor: Mapped[int] = mapped_column(Integer, nullable=False)
    currency_code: Mapped[str] = mapped_column(String(3), nullable=False)
    status: Mapped[InvoiceStatus] = mapped_column(
        SAEnum(InvoiceStatus), nullable=False, default=InvoiceStatus.ISSUED
    )
    issued_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    due_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    payload: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    reservation: Mapped[Reservation] = relationship("Reservation", back_populates="invoices")


class PaymentReconciliationLog(Base):
    __tablename__ = "payment_reconciliation_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    ran_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    status: Mapped[PaymentReconciliationStatus] = mapped_column(
        SAEnum(PaymentReconciliationStatus), nullable=False
    )
    total_intents: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    discrepancies: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)


class PaymentWebhookEvent(Base):
    __tablename__ = "payment_webhook_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    provider: Mapped[PaymentProvider] = mapped_column(SAEnum(PaymentProvider), nullable=False)
    event_type: Mapped[str] = mapped_column(String(120), nullable=False)
    status: Mapped[PaymentWebhookStatus] = mapped_column(
        SAEnum(PaymentWebhookStatus), nullable=False, default=PaymentWebhookStatus.RECEIVED
    )
    reservation_id: Mapped[int | None] = mapped_column(ForeignKey("reservations.id"), nullable=True)
    intent_id: Mapped[int | None] = mapped_column(ForeignKey("payment_intents.id"), nullable=True)
    payload: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    processed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    reservation: Mapped[Reservation | None] = relationship("Reservation")
    intent: Mapped[PaymentIntent | None] = relationship("PaymentIntent")


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


class ReconciliationSource(str, Enum):
    OTA = "ota"
    DIRECT = "direct"
    MANUAL = "manual"


class ReconciliationStatus(str, Enum):
    PENDING = "pending"
    IN_REVIEW = "in_review"
    CONFLICT = "conflict"
    RESOLVED = "resolved"


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
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )


class InventoryReconciliationQueue(Base):
    __tablename__ = "inventory_reconciliation_queue"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    reservation_id: Mapped[int | None] = mapped_column(ForeignKey("reservations.id"), nullable=True)
    property_id: Mapped[int] = mapped_column(ForeignKey("properties.id"), nullable=False)
    channel_id: Mapped[int | None] = mapped_column(ForeignKey("ota_channels.id"), nullable=True)
    external_booking_id: Mapped[str | None] = mapped_column(String(120), nullable=True)
    source: Mapped[ReconciliationSource] = mapped_column(
        SAEnum(ReconciliationSource), nullable=False, default=ReconciliationSource.OTA
    )
    status: Mapped[ReconciliationStatus] = mapped_column(
        SAEnum(ReconciliationStatus), nullable=False, default=ReconciliationStatus.PENDING
    )
    payload: Mapped[str] = mapped_column(Text, nullable=False)
    attempts: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    next_action_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    last_attempt_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    sla_version_id: Mapped[int | None] = mapped_column(ForeignKey("partner_sla_versions.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )
    sla_version: Mapped["PartnerSLAVersion | None"] = relationship(
        "PartnerSLAVersion",
        back_populates="reconciliation_items",
        foreign_keys=lambda: [InventoryReconciliationQueue.sla_version_id],
    )


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
    current_version_id: Mapped[int | None] = mapped_column(
        ForeignKey("partner_sla_versions.id"), nullable=True
    )

    partner: Mapped[Partner] = relationship("Partner", back_populates="slas")
    versions: Mapped[list["PartnerSLAVersion"]] = relationship(
        "PartnerSLAVersion",
        back_populates="sla",
        order_by="PartnerSLAVersion.version",
        cascade="all, delete-orphan",
        foreign_keys=lambda: [PartnerSLAVersion.sla_id],
    )
    current_version: Mapped["PartnerSLAVersion | None"] = relationship(
        "PartnerSLAVersion",
        foreign_keys=[current_version_id],
        post_update=True,
        uselist=False,
    )


class PartnerSLAVersion(Base):
    __tablename__ = "partner_sla_versions"
    __table_args__ = (
        UniqueConstraint("sla_id", "version", name="uq_partner_sla_version"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    sla_id: Mapped[int] = mapped_column(ForeignKey("partner_slas.id"), nullable=False)
    version: Mapped[int] = mapped_column(Integer, nullable=False)
    target_minutes: Mapped[int] = mapped_column(Integer, nullable=False)
    warning_minutes: Mapped[int | None] = mapped_column(Integer, nullable=True)
    breach_minutes: Mapped[int] = mapped_column(Integer, nullable=False)
    effective_from: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    effective_to: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    sla: Mapped[PartnerSLA] = relationship(
        "PartnerSLA",
        back_populates="versions",
        foreign_keys=lambda: [PartnerSLAVersion.sla_id],
    )
    reconciliation_items: Mapped[list[InventoryReconciliationQueue]] = relationship(
        "InventoryReconciliationQueue",
        back_populates="sla_version",
        foreign_keys=lambda: [InventoryReconciliationQueue.sla_version_id],
    )


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


class ExperienceSurveyTouchpoint(str, Enum):
    ONBOARDING = "onboarding"
    OPERATIONS = "operations"
    SUPPORT = "support"


class ExperienceSurveyResponse(Base):
    """Captura respostas de pesquisas de satisfação (NPS)."""

    __tablename__ = "experience_survey_responses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    workspace_id: Mapped[int | None] = mapped_column(ForeignKey("workspaces.id"), nullable=True)
    touchpoint: Mapped[ExperienceSurveyTouchpoint] = mapped_column(
        SAEnum(ExperienceSurveyTouchpoint), nullable=False
    )
    score: Mapped[int] = mapped_column(Integer, nullable=False)
    submitted_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    context: Mapped[dict[str, object] | None] = mapped_column(JSON, nullable=True)

    workspace: Mapped[Workspace | None] = relationship("Workspace")


class AnalyticsSyncState(Base):
    """Checkpoint para ingestão incremental de fontes analíticas."""

    __tablename__ = "analytics_sync_state"

    source: Mapped[str] = mapped_column(String(80), primary_key=True)
    last_ingested_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=lambda: datetime.now(timezone.utc), onupdate=datetime.utcnow
    )


class RecommendationDecision(str, Enum):
    APPROVED = "approved"
    REJECTED = "rejected"
    DISMISSED = "dismissed"


class RecommendationFeedback(Base):
    """Armazena feedback supervisionado para recomendações geradas pelo motor."""

    __tablename__ = "recommendation_feedback"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    recommendation_key: Mapped[str] = mapped_column(String(160), nullable=False, index=True)
    decision: Mapped[RecommendationDecision] = mapped_column(
        SAEnum(RecommendationDecision), nullable=False
    )
    agent_id: Mapped[int | None] = mapped_column(ForeignKey("agents.id"), nullable=True)
    score: Mapped[float | None] = mapped_column(Float, nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    context: Mapped[dict[str, Any] | None] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)

    agent: Mapped[Agent | None] = relationship("Agent", back_populates="recommendation_feedback")


class BundleUsageGranularity(str, Enum):
    DAILY = "daily"
    WEEKLY = "weekly"


class BundleUsageMetric(Base):
    """Agregado de utilização de bundles por período."""

    __tablename__ = "bundle_usage_metrics"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    workspace_slug: Mapped[str | None] = mapped_column(String(120), nullable=True, index=True)
    bundle_id: Mapped[str] = mapped_column(String(160), nullable=False, index=True)
    bundle_type: Mapped[str] = mapped_column(String(80), nullable=False)
    period_start: Mapped[datetime] = mapped_column(DateTime, nullable=False, index=True)
    granularity: Mapped[BundleUsageGranularity] = mapped_column(
        SAEnum(BundleUsageGranularity), nullable=False
    )
    view_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    launch_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    last_event_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    __table_args__ = (
        UniqueConstraint(
            "workspace_slug",
            "bundle_id",
            "granularity",
            "period_start",
            name="uq_bundle_usage_metrics_period",
        ),
    )
