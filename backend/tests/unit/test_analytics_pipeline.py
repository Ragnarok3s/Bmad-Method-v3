from datetime import datetime, timedelta, timezone

from sqlalchemy import select

from services.core.analytics import IncrementalAnalyticsPipeline
from services.core.config import CoreSettings
from services.core.database import Database
from services.core.domain.models import (
    AnalyticsSyncState,
    Base,
    ExperienceSurveyResponse,
    ExperienceSurveyTouchpoint,
)


def setup_database(db_url: str) -> Database:
  settings = CoreSettings(database_url=db_url)
  database = Database(settings)
  database.create_all(Base)
  return database


def test_incremental_pipeline_accumulates_new_records(tmp_path) -> None:
  database = setup_database(f"sqlite:///{tmp_path}/analytics_pipeline.db")
  initial = datetime.now(timezone.utc)

  with database.session_scope() as session:
    session.add_all(
      [
        ExperienceSurveyResponse(
          touchpoint=ExperienceSurveyTouchpoint.OPERATIONS,
          score=10,
          submitted_at=initial - timedelta(hours=2),
        ),
        ExperienceSurveyResponse(
          touchpoint=ExperienceSurveyTouchpoint.SUPPORT,
          score=7,
          submitted_at=initial - timedelta(hours=1),
        ),
      ]
    )

  pipeline = IncrementalAnalyticsPipeline.default()

  with database.session_scope() as session:
    results = pipeline.sync(session)
    nps_result = next(item for item in results if item.source == 'nps_responses')
    assert len(nps_result.records) == 2
    assert len(pipeline.dataset('nps_responses')) == 2

    session.add(
      ExperienceSurveyResponse(
        touchpoint=ExperienceSurveyTouchpoint.ONBOARDING,
        score=9,
        submitted_at=initial + timedelta(minutes=5),
      )
    )

  with database.session_scope() as session:
    results = pipeline.sync(session)
    nps_result = next(item for item in results if item.source == 'nps_responses')
    assert len(nps_result.records) == 1
    assert len(pipeline.dataset('nps_responses')) == 3

    state = session.execute(
      select(AnalyticsSyncState.last_ingested_at).where(AnalyticsSyncState.source == 'nps_responses')
    ).scalar_one()
    assert state is not None
