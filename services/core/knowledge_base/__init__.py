from __future__ import annotations

from .data import ARTICLES, CATEGORIES
from .repository import KnowledgeBaseRepository, get_repository, set_default_repository

__all__ = [
    "KnowledgeBaseRepository",
    "get_repository",
    "set_default_repository",
]


def initialize_repository() -> KnowledgeBaseRepository:
    repository = KnowledgeBaseRepository(CATEGORIES, ARTICLES)
    set_default_repository(repository)
    return repository


# Inicializa repositório por padrão ao importar o módulo para garantir seeds disponíveis.
initialize_repository()
