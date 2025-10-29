"""Persistência e agregação de feedback supervisionado para recomendações."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session

from .domain.models import RecommendationDecision, RecommendationFeedback
from .domain.schemas import RecommendationFeedbackCreate, RecommendationFeedbackRead


@dataclass(slots=True)
class FeedbackStats:
    total: int
    approvals: int
    rejections: int
    dismissed: int

    @property
    def approval_rate(self) -> float:
        if not self.total:
            return 0.0
        return round(self.approvals / self.total, 4)


class FeedbackRepository:
    """Interface de persistência para feedback de heurísticas."""

    def __init__(self, session: Session) -> None:
        self.session = session

    def record(self, payload: RecommendationFeedbackCreate) -> RecommendationFeedback:
        feedback = RecommendationFeedback(
            recommendation_key=payload.recommendation_key,
            decision=payload.decision,
            agent_id=payload.agent_id,
            score=payload.score,
            notes=payload.notes,
            context=payload.context or {},
        )
        self.session.add(feedback)
        self.session.flush()
        return feedback

    def list_for_key(self, recommendation_key: str, *, limit: int = 20) -> list[RecommendationFeedbackRead]:
        stmt = (
            select(RecommendationFeedback)
            .where(RecommendationFeedback.recommendation_key == recommendation_key)
            .order_by(RecommendationFeedback.created_at.desc())
            .limit(limit)
        )
        results = [row[0] for row in self.session.execute(stmt).all()]
        return [RecommendationFeedbackRead.model_validate(row) for row in results]

    def aggregate(self, recommendation_key: str | None = None) -> FeedbackStats:
        stmt = select(RecommendationFeedback)
        if recommendation_key is not None:
            stmt = stmt.where(RecommendationFeedback.recommendation_key == recommendation_key)
        records = [row[0] for row in self.session.execute(stmt).all()]
        total = len(records)
        approvals = sum(1 for item in records if item.decision == RecommendationDecision.APPROVED)
        rejections = sum(1 for item in records if item.decision == RecommendationDecision.REJECTED)
        dismissed = sum(1 for item in records if item.decision == RecommendationDecision.DISMISSED)
        return FeedbackStats(total=total, approvals=approvals, rejections=rejections, dismissed=dismissed)

    def as_dict(self, stats: FeedbackStats) -> dict[str, Any]:
        return {
            "total": stats.total,
            "approvals": stats.approvals,
            "rejections": stats.rejections,
            "dismissed": stats.dismissed,
            "approval_rate": stats.approval_rate,
        }
