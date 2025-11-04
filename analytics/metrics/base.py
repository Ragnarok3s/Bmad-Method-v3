"""Core utilities for defining and emitting leading indicator metrics.

The module intentionally keeps runtime dependencies minimal so it can be
imported both by application code and offline batch jobs.  When the
``prometheus_client`` package is available it will transparently export
samples to Prometheus gauges while still keeping an in-memory copy for
unit testing and reporting.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict, Iterable, Mapping, MutableMapping, Optional, Sequence

try:  # Optional dependency used in production collectors
    from prometheus_client import Gauge  # type: ignore
except Exception:  # pragma: no cover - fallback when the dependency is absent
    Gauge = None  # type: ignore


@dataclass(frozen=True)
class MetricDefinition:
    """Static configuration for a metric.

    Attributes
    ----------
    name:
        Metric identifier following Prometheus naming conventions.
    description:
        Human-readable explanation of what the metric represents.
    unit:
        Textual description of the unit (``seconds``, ``percentage`` ...).
    metric_type:
        Logical type (``gauge``, ``counter``, ``histogram``). Only ``gauge``
        is currently used for leading indicators.
    service:
        Name of the service responsible for emitting the metric.
    owner:
        Owning team, useful for routing alerts.
    tags:
        Static tags/labels that will be added to every sample.
    formula:
        Optional description of how the value is calculated.
    leading_indicator:
        True when the metric is a leading KPI as opposed to a lagging one.
    """

    name: str
    description: str
    unit: str
    metric_type: str
    service: str
    owner: str
    tags: Mapping[str, str] = field(default_factory=dict)
    formula: Optional[str] = None
    leading_indicator: bool = True


@dataclass(frozen=True)
class MetricSample:
    """Concrete sample emitted for a metric definition."""

    definition: MetricDefinition
    value: float
    labels: Mapping[str, str] = field(default_factory=dict)
    timestamp: Optional[datetime] = None

    def merged_labels(self) -> Dict[str, str]:
        combined: Dict[str, str] = dict(self.definition.tags)
        combined.update(self.labels)
        return combined


class MetricRegistry:
    """Registry that captures emitted metrics and proxies them to Prometheus."""

    def __init__(self, use_prometheus: bool = True) -> None:
        self._samples: list[MetricSample] = []
        self._gauges: MutableMapping[str, "Gauge"] = {}
        self._use_prometheus = use_prometheus and Gauge is not None

    @property
    def samples(self) -> Sequence[MetricSample]:
        return tuple(self._samples)

    def record(self, definition: MetricDefinition, value: float, *, labels: Optional[Mapping[str, str]] = None,
               timestamp: Optional[datetime] = None) -> None:
        sample = MetricSample(definition=definition, value=value, labels=labels or {}, timestamp=timestamp)
        self._samples.append(sample)
        if self._use_prometheus:
            gauge = self._gauges.get(definition.name)
            if gauge is None:
                gauge = Gauge(  # type: ignore[call-arg]
                    definition.name,
                    definition.description,
                    list(sample.merged_labels().keys()) or None,
                )
                self._gauges[definition.name] = gauge
            gauge.labels(**sample.merged_labels()).set(value)

    def extend(self, samples: Iterable[MetricSample]) -> None:
        for sample in samples:
            self.record(sample.definition, sample.value, labels=sample.labels, timestamp=sample.timestamp)

    def summary_by_service(self) -> Dict[str, int]:
        counts: Dict[str, int] = {}
        for sample in self._samples:
            counts[sample.definition.service] = counts.get(sample.definition.service, 0) + 1
        return counts


def ensure_percent(value: float) -> float:
    """Normalises percentage values to the ``0-100`` range."""
    if value > 1 and value <= 100:
        return value
    return value * 100


__all__ = [
    "MetricDefinition",
    "MetricRegistry",
    "MetricSample",
    "ensure_percent",
]
