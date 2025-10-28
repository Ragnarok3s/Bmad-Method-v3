"""Endpoints REST que cobrem os módulos do MVP."""
from __future__ import annotations

import logging
from datetime import date, datetime, timezone
from typing import Any, Iterable, TypeVar

from fastapi import APIRouter, Depends, FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from pydantic import BaseModel

from ..config import CoreSettings
from ..database import Database, get_database
from ..domain.agents import AgentAvailability, AgentCatalogPage, list_agent_catalog
from ..domain.models import HousekeepingStatus
from ..domain.schemas import (
    AgentCreate,
    AgentRead,
    DashboardMetricsRead,
    HousekeepingTaskCollection,
    HousekeepingTaskCreate,
    HousekeepingTaskRead,
    HousekeepingStatusUpdate,
    PartnerSLARead,
    PartnerWebhookPayload,
    PlaybookExecutionRead,
    PlaybookExecutionRequest,
    PlaybookTemplateCreate,
    PlaybookTemplateRead,
    PropertyCreate,
    PropertyRead,
    ReservationCreate,
    ReservationRead,
    ReservationUpdateStatus,
    WorkspaceCreate,
    WorkspaceRead,
)
from ..observability import get_observability_status, instrument_application
from ..services import (
    AgentService,
    HousekeepingService,
    OperationalMetricsService,
    PlaybookTemplateService,
    PropertyService,
    ReservationService,
    WorkspaceService,
)
from ..services.partners import PartnerSLAService
from ..metrics import record_dashboard_request

ModelT = TypeVar("ModelT", bound=BaseModel)

router = APIRouter()
logger = logging.getLogger(__name__)


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


@router.get("/agents", response_model=AgentCatalogPage)
def list_agents_catalog(
    competency: list[str] = Query(default_factory=list),
    availability: list[AgentAvailability] = Query(default_factory=list),
    page: int = Query(1, ge=1),
    page_size: int = Query(6, ge=1, le=50),
):
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

    def _get_db_override() -> Database:
        return database

    app.dependency_overrides[get_database] = _get_db_override
    app.include_router(router)
    instrument_application(app)
    return app
