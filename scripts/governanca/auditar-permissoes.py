#!/usr/bin/env python3.14
"""Rotina mensal de auditoria de permissões cruzando API /agents e planilha de RH."""
from __future__ import annotations

import argparse
import csv
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable

import requests


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Auditoria de permissões vs. cadastro de RH")
    parser.add_argument(
        "--api-url",
        default="http://localhost:8000/agents?registry=true",
        help="Endpoint da API de agentes (por padrão consulta o registry com registry=true)",
    )
    parser.add_argument(
        "--planilha",
        required=True,
        help="Caminho para planilha CSV exportada pelo RH contendo colunas email, role e status",
    )
    parser.add_argument(
        "--output",
        help="Arquivo para salvar o relatório consolidado (formato inferido por extensão .json ou .csv)",
    )
    parser.add_argument(
        "--format",
        choices=["text", "json"],
        default="text",
        help="Formato do relatório impresso no stdout",
    )
    parser.add_argument(
        "--ignore-inactive",
        action="store_true",
        help="Ignora inconsistências de status ativo/inativo, útil para auditorias exploratórias",
    )
    return parser.parse_args()


def fetch_agents(api_url: str) -> list[dict[str, Any]]:
    response = requests.get(api_url, timeout=30)
    response.raise_for_status()
    payload = response.json()

    if isinstance(payload, list):
        candidates = payload
    elif isinstance(payload, dict) and isinstance(payload.get("items"), list):
        # fallback para o catálogo público /agents sem registry=true
        candidates = payload["items"]
    else:
        raise RuntimeError("Formato inesperado de resposta da API /agents")

    agents: list[dict[str, Any]] = []
    for entry in candidates:
        if "email" in entry:
            email = str(entry.get("email", "")).strip().lower()
        else:
            # catálogo público não expõe e-mail, usa slug como identificador para alerta
            email = f"{entry.get('slug', 'desconhecido')}@catalogo"
        if not email:
            continue
        agents.append(
            {
                "id": entry.get("id"),
                "name": entry.get("name"),
                "email": email,
                "role": str(entry.get("role", "")).strip(),
                "active": bool(entry.get("active", True)),
            }
        )
    return agents


def read_hr_sheet(path: str | Path) -> list[dict[str, Any]]:
    resolved = Path(path)
    if not resolved.exists():
        raise FileNotFoundError(f"Planilha não encontrada: {resolved}")

    with resolved.open("r", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        rows = []
        for row in reader:
            normalized = {key.strip().lower(): value for key, value in row.items() if key}
            email = str(normalized.get("email", "")).strip().lower()
            role = str(normalized.get("role") or normalized.get("papel") or "").strip()
            status_value = normalized.get("status") or normalized.get("ativo") or ""
            rows.append(
                {
                    "email": email,
                    "role": role,
                    "status": status_value,
                    "active": to_bool(status_value),
                }
            )
    return rows


def to_bool(value: Any) -> bool:
    if isinstance(value, bool):
        return value
    text = str(value or "").strip().lower()
    return text in {"ativo", "active", "1", "true", "sim", "yes"}


def audit_permissions(
    hr_rows: Iterable[dict[str, Any]],
    api_agents: Iterable[dict[str, Any]],
    *,
    ignore_inactive: bool,
) -> dict[str, Any]:
    api_index = {agent["email"]: agent for agent in api_agents}
    hr_index = {row["email"]: row for row in hr_rows if row["email"]}

    missing_in_api: list[dict[str, Any]] = []
    role_mismatches: list[dict[str, Any]] = []
    status_mismatches: list[dict[str, Any]] = []

    for email, hr_entry in hr_index.items():
        api_entry = api_index.get(email)
        if not api_entry:
            missing_in_api.append({"email": email, "expected_role": hr_entry["role"]})
            continue
        if hr_entry["role"] and api_entry.get("role") and hr_entry["role"] != api_entry["role"]:
            role_mismatches.append(
                {
                    "email": email,
                    "hr_role": hr_entry["role"],
                    "api_role": api_entry["role"],
                }
            )
        if not ignore_inactive and hr_entry["active"] != bool(api_entry.get("active", True)):
            status_mismatches.append(
                {
                    "email": email,
                    "hr_active": hr_entry["active"],
                    "api_active": bool(api_entry.get("active", True)),
                }
            )

    unexpected_agents = [
        {
            "email": email,
            "role": agent.get("role"),
            "active": agent.get("active", True),
        }
        for email, agent in api_index.items()
        if email not in hr_index and agent.get("active", True)
    ]

    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "total_hr_records": len(hr_index),
        "total_api_agents": len(api_index),
        "missing_in_api": missing_in_api,
        "role_mismatches": role_mismatches,
        "status_mismatches": status_mismatches,
        "unexpected_agents": unexpected_agents,
        "violations": bool(
            missing_in_api or role_mismatches or (status_mismatches and not ignore_inactive)
        ),
    }


def format_text(report: dict[str, Any]) -> str:
    lines = [
        "# Auditoria de Permissões",
        f"Gerado em: {report['generated_at']}",
        f"Registos RH avaliados: {report['total_hr_records']}",
        f"Agentes na API: {report['total_api_agents']}",
        "",
    ]
    if report["missing_in_api"]:
        lines.append("## Ausentes na API")
        for item in report["missing_in_api"]:
            lines.append(f"- {item['email']} (esperado papel {item['expected_role']})")
        lines.append("")
    if report["role_mismatches"]:
        lines.append("## Divergência de papéis")
        for item in report["role_mismatches"]:
            lines.append(
                f"- {item['email']}: RH={item['hr_role']} / API={item['api_role']}"
            )
        lines.append("")
    if report["status_mismatches"]:
        lines.append("## Divergência de status ativo")
        for item in report["status_mismatches"]:
            lines.append(
                f"- {item['email']}: RH={'ativo' if item['hr_active'] else 'inativo'} / "
                f"API={'ativo' if item['api_active'] else 'inativo'}"
            )
        lines.append("")
    if report["unexpected_agents"]:
        lines.append("## Agentes ativos não mapeados pelo RH")
        for item in report["unexpected_agents"]:
            lines.append(f"- {item['email']} ({item.get('role') or 'sem papel definido'})")
        lines.append("")
    if not report["violations"]:
        lines.append("Nenhuma divergência encontrada. ✅")
    return "\n".join(lines)


def write_output(path: Path, report: dict[str, Any]) -> None:
    if path.suffix.lower() == ".json":
        path.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
        return
    if path.suffix.lower() == ".csv":
        fieldnames = ["email", "tipo", "detalhe"]
        with path.open("w", newline="", encoding="utf-8") as handle:
            writer = csv.DictWriter(handle, fieldnames=fieldnames)
            writer.writeheader()
            for item in report["missing_in_api"]:
                writer.writerow(
                    {
                        "email": item["email"],
                        "tipo": "ausente_api",
                        "detalhe": item.get("expected_role", ""),
                    }
                )
            for item in report["role_mismatches"]:
                writer.writerow(
                    {
                        "email": item["email"],
                        "tipo": "papel_divergente",
                        "detalhe": f"rh={item['hr_role']} api={item['api_role']}",
                    }
                )
            for item in report["status_mismatches"]:
                writer.writerow(
                    {
                        "email": item["email"],
                        "tipo": "status_divergente",
                        "detalhe": f"rh={item['hr_active']} api={item['api_active']}",
                    }
                )
            for item in report["unexpected_agents"]:
                writer.writerow(
                    {
                        "email": item["email"],
                        "tipo": "nao_mapeado_rh",
                        "detalhe": item.get("role", ""),
                    }
                )
        return
    path.write_text(format_text(report), encoding="utf-8")


def main() -> int:
    args = parse_args()
    try:
        hr_rows = read_hr_sheet(args.planilha)
    except FileNotFoundError as exc:
        print(str(exc))
        return 1
    except csv.Error as exc:
        print(f"Erro ao ler planilha: {exc}")
        return 1

    try:
        api_agents = fetch_agents(args.api_url)
    except Exception as exc:  # noqa: BLE001
        print(f"Falha ao consultar API: {exc}")
        return 1

    report = audit_permissions(hr_rows, api_agents, ignore_inactive=args.ignore_inactive)

    if args.output:
        write_output(Path(args.output), report)

    if args.format == "json":
        print(json.dumps(report, indent=2, ensure_ascii=False))
    else:
        print(format_text(report))

    return 0 if not report["violations"] else 2


if __name__ == "__main__":
    raise SystemExit(main())
