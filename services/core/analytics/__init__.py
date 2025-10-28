"""Componentes de analytics e pipelines de ingestão."""

from .pipelines import (
    PIPELINE,
    IncrementalAnalyticsPipeline,
    AnalyticsSource,
    AnalyticsIngestionResult,
)

__all__ = [
    "PIPELINE",
    "IncrementalAnalyticsPipeline",
    "AnalyticsSource",
    "AnalyticsIngestionResult",
]
