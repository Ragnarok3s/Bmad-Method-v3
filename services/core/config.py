"""Configurações principais para o serviço core."""
from __future__ import annotations

from dataclasses import dataclass
from typing import List


def _split(value: str | None) -> List[str]:
    if not value:
        return []
    return [item.strip() for item in value.split(",") if item.strip()]


@dataclass(slots=True)
class CoreSettings:
    """Agrupa as configurações necessárias para a API core."""

    database_url: str = "sqlite:///./core.db"
    allowed_origins: List[str] | None = None
    enable_graphql: bool = True

    @classmethod
    def from_environ(cls, environ: dict[str, str]) -> "CoreSettings":
        """Cria configurações a partir de variáveis de ambiente."""

        return cls(
            database_url=environ.get("CORE_DATABASE_URL", "sqlite:///./core.db"),
            allowed_origins=_split(environ.get("CORE_ALLOWED_ORIGINS")),
            enable_graphql=environ.get("CORE_ENABLE_GRAPHQL", "true").lower() in {"1", "true", "yes"},
        )
