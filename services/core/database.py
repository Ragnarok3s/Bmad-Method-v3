"""Infraestrutura de base de dados para o serviço core."""
from __future__ import annotations

from contextlib import contextmanager
from typing import Iterator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from .config import CoreSettings


class Database:
    """Encapsula o acesso ao motor de base de dados."""

    def __init__(self, settings: CoreSettings) -> None:
        self._engine = create_engine(settings.database_url, future=True)
        self._session_factory = sessionmaker(bind=self._engine, class_=Session, expire_on_commit=False)

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
    return Database(settings)
