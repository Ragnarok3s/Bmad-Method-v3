"""Catalog of leading KPIs grouped by service."""
from __future__ import annotations

from collections import defaultdict
from typing import Dict, List, Mapping, Sequence

from .base import MetricDefinition
from .core.collector import METRICS as CORE_METRICS
from .identity.collector import METRICS as IDENTITY_METRICS
from .payments.collector import METRICS as PAYMENTS_METRICS
from .property.collector import METRICS as PROPERTY_METRICS

_SERVICE_METRIC_MAP: Mapping[str, Sequence[MetricDefinition]] = {
    "core": CORE_METRICS,
    "identity": IDENTITY_METRICS,
    "payments": PAYMENTS_METRICS,
    "property": PROPERTY_METRICS,
}

LEADING_KPIS: Dict[str, List[MetricDefinition]] = defaultdict(list)
for service, definitions in _SERVICE_METRIC_MAP.items():
    LEADING_KPIS[service].extend(definitions)


def get_leading_kpis_for_service(service: str) -> Sequence[MetricDefinition]:
    """Return the KPI definitions registered for a service."""

    return tuple(LEADING_KPIS.get(service, ()))


__all__ = ["LEADING_KPIS", "get_leading_kpis_for_service"]
