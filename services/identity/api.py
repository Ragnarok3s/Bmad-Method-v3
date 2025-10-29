"""FastAPI router exposing tenant-scoped identity operations."""

from __future__ import annotations

from contextlib import contextmanager
from datetime import timedelta

from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request, Response, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from services.core.config import CoreSettings
from services.core.database import Database, get_database
from services.core.domain.models import Agent
from services.core.observability import instrument_application
from services.core.security import AuthenticationError
from services.core.tenancy import (
    TenantIsolationError,
    TenantManager,
    TenantNotFoundError,
    create_tenant_manager,
)

from pydantic import BaseModel, ValidationError

from .models import TenantAgentAccess  # noqa: F401 - ensure model registration
from .repositories import TenantAccessError, TenantAccessRepository, TenantContext
from .schemas import (
    RoleAssignmentRead,
    RoleAssignmentUpdate,
    TenantLoginRequest,
    TenantLoginResponse,
    TenantMFAVerificationRequest,
)
from .service import TenantAwareAuthenticationService

router = APIRouter(prefix="/tenants/{tenant_slug}", tags=["identity"])


async def _parse_model(request: Request, model: type[BaseModel]) -> BaseModel:
    try:
        payload = await request.json()
    except Exception as exc:  # pragma: no cover - defensive guard
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Corpo da requisição inválido") from exc
    try:
        return model.model_validate(payload)
    except ValidationError as exc:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, exc.errors()) from exc


def configure_cors(app: FastAPI, settings: CoreSettings) -> None:
    if settings.allowed_origins:
        app.add_middleware(
            middleware_class=__import__(
                "fastapi.middleware.cors", fromlist=["CORSMiddleware"]
            ).CORSMiddleware,
            allow_origins=settings.allowed_origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )


def _get_tenant_manager(app: FastAPI) -> TenantManager:
    tenant_manager: TenantManager | None = getattr(app.state, "tenant_manager", None)
    if tenant_manager is None:
        raise RuntimeError("Tenant manager not configured")
    return tenant_manager


@contextmanager
def _tenant_context(
    request: Request,
    tenant_slug: str,
    database: Database,
    tenant_manager: TenantManager,
):
    with database.session_scope() as session:
        try:
            tenant = tenant_manager.require_tenant(session, tenant_slug)
        except TenantNotFoundError as exc:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Tenant não encontrado") from exc
        except TenantIsolationError as exc:
            raise HTTPException(status.HTTP_403_FORBIDDEN, str(exc)) from exc
        tenant_manager.bind_session(session, tenant)
        yield TenantContext(tenant=tenant, session=session)


def get_tenant_repository(
    request: Request,
    tenant_slug: str,
    database: Database = Depends(get_database),
) -> TenantAccessRepository:
    tenant_manager = _get_tenant_manager(request.app)
    with _tenant_context(request, tenant_slug, database, tenant_manager) as context:
        repository = TenantAccessRepository(context)
        yield repository


def _build_auth_service(
    request: Request,
    repository: TenantAccessRepository,
    session: Session,
) -> TenantAwareAuthenticationService:
    timeout_seconds: int | None = getattr(request.app.state, "auth_session_timeout", None)
    timeout = timedelta(seconds=timeout_seconds) if timeout_seconds else None
    return TenantAwareAuthenticationService(session, repository, session_timeout=timeout)


@router.post("/login", response_model=TenantLoginResponse)
async def login(
    tenant_slug: str,
    request: Request,
    repository: TenantAccessRepository = Depends(get_tenant_repository),
) -> TenantLoginResponse | JSONResponse:
    login_request = await _parse_model(request, TenantLoginRequest)
    session = repository.session
    service = _build_auth_service(request, repository, session)
    try:
        result = service.initiate_login(
            login_request.email,
            login_request.password,
            ip_address=request.client.host if request.client else None,
            user_agent=request.headers.get("user-agent"),
        )
    except (AuthenticationError, TenantAccessError) as error:
        detail = getattr(error, "detail", "Credenciais inválidas")
        status_code = getattr(error, "status_code", status.HTTP_401_UNAUTHORIZED)
        raise HTTPException(status_code, detail) from error
    auth_session = result.session
    return TenantLoginResponse(
        tenant=tenant_slug,
        session_id=auth_session.id,
        agent_id=auth_session.agent_id,
        mfa_required=result.mfa_required,
        expires_at=auth_session.expires_at,
        session_timeout_seconds=service.session_timeout_seconds,
        recovery_codes_remaining=result.recovery_codes_remaining,
    )


@router.post("/mfa/verify", response_model=TenantLoginResponse)
async def verify_mfa(
    tenant_slug: str,
    request: Request,
    repository: TenantAccessRepository = Depends(get_tenant_repository),
) -> TenantLoginResponse:
    mfa_request = await _parse_model(request, TenantMFAVerificationRequest)
    session = repository.session
    service = _build_auth_service(request, repository, session)
    try:
        auth_session = service.verify_mfa(
            mfa_request.session_id,
            mfa_request.code,
            method=mfa_request.method,
        )
    except AuthenticationError as error:
        raise HTTPException(error.status_code, error.detail) from error
    except TenantAccessError as error:
        raise HTTPException(error.status_code, error.detail) from error
    credentials = auth_session.agent.credentials if auth_session.agent else None
    remaining = len(credentials.recovery_codes) if credentials else 0
    return TenantLoginResponse(
        tenant=tenant_slug,
        session_id=auth_session.id,
        agent_id=auth_session.agent_id,
        mfa_required=False,
        expires_at=auth_session.expires_at,
        session_timeout_seconds=service.session_timeout_seconds,
        recovery_codes_remaining=remaining,
    )


@router.get("/roles", response_model=list[RoleAssignmentRead])
async def list_roles(
    tenant_slug: str,
    repository: TenantAccessRepository = Depends(get_tenant_repository),
) -> list[RoleAssignmentRead]:
    assignments = repository.list_assignments()
    return [
        RoleAssignmentRead(
            tenant_id=assignment.tenant_id,
            agent_id=assignment.agent_id,
            agent_email=assignment.agent.email,
            role=assignment.role,
            assigned_at=assignment.assigned_at,
            updated_at=assignment.updated_at,
        )
        for assignment in assignments
    ]


@router.put("/roles/{agent_id}", response_model=RoleAssignmentRead)
async def upsert_role(
    tenant_slug: str,
    agent_id: int,
    request: Request,
    repository: TenantAccessRepository = Depends(get_tenant_repository),
) -> RoleAssignmentRead:
    role_update = await _parse_model(request, RoleAssignmentUpdate)
    agent = repository.session.get(Agent, agent_id)
    if agent is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Agente não encontrado")
    assignment = repository.assign_role(agent, role_update.role)
    repository.session.flush()
    return RoleAssignmentRead(
        tenant_id=assignment.tenant_id,
        agent_id=assignment.agent_id,
        agent_email=agent.email,
        role=assignment.role,
        assigned_at=assignment.assigned_at,
        updated_at=assignment.updated_at,
    )


@router.delete("/roles/{agent_id}", status_code=status.HTTP_204_NO_CONTENT)
async def revoke_role(
    tenant_slug: str,
    agent_id: int,
    repository: TenantAccessRepository = Depends(get_tenant_repository),
) -> Response:
    removed = repository.remove_assignment(agent_id)
    if not removed:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Associação não encontrada")
    return Response(status_code=status.HTTP_204_NO_CONTENT)


def create_app(
    settings: CoreSettings | None = None,
    database: Database | None = None,
    tenant_manager: TenantManager | None = None,
) -> FastAPI:
    settings = settings or CoreSettings()
    database = database or get_database(settings)
    tenant_manager = tenant_manager or create_tenant_manager(settings, database)

    app = FastAPI(title="Bmad Identity Service", version="0.1.0")
    configure_cors(app, settings)

    def _db_override() -> Database:
        return database

    app.dependency_overrides[get_database] = _db_override
    app.state.database = database
    app.state.tenant_manager = tenant_manager
    app.state.auth_session_timeout = settings.auth_session_timeout_seconds
    app.include_router(router)
    observability = settings.observability
    if (
        observability.enable_traces
        or observability.enable_metrics
        or observability.enable_logs
    ):
        instrument_application(app)
    return app


__all__ = ["create_app", "router"]
