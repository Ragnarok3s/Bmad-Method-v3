from __future__ import annotations

import json
from datetime import date
from pathlib import Path

import pytest

from quality.privacy import (
    build_privacy_matrix,
    enforce_retention_policy,
    is_record_synthetic,
    mask_personal_identifiers,
)


DATASET_PATH = Path(__file__).resolve().parents[1] / "data" / "synthetic_guests.json"
MATRIX_PATH = Path(__file__).resolve().parents[2] / "docs" / "evidencias" / "compliance" / "privacy-readiness.yaml"


pytestmark = pytest.mark.integration


def test_synthetic_dataset_is_masked() -> None:
    dataset = json.loads(DATASET_PATH.read_text(encoding="utf-8"))
    masked_records = [mask_personal_identifiers(record) for record in dataset]

    assert all(is_record_synthetic(record) for record in masked_records)


def test_retention_policy_applies() -> None:
    dataset = json.loads(DATASET_PATH.read_text(encoding="utf-8"))
    sanitized = enforce_retention_policy(dataset, retention_days=45, reference=date(2024, 8, 1))

    assert sanitized == [dataset[1]]


def test_privacy_matrix_is_ready() -> None:
    controls = build_privacy_matrix(MATRIX_PATH)
    statuses = {control.module: control.status for control in controls}

    assert statuses["Pagamentos PCI"] == "aprovado"
    assert statuses["Reservas"] == "aprovado"
