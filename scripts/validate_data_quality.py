#!/usr/bin/env python3
"""Executa validações de qualidade de dados com Great Expectations."""

from __future__ import annotations

import json
from pathlib import Path

import pandas as pd
from great_expectations.dataset import PandasDataset

ROOT = Path(__file__).resolve().parent.parent
ARTIFACT_DIR = ROOT / "artifacts" / "data-quality"
DATASET_PATH = ROOT / "analytics" / "dbt" / "seeds" / "bronze_reservations_raw.csv"


class BronzeReservationsDataset(PandasDataset):
    class Meta:
        expectation_suite_name = "bronze_reservations_suite"


def run_expectations() -> dict:
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    dataframe = pd.read_csv(DATASET_PATH, parse_dates=["booked_at"])
    dataset = BronzeReservationsDataset(dataframe)

    dataset.expect_column_values_to_not_be_null("reservation_id")
    dataset.expect_column_values_to_be_unique("reservation_id")
    dataset.expect_column_values_to_be_in_set(
        "status", ["booked", "cancelled", "completed"]
    )
    dataset.expect_column_values_to_not_be_null("check_in")
    dataset.expect_column_values_to_not_be_null("check_out")
    dataset.expect_column_values_to_not_be_null("revenue")
    dataset.expect_column_values_to_be_between(
        "revenue", min_value=0, max_value=None
    )

    result = dataset.validate()
    artifact = ARTIFACT_DIR / "bronze_reservations_suite.json"
    artifact.write_text(json.dumps(result, indent=2, default=str), encoding="utf-8")
    return result


def main() -> int:
    result = run_expectations()
    return 0 if result.get("success") else 1


if __name__ == "__main__":
    raise SystemExit(main())
