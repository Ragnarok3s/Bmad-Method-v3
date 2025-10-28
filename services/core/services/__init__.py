"""Regras de negócio para propriedades, reservas e housekeeping."""
from __future__ import annotations

import json
import logging
from datetime import datetime
from math import ceil

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from quality.privacy import enforce_retention_policy, mask_personal_identifiers

from ..domain.models import (
    Agent,
    AgentRole,
    AuditLog,
    HousekeepingStatus,
    HousekeepingTask,
    OTASyncQueue,
    OTASyncStatus,
    Property,
    Reservation,
    ReservationStatus,
)
from ..domain.schemas import (
    AgentCreate,
    HousekeepingTaskCollection,
    HousekeepingTaskCreate,
    PaginationMeta,
    PropertyCreate,
    ReservationCreate,
    ReservationUpdateStatus,
)
from ..metrics import (
    record_housekeeping_scheduled,
    record_housekeeping_transition,
    record_ota_enqueue,
    record_reservation_confirmed,
    record_reservation_status,
)
from ..security import assert_role


logger = logging.getLogger("bmad.core.services")


class PropertyService:
    def __init__(self, session: Session) -> None:
        self.session = session

    def create(self, payload: PropertyCreate) -> Property:
        property_obj = Property(**payload.model_dump())
        self.session.add(property_obj)
        self.session.flush()
        logger.info("property_created", extra={"property_id": property_obj.id})
        return property_obj

    def list(self) -> list[Property]:
        result = self.session.execute(select(Property).order_by(Property.name))
        return list(result.scalars())


class AgentService:
    def __init__(self, session: Session) -> None:
        self.session = session

    def create(self, payload: AgentCreate) -> Agent:
        agent = Agent(**payload.model_dump())
        self.session.add(agent)
        self.session.flush()
        logger.info(
            "agent_created",
            extra={"agent_id": agent.id, "role": agent.role.value},
        )
        return agent

    def get(self, agent_id: int) -> Agent:
        agent = self.session.get(Agent, agent_id)
        if not agent:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agente não encontrado")
        return agent


class ReservationService:
    def __init__(self, session: Session) -> None:
        self.session = session

    def _check_conflict(self, property_id: int, check_in: datetime, check_out: datetime) -> None:
        query = (
            select(Reservation)
            .where(Reservation.property_id == property_id)
            .where(Reservation.status != ReservationStatus.CANCELLED)
            .where(Reservation.check_out > check_in)
            .where(Reservation.check_in < check_out)
        )
        conflict = self.session.execute(query).scalar_one_or_none()
        if conflict:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Conflito de disponibilidade")

    def create(self, payload: ReservationCreate, actor: Agent | None = None) -> Reservation:
        property_obj = self.session.get(Property, payload.property_id)
        if not property_obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Propriedade não encontrada")
        self._check_conflict(payload.property_id, payload.check_in, payload.check_out)

        reservation = Reservation(**payload.model_dump())
        reservation.status = ReservationStatus.CONFIRMED
        self.session.add(reservation)
        self.session.flush()

        self._log_event(reservation, actor, "reservation_created")
        self._enqueue_sync(reservation, "create")
        record_reservation_confirmed(property_obj.id)
        logger.info(
            "reservation_confirmed",
            extra={
                "reservation_id": reservation.id,
                "property_id": property_obj.id,
                "actor_id": actor.id if actor else None,
            },
        )
        return reservation

    def update_status(self, reservation_id: int, payload: ReservationUpdateStatus, actor: Agent | None = None) -> Reservation:
        reservation = self.session.get(Reservation, reservation_id)
        if not reservation:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reserva não encontrada")
        reservation.status = payload.status
        self.session.add(reservation)
        self.session.flush()
        self._log_event(reservation, actor, f"reservation_status_{payload.status.value}")
        self._enqueue_sync(reservation, "update_status")
        record_reservation_status(payload.status.value, reservation.property_id)
        logger.info(
            "reservation_status_updated",
            extra={
                "reservation_id": reservation.id,
                "status": payload.status.value,
                "actor_id": actor.id if actor else None,
            },
        )
        return reservation

    def list_for_property(self, property_id: int) -> list[Reservation]:
        query = select(Reservation).where(Reservation.property_id == property_id).order_by(Reservation.check_in)
        result = self.session.execute(query)
        reservations = list(result.scalars())
        masked = []
        for reservation in reservations:
            sanitized = mask_personal_identifiers(
                {
                    "guest_name": reservation.guest_name,
                    "email": reservation.guest_email,
                    "document": "",
                    "tax_id": "",
                    "passport": "",
                }
            )
            reservation.guest_email = sanitized["email"]
            masked.append(reservation)
        return masked

    def enforce_retention(self, retention_days: int) -> int:
        query = select(Reservation)
        reservations = self.session.execute(query).scalars().all()
        serialized = [
            {
                "id": reservation.id,
                "created_at": reservation.created_at.strftime("%Y-%m-%d"),
            }
            for reservation in reservations
        ]
        filtered = enforce_retention_policy(serialized, retention_days)
        filtered_ids = {item["id"] for item in filtered}
        removed = 0
        for reservation in reservations:
            if reservation.id not in filtered_ids:
                self.session.delete(reservation)
                removed += 1
        return removed

    def _enqueue_sync(self, reservation: Reservation, action: str) -> None:
        payload = json.dumps(
            {
                "reservation_id": reservation.id,
                "property_id": reservation.property_id,
                "action": action,
                "status": reservation.status.value,
            }
        )
        job = OTASyncQueue(
            reservation_id=reservation.id,
            property_id=reservation.property_id,
            channel_id=1,
            payload=payload,
            status=OTASyncStatus.PENDING,
        )
        self.session.add(job)
        record_ota_enqueue(reservation.property_id, action)
        logger.info(
            "ota_job_enqueued",
            extra={
                "reservation_id": reservation.id,
                "property_id": reservation.property_id,
                "action": action,
            },
        )

    def _log_event(self, reservation: Reservation, actor: Agent | None, action: str) -> None:
        log = AuditLog(
            reservation_id=reservation.id,
            agent_id=actor.id if actor else None,
            action=action,
            detail=f"Status atual: {reservation.status.value}",
        )
        self.session.add(log)


class HousekeepingService:
    def __init__(self, session: Session) -> None:
        self.session = session

    def schedule(self, payload: HousekeepingTaskCreate, actor: Agent) -> HousekeepingTask:
        assert_role(actor, {AgentRole.ADMIN, AgentRole.PROPERTY_MANAGER})
        property_obj = self.session.get(Property, payload.property_id)
        if not property_obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Propriedade não encontrada")

        task = HousekeepingTask(**payload.model_dump())
        self.session.add(task)
        self.session.flush()
        record_housekeeping_scheduled(task.property_id, actor.id)
        logger.info(
            "housekeeping_task_scheduled",
            extra={
                "task_id": task.id,
                "property_id": task.property_id,
                "actor_id": actor.id,
            },
        )
        return task

    def update_status(self, task_id: int, status_update: HousekeepingStatus, actor: Agent) -> HousekeepingTask:
        task = self.session.get(HousekeepingTask, task_id)
        if not task:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tarefa não encontrada")

        allowed_roles = {AgentRole.ADMIN, AgentRole.PROPERTY_MANAGER, AgentRole.HOUSEKEEPING}
        assert_role(actor, allowed_roles)
        if actor.role == AgentRole.HOUSEKEEPING and task.assigned_agent_id != actor.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Tarefa pertence a outro agente")

        task.status = status_update
        record_housekeeping_transition(task.property_id, status_update.value, actor.role.value)
        logger.info(
            "housekeeping_task_status_updated",
            extra={
                "task_id": task.id,
                "status": status_update.value,
                "actor_id": actor.id,
            },
        )
        self.session.add(task)
        self.session.flush()
        return task

    def list_for_property(
        self,
        property_id: int,
        *,
        start_date: datetime | None = None,
        end_date: datetime | None = None,
        status_filter: HousekeepingStatus | None = None,
        page: int = 1,
        page_size: int = 20,
    ) -> HousekeepingTaskCollection:
        property_obj = self.session.get(Property, property_id)
        if not property_obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Propriedade não encontrada")

        page = max(page, 1)
        page_size = max(1, min(page_size, 100))

        filters = [HousekeepingTask.property_id == property_id]
        if start_date:
            filters.append(HousekeepingTask.scheduled_date >= start_date)
        if end_date:
            filters.append(HousekeepingTask.scheduled_date <= end_date)
        if status_filter:
            filters.append(HousekeepingTask.status == status_filter)

        base_query = select(HousekeepingTask).where(*filters)
        count_subquery = select(HousekeepingTask.id).where(*filters).subquery()
        total = self.session.execute(select(func.count()).select_from(count_subquery)).scalar_one()

        total_pages = ceil(total / page_size) if total else 0
        if total_pages and page > total_pages:
            page = total_pages

        offset = (page - 1) * page_size if total else 0
        items_query = (
            base_query.order_by(HousekeepingTask.scheduled_date, HousekeepingTask.id)
            .offset(offset)
            .limit(page_size)
        )
        items = list(self.session.execute(items_query).scalars())

        return HousekeepingTaskCollection(
            items=items,
            pagination=PaginationMeta(
                page=page,
                page_size=page_size,
                total=total,
                total_pages=total_pages,
            ),
        )


class OTASynchronizer:
    """Orquestra a sincronização OTA com filas resilientes."""

    def __init__(self, session: Session) -> None:
        self.session = session

    def mark_in_flight(self, job_id: int) -> OTASyncQueue:
        job = self.session.get(OTASyncQueue, job_id)
        if not job:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job não encontrado")
        job.status = OTASyncStatus.IN_FLIGHT
        self.session.add(job)
        return job

    def mark_completed(self, job_id: int, success: bool) -> OTASyncQueue:
        job = self.session.get(OTASyncQueue, job_id)
        if not job:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job não encontrado")
        job.status = OTASyncStatus.SUCCESS if success else OTASyncStatus.FAILED
        self.session.add(job)
        return job

    def pending_jobs(self, limit: int = 20) -> list[OTASyncQueue]:
        query = select(OTASyncQueue).where(OTASyncQueue.status == OTASyncStatus.PENDING).limit(limit)
        result = self.session.execute(query)
        return list(result.scalars())
