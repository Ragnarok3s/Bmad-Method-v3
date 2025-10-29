"""Fila e critérios dinâmicos para execuções automáticas de playbooks."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Callable, Iterable
from uuid import uuid4

from .domain.playbooks import PlaybookTemplate
from .recommendations import Recommendation

AutomationPredicate = Callable[[Recommendation], bool]


@dataclass(slots=True)
class TriggerCriteria:
    """Conjunto de critérios configuráveis para disparar um playbook."""

    name: str
    predicate: AutomationPredicate
    minimum_score: float = 0.0
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass(slots=True)
class RegisteredTemplate:
    template: PlaybookTemplate
    criteria: TriggerCriteria
    auto_execute: bool = False


@dataclass(slots=True)
class AutomationQueueItem:
    """Item pronto para execução automática ou revisão humana."""

    id: str
    template_id: int
    recommendation_key: str
    created_at: datetime
    score: float
    triggered_by: str
    payload: dict[str, Any] = field(default_factory=dict)
    auto_execute: bool = False


class AutomationQueue:
    """Gerencia o ciclo de vida de execuções automáticas disparadas por recomendações."""

    def __init__(self) -> None:
        self._registry: dict[str, RegisteredTemplate] = {}
        self._queue: list[AutomationQueueItem] = []

    def register_template(
        self,
        template: PlaybookTemplate,
        *,
        criteria: TriggerCriteria,
        auto_execute: bool = False,
    ) -> None:
        key = f"{template.id}:{criteria.name}"
        self._registry[key] = RegisteredTemplate(template=template, criteria=criteria, auto_execute=auto_execute)

    def evaluate(
        self,
        recommendations: Iterable[Recommendation],
        *,
        triggered_by: str,
    ) -> list[AutomationQueueItem]:
        enqueued: list[AutomationQueueItem] = []
        for recommendation in recommendations:
            for binding in self._registry.values():
                if recommendation.score < binding.criteria.minimum_score:
                    continue
                if not binding.criteria.predicate(recommendation):
                    continue
                item = AutomationQueueItem(
                    id=uuid4().hex,
                    template_id=binding.template.id,
                    recommendation_key=recommendation.key,
                    created_at=datetime.now(timezone.utc),
                    score=recommendation.score,
                    triggered_by=triggered_by,
                    payload={
                        "template_summary": binding.template.summary,
                        "recommendation": recommendation.metadata,
                        "criteria": binding.criteria.metadata,
                    },
                    auto_execute=binding.auto_execute,
                )
                self._queue.append(item)
                enqueued.append(item)
        return enqueued

    def dequeue(self) -> AutomationQueueItem | None:
        if not self._queue:
            return None
        return self._queue.pop(0)

    def pending(self) -> list[AutomationQueueItem]:
        return list(self._queue)

    def clear(self) -> None:
        self._queue.clear()

    def registered_templates(self) -> list[RegisteredTemplate]:
        return list(self._registry.values())
