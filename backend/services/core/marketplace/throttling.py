"""Simple throttling utilities for marketplace integrations."""

from __future__ import annotations

from collections import deque
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from typing import Deque


class RateLimitExceeded(RuntimeError):
    """Raised when a partner exceeds its allotted throughput."""

    def __init__(self, partner_id: str, policy: "ThrottlePolicy") -> None:
        super().__init__(
            f"Partner {partner_id} exceeded {policy.requests} requests per {policy.period.total_seconds()}s"
        )
        self.partner_id = partner_id
        self.policy = policy


@dataclass(slots=True)
class ThrottlePolicy:
    """Defines how frequently a partner can interact with the core APIs."""

    requests: int
    period: timedelta


class MarketplaceThrottler:
    """In-memory throttler intended for contract testing and sandbox usage."""

    def __init__(self, policy: ThrottlePolicy) -> None:
        self._policy = policy
        self._calls: dict[str, Deque[datetime]] = {}

    @property
    def policy(self) -> ThrottlePolicy:
        return self._policy

    def allow(self, partner_id: str, *, now: datetime | None = None) -> None:
        """Register a partner call and raise if it breaches the policy."""

        current_time = now or datetime.now(UTC)
        ring = self._calls.setdefault(partner_id, deque())
        while ring and (current_time - ring[0]) > self._policy.period:
            ring.popleft()
        if len(ring) >= self._policy.requests:
            raise RateLimitExceeded(partner_id, self._policy)
        ring.append(current_time)

    def reset(self, partner_id: str | None = None) -> None:
        """Clears throttling history for a partner or for every partner."""

        if partner_id is None:
            self._calls.clear()
        else:
            self._calls.pop(partner_id, None)
