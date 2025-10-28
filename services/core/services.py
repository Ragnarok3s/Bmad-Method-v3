"""Regras de negócio para propriedades, reservas e housekeeping."""
from __future__ import annotations

import json
from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from quality.privacy import enforce_retention_policy, mask_personal_identifiers

from .domain.models import (
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
from .domain.schemas import (
    AgentCreate,
    HousekeepingTaskCreate,
    PropertyCreate,
    ReservationCreate,
    ReservationRead,
    ReservationUpdateStatus,
)
from .security import assert_role


class PropertyService:
    def __init__(self, session: Session) -> None:
        self.session = session

    def create(self, payload: PropertyCreate) -> Property:
        property_obj = Property(**payload.model_dump())
        self.session.add(property_obj)
        self.session.flush()
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
        return reservation

    def list_for_property(self, property_id: int) -> list[ReservationRead]:
        query = select(Reservation).where(Reservation.property_id == property_id).order_by(Reservation.check_in)
        result = self.session.execute(query)
        reservations = list(result.scalars())
        masked: list[ReservationRead] = []
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
            masked.append(
                ReservationRead.model_validate(reservation).model_copy(
                    update={"guest_email": sanitized["email"]}
                )
            )
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
        expired_ids = {reservation.id for reservation in reservations if reservation.id not in filtered_ids}

        if not expired_ids:
            return 0

        logs_query = select(AuditLog).where(AuditLog.reservation_id.in_(expired_ids))
        for audit_log in self.session.execute(logs_query).scalars():
            self.session.delete(audit_log)

        removed = 0
        for reservation in reservations:
            if reservation.id in expired_ids:
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
        self.session.add(task)
        self.session.flush()
        return task

    def list_for_property(self, property_id: int) -> list[HousekeepingTask]:
        query = select(HousekeepingTask).where(HousekeepingTask.property_id == property_id).order_by(HousekeepingTask.scheduled_date)
        result = self.session.execute(query)
        return list(result.scalars())


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
