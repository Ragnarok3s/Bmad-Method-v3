"""Payments service leading KPI collector."""
from __future__ import annotations

from typing import Dict, List

from ..base import MetricDefinition, ensure_percent
from ..helpers import MeasurementSet, emit_measurements

SERVICE = "payments"
TEAM = "Payments"

METRICS = (
    MetricDefinition(
        name="bmad_leading_kpi_payments_authorization_success_rate",
        description="Authorization success percentage over the last 24 hours.",
        unit="percentage",
        metric_type="gauge",
        service=SERVICE,
        owner=TEAM,
        formula="authorised / attempted",
    ),
    MetricDefinition(
        name="bmad_leading_kpi_payments_settlement_lead_time_hours",
        description="Average time between authorization and settlement.",
        unit="hours",
        metric_type="gauge",
        service=SERVICE,
        owner=TEAM,
        formula="avg(settled_at - authorised_at)",
    ),
    MetricDefinition(
        name="bmad_leading_kpi_payments_dispute_response_sla",
        description="Percentage of disputes responded within SLA window.",
        unit="percentage",
        metric_type="gauge",
        service=SERVICE,
        owner=TEAM,
        formula="responses_within_sla / total_responses",
    ),
)


def export_leading_kpis(registry, measurements: MeasurementSet) -> None:
    normalised: Dict[str, List[dict[str, object]]] = {}
    for definition in METRICS:
        datapoints = []
        for item in measurements.get(definition.name, ()):  # type: ignore[arg-type]
            value = item.get("value", 0)
            if definition.unit == "percentage":
                value = ensure_percent(float(value))
            datapoints.append({**item, "value": value})
        if datapoints:
            normalised[definition.name] = datapoints
    emit_measurements(registry, METRICS, normalised)


__all__ = ["METRICS", "export_leading_kpis"]
