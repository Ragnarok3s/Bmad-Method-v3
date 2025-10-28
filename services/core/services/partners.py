"""Serviços relacionados aos parceiros e aos seus SLAs."""
from __future__ import annotations

import json
import logging
from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from ..domain.models import Partner, PartnerSLA, PartnerWebhookEvent, SLAStatus
from ..domain.schemas import PartnerWebhookPayload


logger = logging.getLogger("bmad.core.services.partners")


class PartnerSLAService:
    def __init__(self, session: Session) -> None:
        self.session = session

    def list_slas(self) -> list[PartnerSLA]:
        query = (
            select(PartnerSLA)
            .join(Partner)
            .options(joinedload(PartnerSLA.partner))
            .order_by(Partner.name, PartnerSLA.metric)
        )
        return list(self.session.execute(query).scalars())

    def reconcile_webhook(self, payload: PartnerWebhookPayload) -> PartnerSLA:
        partner = self._get_partner(payload.partner_slug)
        sla = self._get_sla(partner.id, payload.metric)

        event = self._upsert_event(partner, sla, payload)
        sla.current_minutes = payload.elapsed_minutes
        sla.updated_at = payload.occurred_at

        status_after_event = self._calculate_status(sla, payload.elapsed_minutes)
        sla.status = status_after_event
        if status_after_event == SLAStatus.BREACHED:
            sla.last_violation_at = payload.occurred_at

        event.resolved_sla_status = status_after_event
        event.processed_at = datetime.now(timezone.utc)

        self.session.add_all([sla, event])
        self.session.flush()

        logger.info(
            "partner_webhook_reconciled",
            extra={
                "partner": partner.slug,
                "metric": sla.metric,
                "status": status_after_event.value,
                "event_id": payload.event_id,
            },
        )

        return sla

    def _calculate_status(self, sla: PartnerSLA, elapsed_minutes: int) -> SLAStatus:
        if elapsed_minutes <= sla.target_minutes:
            return SLAStatus.ON_TRACK

        warning_threshold = sla.warning_minutes or sla.breach_minutes
        if elapsed_minutes <= warning_threshold:
            return SLAStatus.AT_RISK

        return SLAStatus.BREACHED

    def _get_partner(self, slug: str) -> Partner:
        query = select(Partner).where(Partner.slug == slug, Partner.active.is_(True))
        partner = self.session.execute(query).scalar_one_or_none()
        if not partner:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Parceiro não encontrado")
        return partner

    def _get_sla(self, partner_id: int, metric: str) -> PartnerSLA:
        query = (
            select(PartnerSLA)
            .where(PartnerSLA.partner_id == partner_id, PartnerSLA.metric == metric)
            .options(joinedload(PartnerSLA.partner))
        )
        sla = self.session.execute(query).scalar_one_or_none()
        if not sla:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="SLA não encontrado para o parceiro")
        return sla

    def _upsert_event(
        self, partner: Partner, sla: PartnerSLA, payload: PartnerWebhookPayload
    ) -> PartnerWebhookEvent:
        query = select(PartnerWebhookEvent).where(
            PartnerWebhookEvent.partner_id == partner.id,
            PartnerWebhookEvent.external_id == payload.event_id,
        )
        event = self.session.execute(query).scalar_one_or_none()

        serialized_payload = json.dumps(payload.model_dump(mode="json"))

        if event is None:
            event = PartnerWebhookEvent(
                partner_id=partner.id,
                sla_id=sla.id,
                external_id=payload.event_id,
                metric=payload.metric,
                status=payload.status,
                payload=serialized_payload,
                elapsed_minutes=payload.elapsed_minutes,
                received_at=payload.occurred_at,
            )
        else:
            event.metric = payload.metric
            event.status = payload.status
            event.payload = serialized_payload
            event.elapsed_minutes = payload.elapsed_minutes
            event.received_at = payload.occurred_at
            event.sla_id = sla.id

        self.session.add(event)
        self.session.flush()
        return event
