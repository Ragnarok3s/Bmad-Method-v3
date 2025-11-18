"""Permission model for BMAD extensions."""
from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Iterable, Iterator, MutableSet


class ExtensionPermission(str, Enum):
    """Enumerates builtin permissions available to sandboxed extensions."""

    DATA_READ = "data:read"
    DATA_WRITE = "data:write"
    EXTERNAL_NETWORK = "network:external"
    SCHEDULER = "scheduler:jobs"
    SECRETS = "secrets:access"


@dataclass(slots=True)
class PermissionSet:
    """Represents the permissions granted to an extension at runtime."""

    granted: MutableSet[ExtensionPermission] = field(default_factory=set)

    @classmethod
    def from_manifest(cls, requested: Iterable[str]) -> "PermissionSet":
        """Create a permission set from manifest request strings."""

        granted = {
            ExtensionPermission(item)
            for item in requested
            if item in {perm.value for perm in ExtensionPermission}
        }
        return cls(granted=granted)

    def ensure_allowed(self, allowed: Iterable[ExtensionPermission]) -> None:
        """Verify requested permissions are a subset of allowed ones."""

        allowed_set = set(allowed)
        disallowed = sorted(perm.value for perm in self.granted if perm not in allowed_set)
        if disallowed:
            raise PermissionError(
                "Extension requested permissions that were not granted by the platform: "
                + ", ".join(disallowed)
            )

    def __contains__(self, permission: ExtensionPermission) -> bool:  # pragma: no cover - simple delegation
        return permission in self.granted

    def __iter__(self) -> Iterator[ExtensionPermission]:  # pragma: no cover - simple delegation
        return iter(self.granted)


__all__ = ["ExtensionPermission", "PermissionSet"]
