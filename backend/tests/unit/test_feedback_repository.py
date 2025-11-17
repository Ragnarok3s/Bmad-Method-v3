from services.core.config import CoreSettings
from services.core.database import Database
from services.core.domain.models import Base, RecommendationDecision
from services.core.domain.schemas import RecommendationFeedbackCreate
from services.core.feedback import FeedbackRepository


def setup_database(tmp_path) -> Database:
    settings = CoreSettings(database_url=f"sqlite:///{tmp_path}/feedback.db")
    database = Database(settings)
    database.create_all(Base)
    return database


def test_feedback_repository_persists_and_aggregates(tmp_path) -> None:
    database = setup_database(tmp_path)

    with database.session_scope() as session:
        repository = FeedbackRepository(session)
        created = repository.record(
            RecommendationFeedbackCreate(
                recommendation_key="reservation:1:housekeeping_backlog",
                decision=RecommendationDecision.APPROVED,
                agent_id=12,
                score=0.9,
                notes="Execução automática confirmada",
                context={"playbook_run": "abc123"},
            )
        )
        assert created.id is not None

        repository.record(
            RecommendationFeedbackCreate(
                recommendation_key="reservation:1:housekeeping_backlog",
                decision=RecommendationDecision.REJECTED,
                agent_id=13,
                score=0.2,
                notes="Hóspede cancelou",
            )
        )

        history = repository.list_for_key("reservation:1:housekeeping_backlog")
        assert len(history) == 2
        assert history[0].decision in {
            RecommendationDecision.APPROVED,
            RecommendationDecision.REJECTED,
        }

        stats = repository.aggregate("reservation:1:housekeeping_backlog")
        assert stats.total == 2
        assert stats.approvals == 1
        assert stats.rejections == 1
        assert stats.dismissed == 0
        assert repository.as_dict(stats)["approval_rate"] == 0.5

    with database.session_scope() as session:
        repository = FeedbackRepository(session)
        stats = repository.aggregate()
        assert stats.total == 2
