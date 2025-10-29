"""Ferramentas utilitárias para coleta e lint de evidências de compliance.

O script expõe dois subcomandos:

* ``collect`` (padrão): agrega evidências dos componentes mapeados e exporta
  relatórios JSON/Markdown para ``docs/compliance/reports``.
* ``lint``: valida se os artefatos obrigatórios existem e se a documentação
  mapeia controles críticos.

Exemplos de uso::

    python scripts/compliance/collect_evidence.py
    python scripts/compliance/collect_evidence.py collect --format both
    python scripts/compliance/collect_evidence.py lint
"""
from __future__ import annotations

import argparse
import hashlib
import json
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable, Iterator, Mapping, Sequence

BASE_DIR = Path(__file__).resolve().parents[2]
DEFAULT_OUTPUT_DIR = BASE_DIR / "docs" / "compliance" / "reports"
DEFAULT_CONTROLES = BASE_DIR / "docs" / "compliance" / "controles.md"

EVIDENCE_TARGETS: Sequence[dict[str, object]] = (
    {
        "id": "iam_access_control",
        "description": "Decisões de IAM/MFA e checkpoints de auditoria",
        "paths": [
            Path("services/core/security/__init__.py"),
            Path("services/core/security/auth.py"),
            Path("services/core/observability.py"),
        ],
    },
    {
        "id": "governance_audit_log",
        "description": "Histórico de auditoria funcional",
        "paths": [Path("docs/evidencias/compliance"), Path("docs/evidencias/security")],
        "globs": ["*.md", "*.json", "*.csv"],
    },
    {
        "id": "pipeline_controls",
        "description": "Workflows de compliance e policies lint",
        "paths": [Path(".github/workflows/compliance-checks.yml")],
    },
    {
        "id": "grafana_dashboards",
        "description": "Dashboards de conformidade e deriva de políticas",
        "paths": [Path("grafana/compliance")],
        "globs": ["*.json", "*.yaml"],
    },
)


@dataclass(slots=True)
class EvidenceFile:
    """Metadados imutáveis sobre um arquivo coletado."""

    path: Path
    exists: bool
    kind: str
    sha256: str | None
    size: int | None
    modified_at: str | None

    @classmethod
    def from_path(cls, path: Path) -> "EvidenceFile":
        absolute = (BASE_DIR / path).resolve()
        if not absolute.exists():
            return cls(path=path, exists=False, kind="missing", sha256=None, size=None, modified_at=None)
        if absolute.is_dir():
            return cls(
                path=path,
                exists=True,
                kind="directory",
                sha256=None,
                size=None,
                modified_at=_format_datetime(datetime.fromtimestamp(absolute.stat().st_mtime, timezone.utc)),
            )
        sha256 = _hash_file(absolute)
        stat = absolute.stat()
        return cls(
            path=path,
            exists=True,
            kind="file",
            sha256=sha256,
            size=stat.st_size,
            modified_at=_format_datetime(datetime.fromtimestamp(stat.st_mtime, timezone.utc)),
        )


@dataclass(slots=True)
class EvidenceRecord:
    """Coleção de arquivos relacionados a um controle."""

    control_id: str
    description: str
    files: tuple[EvidenceFile, ...]

    def to_dict(self) -> dict[str, object]:  # noqa: D401
        return {
            "control_id": self.control_id,
            "description": self.description,
            "files": [
                {
                    "path": str(file.path),
                    "exists": file.exists,
                    "kind": file.kind,
                    "sha256": file.sha256,
                    "size": file.size,
                    "modified_at": file.modified_at,
                }
                for file in self.files
            ],
        }


def _hash_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as buffer:
        for chunk in iter(lambda: buffer.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _format_datetime(value: datetime) -> str:
    return value.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


def _glob_files(base: Path, patterns: Iterable[str]) -> Iterator[Path]:
    for pattern in patterns:
        yield from base.glob(pattern)


def collect_evidence(*, output_dir: Path, fmt: str, period: str) -> Path:
    """Executa a coleta de evidências e retorna o caminho do relatório JSON."""

    ensure_directory(output_dir)
    timestamp = _format_datetime(datetime.now(timezone.utc))

    records: list[EvidenceRecord] = []
    for item in EVIDENCE_TARGETS:
        files: list[EvidenceFile] = []
        for raw_path in item.get("paths", []):  # type: ignore[arg-type]
            files.append(EvidenceFile.from_path(Path(raw_path)))
        globs = item.get("globs")
        if globs:
            for root in item.get("paths", []):  # type: ignore[arg-type]
                resolved_root = (BASE_DIR / root).resolve()
                if not resolved_root.exists() or not resolved_root.is_dir():
                    continue
                for candidate in _glob_files(resolved_root, globs):  # type: ignore[arg-type]
                    rel = candidate.relative_to(BASE_DIR)
                    files.append(EvidenceFile.from_path(rel))
        unique = {(file.path, file.kind): file for file in files}
        record = EvidenceRecord(
            control_id=str(item["id"]),
            description=str(item["description"]),
            files=tuple(sorted(unique.values(), key=lambda entry: str(entry.path))),
        )
        records.append(record)

    payload = {
        "generated_at": timestamp,
        "period": period,
        "controls": [record.to_dict() for record in records],
    }

    json_path = output_dir / f"compliance-report-{period}.json"
    json_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    if fmt in {"markdown", "both"}:
        markdown_path = output_dir / f"compliance-report-{period}.md"
        markdown_path.write_text(_to_markdown(payload), encoding="utf-8")
    if fmt in {"json", "both"}:
        return json_path
    return output_dir / f"compliance-report-{period}.md"


def lint_controles(*, controles_path: Path) -> None:
    """Valida se o documento de controles possui os elementos obrigatórios."""

    if not controles_path.exists():
        raise SystemExit(f"Documento de controles não encontrado: {controles_path}")
    content = controles_path.read_text(encoding="utf-8")
    required_sections = (
        "## SOC 2 Trust Services Criteria",
        "## ISO/IEC 27001:2022 Annex A",
        "scripts/compliance/collect_evidence.py",
        ".github/workflows/compliance-checks.yml",
    )
    missing = [section for section in required_sections if section not in content]
    if missing:
        raise SystemExit(f"Seções obrigatórias ausentes em {controles_path}: {', '.join(missing)}")
    if "register_control_checkpoint" not in content:
        raise SystemExit("Documento de controles precisa referenciar a integração de rastreabilidade")


def ensure_directory(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def _to_markdown(payload: Mapping[str, object]) -> str:
    header = [
        "# Relatório Mensal de Compliance",
        "",
        f"- Gerado em: {payload['generated_at']}",
        f"- Período: {payload['period']}",
        "",
        "| Controle | Arquivo | Existe? | Tipo | Hash | Última alteração |",
        "| --- | --- | --- | --- | --- | --- |",
    ]
    rows: list[str] = []
    for control in payload.get("controls", []):
        control_id = control.get("control_id")
        description = control.get("description")
        files = control.get("files", [])
        if not isinstance(files, list):
            continue
        for entry in files:
            if not isinstance(entry, Mapping):
                continue
            rows.append(
                "| {id} — {desc} | {path} | {exists} | {kind} | {sha} | {modified} |".format(
                    id=control_id,
                    desc=description,
                    path=entry.get("path"),
                    exists="✅" if entry.get("exists") else "❌",
                    kind=entry.get("kind"),
                    sha=entry.get("sha256") or "-",
                    modified=entry.get("modified_at") or "-",
                )
            )
    return "\n".join(header + rows) + "\n"


def parse_args(argv: Sequence[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Ferramentas de compliance")
    subparsers = parser.add_subparsers(dest="command")

    collect_parser = subparsers.add_parser("collect", help="Coleta de evidências")
    collect_parser.add_argument(
        "--output-dir",
        default=str(DEFAULT_OUTPUT_DIR),
        type=Path,
        help="Diretório para salvar relatórios",
    )
    collect_parser.add_argument(
        "--format",
        default="json",
        choices=("json", "markdown", "both"),
        help="Formato de saída desejado",
    )
    collect_parser.add_argument(
        "--period",
        default=datetime.now(timezone.utc).strftime("%Y-%m"),
        help="Período (AAAA-MM) para o relatório",
    )

    lint_parser = subparsers.add_parser("lint", help="Validação de documentação")
    lint_parser.add_argument(
        "--controles",
        default=str(DEFAULT_CONTROLES),
        type=Path,
        help="Caminho para o documento de controles",
    )

    parser.set_defaults(command="collect")
    return parser.parse_args(argv)


def main(argv: Sequence[str] | None = None) -> int:
    args = parse_args(argv)
    if args.command == "lint":
        lint_controles(controles_path=args.controles)
        print("Lint de controles executado com sucesso")
        return 0
    if args.command == "collect":
        report_path = collect_evidence(output_dir=args.output_dir, fmt=args.format, period=args.period)
        print(f"Relatório gerado em {report_path}")
        return 0
    raise SystemExit(f"Comando desconhecido: {args.command}")


if __name__ == "__main__":
    raise SystemExit(main())
