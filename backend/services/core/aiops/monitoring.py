"""Monitorização contínua de drift e precisão dos modelos AIOps."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable

from ..observability import record_critical_alert


@dataclass(slots=True)
class DriftReport:
    metric: str
    drift_score: float
    threshold: float
    drift_detected: bool


@dataclass(slots=True)
class PrecisionReport:
    metric: str
    precision: float
    recall: float
    min_precision: float
    min_recall: float
    passed: bool


class AIOpsPerformanceMonitor:
    """Avalia drift estatístico e precisão operacional gerando alertas dedicados."""

    def __init__(self) -> None:
        self.drift_history: list[DriftReport] = []
        self.precision_history: list[PrecisionReport] = []

    def evaluate_drift(
        self,
        *,
        metric: str,
        baseline: Iterable[float],
        current: Iterable[float],
        threshold: float = 0.2,
    ) -> DriftReport:
        baseline_values = list(baseline)
        current_values = list(current)
        if not baseline_values or not current_values:
            raise ValueError("Listas de referência e atual não podem ser vazias.")
        baseline_avg = sum(baseline_values) / len(baseline_values)
        current_avg = sum(current_values) / len(current_values)
        denom = abs(baseline_avg) or 1.0
        drift_score = abs(current_avg - baseline_avg) / denom
        drift_detected = drift_score >= threshold
        report = DriftReport(
            metric=metric,
            drift_score=drift_score,
            threshold=threshold,
            drift_detected=drift_detected,
        )
        self.drift_history.append(report)
        if drift_detected:
            record_critical_alert(
                "aiops_drift_detected",
                detail=f"Drift detectado para {metric}",
                context={"drift_score": f"{drift_score:.3f}", "threshold": f"{threshold:.3f}"},
                severity="warning",
            )
        return report

    def evaluate_precision(
        self,
        *,
        metric: str,
        predicted_positive: Iterable[bool],
        actual_positive: Iterable[bool],
        min_precision: float = 0.75,
        min_recall: float = 0.6,
    ) -> PrecisionReport:
        predicted = list(predicted_positive)
        actual = list(actual_positive)
        if len(predicted) != len(actual):
            raise ValueError("Listas de predições e valores reais devem ter o mesmo tamanho.")
        if not predicted:
            raise ValueError("É necessário fornecer ao menos uma observação.")
        true_positives = sum(1 for p, a in zip(predicted, actual) if p and a)
        false_positives = sum(1 for p, a in zip(predicted, actual) if p and not a)
        false_negatives = sum(1 for p, a in zip(predicted, actual) if not p and a)
        precision = true_positives / (true_positives + false_positives) if (true_positives + false_positives) else 0.0
        recall = true_positives / (true_positives + false_negatives) if (true_positives + false_negatives) else 0.0
        passed = precision >= min_precision and recall >= min_recall
        report = PrecisionReport(
            metric=metric,
            precision=precision,
            recall=recall,
            min_precision=min_precision,
            min_recall=min_recall,
            passed=passed,
        )
        self.precision_history.append(report)
        if not passed:
            record_critical_alert(
                "aiops_precision_alert",
                detail=f"Precisão abaixo do esperado para {metric}",
                context={
                    "precision": f"{precision:.3f}",
                    "recall": f"{recall:.3f}",
                    "min_precision": f"{min_precision:.3f}",
                    "min_recall": f"{min_recall:.3f}",
                },
            )
        return report
