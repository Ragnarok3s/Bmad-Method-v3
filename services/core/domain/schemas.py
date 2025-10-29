"""Esquemas de entrada e saída para a API core."""
from __future__ import annotations

from datetime import date, datetime
from enum import Enum
from typing import Any, Literal

from uuid import uuid4

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from .models import (
    AgentRole,
    ExperienceSurveyTouchpoint,
    HousekeepingStatus,
    InvoiceStatus,
    PaymentIntentStatus,
    PaymentMethodStatus,
    PaymentProvider,
    ReservationStatus,
    ReconciliationSource,
    ReconciliationStatus,
    SLAStatus,
    RecommendationDecision,
)


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


class PaymentMethodCreate(BaseModel):
    provider: PaymentProvider
    customer_reference: str
    payment_method_nonce: str
    guest_email: EmailStr | None = None
    metadata: dict[str, Any] | None = None


class PaymentAuthorizationRequest(BaseModel):
    method: PaymentMethodCreate
    amount_minor: int = Field(gt=0)
    currency: str = Field(min_length=3, max_length=3)
    capture_on_check_in: bool = False
    metadata: dict[str, Any] | None = None


class PaymentIntentRead(BaseModel):
    id: int
    status: PaymentIntentStatus
    amount_minor: int
    currency_code: str
    provider: PaymentProvider
    provider_reference: str | None = None
    capture_on_check_in: bool
    payment_method_status: PaymentMethodStatus | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class InvoiceRead(BaseModel):
    id: int
    status: InvoiceStatus
    amount_minor: int
    currency_code: str
    issued_at: datetime
    due_at: datetime | None = None

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class LoginResponse(BaseModel):
    session_id: str
    agent_id: int
    mfa_required: bool
    expires_at: datetime
    session_timeout_seconds: int | None = None
    recovery_codes_remaining: int = 0


class MFAVerificationRequest(BaseModel):
    session_id: str
    code: str = Field(min_length=1)
    method: Literal["totp", "sms", "email"] | None = Field(default="totp")


class RecoveryInitiateRequest(BaseModel):
    email: EmailStr


class RecoveryInitiateResponse(BaseModel):
    email: EmailStr
    issued_at: datetime
    recovery_codes: list[str] = Field(default_factory=list)


class RecoveryCompleteRequest(BaseModel):
    email: EmailStr
    code: str = Field(min_length=1)


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


class AgentProfileUpdate(BaseModel):
    name: str | None = None
    role: AgentRole | None = None
    active: bool | None = None


class ReservationCreate(BaseModel):
    property_id: int
    guest_name: str
    guest_email: EmailStr
    check_in: datetime
    check_out: datetime
    payment: PaymentAuthorizationRequest | None = None


class ReservationRead(BaseModel):
    id: int
    property_id: int
    guest_name: str
    guest_email: EmailStr
    status: ReservationStatus
    check_in: datetime
    check_out: datetime
    total_amount_minor: int | None
    currency_code: str | None
    capture_on_check_in: bool
    created_at: datetime
    payment_intents: list[PaymentIntentRead] | None = None
    invoices: list[InvoiceRead] | None = None

    class Config:
        from_attributes = True


class ReservationUpdateStatus(BaseModel):
    status: ReservationStatus


class PricingCompetitorRate(BaseModel):
    channel: str = Field(min_length=1)
    amount_minor: int = Field(gt=0)


class PricingSimulationRequest(BaseModel):
    property_id: int
    base_rate_minor: int = Field(gt=0)
    currency_code: str = Field(min_length=3, max_length=3)
    check_in: datetime
    check_out: datetime
    competitor_rates: list[PricingCompetitorRate] | None = None


class PricingComponentRead(BaseModel):
    name: Literal["occupancy", "seasonality", "competition"]
    weight: float
    factor: float
    contribution_minor: int
    context: dict[str, Any] = Field(default_factory=dict)


class PricingSimulationRead(BaseModel):
    property_id: int
    check_in: datetime
    check_out: datetime
    base_rate_minor: int
    recommended_rate_minor: int
    currency_code: str
    nights: int
    occupancy_rate: float
    historical_rate: float
    seasonal_index: float
    competitor_index: float
    confidence: float
    components: list[PricingComponentRead]
    expected_revenue_delta_minor: int
    generated_at: datetime
    actor_id: int | None = None


class ReservationPricingUpdate(BaseModel):
    reservation_id: int
    rate_minor: int = Field(gt=0)
    currency_code: str = Field(min_length=3, max_length=3)
    reason: str | None = None
    expected_accuracy: float | None = Field(default=None, ge=0.0, le=1.0)


class PricingBulkUpdateRequest(BaseModel):
    property_id: int
    updates: list[ReservationPricingUpdate]


class ReservationPricingUpdateResult(BaseModel):
    reservation_id: int
    previous_rate_minor: int | None
    new_rate_minor: int
    currency_code: str
    ota_job_id: int | None = None
    status: Literal["synced", "manual"]
    manual_fallback_reason: str | None = None
    audit_log_id: int


class PricingBulkUpdateResponse(BaseModel):
    property_id: int
    processed: int
    manual_actions: int
    results: list[ReservationPricingUpdateResult]


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


class PartnerSLAVersionRead(BaseModel):
    id: int
    sla_id: int
    version: int
    target_minutes: int
    warning_minutes: int | None
    breach_minutes: int
    effective_from: datetime
    effective_to: datetime | None
    created_at: datetime

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
    current_version: PartnerSLAVersionRead | None = None
    versions: list[PartnerSLAVersionRead] | None = None

    class Config:
        from_attributes = True


class ReconciliationQueueRead(BaseModel):
    id: int
    property_id: int
    reservation_id: int | None
    channel_id: int | None
    external_booking_id: str | None
    source: ReconciliationSource
    status: ReconciliationStatus
    attempts: int
    next_action_at: datetime | None
    last_attempt_at: datetime | None
    created_at: datetime
    updated_at: datetime
    sla_version_id: int | None
    payload: dict[str, Any]

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


class KnowledgeBaseSnippetRead(BaseModel):
    id: str
    label: str
    content: str
    surface: str
    recommended_playbook: str | None = None


class KnowledgeBaseArticleSummary(BaseModel):
    id: str
    slug: str
    title: str
    excerpt: str
    category_id: str
    category_name: str
    reading_time_minutes: int
    tags: list[str]
    updated_at: datetime
    stage: str
    snippet_preview: str | None = None


class KnowledgeBaseArticleRead(KnowledgeBaseArticleSummary):
    content: str
    action_snippets: list[KnowledgeBaseSnippetRead]
    related_playbooks: list[str]
    persona: str | None = None
    use_case: str | None = None


class KnowledgeBaseCategoryRead(BaseModel):
    id: str
    name: str
    description: str
    total_articles: int
    top_tags: list[str] = Field(default_factory=list)


class KnowledgeBaseQueryInfo(BaseModel):
    term: str | None = None
    total_hits: int = Field(ge=0)


class KnowledgeBaseCatalogRead(BaseModel):
    categories: list[KnowledgeBaseCategoryRead]
    articles: list[KnowledgeBaseArticleSummary]
    query: KnowledgeBaseQueryInfo


class KnowledgeBaseTelemetryEvent(BaseModel):
    event: Literal['search', 'article_view', 'article_complete', 'snippet_copy']
    slug: str | None = None
    query: str | None = None
    hits: int | None = Field(default=None, ge=0)
    surface: str | None = None
    duration_seconds: float | None = Field(default=None, ge=0.0)


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


class KPIReportEntry(BaseModel):
    property_id: int
    property_name: str
    currency: str | None = None
    reservations: int
    occupied_nights: int
    available_nights: int
    occupancy_rate: float
    adr: float | None = None
    revenue: float


class KPIReportSummary(BaseModel):
    properties_covered: int
    total_reservations: int
    total_occupied_nights: int
    total_available_nights: int
    average_occupancy_rate: float
    revenue_breakdown: dict[str | None, float]


class KPIReportRead(BaseModel):
    period_start: date
    period_end: date
    generated_at: datetime
    items: list[KPIReportEntry]
    summary: KPIReportSummary


class TenantKPIReportRead(BaseModel):
    tenant_slug: str
    tenant_name: str
    generated_at: datetime
    items: list[KPIReportEntry]
    summary: KPIReportSummary


class MultiTenantKPIReportRead(BaseModel):
    generated_at: datetime
    tenants: list[TenantKPIReportRead]
    total_summary: KPIReportSummary


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


class NPSSnapshot(BaseModel):
    score: float
    promoters: int
    detractors: int
    passives: int
    total_responses: int
    trend_7d: float | None = None
    last_response_at: datetime | None = None
    touchpoint_distribution: dict[ExperienceSurveyTouchpoint, float] = Field(
        default_factory=dict
    )


class SLAMetricSummary(BaseModel):
    total: int
    on_track: int
    at_risk: int
    breached: int
    worst_offenders: list[str] = Field(default_factory=list)


class OperationalKPIEntry(BaseModel):
    name: str
    value: float
    unit: str
    target: float | None = None
    status: str | None = None


class OperationalKPIs(BaseModel):
    critical_alerts: CriticalAlertSummary
    playbook_adoption: PlaybookAdoptionSummary
    housekeeping_completion_rate: OperationalKPIEntry
    ota_sync_backlog: OperationalKPIEntry


class DashboardMetricsRead(BaseModel):
    occupancy: OccupancySnapshot
    nps: NPSSnapshot
    sla: SLAMetricSummary
    operational: OperationalKPIs


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


class OwnerMetricsRead(BaseModel):
    occupancy_rate: float
    revenue_mtd: float
    average_daily_rate: float
    incident_count: int
    guest_satisfaction: float
    pending_invoices: int
    properties_active: int


class OwnerPayoutPreferencesRead(BaseModel):
    method: Literal["bank_transfer", "pix", "paypal"]
    beneficiary_name: str
    bank_account_last4: str | None
    currency: str
    payout_threshold: float
    schedule: Literal["weekly", "monthly"]
    updated_at: datetime
    manual_review_required: bool = False


class OwnerPayoutPreferencesUpdate(BaseModel):
    method: Literal["bank_transfer", "pix", "paypal"]
    beneficiary_name: str
    bank_account_last4: str | None = None
    currency: str
    payout_threshold: float
    schedule: Literal["weekly", "monthly"]


class OwnerOverviewRead(BaseModel):
    owner_id: int
    owner_name: str
    email: EmailStr
    phone: str
    metrics: OwnerMetricsRead
    payout_preferences: OwnerPayoutPreferencesRead
    pending_verifications: int
    unread_notifications: int
    last_payout_at: datetime | None
    compliance_status: Literal["clear", "pending", "restricted"]
    documents_submitted: int


class OwnerPropertySummaryRead(BaseModel):
    property_id: int
    property_name: str
    occupancy_rate: float
    revenue_mtd: float
    adr: float
    last_incident_at: datetime | None
    issues_open: int


class RecommendationPriority(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class RecommendationExplanation(BaseModel):
    signal: str
    description: str
    weight: float = Field(ge=0.0, le=1.0)


class RecommendationRead(BaseModel):
    key: str
    title: str
    summary: str
    priority: RecommendationPriority
    score: float = Field(ge=0.0, le=1.0)
    source: str
    created_at: datetime
    metadata: dict[str, Any] = Field(default_factory=dict)
    explainability: list[RecommendationExplanation] = Field(default_factory=list)
    actions: list[str] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class RecommendationFeedbackCreate(BaseModel):
    recommendation_key: str = Field(min_length=1)
    decision: RecommendationDecision
    agent_id: int | None = None
    score: float | None = Field(default=None, ge=0.0, le=1.0)
    notes: str | None = Field(default=None, max_length=2000)
    context: dict[str, Any] = Field(default_factory=dict)


class RecommendationFeedbackRead(RecommendationFeedbackCreate):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PrecisionRecallReport(BaseModel):
    evaluated_at: datetime
    window_start: datetime | None = None
    window_end: datetime | None = None
    precision: float = Field(ge=0.0, le=1.0)
    recall: float = Field(ge=0.0, le=1.0)
    true_positives: int
    false_positives: int
    false_negatives: int
    total_predictions: int
    total_relevant: int


class OwnerInvoiceRead(BaseModel):
    invoice_id: str
    property_name: str
    due_date: datetime
    amount_due: float
    currency: str
    status: Literal["pending", "paid", "overdue"]


class OwnerReportRead(BaseModel):
    report_id: str
    title: str
    period: str
    url: str
    generated_at: datetime
    format: Literal["pdf", "xlsx"]


class OwnerNotificationRead(BaseModel):
    id: str
    title: str
    message: str
    category: str
    created_at: datetime
    read: bool


class PushDeviceRegistration(BaseModel):
    token: str
    platform: Literal["ios", "android", "web"]
    device_name: str | None = None
    expo_push_token: str | None = None


class PushDeviceRead(BaseModel):
    token: str
    platform: str
    device_name: str | None = None
    last_seen_at: datetime
    enabled: bool


class OwnerIncidentReport(BaseModel):
    incident: str
    severity: Literal["low", "medium", "high"]
    reported_by: str


class OwnerDocumentUploadResponse(BaseModel):
    document_id: str
    status: Literal["pending", "queued"]
    manual_review_id: str
