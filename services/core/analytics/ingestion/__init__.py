"""Pipelines de ingestão para streaming Kafka e persistência Delta."""

from .kafka import KafkaMessage, KafkaStreamConfig, KafkaStream
from .delta import DeltaLakeConfig, DeltaLakeWriter, DeltaWriteResult
from .pipeline import StreamingIngestionPipeline, StreamingIngestionResult

__all__ = [
    "KafkaMessage",
    "KafkaStreamConfig",
    "KafkaStream",
    "DeltaLakeConfig",
    "DeltaLakeWriter",
    "DeltaWriteResult",
    "StreamingIngestionPipeline",
    "StreamingIngestionResult",
]
