import pytest

from quality.metrics import QualitySnapshot, calculate_error_budget, summarize_coverage_trend


@pytest.mark.unit
def test_quality_snapshot_health() -> None:
    healthy = QualitySnapshot(build_id="42", coverage=0.81, failed_tests=0, blocking_bugs=0)
    degraded = QualitySnapshot(build_id="43", coverage=0.7, failed_tests=1, blocking_bugs=0)

    assert healthy.is_healthy() is True
    assert degraded.is_healthy() is False


@pytest.mark.unit
@pytest.mark.parametrize(
    ("target", "actual", "expected"),
    [
        (0.99, 0.97, 0.02),
        (0.9, 0.95, 0.0),
    ],
)
def test_calculate_error_budget(target: float, actual: float, expected: float) -> None:
    assert calculate_error_budget(target, actual) == pytest.approx(expected)


@pytest.mark.unit
def test_calculate_error_budget_bounds() -> None:
    with pytest.raises(ValueError):
        calculate_error_budget(-0.1, 0.9)
    with pytest.raises(ValueError):
        calculate_error_budget(0.9, 1.1)


@pytest.mark.unit
def test_summarize_coverage_trend() -> None:
    snapshots = [
        QualitySnapshot(build_id="001", coverage=0.74, failed_tests=0, blocking_bugs=0),
        QualitySnapshot(build_id="002", coverage=0.80, failed_tests=0, blocking_bugs=0),
        QualitySnapshot(build_id="003", coverage=0.78, failed_tests=1, blocking_bugs=0),
    ]

    summary = summarize_coverage_trend(snapshots)
    assert summary[0] == "Build 001: cobertura inicial em 74.0%."
    assert "subiu" in summary[1]
    assert "caiu" in summary[2]


@pytest.mark.unit
def test_summarize_coverage_trend_handles_numeric_build_ids_out_of_order() -> None:
    snapshots = [
        QualitySnapshot(build_id="10", coverage=0.70, failed_tests=0, blocking_bugs=0),
        QualitySnapshot(build_id="2", coverage=0.72, failed_tests=0, blocking_bugs=0),
        QualitySnapshot(build_id="9", coverage=0.71, failed_tests=0, blocking_bugs=0),
    ]

    summary = summarize_coverage_trend(snapshots)

    assert summary[0].startswith("Build 2:")
    assert summary[1].startswith("Build 9:")
    assert summary[2].startswith("Build 10:")
