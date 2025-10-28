from datetime import date
import sys
import types

import pytest

if "yaml" not in sys.modules:
    yaml_stub = types.ModuleType("yaml")
    yaml_stub.safe_load = lambda *_args, **_kwargs: {}
    sys.modules["yaml"] = yaml_stub

from quality.privacy import enforce_retention_policy


@pytest.mark.unit
def test_enforce_retention_policy_discards_invalid_dates(caplog):
    records = [
        {"id": "valid", "created_at": "2024-01-02"},
        {"id": "invalid", "created_at": "2024-13-02"},
    ]

    with caplog.at_level("WARNING"):
        sanitized = enforce_retention_policy(
            records,
            retention_days=10,
            reference=date(2024, 1, 10),
        )

    assert sanitized == [records[0]]
    assert "created_at inválido" in caplog.text
