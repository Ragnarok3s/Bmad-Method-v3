from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Dict, Iterable, List, MutableMapping, Protocol, Sequence

from sqlalchemy import select
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
        self._datasets: MutableMapping[str, List[object]] = {}

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
        return self._datasets.get(source_name, [])

    def sync(self, session: Session) -> list[AnalyticsIngestionResult]:
        results: list[AnalyticsIngestionResult] = []
        for name, source in self._sources.items():
            state = session.get(AnalyticsSyncState, name)
            since = state.last_ingested_at if state else None
            records = list(source.load(session, since))
            latest_cursor: datetime | None = None
            if records:
                latest_cursor = max(source.cursor(record) for record in records)
                buffer = self._datasets.setdefault(name, [])
                buffer.extend(records)
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

    def cached_state(self) -> Dict[str, datetime | None]:
        return {
            name: max((source.cursor(record) for record in records), default=None)
            for name, records in self._datasets.items()
            for source in [self._sources[name]]
        }

    def reset(self) -> None:
        self._datasets.clear()


# Pipeline padrão reutilizado pelos serviços.
PIPELINE = IncrementalAnalyticsPipeline.default()
