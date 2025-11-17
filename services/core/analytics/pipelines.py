from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Any, Iterable, MutableMapping, Protocol, Sequence

from sqlalchemy import inspect as sa_inspect, select
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import InstrumentedAttribute

from ..domain.models import (
    AnalyticsSyncState,
    ExperienceSurveyResponse,
    HousekeepingTask,
    OTASyncQueue,
    PartnerSLA,
    Reservation,
)


@dataclass(slots=True)
class AnalyticsIngestionResult:
    """Resultado de uma execução incremental de um *source*."""

    source: str
    records: Sequence[object]
    latest_cursor: datetime | None


class AnalyticsSource(Protocol):
    """Fonte de dados que pode ser ingerida incrementalmente."""

    name: str

    def load(self, session: Session, since: datetime | None) -> Iterable[object]:
        """Carrega registros atualizados após ``since`` (ou todos)."""

    def cursor(self, record: object) -> datetime:
        """Retorna o cursor temporal para o registro."""


class SQLAlchemySource:
    """Fonte que usa um modelo SQLAlchemy com coluna temporal como cursor."""

    def __init__(
        self,
        name: str,
        model: type,
        cursor_column: InstrumentedAttribute[datetime],
    ) -> None:
        self.name = name
        self._model = model
        self._cursor_column = cursor_column

    def load(self, session: Session, since: datetime | None) -> Iterable[object]:
        stmt = select(self._model)
        if since is not None:
            stmt = stmt.where(self._cursor_column > since)
        stmt = stmt.order_by(self._cursor_column.asc())
        return list(session.execute(stmt).scalars())

    def cursor(self, record: object) -> datetime:
        return getattr(record, self._cursor_column.key)


class IncrementalAnalyticsPipeline:
    """Orquestra a ingestão incremental das fontes analíticas."""

    def __init__(self, sources: Sequence[AnalyticsSource]) -> None:
        self._sources = {source.name: source for source in sources}
        self._datasets: MutableMapping[str, dict[tuple[Any, ...], object]] = {}

    @classmethod
    def default(cls) -> "IncrementalAnalyticsPipeline":
        return cls(
            [
                SQLAlchemySource(
                    "nps_responses",
                    ExperienceSurveyResponse,
                    ExperienceSurveyResponse.submitted_at,
                ),
                SQLAlchemySource(
                    "reservations",
                    Reservation,
                    Reservation.created_at,
                ),
                SQLAlchemySource(
                    "housekeeping_tasks",
                    HousekeepingTask,
                    HousekeepingTask.created_at,
                ),
                SQLAlchemySource(
                    "ota_sync_queue",
                    OTASyncQueue,
                    OTASyncQueue.updated_at,
                ),
                SQLAlchemySource(
                    "partner_slas",
                    PartnerSLA,
                    PartnerSLA.updated_at,
                ),
            ]
        )

    def dataset(self, source_name: str) -> Sequence[object]:
        records = self._datasets.get(source_name)
        if not records:
            return ()
        return tuple(records.values())

    def sync(self, session: Session) -> list[AnalyticsIngestionResult]:
        results: list[AnalyticsIngestionResult] = []
        for name, source in self._sources.items():
            state = session.get(AnalyticsSyncState, name)
            since = state.last_ingested_at if state else None
            records = list(source.load(session, since))
            latest_cursor: datetime | None = None
            if records:
                latest_cursor = max(source.cursor(record) for record in records)
                buffer = self._datasets.setdefault(name, {})
                for record in records:
                    identity = sa_inspect(record).identity
                    if identity is None:
                        primary_key = getattr(record, "id", None)
                        identity = (primary_key,) if primary_key is not None else (id(record),)
                    buffer[identity] = record
                if state is None:
                    state = AnalyticsSyncState(source=name)
                state.last_ingested_at = latest_cursor
                session.add(state)
            results.append(
                AnalyticsIngestionResult(
                    source=name,
                    records=records,
                    latest_cursor=latest_cursor,
                )
            )
        return results


# Pipeline padrão reutilizado pelos serviços.
PIPELINE = IncrementalAnalyticsPipeline.default()
