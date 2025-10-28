"""Endpoints REST que cobrem os módulos do MVP."""
from __future__ import annotations

import logging
from datetime import date, datetime, timedelta, timezone
from typing import Any, Iterable, TypeVar, Union

from fastapi import APIRouter, Depends, FastAPI, HTTPException, Query, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from pydantic import BaseModel

from ..config import CoreSettings
from ..database import Database, get_database
from ..domain.agents import AgentAvailability, AgentCatalogPage, list_agent_catalog
from ..domain.models import Agent, HousekeepingStatus
from ..domain.schemas import (
    AgentCreate,
    AgentProfileUpdate,
    AgentRead,
    DashboardMetricsRead,
    GovernanceAuditRead,
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
    RolePolicyCreate,
    RolePolicyRead,
    RolePolicyUpdate,
    KnowledgeBaseArticleRead,
    KnowledgeBaseCatalogRead,
    KnowledgeBaseTelemetryEvent,
    WorkspaceCreate,
    WorkspaceRead,
)
from ..observability import get_observability_status, instrument_application
from ..services import (
    AgentService,
    HousekeepingService,
    OperationalMetricsService,
    KnowledgeBaseService,
    PlaybookTemplateService,
    PropertyService,
    ReservationService,
    WorkspaceService,
)
from ..services.partners import PartnerSLAService
from ..metrics import record_dashboard_request
from ..security import AuthenticationError, AuthenticationService, SecurityService

ModelT = TypeVar("ModelT", bound=BaseModel)

router = APIRouter()
logger = logging.getLogger(__name__)

knowledge_base_service = KnowledgeBaseService()


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


def get_session(db: Database = Depends(get_database)) -> Iterable[Session]:
    with db.session_scope() as session:
        yield session


async def _parse_model(request: Request, model_type: type[ModelT]) -> ModelT:
    data = await request.json()
    return model_type.model_validate(data)


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
    service = OperationalMetricsService(session)
    try:
        overview = service.get_overview(target_date)
    except Exception:
        record_dashboard_request("overview", False)
        logger.exception("dashboard_metrics_failed")
        raise

    record_dashboard_request("overview", True)
    return overview


@router.post("/properties", response_model=PropertyRead, status_code=201)
async def create_property(
    request: Request,
    session: Session = Depends(get_session),
):
    payload = await _parse_model(request, PropertyCreate)
    service = PropertyService(session)
    return service.create(payload)


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
    service = WorkspaceService(session)
    return service.create(payload)


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
    service = ReservationService(session)
    return service.create(payload)


@router.get("/properties/{property_id}/reservations", response_model=list[ReservationRead])
def list_reservations(property_id: int, session: Session = Depends(get_session)):
    service = ReservationService(session)
    return service.list_for_property(property_id)


@router.patch("/reservations/{reservation_id}", response_model=ReservationRead)
async def update_reservation_status(
    reservation_id: int,
    request: Request,
    session: Session = Depends(get_session),
):
    payload = await _parse_model(request, ReservationUpdateStatus)
    service = ReservationService(session)
    return service.update_status(reservation_id, payload)


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


def create_app(settings: CoreSettings | None = None, database: Database | None = None) -> FastAPI:
    settings = settings or CoreSettings()
    database = database or get_database(settings)
    app = FastAPI(title="Core Hospitality Service", version="0.1.0")
    configure_cors(app, settings)

    with database.session_scope() as session:
        SecurityService(session).ensure_bootstrap()

    def _get_db_override() -> Database:
        return database

    app.dependency_overrides[get_database] = _get_db_override
    app.state.auth_session_timeout = timedelta(seconds=settings.auth_session_timeout_seconds)
    app.state.core_settings = settings
    app.include_router(router)
    instrument_application(app)
    return app
