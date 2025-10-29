from __future__ import annotations

import json
import math
from dataclasses import dataclass
from datetime import datetime, timezone
from statistics import mean
from typing import Sequence

from fastapi import HTTPException, status
from sqlalchemy import Select, select
from sqlalchemy.orm import Session

from ..analytics import IncrementalAnalyticsPipeline, PIPELINE
from ..domain.models import AuditLog, Property, Reservation, ReservationStatus
from ..domain.schemas import (
    PricingBulkUpdateRequest,
    PricingBulkUpdateResponse,
    PricingComponentRead,
    PricingSimulationRead,
    PricingSimulationRequest,
    ReservationPricingUpdateResult,
)
from ..metrics import (
    record_pricing_accuracy,
    record_pricing_bulk_update,
    record_pricing_impact,
    record_pricing_simulation,
)
from ..ota_sync import OTASyncService


@dataclass(slots=True)
class _OccupancySnapshot:
    nights: int
    occupied_nights: int

    @property
    def ratio(self) -> float:
        if self.nights <= 0:
            return 0.0
        return max(0.0, min(1.0, self.occupied_nights / self.nights))


class PricingService:
    """Serviços de precificação dinâmica baseados em dados analíticos."""

    def __init__(
        self,
        session: Session,
        *,
        analytics: IncrementalAnalyticsPipeline | None = None,
        ota_service: OTASyncService | None = None,
    ) -> None:
        self.session = session
        self.analytics = analytics or PIPELINE
        self._ota_service = ota_service

    def _ensure_ota_service(self) -> OTASyncService:
        if not self._ota_service:
            self._ota_service = OTASyncService(self.session)
        return self._ota_service

    def simulate(
        self,
        payload: PricingSimulationRequest,
        *,
        actor_id: int | None = None,
    ) -> PricingSimulationRead:
        property_obj = self.session.get(Property, payload.property_id)
        if not property_obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Propriedade não encontrada",
            )

        nights = (payload.check_out - payload.check_in).days
        if nights <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Período inválido para simulação",
            )

        # Mantém pipeline incremental atualizado para obter séries históricas.
        self.analytics.sync(self.session)

        current_snapshot = self._current_occupancy(
            property_obj.id,
            property_obj.units,
            payload.check_in,
            payload.check_out,
        )
        historical_snapshot = self._historical_occupancy(property_obj.id, payload.check_in, nights, property_obj.units)

        seasonal_index = historical_snapshot.ratio
        occupancy_gap = current_snapshot.ratio - seasonal_index
        occupancy_component = self._clamp(occupancy_gap * 0.75, -0.35, 0.45)

        seasonal_component = self._clamp((seasonal_index - 0.55) * 0.35, -0.2, 0.2)

        competitor_average = self._competitor_average(payload)
        if competitor_average:
            competitor_index = competitor_average / payload.base_rate_minor
        else:
            competitor_index = 1.0
        competition_component = self._clamp((1 - competitor_index) * 0.6, -0.25, 0.25)

        combined_factor = 1 + occupancy_component + seasonal_component + competition_component
        recommended = math.floor(max(0, payload.base_rate_minor * combined_factor))

        revenue_delta = (recommended - payload.base_rate_minor) * nights

        history_density = historical_snapshot.occupied_nights
        confidence = max(0.35, min(0.95, 0.45 + history_density / (property_obj.units * 60 or 1)))

        components = [
            PricingComponentRead(
                name="occupancy",
                weight=0.45,
                factor=occupancy_component,
                contribution_minor=int(payload.base_rate_minor * occupancy_component),
                context={
                    "current_ratio": round(current_snapshot.ratio, 4),
                    "baseline_ratio": round(seasonal_index, 4),
                },
            ),
            PricingComponentRead(
                name="seasonality",
                weight=0.25,
                factor=seasonal_component,
                contribution_minor=int(payload.base_rate_minor * seasonal_component),
                context={
                    "seasonal_index": round(seasonal_index, 4),
                    "units": property_obj.units,
                },
            ),
            PricingComponentRead(
                name="competition",
                weight=0.30,
                factor=competition_component,
                contribution_minor=int(payload.base_rate_minor * competition_component),
                context={
                    "competitor_index": round(competitor_index, 4),
                    "competitor_average_minor": competitor_average or 0,
                },
            ),
        ]

        record_pricing_simulation(property_obj.id, nights)
        record_pricing_accuracy(property_obj.id, confidence)
        record_pricing_impact(property_obj.id, revenue_delta)

        generated_at = datetime.now(timezone.utc)
        return PricingSimulationRead(
            property_id=property_obj.id,
            check_in=payload.check_in,
            check_out=payload.check_out,
            base_rate_minor=payload.base_rate_minor,
            recommended_rate_minor=recommended,
            currency_code=payload.currency_code.upper(),
            nights=nights,
            occupancy_rate=current_snapshot.ratio,
            historical_rate=seasonal_index,
            seasonal_index=seasonal_index,
            competitor_index=competitor_index,
            confidence=confidence,
            components=components,
            expected_revenue_delta_minor=revenue_delta,
            generated_at=generated_at,
            actor_id=actor_id,
        )

    def apply_bulk_update(
        self,
        payload: PricingBulkUpdateRequest,
        *,
        actor_id: int | None = None,
    ) -> PricingBulkUpdateResponse:
        property_obj = self.session.get(Property, payload.property_id)
        if not property_obj:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Propriedade não encontrada",
            )

        if not payload.updates:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Nenhuma atualização informada",
            )

        reservation_ids = [update.reservation_id for update in payload.updates]
        reservations = self._load_reservations_for_update(reservation_ids)

        results: list[ReservationPricingUpdateResult] = []
        manual_actions = 0
        ota_service = self._ensure_ota_service()

        for update in payload.updates:
            reservation = reservations.get(update.reservation_id)
            if reservation is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Reserva {update.reservation_id} não encontrada",
                )
            if reservation.property_id != property_obj.id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Reserva não pertence à propriedade informada",
                )

            previous_rate = reservation.total_amount_minor or 0
            reservation.total_amount_minor = update.rate_minor
            reservation.currency_code = update.currency_code.upper()
            self.session.add(reservation)

            audit_detail = {
                "previous_rate_minor": previous_rate,
                "new_rate_minor": update.rate_minor,
                "currency_code": reservation.currency_code,
                "reason": update.reason,
                "actor_id": actor_id,
            }
            audit = AuditLog(
                reservation_id=reservation.id,
                agent_id=actor_id,
                action="reservation.pricing.update",
                detail=json.dumps(audit_detail, ensure_ascii=False, sort_keys=True),
                created_at=datetime.now(timezone.utc),
            )
            self.session.add(audit)
            self.session.flush()

            propagation = ota_service.propagate_pricing_update(
                reservation,
                amount_minor=update.rate_minor,
                currency_code=reservation.currency_code,
            )

            if propagation.get("status") != "synced":
                manual_actions += 1

            nights = (reservation.check_out - reservation.check_in).days or 1
            delta_minor = (update.rate_minor - previous_rate) * nights

            if update.expected_accuracy is not None:
                record_pricing_accuracy(property_obj.id, update.expected_accuracy)
            record_pricing_impact(property_obj.id, delta_minor)

            results.append(
                ReservationPricingUpdateResult(
                    reservation_id=reservation.id,
                    previous_rate_minor=previous_rate,
                    new_rate_minor=update.rate_minor,
                    currency_code=reservation.currency_code,
                    ota_job_id=propagation.get("job_id"),
                    status=propagation.get("status", "manual"),
                    manual_fallback_reason=propagation.get("reason"),
                    audit_log_id=audit.id,
                )
            )

        record_pricing_bulk_update(property_obj.id, len(payload.updates))

        return PricingBulkUpdateResponse(
            property_id=property_obj.id,
            processed=len(results),
            manual_actions=manual_actions,
            results=results,
        )

    def _current_occupancy(
        self,
        property_id: int,
        units: int,
        start: datetime,
        end: datetime,
    ) -> _OccupancySnapshot:
        stmt: Select[tuple[Reservation]] = (
            select(Reservation)
            .where(Reservation.property_id == property_id)
            .where(Reservation.status != ReservationStatus.CANCELLED)
            .where(Reservation.check_out > start)
            .where(Reservation.check_in < end)
            .with_for_update(nowait=False)
        )
        reservations = list(self.session.execute(stmt).scalars())

        occupied_nights = sum(self._overlap_nights(res, start, end) for res in reservations)
        total_nights = max(1, int((end - start).days))
        capacity_units = max(1, units)

        return _OccupancySnapshot(
            nights=total_nights * capacity_units,
            occupied_nights=occupied_nights,
        )

    def _historical_occupancy(
        self,
        property_id: int,
        reference_start: datetime,
        nights: int,
        units: int,
    ) -> _OccupancySnapshot:
        dataset = self.analytics.dataset("reservations")
        month = reference_start.month
        relevant: list[int] = []
        capacity = max(1, units * nights)
        for reservation in dataset:
            if (
                getattr(reservation, "property_id", None) == property_id
                and getattr(reservation, "status", ReservationStatus.CONFIRMED)
                != ReservationStatus.CANCELLED
                and getattr(reservation, "check_in", None)
                and reservation.check_in.month == month
            ):
                relevant.append(
                    min(nights, max(0, int((reservation.check_out - reservation.check_in).days)))
                )
        if not relevant:
            return _OccupancySnapshot(nights=capacity, occupied_nights=0)
        average = mean(relevant)
        estimated = int(average * len(relevant))
        return _OccupancySnapshot(nights=capacity, occupied_nights=min(capacity, estimated))

    @staticmethod
    def _overlap_nights(reservation: Reservation, start: datetime, end: datetime) -> int:
        overlap_start = max(start, reservation.check_in)
        overlap_end = min(end, reservation.check_out)
        delta = (overlap_end - overlap_start).days
        return max(0, delta)

    @staticmethod
    def _clamp(value: float, lower: float, upper: float) -> float:
        return max(lower, min(upper, value))

    @staticmethod
    def _competitor_average(payload: PricingSimulationRequest) -> float | None:
        if not payload.competitor_rates:
            return None
        values = [rate.amount_minor for rate in payload.competitor_rates if rate.amount_minor > 0]
        if not values:
            return None
        return float(mean(values))

    def _load_reservations_for_update(
        self, reservation_ids: Sequence[int]
    ) -> dict[int, Reservation]:
        stmt = (
            select(Reservation)
            .where(Reservation.id.in_(reservation_ids))
            .with_for_update(nowait=False)
        )
        result = self.session.execute(stmt)
        reservations = {reservation.id: reservation for reservation in result.scalars()}
        return reservations
