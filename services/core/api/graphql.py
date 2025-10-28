"""Schema GraphQL exposto para consumo avançado."""
from __future__ import annotations

import strawberry
from strawberry.fastapi import GraphQLRouter

from ..database import Database
from ..domain.models import HousekeepingTask, Property, Reservation
from ..services import HousekeepingService, PropertyService, ReservationService


def _property_to_type(model: Property) -> "PropertyType":
    return PropertyType(id=model.id, name=model.name, timezone=model.timezone, units=model.units)


def _reservation_to_type(model: Reservation) -> "ReservationType":
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


def create_graphql_router(database: Database) -> GraphQLRouter:
    @strawberry.type
    class Query:
        @strawberry.field
        def properties(self) -> list[PropertyType]:
            with database.session_scope() as session:
                service = PropertyService(session)
                return [_property_to_type(prop) for prop in service.list()]

        @strawberry.field
        def reservations(self, property_id: int) -> list[ReservationType]:
            with database.session_scope() as session:
                service = ReservationService(session)
                data = service.list_for_property(property_id)
                return [_reservation_to_type(item) for item in data]

        @strawberry.field
        def housekeeping_tasks(self, property_id: int) -> list[HousekeepingTaskType]:
            with database.session_scope() as session:
                service = HousekeepingService(session)
                data = service.list_for_property(property_id)
                return [_task_to_type(item) for item in data]

    schema = strawberry.Schema(query=Query)
    return GraphQLRouter(schema)
