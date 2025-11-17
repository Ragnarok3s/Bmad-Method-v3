"""Motor de recomendações prioritizadas a partir de telemetria operacional."""

from .engine import (
    EvaluationResult,
    PrecisionRecallMonitor,
    Recommendation,
    RecommendationEngine,
    RecommendationSignal,
)

__all__ = [
    "EvaluationResult",
    "PrecisionRecallMonitor",
    "Recommendation",
    "RecommendationEngine",
    "RecommendationSignal",
]
