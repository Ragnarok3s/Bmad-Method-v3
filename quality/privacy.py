"""Rotinas de privacidade alinhadas ao plano MVP."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Dict, Iterable, List

import logging

import yaml

SYNTHETIC_EMAIL_DOMAIN = "example.test"
MASK_TOKEN = "***"

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class PrivacyControl:
    """Representa um controle de privacidade para fins de evidência."""

    module: str
    requirement: str
    status: str
    evidence: str


def mask_personal_identifiers(record: Dict[str, str]) -> Dict[str, str]:
    """Retorna uma cópia da entrada com identificadores pessoais mascarados."""

    masked = record.copy()
    for field in ("document", "passport", "tax_id"):
        if field in masked and masked[field]:
            masked[field] = MASK_TOKEN + masked[field][-4:]
    if "email" in masked and masked["email"]:
        local_part = masked["email"].split("@")[0]
        masked["email"] = f"{local_part}@{SYNTHETIC_EMAIL_DOMAIN}"
    return masked


def is_record_synthetic(record: Dict[str, str]) -> bool:
    """Valida se um registro utiliza dados sintéticos conforme a estratégia."""

    email = record.get("email", "")
    if SYNTHETIC_EMAIL_DOMAIN not in email:
        return False
    for key in ("document", "passport", "tax_id"):
        value = record.get(key)
        if value and not value.startswith(MASK_TOKEN):
            return False
    return True


def enforce_retention_policy(
    records: Iterable[Dict[str, str]],
    retention_days: int,
    reference: date | None = None,
) -> List[Dict[str, str]]:
    """Remove registros cuja retenção expirou."""

    if retention_days <= 0:
        raise ValueError("retention_days deve ser positivo")

    cutoff = (reference or date.today()) - timedelta(days=retention_days)
    sanitized: List[Dict[str, str]] = []
    for record in records:
        created_at = record.get("created_at")
        if not created_at:
            continue
        try:
            created_date = datetime.strptime(created_at, "%Y-%m-%d").date()
        except (TypeError, ValueError):
            logger.warning("Registro descartado devido a created_at inválido: %s", created_at)
            continue
        if created_date >= cutoff:
            sanitized.append(record)
    return sanitized


def build_privacy_matrix(path: Path) -> List[PrivacyControl]:
    """Carrega evidências de privacidade para alimentar dashboards e gates."""

    raw = yaml.safe_load(path.read_text(encoding="utf-8"))
    if raw is None:
        raw = {}
    if not isinstance(raw, dict):
        raise ValueError("o arquivo de privacidade deve conter um mapeamento YAML")

    entries = raw.get("controles", [])
    if not isinstance(entries, list):
        raise ValueError("o campo 'controles' deve ser uma lista")

    controls: List[PrivacyControl] = []
    required_fields = {"modulo", "requisito", "status", "evidencia"}
    for entry in entries:
        if not isinstance(entry, dict):
            raise ValueError("cada controle deve ser um mapeamento YAML")

        missing_fields = required_fields.difference(entry)
        if missing_fields:
            missing = ", ".join(sorted(missing_fields))
            raise ValueError(f"controle incompleto: faltam campos {missing}")

        controls.append(
            PrivacyControl(
                module=entry["modulo"],
                requirement=entry["requisito"],
                status=entry["status"],
                evidence=entry["evidencia"],
            )
        )
    return controls
