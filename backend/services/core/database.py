"""Infraestrutura de base de dados para o serviço core."""
from __future__ import annotations

from contextlib import contextmanager
from typing import Iterator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor

from .config import CoreSettings, ObservabilitySettings

_INSTRUMENTED_ENGINES: set[int] = set()


class Database:
    """Encapsula o acesso ao motor de base de dados."""

    def __init__(
        self,
        settings: CoreSettings,
        observability: ObservabilitySettings | None = None,
    ) -> None:
        self._engine = create_engine(settings.database_url, future=True)
        self._session_factory = sessionmaker(bind=self._engine, class_=Session, expire_on_commit=False)
        if observability and observability.enable_traces:
            engine_id = id(self._engine)
            if engine_id not in _INSTRUMENTED_ENGINES:
                SQLAlchemyInstrumentor().instrument(engine=self._engine)
                _INSTRUMENTED_ENGINES.add(engine_id)

    @property
    def session_factory(self) -> sessionmaker[Session]:  # type: ignore[type-arg]
        return self._session_factory

    def create_all(self, base) -> None:
        base.metadata.create_all(self._engine)

    @contextmanager
    def session_scope(self) -> Iterator[Session]:
        session = self._session_factory()
        try:
            yield session
            session.commit()
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()


def get_database(settings: CoreSettings | None = None) -> Database:
    """Factory para instanciar o Database com configurações default."""

    settings = settings or CoreSettings()
    return Database(settings, settings.observability)
