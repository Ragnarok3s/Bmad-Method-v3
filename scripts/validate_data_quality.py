#!/usr/bin/env python3.14
"""Executa validações de qualidade de dados para os seeds de reservas."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
ARTIFACT_DIR = ROOT / "artifacts" / "data-quality"
DATASET_PATH = ROOT / "analytics" / "dbt" / "seeds" / "bronze_reservations_raw.csv"


def _format_check(name: str, success: bool, details: str | None = None) -> dict[str, Any]:
    payload: dict[str, Any] = {"name": name, "success": success}
    if details:
        payload["details"] = details
    return payload


def run_expectations() -> dict[str, Any]:
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    dataframe = pd.read_csv(DATASET_PATH, parse_dates=["booked_at"])

    checks: list[dict[str, Any]] = []

    reservation_id = dataframe["reservation_id"]
    checks.append(
        _format_check(
            "reservation_id_not_null",
            reservation_id.notna().all(),
            None if reservation_id.notna().all() else "Valores nulos detectados",
        )
    )
    checks.append(
        _format_check(
            "reservation_id_unique",
            reservation_id.is_unique,
            None if reservation_id.is_unique else "IDs duplicados encontrados",
        )
    )

    expected_status = {"booked", "cancelled", "completed"}
    invalid_status = set(dataframe["status"].dropna().unique()) - expected_status
    checks.append(
        _format_check(
            "status_in_allowed_set",
            not invalid_status,
            None if not invalid_status else f"Status inválidos: {sorted(invalid_status)}",
        )
    )

    for column in ("check_in", "check_out", "revenue"):
        series = dataframe[column]
        checks.append(
            _format_check(
                f"{column}_not_null",
                series.notna().all(),
                None if series.notna().all() else f"Valores nulos detectados em {column}",
            )
        )

    revenue = dataframe["revenue"].dropna()
    negative_revenue = revenue[revenue < 0]
    checks.append(
        _format_check(
            "revenue_non_negative",
            negative_revenue.empty,
            None
            if negative_revenue.empty
            else f"Receitas negativas detectadas: {negative_revenue.values.tolist()[:5]}",
        )
    )

    success = all(check["success"] for check in checks)
    result = {"success": success, "checks": checks}
    artifact = ARTIFACT_DIR / "bronze_reservations_suite.json"
    artifact.write_text(json.dumps(result, indent=2, default=str), encoding="utf-8")
    return result


def main() -> int:
    result = run_expectations()
    return 0 if result.get("success") else 1


if __name__ == "__main__":
    raise SystemExit(main())
