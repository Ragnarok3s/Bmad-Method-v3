"""Endpoints REST que cobrem os módulos do MVP."""
from __future__ import annotations

import json
import logging
from datetime import date, datetime, timedelta, timezone
from typing import Annotated, Any, Iterable, Literal, TypeVar, Union

from fastapi import APIRouter, Depends, FastAPI, HTTPException, Query, Request, Response, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from pydantic import BaseModel, ValidationError

from ..analytics import PIPELINE
from ..automation import (
    AutomationQueue,
    GuestJourneyAutomationBridge,
    GuestJourneySnapshot,
    get_guest_journey_summary,
)
from ..communications import (
    CommunicationChannel,
    CommunicationService,
    CommunicationTemplate,
    TemplateTranslation,
)
from ..analytics.reports import generate_kpi_report, kpi_report_to_csv
from ..analytics.query import (
    MetricSpec,
    QueryFilter,
    QueryResult,
    parse_filter_expression,
    parse_metric_expression,
    run_query,
)
from ..config import CoreSettings, PaymentGatewaySettings
from ..database import Database, get_database
from ..domain.agents import AgentAvailability, AgentCatalogPage, list_agent_catalog
from ..domain.models import Agent, BundleUsageGranularity, HousekeepingStatus
from ..domain.schemas import (
    AgentCreate,
    AgentProfileUpdate,
    AgentRead,
    DashboardMetricsRead,
    GovernanceAuditRead,
    KPIReportEntry,
    KPIReportRead,
    KPIReportSummary,
    MultiTenantKPIReportRead,
    TenantKPIReportRead,
    HousekeepingTaskCollection,
    HousekeepingTaskCreate,
    HousekeepingTaskRead,
    HousekeepingStatusUpdate,
    LoginRequest,
    LoginResponse,
    MFAVerificationRequest,
    PermissionCreate,
    PermissionRead,
    PermissionUpdate,
    PartnerSLARead,
    PartnerWebhookPayload,
    PlaybookExecutionRead,
    PlaybookExecutionRequest,
    PlaybookTemplateCreate,
    PlaybookTemplateRead,
    PropertyCreate,
    PropertyRead,
    RecoveryCompleteRequest,
    RecoveryInitiateRequest,
    RecoveryInitiateResponse,
    ReservationCreate,
    ReservationRead,
    ReservationUpdateStatus,
    PricingBulkUpdateRequest,
    PricingBulkUpdateResponse,
    PricingSimulationRead,
    PricingSimulationRequest,
    RolePolicyCreate,
    RolePolicyRead,
    RolePolicyUpdate,
    KnowledgeBaseArticleRead,
    KnowledgeBaseCatalogRead,
    KnowledgeBaseTelemetryEvent,
    BundleUsageCollection,
    OwnerDocumentUploadResponse,
    OwnerIncidentReport,
    OwnerInvoiceRead,
    OwnerNotificationRead,
    PushDeviceRead,
    PushDeviceRegistration,
    OwnerOverviewRead,
    OwnerPayoutPreferencesRead,
    OwnerPayoutPreferencesUpdate,
    OwnerPropertySummaryRead,
    OwnerReportRead,
    CommunicationDeliverySummaryRead,
    CommunicationInboundMessageRequest,
    CommunicationMessageRead,
    CommunicationMessageSendRequest,
    CommunicationTemplateRead,
    GuestExperienceOverviewRead,
    GuestJourneySnapshotRequest,
    GuestJourneySummaryRead,
    GuestJourneySyncResponse,
    WorkspaceCreate,
    WorkspaceRead,
)
from ..observability import get_observability_status, instrument_application
from ..payments import PaymentGatewayNotConfiguredError, PaymentService
from ..services import (
    AgentService,
    HousekeepingService,
    OperationalMetricsService,
    KnowledgeBaseService,
    PlaybookTemplateService,
    PropertyService,
    ReservationService,
    WorkspaceService,
    BundleUsageService,
)
from ..pricing import PricingService
from ..services.partners import PartnerSLAService
from ..metrics import record_dashboard_request
from ..owners import ManualVerificationQueue, OwnerService
from ..events import EventBus, NotificationCenter, WebhookDispatcher
from ..notifications import NotificationRelay, PushNotificationService
from ..security import AuthenticationError, AuthenticationService, SecurityService
from ..tenancy import (
    TenantIsolationError,
    TenantLimitError,
    TenantManager,
    TenantNotFoundError,
    create_tenant_manager,
)
from ..storage import SecureDocumentStorage, StorageError
from .partners import router as marketplace_router
from .webhooks import verify_webhook_signature

ModelT = TypeVar("ModelT", bound=BaseModel)

router = APIRouter()
router.include_router(marketplace_router)
logger = logging.getLogger(__name__)


class AnalyticsGroupResult(BaseModel):
    dimensions: dict[str, Any]
    count: int
    metrics: dict[str, float | None]


class AnalyticsQueryResponse(BaseModel):
    dataset: str
    total_records: int
    applied_filters: list[str]
    group_by: list[str]
    metrics: list[str]
    groups: list[AnalyticsGroupResult] | None
    records: list[dict[str, Any]]


knowledge_base_service = KnowledgeBaseService()

communication_service = CommunicationService()
automation_queue = AutomationQueue()
guest_journey_bridge = GuestJourneyAutomationBridge(automation_queue)


def _register_guest_communications() -> None:
    if communication_service.list_templates():
        return

    communication_service.register_template(
        CommunicationTemplate(
            id="guest_prearrival_checkin",
            name="Pré check-in digital",
            category="guest_experience",
            description="Convite automatizado para completar o check-in digital",
            channels={CommunicationChannel.EMAIL, CommunicationChannel.WHATSAPP},
            default_locale="pt-BR",
            tags={"check-in", "journey"},
            metadata={"journey_stage": "check_in.pre_arrival"},
            translations={
                "pt-BR": TemplateTranslation(
                    locale="pt-BR",
                    subject="Finalize seu check-in digital",
                    body=(
                        "Olá {guest_name}, faltam {days_to_check_in} dias para sua chegada em {property_name}. "
                        "Complete o pré check-in em {check_in_url} para agilizar sua experiência."
                    ),
                ),
                "en-US": TemplateTranslation(
                    locale="en-US",
                    subject="Complete your digital check-in",
                    body=(
                        "Hi {guest_name}, you're {days_to_check_in} days away from {property_name}. "
                        "Finish your digital check-in at {check_in_url} to unlock early arrival tips."
                    ),
                ),
            },
        )
    )

    communication_service.register_template(
        CommunicationTemplate(
            id="guest_upsell_local_experience",
            name="Upsell experiências locais",
            category="guest_experience",
            description="Sugestões de upgrades e experiências relevantes",
            channels={CommunicationChannel.EMAIL, CommunicationChannel.WHATSAPP},
            default_locale="pt-BR",
            tags={"upsell", "revenue"},
            metadata={"journey_stage": "in_stay.experience"},
            translations={
                "pt-BR": TemplateTranslation(
                    locale="pt-BR",
                    subject="Experiência exclusiva para sua estadia",
                    body=(
                        "{guest_name}, reservamos {experience_name} para {date_label}. "
                        "Confirme respondendo SIM ou fale conosco pelo chat. Valor: {price_formatted}."
                    ),
                ),
                "en-US": TemplateTranslation(
                    locale="en-US",
                    subject="Enhance your stay with {experience_name}",
                    body=(
                        "{guest_name}, we hand-picked {experience_name} for {date_label}. "
                        "Reply YES to secure your spot. Rate: {price_formatted}."
                    ),
                ),
            },
        )
    )

    communication_service.register_template(
        CommunicationTemplate(
            id="guest_post_stay_feedback",
            name="Feedback pós-estadia",
            category="guest_experience",
            description="Coleta NPS e preferências após o checkout",
            channels={CommunicationChannel.EMAIL, CommunicationChannel.WHATSAPP},
            default_locale="pt-BR",
            tags={"feedback", "satisfacao"},
            metadata={"journey_stage": "post_stay.feedback"},
            translations={
                "pt-BR": TemplateTranslation(
                    locale="pt-BR",
                    subject="Como foi sua estadia?",
                    body=(
                        "Obrigado por ficar conosco, {guest_name}! Em uma escala de 0 a 10, "
                        "qual a probabilidade de indicar o {property_name}? Responda com um número."
                    ),
                ),
                "en-US": TemplateTranslation(
                    locale="en-US",
                    subject="We'd love your feedback",
                    body=(
                        "Thank you for staying at {property_name}, {guest_name}! On a scale from 0 to 10, "
                        "how likely are you to recommend us? Reply with a number."
                    ),
                ),
            },
        )
    )


_register_guest_communications()

owner_event_bus = EventBus()
owner_notifications = NotificationCenter(owner_event_bus)
owner_webhooks = WebhookDispatcher(owner_event_bus)
owner_queue = ManualVerificationQueue()
owner_storage = SecureDocumentStorage()
owner_service = OwnerService(
    event_bus=owner_event_bus,
    storage=owner_storage,
    verification_queue=owner_queue,
    notifications=owner_notifications,
    webhooks=owner_webhooks,
)
push_notification_service = PushNotificationService()
notification_relay = NotificationRelay(push_notification_service)
owner_notifications.subscribe(notification_relay.handle)
owner_webhooks.register(
    "owner.payment.processed",
    "https://hooks.bmad.example/payments",
    secret="owner-payments",
)
owner_webhooks.register(
    "owner.incident.reported",
    "https://hooks.bmad.example/incidents",
    secret="owner-incidents",
)


def _auth_error_response(error: AuthenticationError) -> JSONResponse:
    return JSONResponse(status_code=error.status_code, content={"detail": error.detail})


def _build_authentication_service(request: Request, session: Session) -> AuthenticationService:
    timeout: timedelta | None = getattr(request.app.state, "auth_session_timeout", None)
    return AuthenticationService(session, session_timeout=timeout)


@router.get("/health/otel")
def get_otel_health() -> dict[str, Any]:
    """Health-check dos sinais exportados via OpenTelemetry."""

    snapshot = get_observability_status()
    status = "ok" if snapshot["ready"] else "degraded"
    if status == "ok" and not snapshot["active"]:
        status = "warming"

    observed_at = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    return {
        "status": status,
        "observed_at": observed_at,
        "ready": snapshot["ready"],
        "active": snapshot["active"],
        "collector": snapshot["collector"],
        "resource": snapshot["resource"],
        "signals": snapshot["signals"],
        "audit": snapshot.get("audit", {}),
        "alerts": snapshot.get("alerts", {}),
    }


def configure_cors(app: FastAPI, settings: CoreSettings) -> None:
    if settings.allowed_origins:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=settings.allowed_origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )


def get_session(
    request: Request,
    db: Database = Depends(get_database),
) -> Iterable[Session]:
    tenant_manager: TenantManager | None = getattr(request.app.state, "tenant_manager", None)
    with db.session_scope() as session:
        if tenant_manager:
            scope = (request.headers.get("x-tenant-scope") or "tenant").lower()
            if scope == "platform":
                token = request.headers.get("x-tenant-platform-token")
                if not tenant_manager.validate_platform_token(token):
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="Escopo de plataforma não autorizado",
                    )
                tenant_manager.bind_platform_session(session)
            else:
                slug = request.headers.get("x-tenant-slug")
                if not slug:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Cabeçalho X-Tenant-Slug obrigatório",
                    )
                try:
                    tenant = tenant_manager.require_tenant(session, slug)
                except TenantNotFoundError as exc:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Tenant não encontrado",
                    ) from exc
                except TenantIsolationError as exc:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail=str(exc),
                    ) from exc
                tenant_manager.bind_session(session, tenant)
        yield session


def _require_tenant_slug(session: Session) -> str:
    slug = session.info.get("tenant_slug")
    if not slug:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Escopo de tenant obrigatório",
        )
    return slug


def get_tenant_slug(session: Session = Depends(get_session)) -> str:
    return _require_tenant_slug(session)


TenantSlugDep = Annotated[str, Depends(get_tenant_slug)]


@router.get("/communications/templates", response_model=list[CommunicationTemplateRead])
def list_communication_templates(session: Session = Depends(get_session)) -> list[CommunicationTemplateRead]:
    return [
        CommunicationTemplateRead.model_validate(template.to_dict())
        for template in communication_service.list_templates()
    ]


@router.post("/communications/send", response_model=CommunicationMessageRead, status_code=status.HTTP_202_ACCEPTED)
async def send_guest_message(
    request: Request,
    tenant_slug: TenantSlugDep,
) -> CommunicationMessageRead:
    try:
        payload_data = await request.json()
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Corpo inválido") from exc
    try:
        payload = CommunicationMessageSendRequest.model_validate(payload_data)
    except ValidationError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=exc.errors()) from exc
    try:
        message = communication_service.send_message(
            payload.template_id,
            channel=CommunicationChannel(payload.channel),
            recipient=payload.recipient,
            locale=payload.locale,
            variables=payload.variables,
            context=payload.context,
            author=payload.author or "automation",
            tenant_slug=tenant_slug,
        )
    except KeyError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template não encontrado") from exc
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    return CommunicationMessageRead.model_validate({**message.to_dict(), "context": message.context})


@router.post("/communications/messages/inbound", response_model=CommunicationMessageRead, status_code=status.HTTP_201_CREATED)
async def register_inbound_message(
    request: Request,
    tenant_slug: TenantSlugDep,
) -> CommunicationMessageRead:
    try:
        payload_data = await request.json()
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Corpo inválido") from exc
    try:
        payload = CommunicationInboundMessageRequest.model_validate(payload_data)
    except ValidationError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=exc.errors()) from exc
    message = communication_service.record_inbound_message(
        channel=CommunicationChannel(payload.channel),
        sender=payload.sender,
        body=payload.body,
        locale=payload.locale,
        context=payload.context,
        in_reply_to=payload.in_reply_to,
        author=payload.author or "guest",
        tenant_slug=tenant_slug,
    )
    return CommunicationMessageRead.model_validate({**message.to_dict(), "context": message.context})


@router.get("/communications/messages", response_model=list[CommunicationMessageRead])
def list_communication_messages(
    tenant_slug: TenantSlugDep,
) -> list[CommunicationMessageRead]:
    return [
        CommunicationMessageRead.model_validate({**message.to_dict(), "context": message.context})
        for message in communication_service.messages(tenant_slug=tenant_slug)
    ]


@router.get("/communications/delivery/summary", response_model=CommunicationDeliverySummaryRead)
def get_delivery_summary(
    tenant_slug: TenantSlugDep,
) -> CommunicationDeliverySummaryRead:
    summary = communication_service.delivery_summary(tenant_slug=tenant_slug)
    return CommunicationDeliverySummaryRead.model_validate(summary)


@router.post("/guest-experience/journey", response_model=GuestJourneySyncResponse, status_code=status.HTTP_202_ACCEPTED)
def sync_guest_journey(payload: GuestJourneySnapshotRequest) -> GuestJourneySyncResponse:
    snapshot = GuestJourneySnapshot(
        reservation_id=payload.reservation_id,
        guest_email=payload.guest_email,
        guest_name=payload.guest_name,
        preferences=payload.preferences,
        journey_stage=payload.journey_stage,
        satisfaction_score=payload.satisfaction_score,
        check_in_completed=payload.check_in_completed,
        upsell_acceptance=payload.upsell_acceptance,
        response_minutes=payload.response_minutes,
        response_channel=payload.response_channel,
    )
    enqueued = guest_journey_bridge.sync(snapshot, [], triggered_by="guest_experience")
    return GuestJourneySyncResponse(enqueued=len(enqueued), pending=len(guest_journey_bridge.pending()))


@router.get("/guest-experience/journey", response_model=GuestJourneySummaryRead)
def get_guest_journey_snapshot() -> GuestJourneySummaryRead:
    summary = get_guest_journey_summary()
    return GuestJourneySummaryRead(**summary)


@router.get("/guest-experience/{reservation_id}", response_model=GuestExperienceOverviewRead)
def get_guest_experience_overview(
    reservation_id: int,
    session: Session = Depends(get_session),
) -> GuestExperienceOverviewRead:
    service = ReservationService(
        session,
        communication_service=communication_service,
    )
    return service.get_guest_experience_overview(reservation_id)


async def _parse_model(request: Request, model_type: type[ModelT]) -> ModelT:
    data = await request.json()
    return model_type.model_validate(data)


def _get_payment_settings(request: Request) -> PaymentGatewaySettings | None:
    return getattr(request.app.state, "payment_settings", None)


def _build_payment_service(request: Request, session: Session) -> PaymentService | None:
    payment_settings = _get_payment_settings(request)
    if not payment_settings:
        return None
    try:
        return PaymentService(session, payment_settings)
    except PaymentGatewayNotConfiguredError:
        logger.warning(
            "payment_gateway_not_configured",
            extra={"provider": payment_settings.provider},
        )
        return None
def _get_reservation_service(request: Request, session: Session) -> ReservationService:
    payment_settings = _get_payment_settings(request)
    payment_service = _build_payment_service(request, session)
    tenant_manager: TenantManager | None = getattr(request.app.state, "tenant_manager", None)
    return ReservationService(
        session,
        payment_service=payment_service,
        payment_settings=None if payment_service else payment_settings,
        tenant_manager=tenant_manager,
        communication_service=communication_service,
    )


def _require_actor(session: Session, request: Request) -> Agent:
    header = request.headers.get("x-actor-id")
    if not header:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Cabeçalho X-Actor-Id obrigatório",
        )
    try:
        actor_id = int(header)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cabeçalho X-Actor-Id inválido",
        ) from exc
    actor = session.get(Agent, actor_id)
    if not actor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agente responsável não encontrado",
        )
    return actor


def _require_owner_access(request: Request, owner_id: int) -> None:
    token = request.headers.get("x-owner-token")
    if not token or not owner_service.validate_token(owner_id, token):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso negado ao portal do proprietário",
        )


@router.post("/auth/login", response_model=LoginResponse)
async def login(
    request: Request, session: Session = Depends(get_session)
) -> LoginResponse | JSONResponse:
    payload = await _parse_model(request, LoginRequest)
    service = _build_authentication_service(request, session)
    try:
        result = service.initiate_login(
            payload.email,
            payload.password,
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
        )
    except AuthenticationError as error:
        session.flush()
        return _auth_error_response(error)
    session.flush()
    auth_session = result.session
    return LoginResponse(
        session_id=auth_session.id,
        agent_id=auth_session.agent_id,
        mfa_required=result.mfa_required,
        expires_at=auth_session.expires_at,
        session_timeout_seconds=service.session_timeout_seconds,
        recovery_codes_remaining=result.recovery_codes_remaining,
    )


@router.post("/auth/mfa/verify", response_model=LoginResponse)
async def verify_mfa(
    request: Request, session: Session = Depends(get_session)
) -> LoginResponse | JSONResponse:
    payload = await _parse_model(request, MFAVerificationRequest)
    service = _build_authentication_service(request, session)
    try:
        auth_session = service.verify_mfa(
            payload.session_id,
            payload.code,
            method=payload.method,
        )
    except AuthenticationError as error:
        session.flush()
        return _auth_error_response(error)
    credentials = auth_session.agent.credentials
    remaining = len(credentials.recovery_codes) if credentials else 0
    return LoginResponse(
        session_id=auth_session.id,
        agent_id=auth_session.agent_id,
        mfa_required=False,
        expires_at=auth_session.expires_at,
        session_timeout_seconds=service.session_timeout_seconds,
        recovery_codes_remaining=remaining,
    )


@router.post("/auth/recovery/initiate", response_model=RecoveryInitiateResponse)
async def initiate_recovery(
    request: Request, session: Session = Depends(get_session)
) -> RecoveryInitiateResponse | JSONResponse:
    payload = await _parse_model(request, RecoveryInitiateRequest)
    service = _build_authentication_service(request, session)
    try:
        codes = service.initiate_recovery(payload.email)
    except AuthenticationError as error:
        session.flush()
        return _auth_error_response(error)
    issued_at = datetime.now(timezone.utc)
    return RecoveryInitiateResponse(email=payload.email, issued_at=issued_at, recovery_codes=codes)


@router.post("/auth/recovery/complete", response_model=LoginResponse)
async def complete_recovery(
    request: Request, session: Session = Depends(get_session)
) -> LoginResponse | JSONResponse:
    payload = await _parse_model(request, RecoveryCompleteRequest)
    service = _build_authentication_service(request, session)
    try:
        auth_session = service.complete_recovery(
            payload.email,
            payload.code,
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
        )
    except AuthenticationError as error:
        session.flush()
        return _auth_error_response(error)
    credentials = auth_session.agent.credentials
    remaining = len(credentials.recovery_codes) if credentials else 0
    return LoginResponse(
        session_id=auth_session.id,
        agent_id=auth_session.agent_id,
        mfa_required=False,
        expires_at=auth_session.expires_at,
        session_timeout_seconds=service.session_timeout_seconds,
        recovery_codes_remaining=remaining,
    )


@router.get("/governance/permissions", response_model=list[PermissionRead])
def list_governance_permissions(
    request: Request,
    session: Session = Depends(get_session),
):
    actor = _require_actor(session, request)
    service = SecurityService(session)
    return service.list_permissions(actor=actor)


@router.post("/governance/permissions", response_model=PermissionRead, status_code=201)
async def create_governance_permission(
    request: Request,
    session: Session = Depends(get_session),
):
    actor = _require_actor(session, request)
    payload = await _parse_model(request, PermissionCreate)
    service = SecurityService(session)
    return service.create_permission(payload, actor=actor)


@router.patch("/governance/permissions/{permission_id}", response_model=PermissionRead)
async def update_governance_permission(
    permission_id: int,
    request: Request,
    session: Session = Depends(get_session),
):
    actor = _require_actor(session, request)
    payload = await _parse_model(request, PermissionUpdate)
    service = SecurityService(session)
    return service.update_permission(permission_id, payload, actor=actor)


@router.delete("/governance/permissions/{permission_id}", status_code=204)
def delete_governance_permission(
    permission_id: int,
    request: Request,
    session: Session = Depends(get_session),
):
    actor = _require_actor(session, request)
    service = SecurityService(session)
    service.delete_permission(permission_id, actor=actor)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/governance/roles", response_model=list[RolePolicyRead])
def list_governance_roles(
    request: Request,
    persona: str | None = None,
    property_id: int | None = None,
    session: Session = Depends(get_session),
):
    actor = _require_actor(session, request)
    service = SecurityService(session)
    return service.list_roles(actor=actor, persona=persona, property_id=property_id)


@router.post("/governance/roles", response_model=RolePolicyRead, status_code=201)
async def create_governance_role(
    request: Request,
    session: Session = Depends(get_session),
):
    actor = _require_actor(session, request)
    payload = await _parse_model(request, RolePolicyCreate)
    service = SecurityService(session)
    return service.create_role(payload, actor=actor)


@router.patch("/governance/roles/{policy_id}", response_model=RolePolicyRead)
async def update_governance_role(
    policy_id: int,
    request: Request,
    session: Session = Depends(get_session),
):
    actor = _require_actor(session, request)
    payload = await _parse_model(request, RolePolicyUpdate)
    service = SecurityService(session)
    return service.update_role(policy_id, payload, actor=actor)


@router.delete("/governance/roles/{policy_id}", status_code=204)
def delete_governance_role(
    policy_id: int,
    request: Request,
    session: Session = Depends(get_session),
):
    actor = _require_actor(session, request)
    service = SecurityService(session)
    service.delete_role(policy_id, actor=actor)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/governance/audit", response_model=list[GovernanceAuditRead])
def list_governance_audit(
    request: Request,
    limit: int = Query(50, ge=1, le=500),
    session: Session = Depends(get_session),
):
    actor = _require_actor(session, request)
    service = SecurityService(session)
    return service.list_audit_trail(actor=actor, limit=limit)


@router.get("/metrics/overview", response_model=DashboardMetricsRead)
def get_dashboard_metrics(
    target_date: date | None = Query(None),
    session: Session = Depends(get_session),
):
    service = OperationalMetricsService(session, communications=communication_service)
    try:
        overview = service.get_overview(target_date)
    except Exception:
        record_dashboard_request("overview", False)
        logger.exception("dashboard_metrics_failed")
        raise

    record_dashboard_request("overview", True)
    return overview


@router.get("/analytics/query", response_model=AnalyticsQueryResponse)
def query_analytics_dataset(
    dataset: str = Query(..., description="Nome do *dataset* sincronizado"),
    filter_expressions: list[str] | None = Query(None, alias="filter"),
    group_by: list[str] | None = Query(None, description="Dimensões para agregação"),
    metric_expressions: list[str] | None = Query(None, alias="metric"),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0),
):
    sources = getattr(PIPELINE, "_sources", {})
    if dataset not in sources:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="dataset desconhecido")

    try:
        filters: list[QueryFilter] = [
            parse_filter_expression(expression)
            for expression in (filter_expressions or [])
        ]
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error

    try:
        metrics: list[MetricSpec] = [
            parse_metric_expression(expression)
            for expression in (metric_expressions or [])
        ]
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error

    dataset_records = PIPELINE.dataset(dataset)
    try:
        result: QueryResult = run_query(
            dataset_records,
            filters=filters,
            group_by=group_by or [],
            metrics=metrics,
            limit=limit,
            offset=offset,
        )
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error

    return AnalyticsQueryResponse(
        dataset=dataset,
        total_records=result.total_records,
        applied_filters=filter_expressions or [],
        group_by=group_by or [],
        metrics=metric_expressions or [],
        groups=[
            AnalyticsGroupResult(**group)  # type: ignore[arg-type]
            for group in (result.groups or [])
        ]
        if result.groups
        else None,
        records=result.records,
    )


@router.get("/reports/kpis", response_model=KPIReportRead)
def get_kpi_reports(
    session: Session = Depends(get_session),
    start_date: date | None = Query(None),
    end_date: date | None = Query(None),
    property_id: list[int] = Query(default_factory=list),
    format: Literal["json", "csv"] = Query("json"),
):
    resolved_end = end_date or date.today()
    resolved_start = start_date or (resolved_end - timedelta(days=29))

    try:
        report = generate_kpi_report(
            session,
            resolved_start,
            resolved_end,
            property_ids=property_id or None,
        )
    except ValueError as error:
        record_dashboard_request("reports.kpi", False)
        raise HTTPException(status_code=400, detail=str(error)) from error

    if format.lower() == "csv":
        csv_payload = kpi_report_to_csv(report)
        record_dashboard_request("reports.kpi", True)
        filename = (
            f"kpi-report-{report.period_start.isoformat()}-{report.period_end.isoformat()}.csv"
        )
        return Response(
            content=csv_payload,
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )

    payload = KPIReportRead(
        period_start=report.period_start,
        period_end=report.period_end,
        generated_at=report.generated_at,
        items=[
            KPIReportEntry(
                property_id=row.property_id,
                property_name=row.property_name,
                currency=row.currency,
                reservations=row.reservations,
                occupied_nights=row.occupied_nights,
                available_nights=row.available_nights,
                occupancy_rate=row.occupancy_rate,
                adr=row.adr,
                revenue=row.revenue,
            )
            for row in report.items
        ],
        summary=KPIReportSummary(
            properties_covered=report.properties_covered,
            total_reservations=report.total_reservations,
            total_occupied_nights=report.total_occupied_nights,
            total_available_nights=report.total_available_nights,
            average_occupancy_rate=report.average_occupancy_rate,
            revenue_breakdown=report.revenue_breakdown(),
        ),
    )

    record_dashboard_request("reports.kpi", True)
    return payload


@router.get("/tenants/reports/kpis", response_model=MultiTenantKPIReportRead)
def get_multi_tenant_kpi_reports(
    request: Request,
    session: Session = Depends(get_session),
    start_date: date | None = Query(None),
    end_date: date | None = Query(None),
    tenant_slug: list[str] = Query(default_factory=list),
):
    if session.info.get("tenant_scope") != "platform":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Escopo de plataforma obrigatório para relatório consolidado",
        )

    tenant_manager: TenantManager | None = getattr(request.app.state, "tenant_manager", None)
    database: Database | None = getattr(request.app.state, "database", None)
    if not tenant_manager or not database:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Gerenciador de tenants indisponível",
        )

    resolved_end = end_date or date.today()
    resolved_start = start_date or (resolved_end - timedelta(days=29))

    tenants = tenant_manager.list_active_tenants(session, slugs=tenant_slug or None)
    generated_at = datetime.now(timezone.utc)

    if not tenants:
        empty_summary = KPIReportSummary(
            properties_covered=0,
            total_reservations=0,
            total_occupied_nights=0,
            total_available_nights=0,
            average_occupancy_rate=0.0,
            revenue_breakdown={},
        )
        return MultiTenantKPIReportRead(
            generated_at=generated_at,
            tenants=[],
            total_summary=empty_summary,
        )

    tenant_payloads: list[TenantKPIReportRead] = []
    total_properties = 0
    total_reservations = 0
    total_occupied = 0
    total_available = 0
    aggregated_revenue: dict[str | None, float] = {}

    for tenant in tenants:
        with database.session_scope() as scoped_session:
            scoped_tenant = tenant_manager.require_tenant(scoped_session, tenant.slug)
            tenant_manager.bind_session(scoped_session, scoped_tenant)
            report = generate_kpi_report(
                scoped_session,
                resolved_start,
                resolved_end,
            )

        summary = KPIReportSummary(
            properties_covered=report.properties_covered,
            total_reservations=report.total_reservations,
            total_occupied_nights=report.total_occupied_nights,
            total_available_nights=report.total_available_nights,
            average_occupancy_rate=report.average_occupancy_rate,
            revenue_breakdown=report.revenue_breakdown(),
        )
        tenant_payloads.append(
            TenantKPIReportRead(
                tenant_slug=tenant.slug,
                tenant_name=tenant.name,
                generated_at=report.generated_at,
                items=[
                    KPIReportEntry(
                        property_id=row.property_id,
                        property_name=row.property_name,
                        currency=row.currency,
                        reservations=row.reservations,
                        occupied_nights=row.occupied_nights,
                        available_nights=row.available_nights,
                        occupancy_rate=row.occupancy_rate,
                        adr=row.adr,
                        revenue=row.revenue,
                    )
                    for row in report.items
                ],
                summary=summary,
            )
        )

        total_properties += summary.properties_covered
        total_reservations += summary.total_reservations
        total_occupied += summary.total_occupied_nights
        total_available += summary.total_available_nights
        for currency, value in summary.revenue_breakdown.items():
            aggregated_revenue[currency] = aggregated_revenue.get(currency, 0.0) + float(value)

    average_rate = (
        total_occupied / total_available if total_available else 0.0
    )
    total_summary = KPIReportSummary(
        properties_covered=total_properties,
        total_reservations=total_reservations,
        total_occupied_nights=total_occupied,
        total_available_nights=total_available,
        average_occupancy_rate=average_rate,
        revenue_breakdown=aggregated_revenue,
    )

    return MultiTenantKPIReportRead(
        generated_at=generated_at,
        tenants=tenant_payloads,
        total_summary=total_summary,
    )


@router.post("/properties", response_model=PropertyRead, status_code=201)
async def create_property(
    request: Request,
    session: Session = Depends(get_session),
):
    payload = await _parse_model(request, PropertyCreate)
    tenant_manager: TenantManager | None = getattr(request.app.state, "tenant_manager", None)
    service = PropertyService(session, tenant_manager=tenant_manager)
    try:
        return service.create(payload)
    except TenantLimitError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error


@router.get("/playbooks", response_model=list[PlaybookTemplateRead])
def list_playbooks(session: Session = Depends(get_session)):
    service = PlaybookTemplateService(session)
    return service.list()


@router.post("/playbooks", response_model=PlaybookTemplateRead, status_code=201)
async def create_playbook(
    request: Request,
    session: Session = Depends(get_session),
):
    payload = await _parse_model(request, PlaybookTemplateCreate)
    service = PlaybookTemplateService(session)
    return service.create(payload)


@router.post(
    "/playbooks/{playbook_id}/execute",
    response_model=PlaybookExecutionRead,
    status_code=202,
)
async def execute_playbook(
    playbook_id: int,
    request: Request,
    session: Session = Depends(get_session),
):
    payload = await _parse_model(request, PlaybookExecutionRequest)
    service = PlaybookTemplateService(session)
    return service.execute(playbook_id, payload)


@router.post("/workspaces", response_model=WorkspaceRead, status_code=201)
async def create_workspace(
    request: Request,
    session: Session = Depends(get_session),
):
    payload = await _parse_model(request, WorkspaceCreate)
    tenant_manager: TenantManager | None = getattr(request.app.state, "tenant_manager", None)
    service = WorkspaceService(session, tenant_manager=tenant_manager)
    try:
        return service.create(payload)
    except TenantLimitError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        ) from error


@router.get("/properties", response_model=list[PropertyRead])
def list_properties(session: Session = Depends(get_session)):
    return PropertyService(session).list()


@router.get("/agents", response_model=Union[AgentCatalogPage, list[AgentRead]])
def list_agents_catalog(
    competency: list[str] = Query(default_factory=list),
    availability: list[AgentAvailability] = Query(default_factory=list),
    page: int = Query(1, ge=1),
    page_size: int = Query(6, ge=1, le=50),
    registry: bool = Query(False),
    session: Session = Depends(get_session),
):
    if registry:
        return AgentService(session).list()
    return list_agent_catalog(
        competencies=competency,
        availability=availability,
        page=page,
        page_size=page_size,
    )


@router.get("/bundles/usage", response_model=BundleUsageCollection)
def get_bundle_usage(
    bundle_id: str | None = Query(default=None),
    workspace: str | None = Query(default=None),
    granularity: BundleUsageGranularity | None = Query(default=None),
    limit: int = Query(default=90, ge=1, le=365),
    start: datetime | None = Query(default=None),
    end: datetime | None = Query(default=None),
    window_days: int | None = Query(default=None, ge=1, le=365),
    session: Session = Depends(get_session),
):
    service = BundleUsageService(session)
    return service.list_usage(
        bundle_id=bundle_id,
        workspace_slug=workspace,
        granularity=granularity,
        limit=limit,
        window_start=start,
        window_end=end,
        window_days=window_days,
    )


@router.post("/agents", response_model=AgentRead, status_code=201)
async def create_agent(
    request: Request,
    session: Session = Depends(get_session),
):
    payload = await _parse_model(request, AgentCreate)
    service = AgentService(session)
    return service.create(payload)


@router.patch("/agents/{agent_id}", response_model=AgentRead)
async def update_agent(
    agent_id: int,
    request: Request,
    session: Session = Depends(get_session),
) -> Agent:
    actor = _require_actor(session, request)
    payload = await _parse_model(request, AgentProfileUpdate)
    service = AgentService(session)
    return service.update_profile(agent_id, payload, actor=actor)


@router.post("/properties/{property_id}/reservations", response_model=ReservationRead, status_code=201)
async def create_reservation(
    property_id: int,
    request: Request,
    session: Session = Depends(get_session),
):
    payload = await _parse_model(request, ReservationCreate)
    if property_id != payload.property_id:
        raise HTTPException(status_code=400, detail="property_id inconsistente")
    service = _get_reservation_service(request, session)
    return service.create(payload)


@router.get("/properties/{property_id}/reservations", response_model=list[ReservationRead])
def list_reservations(
    property_id: int,
    request: Request,
    session: Session = Depends(get_session),
):
    service = _get_reservation_service(request, session)
    return service.list_for_property(property_id)


@router.patch("/reservations/{reservation_id}", response_model=ReservationRead)
async def update_reservation_status(
    reservation_id: int,
    request: Request,
    session: Session = Depends(get_session),
):
    payload = await _parse_model(request, ReservationUpdateStatus)
    service = _get_reservation_service(request, session)
    return service.update_status(reservation_id, payload)


@router.post("/pricing/simulate", response_model=PricingSimulationRead)
async def simulate_pricing(
    request: Request,
    session: Session = Depends(get_session),
) -> PricingSimulationRead:
    actor = _require_actor(session, request)
    payload = await _parse_model(request, PricingSimulationRequest)
    service = PricingService(session)
    result = service.simulate(payload, actor_id=actor.id)
    session.flush()
    return result


@router.patch("/reservations/pricing", response_model=PricingBulkUpdateResponse)
async def apply_pricing_updates(
    request: Request,
    session: Session = Depends(get_session),
) -> PricingBulkUpdateResponse:
    actor = _require_actor(session, request)
    payload = await _parse_model(request, PricingBulkUpdateRequest)
    service = PricingService(session)
    result = service.apply_bulk_update(payload, actor_id=actor.id)
    session.flush()
    return result


@router.post("/housekeeping/tasks", response_model=HousekeepingTaskRead, status_code=201)
async def schedule_housekeeping_task(
    request: Request,
    session: Session = Depends(get_session),
):
    payload = await _parse_model(request, HousekeepingTaskCreate)
    agent_service = AgentService(session)
    if payload.assigned_agent_id:
        actor = agent_service.get(payload.assigned_agent_id)
    else:
        raise HTTPException(status_code=400, detail="Agente responsável obrigatório para agendamento")

    service = HousekeepingService(session)
    return service.schedule(payload, actor)


@router.patch("/housekeeping/tasks/{task_id}", response_model=HousekeepingTaskRead)
async def update_housekeeping_task(
    task_id: int,
    request: Request,
    session: Session = Depends(get_session),
    actor_id: int | None = None,
):
    payload = await _parse_model(request, HousekeepingStatusUpdate)
    agent_service = AgentService(session)
    if actor_id is None:
        raise HTTPException(status_code=400, detail="actor_id é obrigatório")
    actor = agent_service.get(actor_id)

    service = HousekeepingService(session)
    return service.update_status(task_id, payload.status, actor)


@router.get(
    "/properties/{property_id}/housekeeping",
    response_model=HousekeepingTaskCollection,
)
def list_housekeeping(
    property_id: int,
    session: Session = Depends(get_session),
    start_date: datetime | None = None,
    end_date: datetime | None = None,
    status: HousekeepingStatus | None = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
):
    service = HousekeepingService(session)
    return service.list_for_property(
        property_id,
        start_date=start_date,
        end_date=end_date,
        status_filter=status,
        page=page,
        page_size=page_size,
    )


@router.get(
    "/support/knowledge-base/catalog",
    response_model=KnowledgeBaseCatalogRead,
    summary="Listagem de artigos e categorias da base de conhecimento",
)
def get_support_knowledge_base_catalog(
    q: str | None = Query(default=None, description="Termo de pesquisa"),
    category: str | None = Query(default=None, description="Filtrar por categoria"),
    limit: int = Query(default=12, ge=1, le=50, description="Número máximo de artigos"),
):
    return knowledge_base_service.catalog(query=q, category=category, limit=limit)


@router.get(
    "/support/knowledge-base/articles/{slug}",
    response_model=KnowledgeBaseArticleRead,
    summary="Detalhe completo de um artigo da base de conhecimento",
)
def get_support_knowledge_base_article(slug: str):
    try:
        return knowledge_base_service.get_article(slug)
    except LookupError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Artigo não encontrado") from exc


@router.post(
    "/support/knowledge-base/telemetry",
    status_code=202,
    summary="Regista eventos de uso da base de conhecimento",
)
async def register_support_knowledge_base_telemetry(request: Request):
    payload = await _parse_model(request, KnowledgeBaseTelemetryEvent)
    try:
        knowledge_base_service.register_event(payload)
    except LookupError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Artigo não encontrado") from exc
    return Response(status_code=status.HTTP_202_ACCEPTED)


@router.get("/partners/slas", response_model=list[PartnerSLARead])
def list_partner_slas(session: Session = Depends(get_session)):
    service = PartnerSLAService(session)
    return service.list_slas()


@router.post(
    "/partners/webhooks/reconcile",
    response_model=PartnerSLARead,
    status_code=202,
)
async def reconcile_partner_webhook(
    request: Request,
    session: Session = Depends(get_session),
):
    payload = await _parse_model(request, PartnerWebhookPayload)
    service = PartnerSLAService(session)
    return service.reconcile_webhook(payload)


@router.post("/payments/reconciliation", status_code=202)
def trigger_payment_reconciliation(
    request: Request, session: Session = Depends(get_session)
) -> dict[str, Any]:
    payment_service = _build_payment_service(request, session)
    if not payment_service:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Integração de pagamentos não configurada",
        )
    log_entry = payment_service.run_daily_reconciliation()
    return {
        "status": log_entry.status.value,
        "total_intents": log_entry.total_intents,
        "discrepancies": log_entry.discrepancies,
        "notes": log_entry.notes,
        "ran_at": log_entry.ran_at,
    }


@router.post("/payments/webhooks/{provider}", status_code=202)
async def receive_payment_webhook(
    provider: str,
    request: Request,
    session: Session = Depends(get_session),
) -> dict[str, str]:
    body = await request.body()
    try:
        raw_payload = body.decode("utf-8")
    except UnicodeDecodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payload de webhook inválido",
        ) from exc
    try:
        payload = json.loads(raw_payload or "{}")
    except json.JSONDecodeError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payload de webhook inválido",
        ) from exc
    payment_settings = _get_payment_settings(request)
    payment_service = _build_payment_service(request, session)
    if not payment_service or not payment_settings:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Integração de pagamentos não configurada",
        )
    if not payment_settings.webhook_secret:
        logger.error(
            "payment_webhook_secret_missing",
            extra={"provider": provider},
        )
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Integração de pagamentos não configurada",
        )
    signature_header = (
        request.headers.get("x-payment-signature")
        or request.headers.get("x-signature")
        or request.headers.get("stripe-signature")
        or request.headers.get("adyen-signature")
    )
    if not verify_webhook_signature(
        provider,
        payment_settings.webhook_secret,
        body,
        raw_payload,
        payload,
        signature_header,
    ):
        logger.warning(
            "payment_webhook_invalid_signature",
            extra={"provider": provider, "signature_present": bool(signature_header)},
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Assinatura de webhook inválida",
        )
    event = payment_service.handle_webhook_event(provider, payload)
    return {"status": event.status.value, "event_type": event.event_type}


def create_app(
    settings: CoreSettings | None = None,
    database: Database | None = None,
    tenant_manager: TenantManager | None = None,
) -> FastAPI:
    settings = settings or CoreSettings()
    database = database or get_database(settings)
    tenant_manager = tenant_manager or create_tenant_manager(settings, database)
    app = FastAPI(title="Core Hospitality Service", version="0.1.0")
    configure_cors(app, settings)

    with database.session_scope() as session:
        SecurityService(session).ensure_bootstrap()

    def _get_db_override() -> Database:
        return database

    app.dependency_overrides[get_database] = _get_db_override
    app.state.auth_session_timeout = timedelta(seconds=settings.auth_session_timeout_seconds)
    app.state.core_settings = settings
    app.state.payment_settings = settings.payments
    app.state.tenant_manager = tenant_manager
    app.state.database = database
    app.include_router(router)
    instrument_application(app)
    return app


@router.get("/owners/{owner_id}/overview", response_model=OwnerOverviewRead)
def get_owner_overview(owner_id: int, request: Request) -> OwnerOverviewRead:
    _require_owner_access(request, owner_id)
    try:
        return owner_service.get_overview(owner_id)
    except KeyError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proprietário não encontrado") from exc


@router.get("/owners/{owner_id}/properties", response_model=list[OwnerPropertySummaryRead])
def list_owner_properties(owner_id: int, request: Request) -> list[OwnerPropertySummaryRead]:
    _require_owner_access(request, owner_id)
    try:
        return owner_service.list_properties(owner_id)
    except KeyError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proprietário não encontrado") from exc


@router.get("/owners/{owner_id}/invoices", response_model=list[OwnerInvoiceRead])
def list_owner_invoices(owner_id: int, request: Request) -> list[OwnerInvoiceRead]:
    _require_owner_access(request, owner_id)
    try:
        return owner_service.list_invoices(owner_id)
    except KeyError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proprietário não encontrado") from exc


@router.get("/owners/{owner_id}/reports", response_model=list[OwnerReportRead])
def list_owner_reports(owner_id: int, request: Request) -> list[OwnerReportRead]:
    _require_owner_access(request, owner_id)
    try:
        return owner_service.list_reports(owner_id)
    except KeyError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proprietário não encontrado") from exc


@router.get("/owners/{owner_id}/notifications", response_model=list[OwnerNotificationRead])
def list_owner_notifications(owner_id: int, request: Request) -> list[OwnerNotificationRead]:
    _require_owner_access(request, owner_id)
    try:
        return owner_service.list_notifications(owner_id)
    except KeyError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proprietário não encontrado") from exc


@router.get("/owners/{owner_id}/devices", response_model=list[PushDeviceRead])
def list_owner_devices(owner_id: int, request: Request) -> list[PushDeviceRead]:
    _require_owner_access(request, owner_id)
    devices = push_notification_service.list_devices(owner_id)
    return [
        PushDeviceRead(
            token=device.token,
            platform=device.platform,
            device_name=device.device_name,
            last_seen_at=device.last_seen_at,
            enabled=device.enabled,
        )
        for device in devices
    ]


@router.post("/owners/{owner_id}/payout-preferences", response_model=OwnerPayoutPreferencesRead)
async def update_owner_payout_preferences(owner_id: int, request: Request) -> OwnerPayoutPreferencesRead:
    _require_owner_access(request, owner_id)
    payload = await _parse_model(request, OwnerPayoutPreferencesUpdate)
    try:
        return owner_service.update_payout_preferences(owner_id, payload)
    except KeyError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proprietário não encontrado") from exc


@router.post(
    "/owners/{owner_id}/kyc-documents",
    response_model=OwnerDocumentUploadResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_owner_document(owner_id: int, request: Request, file: UploadFile = File(...)) -> OwnerDocumentUploadResponse:
    _require_owner_access(request, owner_id)
    try:
        file.file.seek(0)
        return owner_service.submit_document(owner_id, file.filename, file.file, file.content_type)
    except StorageError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except KeyError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proprietário não encontrado") from exc


@router.post("/owners/{owner_id}/incidents", status_code=status.HTTP_202_ACCEPTED)
async def report_owner_incident(owner_id: int, request: Request) -> dict[str, str]:
    _require_owner_access(request, owner_id)
    payload = await _parse_model(request, OwnerIncidentReport)
    try:
        owner_service.report_incident(owner_id, payload)
    except KeyError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Proprietário não encontrado") from exc
    return {"status": "received"}


@router.post("/owners/{owner_id}/devices", status_code=status.HTTP_204_NO_CONTENT)
async def register_owner_device(owner_id: int, request: Request) -> Response:
    _require_owner_access(request, owner_id)
    payload = await _parse_model(request, PushDeviceRegistration)
    push_notification_service.register_device(
        owner_id,
        payload.token,
        payload.platform,
        device_name=payload.device_name,
        expo_push_token=payload.expo_push_token,
    )
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.delete("/owners/{owner_id}/devices/{token}", status_code=status.HTTP_204_NO_CONTENT)
def unregister_owner_device(owner_id: int, token: str, request: Request) -> Response:
    _require_owner_access(request, owner_id)
    push_notification_service.unregister_device(owner_id, token)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
