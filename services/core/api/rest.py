"""Endpoints REST que cobrem os módulos do MVP."""
from __future__ import annotations

from typing import Iterable, TypeVar

from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from pydantic import BaseModel

from ..config import CoreSettings
from ..database import Database, get_database
from ..domain.models import AgentRole, HousekeepingStatus
from ..domain.schemas import (
    AgentCreate,
    AgentRead,
    HousekeepingTaskCreate,
    HousekeepingTaskRead,
    HousekeepingStatusUpdate,
    PropertyCreate,
    PropertyRead,
    ReservationCreate,
    ReservationRead,
    ReservationUpdateStatus,
)
from ..services import AgentService, HousekeepingService, PropertyService, ReservationService

ModelT = TypeVar("ModelT", bound=BaseModel)

router = APIRouter()


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


@router.post("/properties", response_model=PropertyRead, status_code=201)
async def create_property(
    request: Request,
    session: Session = Depends(get_session),
):
    payload = await _parse_model(request, PropertyCreate)
    service = PropertyService(session)
    return service.create(payload)


@router.get("/properties", response_model=list[PropertyRead])
def list_properties(session: Session = Depends(get_session)):
    return PropertyService(session).list()


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


@router.get("/properties/{property_id}/housekeeping", response_model=list[HousekeepingTaskRead])
def list_housekeeping(property_id: int, session: Session = Depends(get_session)):
    service = HousekeepingService(session)
    return service.list_for_property(property_id)


def create_app(settings: CoreSettings | None = None, database: Database | None = None) -> FastAPI:
    settings = settings or CoreSettings()
    database = database or get_database(settings)
    app = FastAPI(title="Core Hospitality Service", version="0.1.0")
    configure_cors(app, settings)

    def _get_db_override() -> Database:
        return database

    app.dependency_overrides[get_database] = _get_db_override
    app.include_router(router)
    return app
