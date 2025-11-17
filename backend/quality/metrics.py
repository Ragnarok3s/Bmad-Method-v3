"""Funções auxiliares para consolidar métricas de qualidade."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable, List


@dataclass(frozen=True)
class QualitySnapshot:
    """Representa um snapshot de métricas de qualidade em um instante de tempo."""

    build_id: str
    coverage: float
    failed_tests: int
    blocking_bugs: int

    def is_healthy(self) -> bool:
        """Retorna ``True`` se o snapshot atende aos critérios mínimos de saúde."""

        return self.coverage >= 0.75 and self.failed_tests == 0 and self.blocking_bugs == 0


def calculate_error_budget(target_slo: float, actual_slo: float) -> float:
    """Calcula o budget restante em relação a um SLO."""

    if not 0 <= target_slo <= 1:
        raise ValueError("target_slo deve estar entre 0 e 1")
    if not 0 <= actual_slo <= 1:
        raise ValueError("actual_slo deve estar entre 0 e 1")
    return max(0.0, target_slo - actual_slo)


def summarize_coverage_trend(snapshots: Iterable[QualitySnapshot]) -> List[str]:
    """Gera um sumário textual da evolução de cobertura."""

    history = list(snapshots)
    if not history:
        return ["Nenhum dado de cobertura disponível."]

    def _snapshot_order(snapshot: QualitySnapshot) -> tuple[int, int | str]:
        """Define uma chave de ordenação cronológica para snapshots."""

        build_id = snapshot.build_id
        try:
            numeric = int(build_id)
        except (TypeError, ValueError):
            return (1, build_id)
        return (0, numeric)

    ordered = sorted(history, key=_snapshot_order)
    summaries: List[str] = []
    for current, previous in zip(ordered, [None, *ordered[:-1]]):
        if previous is None:
            summaries.append(
                f"Build {current.build_id}: cobertura inicial em {current.coverage:.1%}."
            )
            continue
        delta = current.coverage - previous.coverage
        trend = "subiu" if delta > 0 else "manteve" if delta == 0 else "caiu"
        summaries.append(
            f"Build {current.build_id}: cobertura {trend} {delta:+.1%} (agora {current.coverage:.1%})."
        )
    return summaries
