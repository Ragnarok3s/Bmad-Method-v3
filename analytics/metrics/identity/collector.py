"""Identity service leading KPI collector."""
from __future__ import annotations

from typing import Dict, List

from ..base import MetricDefinition, ensure_percent
from ..helpers import MeasurementSet, emit_measurements

SERVICE = "identity"
TEAM = "Identity Platform"

METRICS = (
    MetricDefinition(
        name="bmad_leading_kpi_identity_identity_proofing_conversion_rate",
        description="Percentage of identity proofing journeys that complete successfully.",
        unit="percentage",
        metric_type="gauge",
        service=SERVICE,
        owner=TEAM,
        formula="completed_proofings / started_proofings",
    ),
    MetricDefinition(
        name="bmad_leading_kpi_identity_idp_sync_latency_seconds",
        description="Median latency to sync user profile updates from the IdP webhook.",
        unit="seconds",
        metric_type="gauge",
        service=SERVICE,
        owner=TEAM,
        formula="p50(sync_completed_at - webhook_received_at)",
    ),
    MetricDefinition(
        name="bmad_leading_kpi_identity_support_backlog_ratio",
        description="Ratio between open identity support tickets and weekly resolution capacity.",
        unit="percentage",
        metric_type="gauge",
        service=SERVICE,
        owner=TEAM,
        formula="open_tickets / resolution_capacity",
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
