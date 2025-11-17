"""Treino de modelos para deteção de anomalias AIOps."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from statistics import mean, pstdev
from typing import Iterable

from .repository import ModelArtifact, ModelRegistry


@dataclass(slots=True)
class AIOpsHistoricalObservation:
    """Representa uma amostra agregada proveniente do lakehouse."""

    timestamp: datetime
    reservations_confirmed: int
    sla_breach_rate: float
    telemetry_lag_seconds: dict[str, float]


class AIOpsTrainer:
    """Calcula estatísticas de base e persiste artefactos treinados."""

    def __init__(self, registry: ModelRegistry) -> None:
        self.registry = registry

    def train(self, observations: Iterable[AIOpsHistoricalObservation]) -> list[ModelArtifact]:
        samples = list(observations)
        if not samples:
            raise ValueError("Nenhuma observação histórica fornecida.")

        artifacts: list[ModelArtifact] = []
        trained_at = datetime.now(timezone.utc)

        reservations_values = [float(item.reservations_confirmed) for item in samples]
        artifacts.append(
            self._build_artifact(
                metric="reservations.daily_volume",
                values=reservations_values,
                trained_at=trained_at,
                metadata={"window": "daily", "source": "lakehouse"},
            )
        )

        sla_values = [float(max(0.0, min(1.0, item.sla_breach_rate))) for item in samples]
        artifacts.append(
            self._build_artifact(
                metric="slas.breach_rate",
                values=sla_values,
                trained_at=trained_at,
                metadata={"window": "rolling", "source": "lakehouse"},
            )
        )

        telemetry_signals: set[str] = set()
        for item in samples:
            telemetry_signals.update(item.telemetry_lag_seconds.keys())

        for signal in sorted(telemetry_signals):
            lag_values = [
                float(value)
                for item in samples
                if (value := item.telemetry_lag_seconds.get(signal)) is not None
            ]
            if not lag_values:
                continue
            artifacts.append(
                self._build_artifact(
                    metric=f"telemetry.{signal}.lag_seconds",
                    values=lag_values,
                    trained_at=trained_at,
                    metadata={"signal": signal, "source": "lakehouse"},
                )
            )

        for artifact in artifacts:
            self.registry.save(artifact)
        return artifacts

    def _build_artifact(
        self,
        *,
        metric: str,
        values: list[float],
        trained_at: datetime,
        metadata: dict[str, str],
    ) -> ModelArtifact:
        if not values:
            raise ValueError(f"Sem valores disponíveis para o métrico {metric}.")
        avg = mean(values)
        dispersion = pstdev(values) if len(values) > 1 else 0.0
        epsilon = max(avg * 0.1, 0.01)
        spread = max(dispersion, epsilon)
        lower = max(0.0, avg - 3 * spread)
        upper = avg + 3 * spread
        return ModelArtifact(
            metric=metric,
            version=trained_at.strftime("%Y%m%dT%H%M%SZ"),
            trained_at=trained_at,
            statistics={
                "mean": avg,
                "std": dispersion,
                "count": len(values),
            },
            thresholds={"lower": lower, "upper": upper},
            metadata=metadata,
        )
