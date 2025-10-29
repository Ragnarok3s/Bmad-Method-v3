"""Rotinas utilitárias para escrita em Delta Lake."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Iterable, Sequence

import json


@dataclass(slots=True)
class DeltaLakeConfig:
    """Configuração para persistência dos dados ingeridos."""

    table_path: Path
    partition_columns: Sequence[str] = ()
    max_file_size_mb: int = 128


@dataclass(slots=True)
class DeltaWriteResult:
    """Informações sobre uma operação de escrita incremental."""

    table_path: Path
    records_written: int
    partitions_touched: Sequence[str]
    updated_at: datetime


class DeltaLakeWriter:
    """Grava datasets em formato Delta Lake via arquivos JSONL versionados."""

    def __init__(self, config: DeltaLakeConfig) -> None:
        self._config = config
        self._config.table_path.mkdir(parents=True, exist_ok=True)

    def append(self, records: Iterable[dict]) -> DeltaWriteResult:
        """Realiza *append* criando um arquivo JSONL com timestamp no nome."""

        batch = list(records)
        if not batch:
            return DeltaWriteResult(
                table_path=self._config.table_path,
                records_written=0,
                partitions_touched=(),
                updated_at=datetime.utcnow(),
            )

        timestamp = datetime.utcnow().strftime("%Y%m%dT%H%M%S%f")
        file_path = self._config.table_path / f"batch_{timestamp}.jsonl"
        with file_path.open("w", encoding="utf-8") as handler:
            for record in batch:
                handler.write(json.dumps(record, ensure_ascii=False))
                handler.write("\n")

        partitions = self._resolve_partitions(batch)
        return DeltaWriteResult(
            table_path=self._config.table_path,
            records_written=len(batch),
            partitions_touched=partitions,
            updated_at=datetime.utcnow(),
        )

    def _resolve_partitions(self, batch: Sequence[dict]) -> Sequence[str]:
        if not self._config.partition_columns:
            return ()
        partitions: set[str] = set()
        for record in batch:
            values = []
            for column in self._config.partition_columns:
                value = record.get(column, "__missing__")
                values.append(f"{column}={value}")
            partitions.add("/".join(values))
        return tuple(sorted(partitions))
