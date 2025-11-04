"""Core platform leading KPI collector."""
from __future__ import annotations

from typing import Dict, List

from ..base import MetricDefinition, ensure_percent
from ..helpers import MeasurementSet, emit_measurements

SERVICE = "core"
TEAM = "Core Platform"

METRICS = (
    MetricDefinition(
        name="bmad_leading_kpi_core_listing_publish_lead_time_hours",
        description="Average hours from property creation to published listing.",
        unit="hours",
        metric_type="gauge",
        service=SERVICE,
        owner=TEAM,
        formula="avg(published_at - created_at)",
    ),
    MetricDefinition(
        name="bmad_leading_kpi_core_integration_success_rate",
        description="Percentage of successful integration sync jobs in the last 24 hours.",
        unit="percentage",
        metric_type="gauge",
        service=SERVICE,
        owner=TEAM,
        formula="successful_jobs / total_jobs",
    ),
    MetricDefinition(
        name="bmad_leading_kpi_core_release_change_failure_rate",
        description="Percentage of production deployments that required rollback in the last 7 days.",
        unit="percentage",
        metric_type="gauge",
        service=SERVICE,
        owner=TEAM,
        formula="rollbacks / deployments",
    ),
    MetricDefinition(
        name="bmad_leading_kpi_core_partner_training_completion_ratio",
        description="Percentage of partner onboarding playbooks completed on schedule.",
        unit="percentage",
        metric_type="gauge",
        service=SERVICE,
        owner=TEAM,
        formula="completed_playbooks / scheduled_playbooks",
    ),
)


def export_leading_kpis(registry, measurements: MeasurementSet) -> None:
    """Emit core leading indicator metrics.

    ``measurements`` must contain entries keyed by metric name. Each entry can
    provide multiple samples in the following structure::

        {
            "value": 12.3,
            "labels": {"region": "southeast"},
            "timestamp": "2024-07-30T12:00:00+00:00"
        }
    """

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
