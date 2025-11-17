from datetime import datetime, timezone

from services.core.automation import AutomationQueue, TriggerCriteria
from services.core.config import CoreSettings
from services.core.database import Database
from services.core.domain.models import Base
from services.core.domain.playbooks import PlaybookTemplate
from services.core.recommendations import Recommendation, RecommendationSignal


def setup_database(tmp_path) -> Database:
    settings = CoreSettings(database_url=f"sqlite:///{tmp_path}/automation.db")
    database = Database(settings)
    database.create_all(Base)
    return database


def create_template(session) -> PlaybookTemplate:
    template = PlaybookTemplate(
        name="Limpeza acelerada",
        summary="Desbloqueia equipe de limpeza e notifica manutenção.",
    )
    template.tags = ["housekeeping", "prioridade"]
    template.steps = ["Confirmar status", "Acionar equipa"]
    session.add(template)
    session.flush()
    return template


def test_automation_queue_enqueues_recommendations(tmp_path) -> None:
    database = setup_database(tmp_path)
    with database.session_scope() as session:
        template = create_template(session)

        queue = AutomationQueue()
        criteria = TriggerCriteria(
            name="housekeeping_high_priority",
            predicate=lambda rec: rec.source == "housekeeping" and rec.metadata.get("reservation_id") is not None,
            minimum_score=0.75,
            metadata={"playbook": "limpeza_acelerada"},
        )
        queue.register_template(template, criteria=criteria, auto_execute=True)

        recommendation = Recommendation(
            key="reservation:501:housekeeping_backlog",
            title="Priorizar limpeza",
            summary="Check-in em 3h com tarefas bloqueadas.",
            score=0.82,
            source="housekeeping",
            created_at=datetime.now(timezone.utc),
            signals=[
                RecommendationSignal(
                    source="housekeeping",
                    description="Tarefas bloqueadas",
                    weight=0.9,
                    metadata={"task_ids": [1, 2]},
                )
            ],
            metadata={"reservation_id": 501},
        )

        enqueued = queue.evaluate([recommendation], triggered_by="engine")
        assert len(enqueued) == 1
        item = enqueued[0]
        assert item.auto_execute is True
        assert item.template_id == template.id
        assert queue.pending()[0].id == item.id

        low_score = Recommendation(
            key="reservation:777:housekeeping_backlog",
            title="Backlog moderado",
            summary="Check-in em 18h.",
            score=0.4,
            source="housekeeping",
            created_at=datetime.now(timezone.utc),
        )
        assert not queue.evaluate([low_score], triggered_by="engine")

        dequeued = queue.dequeue()
        assert dequeued is not None and dequeued.id == item.id
        assert queue.dequeue() is None
