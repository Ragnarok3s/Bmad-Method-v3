#!/usr/bin/env python3
"""Validate compliance evidence manifests for releases."""
from __future__ import annotations

import argparse
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable, List

try:
    import tomllib  # Python 3.11+
except ModuleNotFoundError as exc:  # pragma: no cover - Python < 3.11
    raise SystemExit("Python 3.11 or newer is required to parse TOML manifests") from exc

MANDATORY_FIELDS = {"version", "date", "owner", "approvers", "tickets", "evidence"}
EVIDENCE_MANDATORY_FIELDS = {"path"}


@dataclass
class ReleaseReport:
    path: Path
    version: str = ""
    errors: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)

    @property
    def ok(self) -> bool:
        return not self.errors


def _load_manifest(path: Path) -> dict:
    with path.open("rb") as handle:
        return tomllib.load(handle)


def _validate_manifest(manifest: dict, report: ReleaseReport) -> None:
    missing = MANDATORY_FIELDS - manifest.keys()
    if missing:
        report.errors.append(f"Missing required fields: {', '.join(sorted(missing))}")
        return

    report.version = str(manifest["version"])

    for field in ("approvers", "tickets", "evidence"):
        if not isinstance(manifest[field], list) or not manifest[field]:
            report.errors.append(f"Field '{field}' must be a non-empty list")

    evidence_entries = manifest.get("evidence", [])
    for index, entry in enumerate(evidence_entries, start=1):
        if not isinstance(entry, dict):
            report.errors.append(f"Evidence entry #{index} must be a table with at least a path")
            continue
        missing_evidence_fields = EVIDENCE_MANDATORY_FIELDS - entry.keys()
        if missing_evidence_fields:
            report.errors.append(
                f"Evidence entry #{index} missing fields: {', '.join(sorted(missing_evidence_fields))}"
            )


def _validate_files(base_path: Path, manifest: dict, report: ReleaseReport) -> None:
    evidence_entries = manifest.get("evidence", [])
    for entry in evidence_entries:
        if not isinstance(entry, dict) or "path" not in entry:
            continue
        evidence_path = base_path / entry["path"]
        if not evidence_path.exists():
            report.errors.append(f"Evidence file not found: {evidence_path.relative_to(base_path)}")


def _evaluate_release(path: Path) -> ReleaseReport:
    report = ReleaseReport(path=path)
    manifest_path = path / "release.toml"
    if not manifest_path.exists():
        report.errors.append("Missing release.toml")
        return report

    try:
        manifest = _load_manifest(manifest_path)
    except tomllib.TOMLDecodeError as exc:
        report.errors.append(f"Invalid TOML: {exc}")
        return report

    _validate_manifest(manifest, report)
    if report.errors:
        return report
    _validate_files(path, manifest, report)
    return report


def _find_release_dirs(base_path: Path) -> Iterable[Path]:
    for child in sorted(base_path.iterdir()):
        if child.is_dir() and child.name.startswith("v"):
            yield child


def run_validation(base_path: Path) -> List[ReleaseReport]:
    reports = [
        _evaluate_release(path)
        for path in _find_release_dirs(base_path)
    ]
    return reports


def _print_report(reports: List[ReleaseReport]) -> None:
    if not reports:
        print("No release folders were found. Nothing to validate.")
        return

    for report in reports:
        header = f"[{report.version or report.path.name}] {report.path}" if report.version else str(report.path)
        print(header)
        if report.ok:
            print("  OK - all checks passed")
        else:
            for issue in report.errors:
                print(f"  ERROR - {issue}")
            for warning in report.warnings:
                print(f"  WARN  - {warning}")
        print()

    failed = sum(not report.ok for report in reports)
    print(f"Validated {len(reports)} releases - {failed} with errors")


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--base-path",
        type=Path,
        default=Path("docs/compliance/releases"),
        help="Directory containing release folders",
    )
    args = parser.parse_args(argv)

    if not args.base_path.exists():
        print(f"Base path {args.base_path} does not exist", file=sys.stderr)
        return 1

    reports = run_validation(args.base_path)
    _print_report(reports)
    return 0 if all(report.ok for report in reports) else 1


if __name__ == "__main__":  # pragma: no cover
    sys.exit(main())
