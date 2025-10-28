"""Serviços de conciliação de inventário e filas de reconciliação."""
from __future__ import annotations

import json
from datetime import datetime, timedelta
from typing import Any, Iterable

from fastapi import HTTPException, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from ..domain.models import (
    InventoryReconciliationQueue,
    PartnerSLAVersion,
    ReconciliationSource,
    ReconciliationStatus,
)
from ..domain.schemas import ReconciliationQueueRead


class InventoryReconciliationService:
    """Gerencia filas de reconciliação de inventário entre canais."""

    def __init__(self, session: Session) -> None:
        self.session = session

    def enqueue(
        self,
        *,
        property_id: int,
        payload: dict[str, Any],
        reservation_id: int | None = None,
        channel_id: int | None = None,
        external_booking_id: str | None = None,
        source: ReconciliationSource = ReconciliationSource.OTA,
        status: ReconciliationStatus = ReconciliationStatus.PENDING,
        sla_version: PartnerSLAVersion | None = None,
        next_action_at: datetime | None = None,
    ) -> InventoryReconciliationQueue:
        item = InventoryReconciliationQueue(
            property_id=property_id,
            reservation_id=reservation_id,
            channel_id=channel_id,
            external_booking_id=external_booking_id,
            source=source,
            status=status,
            payload=json.dumps(payload, ensure_ascii=False, sort_keys=True),
            sla_version_id=sla_version.id if sla_version else None,
            next_action_at=next_action_at,
        )
        self.session.add(item)
        self.session.flush()
        return item

    def mark_for_manual_review(self, item_id: int) -> InventoryReconciliationQueue:
        item = self._get_item(item_id)
        item.status = ReconciliationStatus.IN_REVIEW
        item.updated_at = datetime.utcnow()
        self.session.add(item)
        return item

    def resolve(
        self,
        item_id: int,
        *,
        resolution_payload: dict[str, Any] | None = None,
    ) -> InventoryReconciliationQueue:
        item = self._get_item(item_id)
        if resolution_payload:
            decoded = self._decode_payload(item.payload)
            decoded["resolution"] = resolution_payload
            item.payload = json.dumps(decoded, ensure_ascii=False, sort_keys=True)
        item.status = ReconciliationStatus.RESOLVED
        item.next_action_at = None
        item.updated_at = datetime.utcnow()
        self.session.add(item)
        return item

    def record_attempt(
        self,
        item_id: int,
        *,
        success: bool,
        scheduled_retry_in_minutes: int | None = None,
    ) -> InventoryReconciliationQueue:
        item = self._get_item(item_id)
        item.last_attempt_at = datetime.utcnow()
        item.attempts += 1
        if success:
            item.status = ReconciliationStatus.RESOLVED
            item.next_action_at = None
        else:
            item.status = ReconciliationStatus.CONFLICT
            if scheduled_retry_in_minutes:
                item.next_action_at = datetime.utcnow() + timedelta(minutes=scheduled_retry_in_minutes)
        item.updated_at = datetime.utcnow()
        self.session.add(item)
        return item

    def list_conflicts(
        self,
        *,
        property_id: int | None = None,
        statuses: Iterable[ReconciliationStatus] | None = None,
    ) -> list[InventoryReconciliationQueue]:
        active_statuses = list(
            statuses
            or (
                ReconciliationStatus.PENDING,
                ReconciliationStatus.CONFLICT,
                ReconciliationStatus.IN_REVIEW,
            )
        )
        filters = [InventoryReconciliationQueue.status.in_(active_statuses)]
        if property_id is not None:
            filters.append(InventoryReconciliationQueue.property_id == property_id)
        query = (
            select(InventoryReconciliationQueue)
            .where(*filters)
            .order_by(InventoryReconciliationQueue.created_at.asc())
        )
        return list(self.session.execute(query).scalars())

    def due_items(self, reference: datetime | None = None) -> list[InventoryReconciliationQueue]:
        reference = reference or datetime.utcnow()
        query = (
            select(InventoryReconciliationQueue)
            .where(InventoryReconciliationQueue.status == ReconciliationStatus.PENDING)
            .where(
                or_(
                    InventoryReconciliationQueue.next_action_at.is_(None),
                    InventoryReconciliationQueue.next_action_at <= reference,
                )
            )
            .order_by(InventoryReconciliationQueue.created_at.asc())
        )
        return list(self.session.execute(query).scalars())

    def to_read_model(
        self, item: InventoryReconciliationQueue
    ) -> ReconciliationQueueRead:
        return ReconciliationQueueRead(
            id=item.id,
            property_id=item.property_id,
            reservation_id=item.reservation_id,
            channel_id=item.channel_id,
            external_booking_id=item.external_booking_id,
            source=item.source,
            status=item.status,
            attempts=item.attempts,
            next_action_at=item.next_action_at,
            last_attempt_at=item.last_attempt_at,
            created_at=item.created_at,
            updated_at=item.updated_at,
            sla_version_id=item.sla_version_id,
            payload=self._decode_payload(item.payload),
        )

    def _get_item(self, item_id: int) -> InventoryReconciliationQueue:
        item = self.session.get(InventoryReconciliationQueue, item_id)
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Item de reconciliação não encontrado",
            )
        return item

    @staticmethod
    def _decode_payload(raw_payload: str) -> dict[str, Any]:
        try:
            data = json.loads(raw_payload)
            if isinstance(data, dict):
                return data
        except json.JSONDecodeError:
            pass
        return {"raw": raw_payload}
