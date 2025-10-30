from __future__ import annotations

from fastapi.testclient import TestClient

from services.core.config import CoreSettings, TenantSettings
from services.core.main import build_application


def build_client(tmp_path) -> TestClient:
    settings = CoreSettings(
        database_url=f"sqlite:///{tmp_path}/bundle-usage.db",
        tenancy=TenantSettings(platform_token="platform-secret"),
    )
    app = build_application(settings)
    return TestClient(app, headers={"x-tenant-slug": settings.tenancy.default_slug})


def test_bundle_usage_endpoint_returns_data(tmp_path) -> None:
    client = build_client(tmp_path)

    response = client.get("/bundles/usage")
    assert response.status_code == 200

    payload = response.json()
    assert isinstance(payload.get("items"), list)
    assert payload["totals"]["view_count"] >= payload["totals"]["launch_count"]
    assert payload["items"], "expected bundle usage metrics to be seeded"

    first_item = payload["items"][0]
    assert "bundle_id" in first_item
    assert first_item["granularity"] in {"daily", "weekly"}

    scoped_workspaces = {item["workspace_slug"] for item in payload["items"] if item["workspace_slug"]}
    if scoped_workspaces:
        workspace_slug = next(iter(scoped_workspaces))
        filtered = client.get(
            "/bundles/usage",
            params={"workspace": workspace_slug, "granularity": "daily", "limit": 5},
        )
        assert filtered.status_code == 200
        filtered_body = filtered.json()
        assert all(entry["workspace_slug"] == workspace_slug for entry in filtered_body["items"])
        assert all(entry["granularity"] == "daily" for entry in filtered_body["items"])
