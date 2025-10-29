"""Schema GraphQL exposto para consumo avançado."""
from __future__ import annotations

import strawberry
from fastapi import HTTPException, Request, status
from strawberry.fastapi import GraphQLRouter
from strawberry.types import Info

from sqlalchemy.orm import Session

from ..database import Database
from ..domain.agents import (
    AgentAvailability,
    AgentCatalogFilters,
    AgentCatalogItem,
    AgentCatalogPage,
    list_agent_catalog,
)
from ..domain.models import HousekeepingTask, Property, Reservation
from ..domain.schemas import ReservationRead
from ..services import HousekeepingService, PropertyService, ReservationService
from ..tenancy import TenantIsolationError, TenantManager, TenantNotFoundError


def _property_to_type(model: Property) -> "PropertyType":
    return PropertyType(id=model.id, name=model.name, timezone=model.timezone, units=model.units)


def _reservation_to_type(model: Reservation | ReservationRead) -> "ReservationType":
    return ReservationType(
        id=model.id,
        property_id=model.property_id,
        guest_name=model.guest_name,
        guest_email=model.guest_email,
        status=model.status.value,
        check_in=model.check_in.isoformat(),
        check_out=model.check_out.isoformat(),
    )


def _task_to_type(model: HousekeepingTask) -> "HousekeepingTaskType":
    return HousekeepingTaskType(
        id=model.id,
        property_id=model.property_id,
        reservation_id=model.reservation_id,
        status=model.status.value,
        scheduled_date=model.scheduled_date.isoformat(),
    )


AgentAvailabilityType = strawberry.enum(AgentAvailability, name="AgentAvailability")


@strawberry.type
class AgentFilterOptionType:
    value: str
    label: str
    count: int


@strawberry.type
class AgentAvailabilityFilterOptionType:
    value: AgentAvailabilityType
    label: str
    count: int


@strawberry.type
class AgentCatalogFiltersType:
    competencies: list[AgentFilterOptionType]
    availability: list[AgentAvailabilityFilterOptionType]


@strawberry.type
class AgentCatalogItemType:
    slug: str
    name: str
    tagline: str
    description: str
    role: str
    competencies: list[str]
    availability: AgentAvailabilityType
    availability_label: str
    response_time_minutes: int | None
    automation_level: str | None
    integrations: list[str]
    languages: list[str]


@strawberry.type
class PaginationMetaType:
    page: int
    page_size: int
    total: int
    total_pages: int


@strawberry.type
class AgentCatalogPageType:
    items: list[AgentCatalogItemType]
    pagination: PaginationMetaType
    available_filters: AgentCatalogFiltersType


def _agent_item_to_type(model: AgentCatalogItem) -> AgentCatalogItemType:
    return AgentCatalogItemType(
        slug=model.slug,
        name=model.name,
        tagline=model.tagline,
        description=model.description,
        role=model.role,
        competencies=list(model.competencies),
        availability=model.availability,
        availability_label=model.availability_label,
        response_time_minutes=model.response_time_minutes,
        automation_level=model.automation_level,
        integrations=list(model.integrations),
        languages=list(model.languages),
    )


def _agent_filters_to_type(model: AgentCatalogFilters) -> AgentCatalogFiltersType:
    return AgentCatalogFiltersType(
        competencies=[
            AgentFilterOptionType(value=option.value, label=option.label, count=option.count)
            for option in model.competencies
        ],
        availability=[
            AgentAvailabilityFilterOptionType(
                value=option.value,
                label=option.label,
                count=option.count,
            )
            for option in model.availability
        ],
    )


def _pagination_to_type(model: PaginationMeta) -> PaginationMetaType:
    return PaginationMetaType(
        page=model.page,
        page_size=model.page_size,
        total=model.total,
        total_pages=model.total_pages,
    )


def _agent_page_to_type(model: AgentCatalogPage) -> AgentCatalogPageType:
    return AgentCatalogPageType(
        items=[_agent_item_to_type(item) for item in model.items],
        pagination=_pagination_to_type(model.pagination),
        available_filters=_agent_filters_to_type(model.available_filters),
    )


@strawberry.type
class PropertyType:
    id: int
    name: str
    timezone: str
    units: int


@strawberry.type
class ReservationType:
    id: int
    property_id: int
    guest_name: str
    guest_email: str
    status: str
    check_in: str
    check_out: str


@strawberry.type
class HousekeepingTaskType:
    id: int
    property_id: int
    reservation_id: int | None
    status: str
    scheduled_date: str


def create_graphql_router(database: Database, tenant_manager: TenantManager | None = None) -> GraphQLRouter:
    def _resolve_manager(request: Request) -> TenantManager | None:
        return tenant_manager or getattr(request.app.state, "tenant_manager", None)

    def _bind_session(session: Session, request: Request) -> None:
        manager = _resolve_manager(request)
        if not manager:
            return
        scope = (request.headers.get("x-tenant-scope") or "tenant").lower()
        if scope == "platform":
            token = request.headers.get("x-tenant-platform-token")
            if not manager.validate_platform_token(token):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Escopo de plataforma não autorizado",
                )
            manager.bind_platform_session(session)
            return

        slug = request.headers.get("x-tenant-slug")
        if not slug:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cabeçalho X-Tenant-Slug obrigatório",
            )
        try:
            tenant = manager.require_tenant(session, slug)
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
        manager.bind_session(session, tenant)

    @strawberry.type
    class Query:
        @strawberry.field
        def properties(self, info: Info) -> list[PropertyType]:
            request: Request = info.context["request"]
            with database.session_scope() as session:
                _bind_session(session, request)
                service = PropertyService(session)
                return [_property_to_type(prop) for prop in service.list()]

        @strawberry.field
        def reservations(self, info: Info, property_id: int) -> list[ReservationType]:
            request: Request = info.context["request"]
            with database.session_scope() as session:
                _bind_session(session, request)
                service = ReservationService(session)
                data = service.list_for_property(property_id)
                return [_reservation_to_type(item) for item in data]

        @strawberry.field
        def agents(
            self,
            competencies: list[str] | None = None,
            availability: list[AgentAvailabilityType] | None = None,
            page: int = 1,
            page_size: int = 6,
        ) -> AgentCatalogPageType:
            catalog_page = list_agent_catalog(
                competencies=competencies or [],
                availability=availability or [],
                page=page,
                page_size=page_size,
            )
            return _agent_page_to_type(catalog_page)

        @strawberry.field
        def housekeeping_tasks(self, info: Info, property_id: int) -> list[HousekeepingTaskType]:
            request: Request = info.context["request"]
            with database.session_scope() as session:
                _bind_session(session, request)
                service = HousekeepingService(session)
                data = service.list_for_property(property_id)
                return [_task_to_type(item) for item in data]

    schema = strawberry.Schema(query=Query)

    async def get_context(request: Request):
        return {"request": request}

    return GraphQLRouter(schema, context_getter=get_context)
