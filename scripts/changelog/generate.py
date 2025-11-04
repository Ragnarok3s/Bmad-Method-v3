#!/usr/bin/env python3
"""Generate changelog entries grouped by Conventional Commit type."""
from __future__ import annotations

import argparse
import datetime as dt
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Sequence

SECTIONS = {
    "feat": "Features",
    "fix": "Fixes",
    "perf": "Performance",
    "refactor": "Refactors",
    "docs": "Documentation",
    "test": "Tests",
    "chore": "Chores",
}
DEFAULT_SECTION = "Outros"


@dataclass
class Commit:
    sha: str
    subject: str
    scope: str | None
    summary: str
    type: str


class GitRunner:
    def __init__(self, cwd: Path | None = None) -> None:
        self.cwd = cwd

    def run(self, *args: str) -> str:
        result = subprocess.run(
            ["git", *args],
            cwd=self.cwd,
            check=True,
            capture_output=True,
            text=True,
        )
        return result.stdout.strip()


def _resolve_from_ref(runner: GitRunner, to_ref: str) -> str:
    try:
        latest_tag = runner.run("describe", "--tags", "--abbrev=0", f"{to_ref}^")
        return latest_tag
    except subprocess.CalledProcessError:
        first_commit = runner.run("rev-list", "--max-parents=0", to_ref)
        return first_commit.splitlines()[0]


def _short_sha(runner: GitRunner, ref: str) -> str:
    return runner.run("rev-parse", "--short", ref)


def _parse_commit(raw: str) -> Commit:
    sha, subject = raw.split("::", 1)
    parsed_type = DEFAULT_SECTION
    scope = None
    summary = subject

    if ":" in subject:
        type_and_scope, summary = subject.split(":", 1)
        summary = summary.strip()
        stripped = type_and_scope.rstrip("!")
        if "(" in stripped and stripped.endswith(")"):
            commit_type, scope = stripped[:-1].split("(", 1)
        else:
            commit_type = stripped
        parsed_type = commit_type

    return Commit(sha=sha, subject=subject, scope=scope, summary=summary or subject, type=parsed_type)


def _group_commits(commits: Sequence[Commit]) -> Dict[str, List[Commit]]:
    grouped: Dict[str, List[Commit]] = {title: [] for title in SECTIONS.values()}
    grouped[DEFAULT_SECTION] = []

    for commit in commits:
        section = SECTIONS.get(commit.type, None)
        if section is None:
            section = DEFAULT_SECTION
        grouped.setdefault(section, []).append(commit)
    return grouped


def _format_commit(commit: Commit) -> str:
    label = commit.summary
    if commit.scope:
        label = f"{commit.scope}: {label}"
    return f"- {label} ({commit.sha})"


def _render_sections(grouped: Dict[str, List[Commit]]) -> str:
    lines: List[str] = []
    for section, commits in grouped.items():
        lines.append(f"### {section}")
        if not commits:
            lines.append(" - _Sem entradas_")
        else:
            for commit in commits:
                lines.append(_format_commit(commit))
        lines.append("")
    return "\n".join(lines).strip()


def build_changelog(commits: Sequence[Commit], header: str) -> str:
    grouped = _group_commits(commits)
    sections = _render_sections(grouped)
    return f"{header}\n\n{sections}\n"


def load_commits(runner: GitRunner, from_ref: str, to_ref: str) -> List[Commit]:
    raw_commits = runner.run("log", "--pretty=format:%H::%s", f"{from_ref}..{to_ref}")
    if not raw_commits:
        return []
    commits = [_parse_commit(line) for line in raw_commits.splitlines() if line]
    return commits


def parse_args(argv: Sequence[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--from-ref", help="Reference/tag to start the changelog range")
    parser.add_argument("--to-ref", default="HEAD", help="Reference/tag to end the changelog range")
    parser.add_argument("--output", type=Path, help="File to write the changelog to", default=Path("CHANGELOG.md"))
    parser.add_argument("--append", action="store_true", help="Append to the output file instead of overwriting")
    parser.add_argument("--auto-range", action="store_true", help="Automatically detect the from ref using the last tag")
    parser.add_argument("--dry-run", action="store_true", help="Print to stdout instead of writing to disk")
    return parser.parse_args(argv)


def main(argv: Sequence[str] | None = None) -> int:
    args = parse_args(argv)
    runner = GitRunner()

    to_ref = args.to_ref
    from_ref = args.from_ref or ( _resolve_from_ref(runner, to_ref) if args.auto_range else None)
    if not from_ref:
        print("--from-ref is required when --auto-range is not provided", file=sys.stderr)
        return 2

    try:
        runner.run("rev-parse", "--verify", from_ref)
        runner.run("rev-parse", "--verify", to_ref)
    except subprocess.CalledProcessError as exc:
        print(f"Invalid git reference: {exc}", file=sys.stderr)
        return 2

    commits = load_commits(runner, from_ref, to_ref)
    if not commits:
        print(f"No commits found between {from_ref} and {to_ref}")
        return 0

    header = f"## {_short_sha(runner, to_ref)} - {dt.datetime.utcnow().date()}"
    changelog = build_changelog(commits, header)

    if args.dry_run:
        print(changelog)
        return 0

    if args.append and args.output.exists():
        existing = args.output.read_text(encoding="utf-8")
        content = f"{existing.rstrip()}\n\n{changelog}"
    else:
        content = changelog

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(content, encoding="utf-8")
    print(f"Changelog written to {args.output} for range {from_ref}..{to_ref}")
    return 0


if __name__ == "__main__":  # pragma: no cover
    sys.exit(main())
