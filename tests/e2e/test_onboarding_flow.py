from __future__ import annotations

from typing import Dict

import pytest

from quality.onboarding import run_onboarding_quality_flow


@pytest.mark.e2e
def test_onboarding_flow_quality_gates() -> None:
    guest: Dict[str, str] = {
        "guest_id": "GUEST-099",
        "name": "Marta Pilot",
        "email": "marta@invalid-domain.dev",
        "document": "123456789",
        "created_at": "2024-07-18",
    }
    property_profile = {
        "code": "PROP-ALPHA",
        "consent_log_enabled": True,
        "consent_tool": "one-trust",
        "audit_trail": "enabled",
    }

    execution = run_onboarding_quality_flow(guest, property_profile)

    assert execution["masked_guest"]["email"].endswith("@example.test")
    statuses = {gate.name: gate.status for gate in execution["quality_gates"]}
    assert statuses == {
        "privacy-synthetic-data": "passed",
        "consent-logging": "passed",
        "audit-trail": "passed",
    }
