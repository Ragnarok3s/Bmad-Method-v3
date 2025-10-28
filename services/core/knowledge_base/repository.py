from __future__ import annotations

from collections import Counter
from typing import Iterable, Sequence

from .models import KnowledgeBaseArticle, KnowledgeBaseCategory


class KnowledgeBaseRepository:
    """Repositório em memória para artigos da base de conhecimento."""

    def __init__(
        self,
        categories: Sequence[KnowledgeBaseCategory],
        articles: Sequence[KnowledgeBaseArticle],
    ) -> None:
        self._categories = {category.id: category for category in categories}
        self._articles = list(articles)
        self._articles_by_slug = {article.slug: article for article in articles}
        self._articles_by_category: dict[str, list[KnowledgeBaseArticle]] = {}
        for article in articles:
            self._articles_by_category.setdefault(article.category_id, []).append(article)

        for items in self._articles_by_category.values():
            items.sort(key=lambda article: article.updated_at, reverse=True)

        self._articles.sort(key=lambda article: article.updated_at, reverse=True)

    def categories(self) -> list[KnowledgeBaseCategory]:
        return list(self._categories.values())

    def category(self, category_id: str) -> KnowledgeBaseCategory | None:
        return self._categories.get(category_id)

    def articles(self) -> list[KnowledgeBaseArticle]:
        return list(self._articles)

    def articles_by_category(self, category_id: str) -> list[KnowledgeBaseArticle]:
        return list(self._articles_by_category.get(category_id, []))

    def get_by_slug(self, slug: str) -> KnowledgeBaseArticle | None:
        return self._articles_by_slug.get(slug)

    def search(
        self,
        *,
        query: str | None = None,
        category_id: str | None = None,
        limit: int | None = None,
    ) -> list[KnowledgeBaseArticle]:
        articles: Iterable[KnowledgeBaseArticle]
        if category_id:
            articles = self._articles_by_category.get(category_id, [])
        else:
            articles = self._articles

        if query:
            filtered = [article for article in articles if article.matches_query(query)]
        else:
            filtered = list(articles)

        if limit is not None:
            return filtered[: max(limit, 0)]
        return filtered

    def top_tags(self, *, category_id: str | None = None, limit: int = 5) -> list[str]:
        articles = (
            self._articles_by_category.get(category_id, [])
            if category_id
            else self._articles
        )
        counter: Counter[str] = Counter()
        for article in articles:
            counter.update(article.tags)
        return [tag for tag, _ in counter.most_common(limit)]

    def category_counts(self) -> dict[str, int]:
        return {category_id: len(items) for category_id, items in self._articles_by_category.items()}


default_repository: KnowledgeBaseRepository | None = None


def set_default_repository(repository: KnowledgeBaseRepository) -> None:
    global default_repository
    default_repository = repository


def get_repository() -> KnowledgeBaseRepository:
    if default_repository is None:
        raise RuntimeError('Knowledge base repository não foi inicializado')
    return default_repository
