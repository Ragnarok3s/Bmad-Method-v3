#!/usr/bin/env python3
"""Ferramentas FinOps para rollback automatizado e tagging de custos.

O script centraliza validações do ledger de releases e orquestra integrações
com Terraform para garantir que ambientes tenham rollback e tags consistentes.
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Tuple

REPO_ROOT = Path(__file__).resolve().parents[2]
LEDGER_PATH = REPO_ROOT / "releases" / "ledger.json"
ARTIFACTS_DIR = REPO_ROOT / "artifacts" / "finops"
DEFAULT_TERRAFORM_DIR = REPO_ROOT / "platform" / "iac" / "terraform"


def _load_ledger() -> Dict[str, Any]:
    if not LEDGER_PATH.exists():
        return {"releases": {}}
    with LEDGER_PATH.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def _save_ledger(payload: Dict[str, Any]) -> None:
    LEDGER_PATH.parent.mkdir(parents=True, exist_ok=True)
    with LEDGER_PATH.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2, sort_keys=True)


def _write_artifact(name: str, payload: Dict[str, Any]) -> Path:
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    artifact = ARTIFACTS_DIR / f"{name}-{timestamp}.json"
    with artifact.open("w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2, sort_keys=True)
    return artifact


def _run_terraform(terraform_dir: Path, action: str, variables: Dict[str, Any], dry_run: bool = False) -> None:
    if dry_run:
        return

    if not terraform_dir.exists():
        raise FileNotFoundError(f"Diretório Terraform não encontrado: {terraform_dir}")

    env = os.environ.copy()
    env.setdefault("TF_IN_AUTOMATION", "1")

    var_args = []
    for key, value in variables.items():
        var_args.extend(["-var", f"{key}={value}"])

    cmd = [
        "terraform",
        "-chdir",
        str(terraform_dir),
        "apply" if action == "apply" else "plan",
        "-auto-approve",
        *var_args,
    ]
    subprocess.run(cmd, check=True, env=env)


def _validate_release(
    ledger: Dict[str, Any], environment: str, release: str | None
) -> Tuple[str, Dict[str, Any]]:
    releases = ledger.setdefault("releases", {})
    env_releases = releases.get(environment)
    if not env_releases:
        raise SystemExit(f"Nenhum release registrado para o ambiente {environment!r}")

    if release:
        payload = env_releases.get(release)
        if not payload:
            raise SystemExit(f"Release {release!r} não encontrado no ambiente {environment!r}")
        return release, payload

    for key, info in env_releases.items():
        if info.get("active"):
            return key, info

    raise SystemExit(f"Nenhum release ativo encontrado para {environment!r}")


def command_record_release(args: argparse.Namespace) -> None:
    ledger = _load_ledger()
    releases = ledger.setdefault("releases", {})
    env_releases = releases.setdefault(args.environment, {})

    if args.active:
        for info in env_releases.values():
            info["active"] = False

    env_releases[args.release] = {
        "artifact": args.artifact,
        "active": args.active,
        "created_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "tags": args.tags or {},
    }
    _save_ledger(ledger)
    artifact_path = _write_artifact("release-record", {"environment": args.environment, "release": args.release})
    print(f"Release registrado em {LEDGER_PATH} (artefato: {artifact_path})")


def command_rollback(args: argparse.Namespace) -> None:
    ledger = _load_ledger()
    release_key, release_info = _validate_release(ledger, args.environment, args.release)

    variables = {
        "environment": args.environment,
        "release": args.release or release_key,
        "finops_mode": "rollback",
    }
    _run_terraform(args.terraform_dir, "apply", variables, dry_run=args.dry_run)

    payload = {
        "action": "rollback",
        "environment": args.environment,
        "release": variables["release"],
        "status": "scheduled" if args.dry_run else "applied",
    }
    artifact = _write_artifact("rollback", payload)
    print(f"Rollback registrado ({artifact})")


def command_tag(args: argparse.Namespace) -> None:
    ledger = _load_ledger()
    release_key, release_info = _validate_release(ledger, args.environment, args.release)

    tags = release_info.setdefault("tags", {})
    tags.update({
        "owner": args.owner,
        "cost_center": args.cost_center,
        "ticket": args.ticket,
    })
    _save_ledger(ledger)

    variables = {
        "environment": args.environment,
        "release": args.release or release_key,
        "finops_mode": "tagging",
        "owner": args.owner,
        "cost_center": args.cost_center,
    }
    _run_terraform(args.terraform_dir, "apply", variables, dry_run=args.dry_run)

    payload = {
        "action": "tagging",
        "environment": args.environment,
        "release": variables["release"],
        "tags": tags,
        "status": "scheduled" if args.dry_run else "applied",
    }
    artifact = _write_artifact("tagging", payload)
    print(f"Tagging atualizado ({artifact})")


def command_validate(args: argparse.Namespace) -> None:
    ledger = _load_ledger()
    release_key, release_info = _validate_release(ledger, args.environment, args.release)

    tags = release_info.get("tags", {})
    missing_tags = [key for key in ("owner", "cost_center") if not tags.get(key)]
    if missing_tags:
        raise SystemExit(f"Tags obrigatórias ausentes: {', '.join(missing_tags)}")

    if not release_info.get("artifact"):
        raise SystemExit("Artifact hash não registrado para o release ativo")

    variables = {
        "environment": args.environment,
        "release": args.release or release_key,
        "finops_mode": "validate",
    }
    _run_terraform(args.terraform_dir, "plan", variables, dry_run=args.dry_run)

    artifact = _write_artifact("validation", {"environment": args.environment, "status": "ok"})
    print(f"Validação concluída ({artifact})")


def _build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Automação de rollback e tagging FinOps")
    parser.add_argument("--terraform-dir", type=Path, default=DEFAULT_TERRAFORM_DIR,
                        help="Diretório com os manifests Terraform")

    subparsers = parser.add_subparsers(dest="command", required=True)

    record = subparsers.add_parser("record-release", help="Registrar release no ledger")
    record.add_argument("--environment", required=True)
    record.add_argument("--release", required=True)
    record.add_argument("--artifact", required=True)
    record.add_argument("--active", action="store_true", default=False)
    record.add_argument("--tags", type=json.loads, default=None, help="JSON com tags iniciais")
    record.set_defaults(func=command_record_release)

    rollback = subparsers.add_parser("rollback", help="Executar rollback automatizado")
    rollback.add_argument("--environment", required=True)
    rollback.add_argument("--release", required=False)
    rollback.add_argument("--dry-run", action="store_true", help="Executa sem aplicar mudanças reais")
    rollback.set_defaults(func=command_rollback)

    tag = subparsers.add_parser("tag", help="Registrar tags de FinOps")
    tag.add_argument("--environment", required=True)
    tag.add_argument("--release", required=False)
    tag.add_argument("--owner", required=True)
    tag.add_argument("--cost-center", required=True)
    tag.add_argument("--ticket", required=True)
    tag.add_argument("--dry-run", action="store_true", help="Executa sem aplicar mudanças reais")
    tag.set_defaults(func=command_tag)

    validate = subparsers.add_parser("validate", help="Validar guardrails FinOps")
    validate.add_argument("--environment", required=True)
    validate.add_argument("--release", required=False)
    validate.add_argument("--dry-run", action="store_true", help="Executa sem aplicar mudanças reais")
    validate.set_defaults(func=command_validate)

    return parser


def main(argv: list[str] | None = None) -> None:
    parser = _build_parser()
    args = parser.parse_args(argv)
    args.func(args)


if __name__ == "__main__":  # pragma: no cover
    try:
        main()
    except FileNotFoundError as exc:
        print(str(exc), file=sys.stderr)
        sys.exit(1)
    except subprocess.CalledProcessError as exc:
        print(f"Falha ao executar comando: {exc}", file=sys.stderr)
        sys.exit(exc.returncode)
