"""Utilitários para consultas analíticas com filtros avançados."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime
from statistics import mean
from typing import Any, Iterable, Sequence

from sqlalchemy import inspect as sa_inspect


@dataclass(slots=True)
class QueryFilter:
    field: str
    operator: str
    values: tuple[Any, ...]


@dataclass(slots=True)
class MetricSpec:
    field: str
    aggregation: str


@dataclass(slots=True)
class QueryResult:
    records: list[dict[str, Any]]
    total_records: int
    groups: list[dict[str, Any]] | None


def run_query(
    dataset: Sequence[Any],
    *,
    filters: Sequence[QueryFilter],
    group_by: Sequence[str],
    metrics: Sequence[MetricSpec],
    limit: int,
    offset: int,
) -> QueryResult:
    filtered = _apply_filters(dataset, filters)
    groups_result = (
        _group_records(filtered, group_by, metrics) if group_by else None
    )
    sliced = filtered[offset : offset + limit] if limit else filtered[offset:]
    return QueryResult(
        records=[_serialize(record) for record in sliced],
        total_records=len(filtered),
        groups=groups_result,
    )


def parse_filter_expression(expression: str) -> QueryFilter:
    if "=" not in expression:
        raise ValueError("expressão de filtro inválida: falta '='")
    field_expression, value_expression = expression.split("=", 1)
    if "__" in field_expression:
        field, operator = field_expression.split("__", 1)
    else:
        field, operator = field_expression, "eq"
    values = tuple(_coerce_value(value) for value in value_expression.split(","))
    return QueryFilter(field=field, operator=operator, values=values)


def parse_metric_expression(expression: str) -> MetricSpec:
    if ":" not in expression:
        raise ValueError("expressão de métrica deve seguir o padrão campo:agregação")
    field, aggregation = expression.split(":", 1)
    return MetricSpec(field=field, aggregation=aggregation)


def _apply_filters(dataset: Sequence[Any], filters: Sequence[QueryFilter]) -> list[Any]:
    return [
        record
        for record in dataset
        if all(_match_filter(record, filter_) for filter_ in filters)
    ]


def _match_filter(record: Any, filter_: QueryFilter) -> bool:
    value = _extract_value(record, filter_.field)
    if filter_.operator == "eq":
        return value in filter_.values
    if filter_.operator == "ne":
        return value not in filter_.values
    if filter_.operator == "in":
        return value in filter_.values
    if filter_.operator in {"gte", "lte", "gt", "lt"}:
        if not filter_.values:
            raise ValueError(
                f"filtro '{filter_.field}__{filter_.operator}' requer ao menos um valor"
            )
        comparison = filter_.values[0]
        if value is None or comparison is None:
            return False
        try:
            if filter_.operator == "gte":
                return value >= comparison
            if filter_.operator == "lte":
                return value <= comparison
            if filter_.operator == "gt":
                return value > comparison
            if filter_.operator == "lt":
                return value < comparison
        except TypeError as error:
            raise ValueError(
                f"valor de filtro inválido para '{filter_.field}': {comparison}"
            ) from error
    if filter_.operator == "contains":
        return any(str(token).lower() in str(value).lower() for token in filter_.values)
    raise ValueError(f"operador de filtro não suportado: {filter_.operator}")


def _group_records(
    records: Iterable[Any],
    group_by: Sequence[str],
    metrics: Sequence[MetricSpec],
) -> list[dict[str, Any]]:
    groups: dict[tuple[Any, ...], list[Any]] = {}
    for record in records:
        key = tuple(_extract_value(record, field) for field in group_by)
        groups.setdefault(key, []).append(record)

    grouped: list[dict[str, Any]] = []
    for key, items in groups.items():
        entry = {
            "dimensions": {field: value for field, value in zip(group_by, key)},
            "count": len(items),
            "metrics": _aggregate_metrics(items, metrics),
        }
        grouped.append(entry)
    return grouped


def _aggregate_metrics(records: Sequence[Any], metrics: Sequence[MetricSpec]) -> dict[str, Any]:
    aggregated: dict[str, Any] = {}
    for spec in metrics:
        values: list[Any] = []
        for record in records:
            value = _extract_value(record, spec.field)
            if value is not None:
                values.append(value)
        if not values:
            aggregated[f"{spec.aggregation}:{spec.field}"] = None
            continue
        if spec.aggregation == "sum":
            aggregated[f"{spec.aggregation}:{spec.field}"] = sum(
                _as_numeric(value) for value in values
            )
        elif spec.aggregation == "avg":
            aggregated[f"{spec.aggregation}:{spec.field}"] = mean(
                [_as_numeric(value) for value in values]
            )
        elif spec.aggregation == "min":
            aggregated[f"{spec.aggregation}:{spec.field}"] = min(
                [_as_numeric(value) for value in values]
            )
        elif spec.aggregation == "max":
            aggregated[f"{spec.aggregation}:{spec.field}"] = max(
                [_as_numeric(value) for value in values]
            )
        else:
            raise ValueError(f"agregação não suportada: {spec.aggregation}")
    return aggregated


def _serialize(record: Any) -> dict[str, Any]:
    inspector = sa_inspect(record, raiseerr=False)
    if inspector is not None:
        data = {}
        for column in inspector.mapper.column_attrs:
            value = getattr(record, column.key)
            data[column.key] = _format_value(value)
        return data
    if isinstance(record, dict):
        return {key: _format_value(value) for key, value in record.items()}
    return {
        key: _format_value(getattr(record, key))
        for key in dir(record)
        if not key.startswith("_") and not callable(getattr(record, key))
    }


def _extract_value(record: Any, field: str) -> Any:
    if isinstance(record, dict):
        return record.get(field)
    inspector = sa_inspect(record, raiseerr=False)
    if inspector is not None:
        if field in inspector.attrs:
            return getattr(record, field)
    return getattr(record, field, None)


def _format_value(value: Any) -> Any:
    if isinstance(value, datetime):
        return value.isoformat()
    if isinstance(value, date):
        return value.isoformat()
    return value


def _coerce_value(value: str) -> Any:
    lowered = value.lower()
    if lowered in {"true", "false"}:
        return lowered == "true"
    try:
        return int(value)
    except ValueError:
        pass
    try:
        return float(value)
    except ValueError:
        pass
    for parser in (datetime.fromisoformat, date.fromisoformat):
        try:
            return parser(value)
        except ValueError:
            continue
    return value


def _as_numeric(value: Any) -> float:
    if isinstance(value, (int, float)):
        return float(value)
    try:
        return float(value)
    except (TypeError, ValueError):
        raise ValueError(f"valor não numérico para agregação: {value}")
