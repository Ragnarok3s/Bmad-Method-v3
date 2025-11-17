from __future__ import annotations

import pytest

from services.core.domain.schemas import KnowledgeBaseTelemetryEvent
from services.core.services.knowledge_base import KnowledgeBaseService


def test_catalog_returns_articles_and_categories():
    service = KnowledgeBaseService()
    catalog = service.catalog(limit=5)

    assert catalog.categories, "Expected at least one category"
    assert catalog.articles, "Expected at least one article"
    first_category = catalog.categories[0]
    assert first_category.total_articles >= 0


def test_get_article_not_found():
    service = KnowledgeBaseService()
    with pytest.raises(LookupError):
        service.get_article('artigo-inexistente')


def test_register_search_event(monkeypatch):
    service = KnowledgeBaseService()
    recorded: dict[str, tuple] = {}

    def fake_search(query: str, hits: int, category: str | None) -> None:
        recorded['search'] = (query, hits, category)

    monkeypatch.setattr(
        'services.core.services.knowledge_base.record_knowledge_base_search',
        fake_search
    )

    event = KnowledgeBaseTelemetryEvent(event='search', query='tour', hits=2, surface='support_center')
    service.register_event(event)

    assert recorded['search'][0] == 'tour'
    assert recorded['search'][1] == 2


def test_register_article_view_event(monkeypatch):
    service = KnowledgeBaseService()
    recorded: dict[str, tuple] = {}

    def fake_view(article_id: str, category_id: str) -> None:
        recorded['view'] = (article_id, category_id)

    monkeypatch.setattr(
        'services.core.services.knowledge_base.record_knowledge_base_article_view',
        fake_view
    )
    monkeypatch.setattr(
        'services.core.services.knowledge_base.record_knowledge_base_article_completion',
        lambda *args, **kwargs: None
    )
    monkeypatch.setattr(
        'services.core.services.knowledge_base.record_knowledge_base_snippet',
        lambda *args, **kwargs: None
    )

    article = service.catalog(limit=1).articles[0]
    event = KnowledgeBaseTelemetryEvent(event='article_view', slug=article.slug)
    service.register_event(event)

    assert 'view' in recorded
    assert recorded['view'][0]
    assert recorded['view'][1]


def test_register_article_completion_event(monkeypatch):
    service = KnowledgeBaseService()
    recorded: dict[str, tuple] = {}

    def fake_completion(article_id: str, category_id: str, duration_seconds: float | None) -> None:
        recorded['complete'] = (article_id, category_id, duration_seconds)

    monkeypatch.setattr(
        'services.core.services.knowledge_base.record_knowledge_base_article_view',
        lambda *args, **kwargs: None
    )
    monkeypatch.setattr(
        'services.core.services.knowledge_base.record_knowledge_base_article_completion',
        fake_completion
    )
    monkeypatch.setattr(
        'services.core.services.knowledge_base.record_knowledge_base_snippet',
        lambda *args, **kwargs: None
    )

    article = service.catalog(limit=1).articles[0]
    event = KnowledgeBaseTelemetryEvent(
        event='article_complete',
        slug=article.slug,
        duration_seconds=120.0
    )
    service.register_event(event)

    assert recorded['complete'][2] == 120.0


def test_register_snippet_event(monkeypatch):
    service = KnowledgeBaseService()
    recorded: dict[str, tuple] = {}

    def fake_snippet(article_id: str, surface: str) -> None:
        recorded['snippet'] = (article_id, surface)

    monkeypatch.setattr(
        'services.core.services.knowledge_base.record_knowledge_base_article_view',
        lambda *args, **kwargs: None
    )
    monkeypatch.setattr(
        'services.core.services.knowledge_base.record_knowledge_base_article_completion',
        lambda *args, **kwargs: None
    )
    monkeypatch.setattr(
        'services.core.services.knowledge_base.record_knowledge_base_snippet',
        fake_snippet
    )

    article = service.catalog(limit=1).articles[0]
    event = KnowledgeBaseTelemetryEvent(
        event='snippet_copy',
        slug=article.slug,
        surface='support_center'
    )
    service.register_event(event)

    assert recorded['snippet'][1] == 'support_center'
