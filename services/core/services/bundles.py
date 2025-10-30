from __future__ import annotations

from datetime import datetime, timedelta, timezone
from math import ceil, floor
from typing import ClassVar, Iterable, Literal

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..analytics import KafkaStream
from ..domain.models import (
    BundleUsageEventLog,
    BundleUsageFact,
    BundleUsageGranularity,
)
from ..domain.schemas import (
    BundleUsageCollection,
    BundleUsageDataPoint,
    BundleUsageStatistics,
    BundleUsageTotals,
)
from ..metrics import record_bundle_activation


def _quantile(samples: Iterable[float], percentile: float) -> float | None:
    data = sorted(float(value) for value in samples if value is not None)
    if not data:
        return None
    if percentile <= 0:
        return data[0]
    if percentile >= 1:
        return data[-1]
    position = (len(data) - 1) * percentile
    lower = floor(position)
    upper = ceil(position)
    if lower == upper:
        return data[int(position)]
    weight = position - lower
    return data[lower] * (1 - weight) + data[upper] * weight


def _normalize_timestamp(value: datetime | str | None) -> datetime:
    if isinstance(value, datetime):
        timestamp = value
    elif isinstance(value, str) and value:
        try:
            timestamp = datetime.fromisoformat(value)
        except ValueError:
            timestamp = datetime.now(timezone.utc)
    else:
        timestamp = datetime.now(timezone.utc)
    if timestamp.tzinfo is None:
        timestamp = timestamp.replace(tzinfo=timezone.utc)
    return timestamp.astimezone(timezone.utc)


class BundleUsageService:
    """Agregação e consulta de métricas de utilização de bundles."""

    _stream: ClassVar[KafkaStream | None] = None

    def __init__(self, session: Session) -> None:
        self.session = session

    @classmethod
    def attach_stream(cls, stream: KafkaStream | None) -> None:
        """Configura o consumidor Kafka utilizado pelo serviço."""

        cls._stream = stream

    @classmethod
    def get_stream(cls) -> KafkaStream | None:
        return cls._stream

    def list_usage(
        self,
        *,
        bundle_id: str | None = None,
        workspace_slug: str | None = None,
        granularity: BundleUsageGranularity | None = None,
        limit: int = 90,
        window_start: datetime | None = None,
        window_end: datetime | None = None,
        window_days: int | None = None,
    ) -> BundleUsageCollection:
        self._ingest_from_stream()

        statement = select(BundleUsageFact).order_by(BundleUsageFact.period_start.desc())

        if bundle_id:
            statement = statement.where(BundleUsageFact.bundle_id == bundle_id)
        if workspace_slug is not None:
            statement = statement.where(BundleUsageFact.workspace_slug == workspace_slug)
        if granularity:
            statement = statement.where(BundleUsageFact.granularity == granularity)

        now = datetime.now(timezone.utc)
        if window_days and window_days > 0:
            computed_start = now - timedelta(days=window_days)
            window_start = max(window_start, computed_start) if window_start else computed_start
            window_end = window_end or now
        if window_start:
            statement = statement.where(BundleUsageFact.period_start >= window_start)
        if window_end:
            statement = statement.where(BundleUsageFact.period_start <= window_end)

        if limit:
            statement = statement.limit(max(1, limit))

        records = list(self.session.execute(statement).scalars())

        aggregated_samples: list[float] = []
        items: list[BundleUsageDataPoint] = []
        for fact in records:
            period_samples = list(fact.lead_time_samples or [])
            aggregated_samples.extend(period_samples)
            conversion = (fact.launch_count / fact.view_count) if fact.view_count else 0.0
            items.append(
                BundleUsageDataPoint(
                    bundle_id=fact.bundle_id,
                    bundle_type=fact.bundle_type,
                    workspace_slug=fact.workspace_slug,
                    period_start=fact.period_start,
                    granularity=fact.granularity,
                    view_count=fact.view_count,
                    launch_count=fact.launch_count,
                    last_event_at=fact.last_event_at,
                    lead_time_seconds_p50=_quantile(period_samples, 0.5),
                    lead_time_seconds_p90=_quantile(period_samples, 0.9),
                    conversion_rate=conversion,
                )
            )

        totals = BundleUsageTotals(
            view_count=sum(item.view_count for item in items),
            launch_count=sum(item.launch_count for item in items),
        )

        stats = BundleUsageStatistics(
            conversion_rate=(totals.launch_count / totals.view_count) if totals.view_count else 0.0,
            lead_time_seconds_p50=_quantile(aggregated_samples, 0.5),
            lead_time_seconds_p90=_quantile(aggregated_samples, 0.9),
            sample_size=len(aggregated_samples),
        )

        return BundleUsageCollection(
            items=items,
            totals=totals,
            stats=stats,
            generated_at=now,
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
        event_id: str | None = None,
    ) -> None:
        """Aplica um evento de bundle directamente na agregação local."""

        timestamp = _normalize_timestamp(occurred_at)
        event_identifier = event_id or f"manual:{bundle_id}:{event}:{timestamp.timestamp()}"
        self._apply_event(
            bundle_id=bundle_id,
            bundle_type=bundle_type,
            event=event,
            workspace_slug=workspace_slug,
            occurred_at=timestamp,
            lead_time_seconds=lead_time_seconds,
            event_id=event_identifier,
            partition=-1,
            offset=-1,
        )
        self.session.flush()

    def _ingest_from_stream(self) -> None:
        stream = self.get_stream()
        if not stream:
            return

        batch = list(stream)
        if not batch:
            return

        offsets: dict[int, int] = {}
        for message in batch:
            payload = message.value or {}
            event_type = payload.get("event")
            if event_type not in {"bundle_view", "bundle_launch"}:
                continue

            bundle_id = payload.get("bundle_id")
            bundle_type = payload.get("bundle_type")
            workspace_slug = payload.get("workspace_slug") or payload.get("workspace")
            event_id = payload.get("event_id") or f"{message.partition}:{message.offset}"
            if not bundle_id or not bundle_type:
                continue

            if self.session.get(BundleUsageEventLog, event_id):
                offsets[message.partition] = max(
                    offsets.get(message.partition, message.offset), message.offset
                )
                continue

            occurred_at = _normalize_timestamp(payload.get("occurred_at"))
            lead_time_seconds = payload.get("lead_time_seconds")
            if isinstance(lead_time_seconds, str) and lead_time_seconds:
                try:
                    lead_time_seconds = float(lead_time_seconds)
                except ValueError:
                    lead_time_seconds = None

            self._apply_event(
                bundle_id=bundle_id,
                bundle_type=bundle_type,
                event="launch" if event_type == "bundle_launch" else "view",
                workspace_slug=workspace_slug,
                occurred_at=occurred_at,
                lead_time_seconds=lead_time_seconds,
                event_id=event_id,
                partition=message.partition,
                offset=message.offset,
            )

            offsets[message.partition] = max(
                offsets.get(message.partition, message.offset), message.offset
            )

        self.session.flush()
        if offsets:
            stream.commit(offsets)

    def _apply_event(
        self,
        *,
        bundle_id: str,
        bundle_type: str,
        event: Literal["view", "launch"],
        workspace_slug: str | None,
        occurred_at: datetime,
        lead_time_seconds: float | None,
        event_id: str,
        partition: int,
        offset: int,
    ) -> None:
        day_start = occurred_at.replace(hour=0, minute=0, second=0, microsecond=0)
        week_start = day_start - timedelta(days=day_start.weekday())

        for granularity, period_start in (
            (BundleUsageGranularity.DAILY, day_start),
            (BundleUsageGranularity.WEEKLY, week_start),
        ):
            fact = self._get_or_create_fact(
                workspace_slug=workspace_slug,
                bundle_id=bundle_id,
                bundle_type=bundle_type,
                granularity=granularity,
                period_start=period_start,
            )
            if event == "view":
                fact.view_count += 1
            else:
                fact.launch_count += 1
                if lead_time_seconds is not None:
                    samples = list(fact.lead_time_samples or [])
                    samples.append(float(lead_time_seconds))
                    fact.lead_time_samples = samples
                    fact.lead_time_p50_seconds = _quantile(samples, 0.5)
                    fact.lead_time_p90_seconds = _quantile(samples, 0.9)
            if fact.last_event_at:
                fact.last_event_at = max(_normalize_timestamp(fact.last_event_at), occurred_at)
            else:
                fact.last_event_at = occurred_at

        if event == "launch":
            record_bundle_activation(
                bundle_id,
                workspace_slug=workspace_slug,
                lead_time_hours=(lead_time_seconds / 3600) if lead_time_seconds is not None else None,
                source="bundle_launch",
            )

        self.session.add(
            BundleUsageEventLog(
                event_id=event_id,
                workspace_slug=workspace_slug,
                bundle_id=bundle_id,
                bundle_type=bundle_type,
                partition=partition,
                offset=offset,
                event_type="launch" if event == "launch" else "view",
                occurred_at=occurred_at,
            )
        )

    def _get_or_create_fact(
        self,
        *,
        workspace_slug: str | None,
        bundle_id: str,
        bundle_type: str,
        granularity: BundleUsageGranularity,
        period_start: datetime,
    ) -> BundleUsageFact:
        fact = (
            self.session.execute(
                select(BundleUsageFact)
                .where(BundleUsageFact.workspace_slug == workspace_slug)
                .where(BundleUsageFact.bundle_id == bundle_id)
                .where(BundleUsageFact.granularity == granularity)
                .where(BundleUsageFact.period_start == period_start)
            ).scalar_one_or_none()
        )
        if fact is None:
            fact = BundleUsageFact(
                workspace_slug=workspace_slug,
                bundle_id=bundle_id,
                bundle_type=bundle_type,
                period_start=period_start,
                granularity=granularity,
                view_count=0,
                launch_count=0,
                lead_time_samples=[],
            )
            self.session.add(fact)
        return fact
