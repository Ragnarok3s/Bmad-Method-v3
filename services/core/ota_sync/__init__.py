"""Serviços especializados em sincronização OTA com SLAs versionados."""
from __future__ import annotations

import json
from datetime import datetime, timedelta, timezone
from typing import Any, Literal

from fastapi import HTTPException, status
from pydantic import BaseModel, ConfigDict, Field, model_validator
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..domain.models import (
    InventoryReconciliationQueue,
    OTAChannel,
    OTASyncQueue,
    OTASyncStatus,
    Partner,
    PartnerSLA,
    PartnerSLAVersion,
    Reservation,
    ReconciliationSource,
    ReconciliationStatus,
    SLAStatus,
)
from ..inventory import InventoryReconciliationService
from ..metrics import record_ota_enqueue

DEFAULT_TARGET_MINUTES = 5
DEFAULT_WARNING_MINUTES = 7
DEFAULT_BREACH_MINUTES = 10


class OTAIngestionContract(BaseModel):
    """Contrato de ingestão de reservas oriundas de OTAs."""

    channel_slug: str = Field(min_length=3)
    partner_name: str = Field(min_length=3)
    external_id: str = Field(min_length=1)
    property_id: int
    reservation_id: int | None = None
    status: Literal["confirmed", "modified", "cancelled"]
    emitted_at: datetime
    received_at: datetime
    payload: dict[str, Any]

    @model_validator(mode="before")
    def validate_times(cls, values: dict[str, Any]) -> dict[str, Any]:
        emitted = values.get("emitted_at")
        received = values.get("received_at")
        if emitted and received and received < emitted:
            raise ValueError("received_at deve ser posterior a emitted_at")
        return values

    model_config = ConfigDict(str_strip_whitespace=True)


class OTAReturnContract(BaseModel):
    """Contrato de retorno (ack) de sincronização enviada às OTAs."""

    job_id: int
    partner_slug: str = Field(min_length=3)
    partner_name: str = Field(min_length=3)
    status: Literal["acknowledged", "rejected"]
    processed_at: datetime
    payload: dict[str, Any]

    model_config = ConfigDict(str_strip_whitespace=True)


class OTASyncService:
    """Coordena ingestão e retorno de eventos OTA garantindo SLAs versionados."""

    def __init__(
        self,
        session: Session,
        reconciliation_service: InventoryReconciliationService | None = None,
    ) -> None:
        self.session = session
        self.reconciliation = reconciliation_service or InventoryReconciliationService(session)

    def ingest(self, contract: OTAIngestionContract) -> InventoryReconciliationQueue | OTASyncQueue:
        channel = self._ensure_channel(contract.partner_name)
        partner = self._ensure_partner(contract.channel_slug, contract.partner_name)
        sla_version = self._ensure_sla_version(
            partner,
            metric="reservation_ingest",
            metric_label="Ingestão de reserva OTA",
            target_minutes=DEFAULT_TARGET_MINUTES,
            warning_minutes=DEFAULT_WARNING_MINUTES,
            breach_minutes=DEFAULT_BREACH_MINUTES,
        )

        latency = contract.received_at - contract.emitted_at
        latency_minutes = max(0, int(latency.total_seconds() // 60))

        if latency_minutes > sla_version.target_minutes:
            payload = {
                "external_id": contract.external_id,
                "status": contract.status,
                "latency_minutes": latency_minutes,
                "payload": contract.payload,
            }
            item = self.reconciliation.enqueue(
                property_id=contract.property_id,
                reservation_id=contract.reservation_id,
                channel_id=channel.id,
                external_booking_id=contract.external_id,
                source=ReconciliationSource.OTA,
                status=ReconciliationStatus.CONFLICT,
                payload=payload,
                sla_version=sla_version,
                next_action_at=contract.received_at + timedelta(minutes=1),
            )
            self._update_sla_progress(sla_version, latency_minutes)
            return item

        job_payload = {
            "external_id": contract.external_id,
            "status": contract.status,
            "payload": contract.payload,
        }
        job = OTASyncQueue(
            property_id=contract.property_id,
            reservation_id=contract.reservation_id,
            channel_id=channel.id,
            payload=json.dumps(job_payload, ensure_ascii=False, sort_keys=True),
            status=OTASyncStatus.PENDING,
        )
        self.session.add(job)
        self.session.flush()
        record_ota_enqueue(contract.property_id, "ingest")

        self._update_sla_progress(sla_version, latency_minutes)
        return job

    def finalize(self, contract: OTAReturnContract) -> dict[str, Any] | InventoryReconciliationQueue:
        job = self.session.get(OTASyncQueue, contract.job_id)
        if not job:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Job OTA não encontrado",
            )

        partner = self._ensure_partner(contract.partner_slug, contract.partner_name)
        sla_version = self._ensure_sla_version(
            partner,
            metric="reservation_return",
            metric_label="Retorno OTA",
            target_minutes=DEFAULT_TARGET_MINUTES,
            warning_minutes=DEFAULT_WARNING_MINUTES,
            breach_minutes=DEFAULT_BREACH_MINUTES,
        )

        processing_latency = contract.processed_at - job.created_at
        latency_minutes = max(0, int(processing_latency.total_seconds() // 60))

        if latency_minutes > sla_version.breach_minutes:
            payload = {
                "job_id": job.id,
                "latency_minutes": latency_minutes,
                "payload": contract.payload,
                "status": contract.status,
            }
            item = self.reconciliation.enqueue(
                property_id=job.property_id,
                reservation_id=job.reservation_id,
                channel_id=job.channel_id,
                external_booking_id=contract.payload.get("external_id"),
                source=ReconciliationSource.OTA,
                status=ReconciliationStatus.CONFLICT,
                payload=payload,
                sla_version=sla_version,
                next_action_at=contract.processed_at + timedelta(minutes=1),
            )
            job.status = OTASyncStatus.FAILED
            job.updated_at = contract.processed_at
            self.session.add(job)
            self._update_sla_progress(sla_version, latency_minutes)
            return item

        job.status = OTASyncStatus.SUCCESS if contract.status == "acknowledged" else OTASyncStatus.FAILED
        job.updated_at = contract.processed_at
        self.session.add(job)

        self._update_sla_progress(sla_version, latency_minutes)

        return {
            "job_id": job.id,
            "channel_id": job.channel_id,
            "status": job.status.value,
            "processed_at": contract.processed_at,
            "payload": contract.payload,
        }

    def propagate_pricing_update(
        self,
        reservation: Reservation,
        *,
        amount_minor: int,
        currency_code: str,
        triggered_at: datetime | None = None,
    ) -> dict[str, Any]:
        """Enfileira sincronização de atualização de tarifa com fallback manual."""

        if reservation.id is None:
            return {
                "status": "manual",
                "reason": "reservation_without_id",
            }

        triggered_at = triggered_at or datetime.now(timezone.utc)

        latest_job = self.session.execute(
            select(OTASyncQueue)
            .where(OTASyncQueue.reservation_id == reservation.id)
            .order_by(OTASyncQueue.created_at.desc())
            .limit(1)
        ).scalar_one_or_none()

        if latest_job is None:
            return {
                "status": "manual",
                "reason": "no_channel_context",
            }

        payload = json.dumps(
            {
                "type": "pricing_update",
                "reservation_id": reservation.id,
                "property_id": reservation.property_id,
                "amount_minor": amount_minor,
                "currency_code": currency_code,
                "check_in": reservation.check_in.isoformat(),
                "check_out": reservation.check_out.isoformat(),
            },
            ensure_ascii=False,
            sort_keys=True,
        )

        job = OTASyncQueue(
            reservation_id=reservation.id,
            property_id=reservation.property_id,
            channel_id=latest_job.channel_id,
            payload=payload,
            status=OTASyncStatus.PENDING,
        )
        self.session.add(job)
        self.session.flush()

        record_ota_enqueue(reservation.property_id, "pricing_update")

        return {
            "status": "synced",
            "job_id": job.id,
            "enqueued_at": triggered_at,
        }

    def _ensure_channel(self, name: str) -> OTAChannel:
        channel = self.session.execute(
            select(OTAChannel).where(OTAChannel.name == name)
        ).scalar_one_or_none()
        if channel:
            return channel
        channel = OTAChannel(name=name)
        self.session.add(channel)
        self.session.flush()
        return channel

    def _ensure_partner(self, slug: str, name: str) -> Partner:
        partner = self.session.execute(
            select(Partner).where(Partner.slug == slug)
        ).scalar_one_or_none()
        if partner:
            return partner
        partner = Partner(name=name, slug=slug, category="ota")
        self.session.add(partner)
        self.session.flush()
        return partner

    def _ensure_sla_version(
        self,
        partner: Partner,
        *,
        metric: str,
        metric_label: str,
        target_minutes: int,
        warning_minutes: int,
        breach_minutes: int,
    ) -> PartnerSLAVersion:
        sla = self.session.execute(
            select(PartnerSLA).where(
                PartnerSLA.partner_id == partner.id,
                PartnerSLA.metric == metric,
            )
        ).scalar_one_or_none()
        if not sla:
            sla = PartnerSLA(
                partner_id=partner.id,
                metric=metric,
                metric_label=metric_label,
                target_minutes=target_minutes,
                warning_minutes=warning_minutes,
                breach_minutes=breach_minutes,
                status=SLAStatus.ON_TRACK,
            )
            self.session.add(sla)
            self.session.flush()

        latest_version = sla.current_version or (sla.versions[-1] if sla.versions else None)
        if latest_version and (
            latest_version.target_minutes == target_minutes
            and latest_version.warning_minutes == warning_minutes
            and latest_version.breach_minutes == breach_minutes
        ):
            return latest_version

        next_version = (latest_version.version if latest_version else 0) + 1
        effective_from = datetime.now(timezone.utc)
        version = PartnerSLAVersion(
            sla_id=sla.id,
            version=next_version,
            target_minutes=target_minutes,
            warning_minutes=warning_minutes,
            breach_minutes=breach_minutes,
            effective_from=effective_from,
        )
        if latest_version and latest_version.effective_to is None:
            latest_version.effective_to = effective_from
            self.session.add(latest_version)
        self.session.add(version)
        self.session.flush()

        sla.target_minutes = target_minutes
        sla.warning_minutes = warning_minutes
        sla.breach_minutes = breach_minutes
        sla.current_version_id = version.id
        sla.updated_at = datetime.now(timezone.utc)
        self.session.add(sla)

        return version

    def _update_sla_progress(self, version: PartnerSLAVersion, latency_minutes: int) -> None:
        sla = version.sla
        if not sla:
            return
        sla.current_minutes = latency_minutes
        if latency_minutes <= version.target_minutes:
            sla.status = SLAStatus.ON_TRACK
        elif version.warning_minutes and latency_minutes <= version.warning_minutes:
            sla.status = SLAStatus.AT_RISK
        else:
            sla.status = SLAStatus.BREACHED
            sla.last_violation_at = datetime.now(timezone.utc)
        sla.updated_at = datetime.now(timezone.utc)
        self.session.add(sla)
