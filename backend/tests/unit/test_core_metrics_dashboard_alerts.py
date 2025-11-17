from __future__ import annotations

import importlib
from types import ModuleType

import pytest

import services.core.metrics as core_metrics


class _FakeCounter:
    def __init__(self, name: str) -> None:
        self.name = name
        self.calls: list[tuple[int, dict[str, str] | None]] = []

    def add(self, amount: int, attributes: dict[str, str] | None = None) -> None:
        self.calls.append((amount, attributes or {}))


class _FakeHistogram:
    def __init__(self, name: str) -> None:
        self.name = name
        self.records: list[tuple[float, dict[str, str] | None]] = []

    def record(self, value: float, attributes: dict[str, str] | None = None) -> None:
        self.records.append((value, attributes or {}))


class _FakeMeter:
    def __init__(self) -> None:
        self.counters: dict[str, _FakeCounter] = {}
        self.histograms: dict[str, _FakeHistogram] = {}

    def create_counter(self, name: str, **_: object) -> _FakeCounter:
        counter = _FakeCounter(name)
        self.counters[name] = counter
        return counter

    def create_histogram(self, name: str, **_: object) -> _FakeHistogram:
        histogram = _FakeHistogram(name)
        self.histograms[name] = histogram
        return histogram


@pytest.fixture()
def metrics_module(
    monkeypatch: pytest.MonkeyPatch,
) -> tuple[ModuleType, _FakeMeter]:
    module = importlib.reload(core_metrics)
    fake_meter = _FakeMeter()
    monkeypatch.setattr(module.metrics, "get_meter", lambda _: fake_meter)
    return module, fake_meter


@pytest.mark.unit
def test_record_dashboard_alerts_tracks_counters_and_events(
    metrics_module: tuple[ModuleType, _FakeMeter], monkeypatch: pytest.MonkeyPatch
) -> None:
    module, fake_meter = metrics_module
    recorded_events: list[tuple[str, str, dict[str, str]]] = []

    def _capture(signal: str, name: str, attributes: dict[str, str]) -> None:
        recorded_events.append((signal, name, attributes))

    monkeypatch.setattr(module, "mark_signal_event", _capture)

    module.record_dashboard_alerts(total=9, blocked=2, overdue=1)

    alert_counter = fake_meter.counters["bmad_core_dashboard_alerts_total"]
    assert alert_counter.calls == [
        (9, {"state": "total"}),
        (2, {"state": "blocked"}),
        (1, {"state": "overdue"}),
    ]

    assert recorded_events == [
        (
            "metrics",
            "bmad_core_dashboard_alerts_summary",
            {"total": "9", "blocked": "2", "overdue": "1"},
        )
    ]
