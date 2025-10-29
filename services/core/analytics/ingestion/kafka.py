"""Componentes utilitários para consumo de streams Kafka."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Callable, Iterable, Iterator, MutableMapping, Sequence

Deserializer = Callable[[bytes], dict]


@dataclass(slots=True)
class KafkaMessage:
    """Representa uma mensagem de analytics publicada em um tópico Kafka."""

    topic: str
    partition: int
    offset: int
    key: bytes | None
    value: dict
    timestamp: datetime = field(
        default_factory=lambda: datetime.now(timezone.utc)
    )


@dataclass(slots=True)
class KafkaStreamConfig:
    """Configuração mínima para um consumidor Kafka."""

    bootstrap_servers: str
    topic: str
    group_id: str
    auto_offset_reset: str = "latest"
    enable_auto_commit: bool = False
    batch_size: int = 500
    poll_timeout: float = 1.0


class KafkaStream:
    """Consumidor enxuto que abstrai a dependência de clientes Kafka reais."""

    def __init__(
        self,
        config: KafkaStreamConfig,
        *,
        deserializer: Deserializer | None = None,
    ) -> None:
        self._config = config
        self._deserializer = deserializer or self._default_deserializer
        self._buffer: MutableMapping[int, list[KafkaMessage]] = {}

    @property
    def topic(self) -> str:
        return self._config.topic

    def poll(self) -> Sequence[KafkaMessage]:
        """Retorna lote de mensagens disponíveis."""

        records: list[KafkaMessage] = []
        for _, partition_buffer in list(self._buffer.items()):
            while partition_buffer and len(records) < self._config.batch_size:
                records.append(partition_buffer.pop(0))
        return records

    def feed(self, payloads: Iterable[tuple[int, bytes, bytes | None]]):
        """Permite injetar mensagens (útil em testes e ambientes locais)."""

        for offset, raw_value, key in payloads:
            message = KafkaMessage(
                topic=self._config.topic,
                partition=0,
                offset=offset,
                key=key,
                value=self._deserializer(raw_value),
            )
            self._buffer.setdefault(message.partition, []).append(message)

    def __iter__(self) -> Iterator[KafkaMessage]:
        while True:
            batch = self.poll()
            if not batch:
                break
            for message in batch:
                yield message

    def commit(self, offsets: dict[int, int]) -> None:
        """Registra offsets consumidos. Neste stub, apenas valida o input."""

        for partition, offset in offsets.items():
            if partition not in self._buffer:
                self._buffer[partition] = []
            if self._buffer[partition] and self._buffer[partition][0].offset <= offset:
                self._buffer[partition] = [
                    m for m in self._buffer[partition] if m.offset > offset
                ]

    @staticmethod
    def _default_deserializer(payload: bytes) -> dict:
        import json

        return json.loads(payload)
