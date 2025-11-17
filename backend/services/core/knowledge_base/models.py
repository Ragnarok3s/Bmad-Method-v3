from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Tuple


@dataclass(frozen=True)
class KnowledgeBaseCategory:
    id: str
    name: str
    description: str


@dataclass(frozen=True)
class KnowledgeBaseSnippet:
    id: str
    label: str
    content: str
    surface: str
    recommended_playbook: str | None = None


@dataclass(frozen=True)
class KnowledgeBaseArticle:
    id: str
    slug: str
    title: str
    excerpt: str
    category_id: str
    reading_time_minutes: int
    tags: Tuple[str, ...]
    updated_at: datetime
    stage: str
    content: str
    action_snippets: Tuple[KnowledgeBaseSnippet, ...] = field(default_factory=tuple)
    related_playbooks: Tuple[str, ...] = field(default_factory=tuple)
    persona: str | None = None
    use_case: str | None = None

    def matches_query(self, query: str) -> bool:
        normalized = query.lower().strip()
        if not normalized:
            return True
        haystack = ' '.join(
            [
                self.title,
                self.excerpt,
                self.content,
                ' '.join(self.tags),
                self.stage,
                self.persona or '',
                self.use_case or '',
            ]
        ).lower()
        return normalized in haystack
