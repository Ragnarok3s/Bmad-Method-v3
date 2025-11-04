"""Property service leading KPI collector."""
from __future__ import annotations

from typing import Dict, List

from ..base import MetricDefinition, ensure_percent
from ..helpers import MeasurementSet, emit_measurements

SERVICE = "property"
TEAM = "Property Ops"

METRICS = (
    MetricDefinition(
        name="bmad_leading_kpi_property_onboarding_cycle_time_hours",
        description="Median hours to onboard a new property partner from contract signature to first listing.",
        unit="hours",
        metric_type="gauge",
        service=SERVICE,
        owner=TEAM,
        formula="p50(first_listing_at - contract_signed_at)",
    ),
    MetricDefinition(
        name="bmad_leading_kpi_property_pricing_refresh_rate",
        description="Percentage of active listings refreshed with new pricing within the SLA window.",
        unit="percentage",
        metric_type="gauge",
        service=SERVICE,
        owner=TEAM,
        formula="listings_refreshed / active_listings",
    ),
    MetricDefinition(
        name="bmad_leading_kpi_property_quality_review_pass_rate",
        description="Percentage of property audits that pass the quality checklist.",
        unit="percentage",
        metric_type="gauge",
        service=SERVICE,
        owner=TEAM,
        formula="audits_passed / audits_completed",
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
