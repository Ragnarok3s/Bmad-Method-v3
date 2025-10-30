"""Modelos relacionados a playbooks automatizados."""
from __future__ import annotations

import json
from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from .models import Base


def _decode_list(value: str | None) -> list[str]:
    try:
        data = json.loads(value or "[]")
    except json.JSONDecodeError:
        return []
    return [str(item) for item in data if isinstance(item, str)]


def _encode_tags(values: list[str]) -> str:
    normalized = sorted({item.strip() for item in values if item and item.strip()})
    return json.dumps(normalized)


def _encode_steps(values: list[str]) -> str:
    normalized = [item.strip() for item in values if item and item.strip()]
    return json.dumps(normalized)


class PlaybookTemplate(Base):
    """Template de playbook com metadados e passos estruturados."""

    __tablename__ = "playbook_templates"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False, unique=True)
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    _tags: Mapped[str] = mapped_column("tags", Text, nullable=False, default="[]")
    _steps: Mapped[str] = mapped_column("steps", Text, nullable=False, default="[]")
    execution_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    last_executed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=func.now(), onupdate=func.now()
    )

    @property
    def tags(self) -> list[str]:
        return _decode_list(self._tags)

    @tags.setter
    def tags(self, values: list[str]) -> None:
        self._tags = _encode_tags(values)

    @property
    def steps(self) -> list[str]:
        return _decode_list(self._steps)

    @steps.setter
    def steps(self, values: list[str]) -> None:
        self._steps = _encode_steps(values)

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "summary": self.summary,
            "tags": self.tags,
            "steps": self.steps,
            "execution_count": self.execution_count,
            "last_executed_at": self.last_executed_at,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }
