from __future__ import annotations

import json
from datetime import datetime, timedelta, timezone

from fastapi.testclient import TestClient

import pytest

from services.core.analytics import KafkaStream, KafkaStreamConfig
from services.core.config import CoreSettings, TenantSettings
from services.core.main import build_application
from services.core.services.bundles import BundleUsageService


def build_client(tmp_path) -> tuple[TestClient, KafkaStream]:
    settings = CoreSettings(
        database_url=f"sqlite:///{tmp_path}/bundle-usage.db",
        tenancy=TenantSettings(platform_token="platform-secret"),
    )
    app = build_application(settings)

    stream_config = KafkaStreamConfig(
        bootstrap_servers="in-memory",
        topic="bundle-usage-tests",
        group_id="bundle-usage-tests",
        partitions=4,
    )
    stream = KafkaStream(stream_config)
    BundleUsageService.attach_stream(stream)

    client = TestClient(app, headers={"x-tenant-slug": settings.tenancy.default_slug})
    return client, stream


def test_bundle_usage_endpoint_returns_data(tmp_path) -> None:
    client, stream = build_client(tmp_path)

    now = datetime.now(timezone.utc)
    events = [
        {
            "event": "bundle_view",
            "event_id": "view-1",
            "bundle_id": "playbook-ai",
            "bundle_type": "revenue",
            "workspace_slug": "pilot",
            "occurred_at": (now - timedelta(minutes=45)).isoformat(),
        },
        {
            "event": "bundle_view",
            "event_id": "view-2",
            "bundle_id": "playbook-ai",
            "bundle_type": "revenue",
            "workspace_slug": "pilot",
            "occurred_at": (now - timedelta(minutes=15)).isoformat(),
        },
        {
            "event": "bundle_launch",
            "event_id": "launch-1",
            "bundle_id": "playbook-ai",
            "bundle_type": "revenue",
            "workspace_slug": "pilot",
            "occurred_at": (now - timedelta(minutes=10)).isoformat(),
            "lead_time_seconds": 1800,
        },
        {
            "event": "bundle_launch",
            "event_id": "launch-2",
            "bundle_id": "playbook-ai",
            "bundle_type": "revenue",
            "workspace_slug": "pilot",
            "occurred_at": (now - timedelta(minutes=5)).isoformat(),
            "lead_time_seconds": 5400,
        },
        {
            "event": "bundle_view",
            "event_id": "view-3",
            "bundle_id": "concierge-ai",
            "bundle_type": "guest-experience",
            "workspace_slug": "north-hub",
            "occurred_at": (now - timedelta(hours=2)).isoformat(),
        },
    ]

    stream.feed(
        (
            idx,
            json.dumps(event).encode(),
            (event["workspace_slug"] or "global").encode(),
        )
        for idx, event in enumerate(events)
    )

    window_start = (now - timedelta(days=1)).isoformat()
    response = client.get("/bundles/usage", params={"start": window_start})
    assert response.status_code == 200

    payload = response.json()
    assert isinstance(payload.get("items"), list)
    assert payload["items"], "expected bundle usage metrics to be ingested"
    assert payload["totals"]["view_count"] == 3
    assert payload["totals"]["launch_count"] == 2

    assert "stats" in payload
    assert payload["stats"]["sample_size"] == 2
    assert payload["stats"]["conversion_rate"] == pytest.approx(2 / 3, rel=1e-2)
    assert payload["stats"]["lead_time_seconds_p50"] == pytest.approx(3600, rel=1e-2)
    assert payload["stats"]["lead_time_seconds_p90"] == pytest.approx(5040, rel=1e-2)

    first_item = payload["items"][0]
    assert "bundle_id" in first_item
    assert first_item["granularity"] in {"daily", "weekly"}
    assert first_item["conversion_rate"] is not None

    filtered = client.get(
        "/bundles/usage",
        params={
            "workspace": "pilot",
            "granularity": "daily",
            "start": (now - timedelta(days=2)).isoformat(),
            "limit": 5,
        },
    )
    assert filtered.status_code == 200
    filtered_body = filtered.json()
    assert all(entry["workspace_slug"] == "pilot" for entry in filtered_body["items"])
    assert all(entry["granularity"] == "daily" for entry in filtered_body["items"])

    # Arbitrary window ensures only pilot launches contribute to quantile stats
    assert filtered_body["stats"]["sample_size"] == 2
