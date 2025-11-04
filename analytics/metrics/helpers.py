"""Helper utilities shared across service collectors."""
from __future__ import annotations

from datetime import datetime
from typing import Iterable, Mapping, Sequence

from .base import MetricDefinition, MetricRegistry

Measurement = Mapping[str, object]
MeasurementSet = Mapping[str, Sequence[Measurement]]


def _parse_timestamp(raw: object) -> datetime | None:
    if isinstance(raw, datetime):
        return raw
    if isinstance(raw, str):
        try:
            return datetime.fromisoformat(raw)
        except ValueError:
            return None
    return None


def emit_measurements(
    registry: MetricRegistry,
    definitions: Iterable[MetricDefinition],
    measurements: MeasurementSet,
) -> None:
    """Emit measurements for the provided definitions.

    Parameters
    ----------
    registry:
        Destination registry receiving the samples.
    definitions:
        Metric definitions to emit.
    measurements:
        Mapping keyed by metric name. Each entry is a sequence of dictionaries
        containing a ``value`` field and optional ``labels`` and ``timestamp``
        keys.
    """

    for definition in definitions:
        datapoints = measurements.get(definition.name, ())
        for data in datapoints:
            value = float(data.get("value", 0))
            labels = data.get("labels") or {}
            if not isinstance(labels, Mapping):
                raise TypeError(f"labels for {definition.name} must be a mapping")
            timestamp = _parse_timestamp(data.get("timestamp"))
            registry.record(definition, value, labels=dict(labels), timestamp=timestamp)


__all__ = ["Measurement", "MeasurementSet", "emit_measurements"]
