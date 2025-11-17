from __future__ import annotations

import logging
from typing import Iterable

from ..domain.schemas import (
    KnowledgeBaseArticleRead,
    KnowledgeBaseArticleSummary,
    KnowledgeBaseCatalogRead,
    KnowledgeBaseCategoryRead,
    KnowledgeBaseQueryInfo,
    KnowledgeBaseTelemetryEvent,
    KnowledgeBaseSnippetRead,
)
from ..knowledge_base import KnowledgeBaseRepository, get_repository
from ..knowledge_base.models import KnowledgeBaseArticle
from ..metrics import (
    record_knowledge_base_article_completion,
    record_knowledge_base_article_view,
    record_knowledge_base_search,
    record_knowledge_base_snippet,
)

logger = logging.getLogger("bmad.core.knowledge_base")


class KnowledgeBaseService:
    """Superfície de consulta e telemetria da base de conhecimento."""

    def __init__(self, repository: KnowledgeBaseRepository | None = None) -> None:
        self.repository = repository or get_repository()

    def catalog(
        self,
        *,
        query: str | None = None,
        category: str | None = None,
        limit: int = 12,
    ) -> KnowledgeBaseCatalogRead:
        normalized_limit = max(limit, 1)
        articles = self.repository.search(query=query, category_id=category, limit=normalized_limit)
        categories = self.repository.categories()
        counts = self.repository.category_counts()

        category_payload: list[KnowledgeBaseCategoryRead] = []
        for item in categories:
            category_payload.append(
                KnowledgeBaseCategoryRead(
                    id=item.id,
                    name=item.name,
                    description=item.description,
                    total_articles=counts.get(item.id, 0),
                    top_tags=self.repository.top_tags(category_id=item.id),
                )
            )

        summaries = [self._map_summary(article) for article in articles]
        if query is not None:
            record_knowledge_base_search(query, len(summaries), category)
            logger.info(
                "knowledge_base_search",
                extra={"query": query, "hits": len(summaries), "category": category or "all"},
            )

        return KnowledgeBaseCatalogRead(
            categories=category_payload,
            articles=summaries,
            query=KnowledgeBaseQueryInfo(term=query, total_hits=len(summaries)),
        )

    def get_article(self, slug: str) -> KnowledgeBaseArticleRead:
        article = self.repository.get_by_slug(slug)
        if not article:
            raise LookupError(f"knowledge_base_article_not_found:{slug}")
        return self._map_detail(article)

    def register_event(self, event: KnowledgeBaseTelemetryEvent) -> None:
        if event.event == "search":
            record_knowledge_base_search(event.query or "", event.hits or 0, event.surface)
            logger.info(
                "knowledge_base_telemetry_search",
                extra={
                    "query": event.query or "",
                    "hits": event.hits or 0,
                    "surface": event.surface or "unknown",
                },
            )
            return

        if event.event in {"article_view", "article_complete", "snippet_copy"}:
            article = self._require_article(event.slug)
            if event.event == "article_view":
                record_knowledge_base_article_view(article.id, article.category_id)
                logger.info(
                    "knowledge_base_article_view",
                    extra={"article_id": article.id, "category": article.category_id, "surface": event.surface},
                )
                return
            if event.event == "article_complete":
                record_knowledge_base_article_completion(
                    article.id,
                    article.category_id,
                    event.duration_seconds,
                )
                logger.info(
                    "knowledge_base_article_complete",
                    extra={
                        "article_id": article.id,
                        "category": article.category_id,
                        "duration": event.duration_seconds,
                    },
                )
                return
            if event.event == "snippet_copy":
                record_knowledge_base_snippet(article.id, event.surface or "unknown")
                logger.info(
                    "knowledge_base_snippet_usage",
                    extra={
                        "article_id": article.id,
                        "surface": event.surface or "unknown",
                    },
                )
                return

        logger.info(
            "knowledge_base_telemetry_ignored",
            extra={"event": event.event, "slug": event.slug, "surface": event.surface},
        )

    def _require_article(self, slug: str | None) -> KnowledgeBaseArticle:
        if not slug:
            raise LookupError("knowledge_base_article_missing")
        article = self.repository.get_by_slug(slug)
        if not article:
            raise LookupError(f"knowledge_base_article_not_found:{slug}")
        return article

    def _map_summary(self, article: KnowledgeBaseArticle) -> KnowledgeBaseArticleSummary:
        category = self.repository.category(article.category_id)
        snippet_preview = article.action_snippets[0].content if article.action_snippets else None
        return KnowledgeBaseArticleSummary(
            id=article.id,
            slug=article.slug,
            title=article.title,
            excerpt=article.excerpt,
            category_id=article.category_id,
            category_name=category.name if category else article.category_id,
            reading_time_minutes=article.reading_time_minutes,
            tags=list(article.tags),
            updated_at=article.updated_at,
            stage=article.stage,
            snippet_preview=snippet_preview,
        )

    def _map_detail(self, article: KnowledgeBaseArticle) -> KnowledgeBaseArticleRead:
        snippets: Iterable[KnowledgeBaseSnippetRead] = (
            KnowledgeBaseSnippetRead(
                id=snippet.id,
                label=snippet.label,
                content=snippet.content,
                surface=snippet.surface,
                recommended_playbook=snippet.recommended_playbook,
            )
            for snippet in article.action_snippets
        )
        summary = self._map_summary(article)
        return KnowledgeBaseArticleRead(
            **summary.model_dump(),
            content=article.content,
            action_snippets=list(snippets),
            related_playbooks=list(article.related_playbooks),
            persona=article.persona,
            use_case=article.use_case,
        )
