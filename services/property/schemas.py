"""Esquemas agregados para recursos relacionados a propriedades."""
from __future__ import annotations

from datetime import datetime, timezone

from pydantic import BaseModel, Field, model_validator

from services.core.domain.schemas import ReservationRead, ReconciliationQueueRead


class PropertyCalendarResponse(BaseModel):
    """Representa a visão consolidada do calendário operacional de uma propriedade."""

    property_id: int = Field(..., description="Identificador da propriedade consultada.")
    generated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Timestamp de geração da visão do calendário.",
    )
    reservations: list[ReservationRead] = Field(
        default_factory=list,
        description="Reservas agendadas para a propriedade com informações relevantes para o calendário.",
    )
    reconciliation_items: list[ReconciliationQueueRead] = Field(
        default_factory=list,
        description="Itens pendentes de reconciliação que impactam a disponibilidade da propriedade.",
    )
    reservations_count: int = Field(
        default=0,
        ge=0,
        description="Quantidade total de reservas retornadas.",
    )
    reconciliation_count: int = Field(
        default=0,
        ge=0,
        description="Quantidade de itens de reconciliação retornados.",
    )

    @model_validator(mode="before")
    @classmethod
    def _hydrate_counts(cls, values: dict[str, object]) -> dict[str, object]:
        reservations = values.get("reservations") or []
        reconciliation_items = values.get("reconciliation_items") or []
        if "reservations_count" not in values:
            values["reservations_count"] = len(reservations)
        if "reconciliation_count" not in values:
            values["reconciliation_count"] = len(reconciliation_items)
        return values


class PropertyInventoryReconciliationResponse(BaseModel):
    """Representa a fila de reconciliação de inventário filtrada por propriedade."""

    property_id: int = Field(..., description="Identificador da propriedade consultada.")
    generated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Timestamp de geração da visão de reconciliação.",
    )
    items: list[ReconciliationQueueRead] = Field(
        default_factory=list,
        description="Itens ativos na fila de reconciliação para a propriedade.",
    )
    pending_count: int = Field(
        default=0,
        ge=0,
        description="Quantidade de itens retornados na fila.",
    )

    @model_validator(mode="before")
    @classmethod
    def _hydrate_pending_count(cls, values: dict[str, object]) -> dict[str, object]:
        items = values.get("items") or []
        if "pending_count" not in values:
            values["pending_count"] = len(items)
        return values
