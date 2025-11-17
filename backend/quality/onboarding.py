"""Fluxos simplificados para validar gates ponta a ponta do MVP."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List

from .privacy import is_record_synthetic, mask_personal_identifiers


@dataclass
class QualityGateResult:
    """Resultado de uma verificação de gate de qualidade."""

    name: str
    status: str
    details: Dict[str, str]


def run_onboarding_quality_flow(
    guest_record: Dict[str, str],
    property_profile: Dict[str, str],
) -> Dict[str, List[QualityGateResult]]:
    """Simula o fluxo E2E descrito na estratégia de testes."""

    masked_guest = mask_personal_identifiers(guest_record)
    results: List[QualityGateResult] = []

    synthetic_status = "passed" if is_record_synthetic(masked_guest) else "failed"
    results.append(
        QualityGateResult(
            name="privacy-synthetic-data",
            status=synthetic_status,
            details={"email": masked_guest.get("email", ""), "property": property_profile["code"]},
        )
    )

    consent_logged = property_profile.get("consent_log_enabled", False)
    results.append(
        QualityGateResult(
            name="consent-logging",
            status="passed" if consent_logged else "failed",
            details={"consent_tool": property_profile.get("consent_tool", "unknown")},
        )
    )

    audit_status = "passed"
    if property_profile.get("audit_trail") != "enabled":
        audit_status = "failed"
    results.append(
        QualityGateResult(
            name="audit-trail",
            status=audit_status,
            details={"audit_trail": property_profile.get("audit_trail", "disabled")},
        )
    )

    return {
        "masked_guest": masked_guest,
        "quality_gates": results,
    }
