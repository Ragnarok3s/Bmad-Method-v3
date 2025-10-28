"""Serviço responsável por acionar execuções de playbooks."""
from __future__ import annotations

import logging
from datetime import datetime
from typing import Any
from uuid import uuid4

from sqlalchemy.orm import Session

from ..domain.playbooks import PlaybookTemplate
from ..domain.schemas import PlaybookExecutionRead


logger = logging.getLogger("bmad.core.automation")


class AutomationService:
    """Orquestra execuções de playbooks com telemetria básica."""

    def __init__(self, session: Session) -> None:
        self.session = session

    def execute(
        self,
        template: PlaybookTemplate,
        *,
        initiated_by: str | None = None,
        context: dict[str, Any] | None = None,
    ) -> PlaybookExecutionRead:
        run_id = uuid4().hex
        started_at = datetime.utcnow()
        metadata = {
            "run_id": run_id,
            "playbook_id": template.id,
            "initiated_by": initiated_by,
            "tags": template.tags,
            "context": context or {},
        }

        logger.info("playbook_execution_started", extra=metadata)

        template.execution_count += 1
        template.last_executed_at = started_at
        self.session.add(template)
        self.session.flush()

        finished_at = datetime.utcnow()
        logger.info(
            "playbook_execution_completed",
            extra={**metadata, "duration_ms": int((finished_at - started_at).total_seconds() * 1000)},
        )

        return PlaybookExecutionRead(
            run_id=run_id,
            playbook_id=template.id,
            status="completed",
            initiated_by=initiated_by,
            started_at=started_at,
            finished_at=finished_at,
            message="Execução iniciada e registrada com sucesso.",
        )
