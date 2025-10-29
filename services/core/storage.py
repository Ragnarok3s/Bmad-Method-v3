from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
import os
from pathlib import Path
import re
import secrets
from typing import BinaryIO, Optional


class StorageError(RuntimeError):
    """Raised when a storage operation fails due to validation or IO issues."""


@dataclass
class StoredDocument:
    id: str
    owner_id: int
    filename: str
    content_type: str
    size: int
    path: Path
    uploaded_at: datetime


class SecureDocumentStorage:
    """Stores sensitive documents in an isolated directory with basic validation."""

    def __init__(self, base_path: Optional[Path] = None, max_size_bytes: int = 8 * 1024 * 1024) -> None:
        self._base_path = base_path or Path(os.getenv("BMAD_STORAGE_DIR", ".bmad-storage"))
        self._base_path.mkdir(parents=True, exist_ok=True)
        self._max_size = max_size_bytes
        self._name_pattern = re.compile(r"[^A-Za-z0-9_.-]+")

    def save(self, owner_id: int, filename: str, stream: BinaryIO, content_type: str | None = None) -> StoredDocument:
        safe_name = self._sanitize_name(filename)
        if not safe_name:
            raise StorageError("Nome de ficheiro inválido")

        owner_dir = self._base_path / f"owner-{owner_id}"
        owner_dir.mkdir(parents=True, exist_ok=True)

        document_id = secrets.token_hex(16)
        target_name = f"{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')}_{document_id}{Path(safe_name).suffix}"
        target_path = owner_dir / target_name

        data = stream.read()
        if not isinstance(data, (bytes, bytearray)):
            raise StorageError("Falha ao ler dados do ficheiro")
        size = len(data)
        if size == 0:
            raise StorageError("Documento vazio")
        if size > self._max_size:
            raise StorageError("Documento excede o limite de tamanho")

        target_path.write_bytes(data)

        return StoredDocument(
            id=document_id,
            owner_id=owner_id,
            filename=safe_name,
            content_type=content_type or "application/octet-stream",
            size=size,
            path=target_path,
            uploaded_at=datetime.now(timezone.utc),
        )

    def _sanitize_name(self, name: str) -> str:
        name = name.strip()
        # Remove path traversal attempts
        name = name.split("/")[-1].split("\\")[-1]
        sanitized = self._name_pattern.sub("_", name)
        return sanitized[:140]


__all__ = ["SecureDocumentStorage", "StoredDocument", "StorageError"]
