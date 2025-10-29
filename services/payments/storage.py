from __future__ import annotations

import hmac
from dataclasses import dataclass, field
from datetime import UTC, datetime
from hashlib import blake2b
from typing import Any

from .models import TokenizedCard


@dataclass(slots=True)
class StoredToken:
    token_reference: str
    masked_pan: str
    network: str | None
    fingerprint: str | None
    checksum: str
    expires_at: datetime | None
    created_at: datetime = field(default_factory=lambda: datetime.now(UTC))
    metadata: dict[str, Any] = field(default_factory=dict)


class SecureTokenVault:
    """In-memory representation of a secure vault for payment tokens."""

    def __init__(self, *, secret_key: bytes) -> None:
        if len(secret_key) < 16:
            raise ValueError("secret_key must be at least 16 bytes for HMAC integrity")
        self._secret_key = secret_key
        self._tokens: dict[str, StoredToken] = {}

    def _checksum(self, token: str) -> str:
        digest = hmac.new(self._secret_key, token.encode("utf-8"), digestmod="sha256").digest()
        return blake2b(digest, digest_size=32).hexdigest()

    def store(self, token: TokenizedCard) -> StoredToken:
        record = StoredToken(
            token_reference=token.token_reference,
            masked_pan=token.masked_pan,
            network=token.network,
            fingerprint=token.fingerprint,
            checksum=self._checksum(token.token),
            expires_at=token.expires_at,
            created_at=token.created_at,
            metadata=token.metadata.copy(),
        )
        self._tokens[record.token_reference] = record
        return record

    def get(self, token_reference: str) -> StoredToken:
        return self._tokens[token_reference]

    def verify_checksum(self, token_reference: str, token_value: str) -> bool:
        stored = self.get(token_reference)
        return hmac.compare_digest(stored.checksum, self._checksum(token_value))

    def list_tokens(self) -> list[StoredToken]:
        return list(self._tokens.values())

    def purge(self, token_reference: str) -> None:
        self._tokens.pop(token_reference, None)

    def clear(self) -> None:
        self._tokens.clear()
