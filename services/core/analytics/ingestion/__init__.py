"""Utilitários mínimos de ingestão streaming baseados em Kafka em memória."""

from .kafka import KafkaMessage, KafkaStreamConfig, KafkaStream

__all__ = [
    "KafkaMessage",
    "KafkaStreamConfig",
    "KafkaStream",
]
