"""Componentes de analytics e pipelines de ingestão."""

from .pipelines import (
    PIPELINE,
    IncrementalAnalyticsPipeline,
    AnalyticsSource,
    AnalyticsIngestionResult,
)
from .ingestion import (
    KafkaMessage,
    KafkaStreamConfig,
    KafkaStream,
    DeltaLakeConfig,
    DeltaLakeWriter,
    DeltaWriteResult,
    StreamingIngestionPipeline,
    StreamingIngestionResult,
)
from .query import (
    MetricSpec,
    QueryFilter,
    QueryResult,
    parse_filter_expression,
    parse_metric_expression,
    run_query,
)

__all__ = [
    "PIPELINE",
    "IncrementalAnalyticsPipeline",
    "AnalyticsSource",
    "AnalyticsIngestionResult",
    "KafkaMessage",
    "KafkaStreamConfig",
    "KafkaStream",
    "DeltaLakeConfig",
    "DeltaLakeWriter",
    "DeltaWriteResult",
    "StreamingIngestionPipeline",
    "StreamingIngestionResult",
    "QueryFilter",
    "MetricSpec",
    "QueryResult",
    "parse_filter_expression",
    "parse_metric_expression",
    "run_query",
]
