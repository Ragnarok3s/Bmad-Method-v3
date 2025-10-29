"""Persistência de artefactos de modelos de AIOps."""

from __future__ import annotations

from dataclasses import asdict, dataclass
from datetime import datetime
from pathlib import Path
from typing import Any

import json


@dataclass(slots=True)
class ModelArtifact:
    """Representa um artefacto treinado para deteção de anomalias."""

    metric: str
    version: str
    trained_at: datetime
    statistics: dict[str, Any]
    thresholds: dict[str, float]
    metadata: dict[str, Any]

    def to_json(self) -> dict[str, Any]:
        payload = asdict(self)
        payload["trained_at"] = self.trained_at.isoformat()
        return payload

    @classmethod
    def from_json(cls, payload: dict[str, Any]) -> "ModelArtifact":
        return cls(
            metric=str(payload["metric"]),
            version=str(payload["version"]),
            trained_at=datetime.fromisoformat(payload["trained_at"]),
            statistics=dict(payload.get("statistics", {})),
            thresholds={str(key): float(value) for key, value in payload.get("thresholds", {}).items()},
            metadata=dict(payload.get("metadata", {})),
        )


class ModelRegistry:
    """Registo de artefactos armazenados no diretório `models/aiops`."""

    def __init__(self, base_path: Path | None = None) -> None:
        if base_path is None:
            base_path = Path(__file__).resolve().parents[3] / "models" / "aiops"
        self.base_path = base_path
        self.base_path.mkdir(parents=True, exist_ok=True)

    def _metric_prefix(self, metric: str) -> str:
        return metric.replace("/", "_").replace(".", "_")

    def _artifact_path(self, artifact: ModelArtifact) -> Path:
        filename = f"{self._metric_prefix(artifact.metric)}-{artifact.version}.json"
        return self.base_path / filename

    def save(self, artifact: ModelArtifact) -> Path:
        path = self._artifact_path(artifact)
        with path.open("w", encoding="utf-8") as handler:
            json.dump(artifact.to_json(), handler, ensure_ascii=False, indent=2)
        return path

    def list_artifacts(self, metric: str | None = None) -> list[ModelArtifact]:
        artifacts: list[ModelArtifact] = []
        prefix = self._metric_prefix(metric) if metric else None
        for file in sorted(self.base_path.glob("*.json")):
            if prefix and not file.name.startswith(prefix):
                continue
            with file.open("r", encoding="utf-8") as handler:
                payload = json.load(handler)
            artifacts.append(ModelArtifact.from_json(payload))
        artifacts.sort(key=lambda item: item.trained_at, reverse=True)
        return artifacts

    def load_latest(self, metric: str) -> ModelArtifact | None:
        artifacts = self.list_artifacts(metric)
        if not artifacts:
            return None
        return artifacts[0]
