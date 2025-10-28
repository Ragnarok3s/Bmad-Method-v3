from __future__ import annotations

import csv
import json
from pathlib import Path

from quality.privacy import is_record_synthetic

REPO_ROOT = Path(__file__).resolve().parents[2]
RELATIONAL_DATASET = REPO_ROOT / "tests" / "data" / "seed" / "guests_relational.csv"
NOSQL_DATASET = REPO_ROOT / "tests" / "data" / "seed" / "guest_preferences.json"


def test_relational_dataset_is_synthetic() -> None:
    assert RELATIONAL_DATASET.exists(), "Dataset relacional ausente"
    with RELATIONAL_DATASET.open("r", encoding="utf-8") as csv_file:
        reader = csv.DictReader(csv_file)
        rows = list(reader)
    assert rows, "Dataset relacional não deve estar vazio"
    assert all(is_record_synthetic(row) for row in rows)


def test_nosql_dataset_is_synthetic() -> None:
    assert NOSQL_DATASET.exists(), "Dataset NoSQL ausente"
    with NOSQL_DATASET.open("r", encoding="utf-8") as json_file:
        rows = json.load(json_file)
    assert isinstance(rows, list) and rows, "Dataset NoSQL deve conter itens"
    assert all(isinstance(item, dict) for item in rows)
    assert all(is_record_synthetic(item) for item in rows)
