from __future__ import annotations

from datetime import datetime, timedelta, timezone, time
from typing import Literal

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from ..domain.agents import list_agent_catalog
from ..domain.models import BundleUsageGranularity, BundleUsageMetric
from ..domain.schemas import BundleUsageCollection, BundleUsageDataPoint, BundleUsageTotals
from ..metrics import record_bundle_activation


class BundleUsageService:
    """Agregação e consulta de métricas de utilização de bundles."""

    def __init__(self, session: Session) -> None:
        self.session = session

    def list_usage(
        self,
        *,
        bundle_id: str | None = None,
        workspace_slug: str | None = None,
        granularity: BundleUsageGranularity | None = None,
        limit: int = 90,
    ) -> BundleUsageCollection:
        self._seed_if_empty()

        statement = select(BundleUsageMetric).order_by(BundleUsageMetric.period_start.desc())
        if bundle_id:
            statement = statement.where(BundleUsageMetric.bundle_id == bundle_id)
        if workspace_slug is not None:
            statement = statement.where(BundleUsageMetric.workspace_slug == workspace_slug)
        if granularity:
            statement = statement.where(BundleUsageMetric.granularity == granularity)
        if limit:
            statement = statement.limit(max(1, limit))

        metrics = list(self.session.execute(statement).scalars())
        items = [
            BundleUsageDataPoint(
                bundle_id=metric.bundle_id,
                bundle_type=metric.bundle_type,
                workspace_slug=metric.workspace_slug,
                period_start=metric.period_start,
                granularity=metric.granularity,
                view_count=metric.view_count,
                launch_count=metric.launch_count,
                last_event_at=metric.last_event_at,
            )
            for metric in metrics
        ]

        totals = BundleUsageTotals(
            view_count=sum(item.view_count for item in items),
            launch_count=sum(item.launch_count for item in items),
        )

        return BundleUsageCollection(
            items=items,
            totals=totals,
            generated_at=datetime.now(timezone.utc),
        )

    def register_event(
        self,
        *,
        bundle_id: str,
        bundle_type: str,
        event: Literal["view", "launch"],
        workspace_slug: str | None = None,
        occurred_at: datetime | None = None,
        lead_time_seconds: float | None = None,
    ) -> None:
        """Atualiza os agregados quando novos eventos de bundle são registados."""

        timestamp = (occurred_at or datetime.now(timezone.utc)).astimezone(timezone.utc)
        day_start = timestamp.replace(hour=0, minute=0, second=0, microsecond=0)
        week_start = day_start - timedelta(days=day_start.weekday())

        for period_start, granularity in (
            (day_start, BundleUsageGranularity.DAILY),
            (week_start, BundleUsageGranularity.WEEKLY),
        ):
            metric = (
                self.session.execute(
                    select(BundleUsageMetric)
                    .where(BundleUsageMetric.workspace_slug == workspace_slug)
                    .where(BundleUsageMetric.bundle_id == bundle_id)
                    .where(BundleUsageMetric.granularity == granularity)
                    .where(BundleUsageMetric.period_start == period_start)
                ).scalar_one_or_none()
            )
            if metric is None:
                metric = BundleUsageMetric(
                    workspace_slug=workspace_slug,
                    bundle_id=bundle_id,
                    bundle_type=bundle_type,
                    period_start=period_start,
                    granularity=granularity,
                    view_count=0,
                    launch_count=0,
                )
                self.session.add(metric)

            if event == "view":
                metric.view_count += 1
            else:
                metric.launch_count += 1
            metric.last_event_at = timestamp

        if event == "launch":
            record_bundle_activation(
                bundle_id,
                workspace_slug=workspace_slug,
                lead_time_hours=(lead_time_seconds / 3600) if lead_time_seconds is not None else None,
                source="bundle_launch",
            )

        self.session.flush()

    def _seed_if_empty(self) -> None:
        total = self.session.execute(select(func.count(BundleUsageMetric.id))).scalar_one()
        if total and int(total) > 0:
            return

        catalog = list_agent_catalog(page=1, page_size=60).items
        today = datetime.now(timezone.utc).date()
        workspace_segments: dict[str | None, float] = {
            None: 1.0,
            "atlantic-hospitality": 0.65,
            "downtown-suites": 0.45,
        }

        for agent in catalog:
            base = 30 + abs(hash(agent.slug)) % 40
            for workspace_slug, factor in workspace_segments.items():
                scaled_base = max(6, int(base * factor))
                for day_offset in range(7):
                    day = today - timedelta(days=day_offset)
                    period_start = datetime.combine(day, time.min, timezone.utc)
                    decay = max(1, scaled_base - day_offset * max(1, int(3 * factor)))
                    launches = max(1, int(decay * 0.35))
                    metric = BundleUsageMetric(
                        workspace_slug=workspace_slug,
                        bundle_id=agent.slug,
                        bundle_type=agent.role,
                        period_start=period_start,
                        granularity=BundleUsageGranularity.DAILY,
                        view_count=decay,
                        launch_count=min(decay, launches),
                        last_event_at=datetime.combine(day, time(hour=18), timezone.utc),
                    )
                    self.session.add(metric)

                for week_offset in range(4):
                    week_start_date = today - timedelta(days=today.weekday()) - timedelta(weeks=week_offset)
                    period_start = datetime.combine(week_start_date, time.min, timezone.utc)
                    weekly_views = max(12, int(scaled_base * (1.6 - 0.2 * week_offset)))
                    weekly_launches = max(2, int(weekly_views * 0.32))
                    metric = BundleUsageMetric(
                        workspace_slug=workspace_slug,
                        bundle_id=agent.slug,
                        bundle_type=agent.role,
                        period_start=period_start,
                        granularity=BundleUsageGranularity.WEEKLY,
                        view_count=weekly_views,
                        launch_count=min(weekly_views, weekly_launches),
                        last_event_at=datetime.combine(
                            week_start_date + timedelta(days=4),
                            time(hour=17, minute=30),
                            timezone.utc,
                        ),
                    )
                    self.session.add(metric)

        self.session.flush()
