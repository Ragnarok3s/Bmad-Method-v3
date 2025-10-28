from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, time, timedelta
from decimal import Decimal, ROUND_HALF_UP
from io import StringIO
from typing import Dict, Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session

from ..domain.models import Property, Reservation, ReservationStatus

__all__ = [
    "KPIReportRow",
    "KPIReport",
    "generate_kpi_report",
    "kpi_report_to_csv",
]


_VALID_STATUSES = {
    ReservationStatus.CONFIRMED,
    ReservationStatus.CHECKED_IN,
    ReservationStatus.CHECKED_OUT,
}

_NO_CURRENCY_KEY = "__none__"


@dataclass(slots=True)
class KPIReportRow:
    """Linha de relatório contendo KPIs consolidados por propriedade e moeda."""

    property_id: int
    property_name: str
    currency: str | None
    reservations: int
    occupied_nights: int
    available_nights: int
    occupancy_rate: float
    adr: float | None
    revenue: float


@dataclass(slots=True)
class KPIReport:
    """Relatório de KPIs para o período solicitado."""

    period_start: date
    period_end: date
    generated_at: datetime
    items: Sequence[KPIReportRow]
    properties_covered: int
    total_reservations: int
    total_occupied_nights: int
    total_available_nights: int

    @property
    def average_occupancy_rate(self) -> float:
        if self.total_available_nights == 0:
            return 0.0
        return self.total_occupied_nights / self.total_available_nights

    def revenue_breakdown(self) -> Dict[str | None, float]:
        totals: Dict[str | None, float] = {}
        for row in self.items:
            totals[row.currency] = totals.get(row.currency, 0.0) + row.revenue
        return totals


def generate_kpi_report(
    session: Session,
    period_start: date,
    period_end: date,
    *,
    property_ids: Sequence[int] | None = None,
) -> KPIReport:
    if period_end < period_start:
        raise ValueError("period_end deve ser maior ou igual a period_start")

    property_stmt = select(Property)
    if property_ids:
        property_stmt = property_stmt.where(Property.id.in_(property_ids))

    properties = list(session.execute(property_stmt).scalars())

    period_days = (period_end - period_start).days + 1
    if period_days <= 0:
        period_days = 0

    if not properties:
        return KPIReport(
            period_start=period_start,
            period_end=period_end,
            generated_at=datetime.utcnow(),
            items=[],
            properties_covered=0,
            total_reservations=0,
            total_occupied_nights=0,
            total_available_nights=0,
        )

    start_dt = datetime.combine(period_start, time.min)
    end_dt = datetime.combine(period_end + timedelta(days=1), time.min)

    reservations_stmt = (
        select(Reservation)
        .where(Reservation.property_id.in_([prop.id for prop in properties]))
        .where(Reservation.status.in_(_VALID_STATUSES))
        .where(Reservation.check_in < end_dt)
        .where(Reservation.check_out > start_dt)
    )

    reservations = list(session.execute(reservations_stmt).scalars())

    property_map: Dict[int, Property] = {prop.id: prop for prop in properties}
    available_by_property: Dict[int, int] = {
        prop.id: prop.units * period_days if period_days > 0 else 0 for prop in properties
    }
    currency_groups: Dict[int, Dict[str, dict[str, Decimal | int]]]
    currency_groups = {prop.id: {} for prop in properties}

    for reservation in reservations:
        property_id = reservation.property_id
        if property_id not in property_map:
            continue

        stay_nights = _compute_overlap_nights(reservation, period_start, period_end)
        if stay_nights <= 0:
            continue

        currency_key = reservation.currency_code or _NO_CURRENCY_KEY
        stats = currency_groups[property_id].setdefault(
            currency_key,
            {
                "reservations": 0,
                "occupied_nights": 0,
                "revenue_minor": Decimal(0),
            },
        )
        stats["reservations"] = int(stats["reservations"]) + 1
        stats["occupied_nights"] = int(stats["occupied_nights"]) + stay_nights
        if reservation.total_amount_minor:
            stats["revenue_minor"] = Decimal(stats["revenue_minor"]) + _allocate_revenue_minor(
                reservation.total_amount_minor,
                reservation.check_in.date(),
                reservation.check_out.date(),
                stay_nights,
            )

    rows: list[KPIReportRow] = []
    total_reservations = 0
    total_occupied_nights = 0
    total_available_nights = 0

    for property_id, property_obj in property_map.items():
        available_nights = available_by_property[property_id]
        total_available_nights += available_nights
        property_currency_stats = currency_groups[property_id]

        if not property_currency_stats:
            rows.append(
                KPIReportRow(
                    property_id=property_obj.id,
                    property_name=property_obj.name,
                    currency=None,
                    reservations=0,
                    occupied_nights=0,
                    available_nights=available_nights,
                    occupancy_rate=0.0,
                    adr=None,
                    revenue=0.0,
                )
            )
            continue

        for currency_key, stats in sorted(property_currency_stats.items()):
            reservations_count = int(stats["reservations"])
            occupied_nights = int(stats["occupied_nights"])
            revenue_minor = Decimal(stats["revenue_minor"])
            currency_value = None if currency_key == _NO_CURRENCY_KEY else currency_key

            revenue_major = _minor_to_major(revenue_minor)
            adr_value: float | None
            if occupied_nights > 0 and revenue_minor > 0:
                adr_minor = revenue_minor / Decimal(occupied_nights)
                adr_major = (adr_minor / Decimal(100)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
                adr_value = float(adr_major)
            elif occupied_nights > 0:
                adr_value = 0.0
            else:
                adr_value = None

            occupancy_rate = (
                occupied_nights / available_nights if available_nights > 0 else 0.0
            )

            rows.append(
                KPIReportRow(
                    property_id=property_obj.id,
                    property_name=property_obj.name,
                    currency=currency_value,
                    reservations=reservations_count,
                    occupied_nights=occupied_nights,
                    available_nights=available_nights,
                    occupancy_rate=occupancy_rate,
                    adr=adr_value,
                    revenue=float(revenue_major),
                )
            )

            total_reservations += reservations_count
            total_occupied_nights += occupied_nights

    return KPIReport(
        period_start=period_start,
        period_end=period_end,
        generated_at=datetime.utcnow(),
        items=rows,
        properties_covered=len(property_map),
        total_reservations=total_reservations,
        total_occupied_nights=total_occupied_nights,
        total_available_nights=total_available_nights,
    )


def kpi_report_to_csv(report: KPIReport) -> str:
    buffer = StringIO()
    headers = [
        "period_start",
        "period_end",
        "generated_at",
        "property_id",
        "property_name",
        "currency",
        "reservations",
        "occupied_nights",
        "available_nights",
        "occupancy_rate",
        "adr",
        "revenue",
    ]
    buffer.write(",".join(headers) + "\n")
    generated_at_iso = report.generated_at.replace(microsecond=0).isoformat() + "Z"
    for row in report.items:
        buffer.write(
            ",".join(
                [
                    report.period_start.isoformat(),
                    report.period_end.isoformat(),
                    generated_at_iso,
                    str(row.property_id),
                    _escape_csv(row.property_name),
                    row.currency or "",
                    str(row.reservations),
                    str(row.occupied_nights),
                    str(row.available_nights),
                    f"{row.occupancy_rate:.4f}",
                    "" if row.adr is None else f"{row.adr:.2f}",
                    f"{row.revenue:.2f}",
                ]
            )
            + "\n"
        )
    return buffer.getvalue()


def _compute_overlap_nights(
    reservation: Reservation, period_start: date, period_end: date
) -> int:
    start = max(reservation.check_in.date(), period_start)
    end_exclusive = min(reservation.check_out.date(), period_end + timedelta(days=1))
    delta = (end_exclusive - start).days
    return max(delta, 0)


def _allocate_revenue_minor(
    total_amount_minor: int,
    check_in: date,
    check_out: date,
    overlapping_nights: int,
) -> Decimal:
    total_nights = (check_out - check_in).days
    if total_nights <= 0 or overlapping_nights <= 0:
        return Decimal(0)
    proportion = Decimal(overlapping_nights) / Decimal(total_nights)
    allocation = Decimal(total_amount_minor) * proportion
    return allocation.quantize(Decimal("1"), rounding=ROUND_HALF_UP)


def _minor_to_major(value: Decimal) -> Decimal:
    return (value / Decimal(100)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def _escape_csv(value: str) -> str:
    if "," in value or "\"" in value:
        escaped = value.replace("\"", '""')
        return f'"{escaped}"'
    return value
