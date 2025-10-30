"""Orquestração entre consumo Kafka e persistência Delta Lake."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Sequence

from .delta import DeltaLakeWriter, DeltaWriteResult
from .kafka import KafkaMessage, KafkaStream


@dataclass(slots=True)
class StreamingIngestionResult:
    """Resumo de uma execução de ingestão streaming."""

    total_messages: int
    committed_offsets: dict[int, int]
    delta_result: DeltaWriteResult
    completed_at: datetime


class StreamingIngestionPipeline:
    """Pipeline mínimo que liga Kafka -> Delta."""

    def __init__(
        self,
        kafka_stream: KafkaStream,
        delta_writer: DeltaLakeWriter,
    ) -> None:
        self._stream = kafka_stream
        self._writer = delta_writer

    def run_once(self) -> StreamingIngestionResult:
        batch = list(self._stream)
        payloads = [message.value for message in batch]
        delta_result = self._writer.append(payloads)
        committed = self._commit_offsets(batch)
        return StreamingIngestionResult(
            total_messages=len(batch),
            committed_offsets=committed,
            delta_result=delta_result,
            completed_at=datetime.now(timezone.utc),
        )

    def _commit_offsets(self, batch: Sequence[KafkaMessage]) -> dict[int, int]:
        offsets: dict[int, int] = {}
        for message in batch:
            offsets[message.partition] = max(
                offsets.get(message.partition, message.offset), message.offset
            )
        if offsets:
            self._stream.commit(offsets)
        return offsets
