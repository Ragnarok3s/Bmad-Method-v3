"""Extension manifest definitions and validation utilities."""
from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, Iterable, List, Mapping, MutableMapping, Optional

SUPPORTED_MANIFEST_VERSIONS = {"1.0", "1.1"}
MANIFEST_FILENAME = "extension.manifest.json"


class ManifestValidationError(ValueError):
    """Raised when an extension manifest fails validation."""


@dataclass(slots=True)
class ExtensionPermissionDeclaration:
    """Represents a single permission declaration inside a manifest."""

    name: str
    description: Optional[str] = None
    scopes: List[str] = field(default_factory=list)

    @classmethod
    def from_mapping(cls, raw: Mapping[str, Any]) -> "ExtensionPermissionDeclaration":
        if "name" not in raw:
            raise ManifestValidationError("Permission declaration missing required field 'name'.")
        scopes: Iterable[str]
        if "scopes" in raw:
            scopes = [str(scope) for scope in raw.get("scopes", [])]
        else:
            scopes = []
        return cls(name=str(raw["name"]), description=raw.get("description"), scopes=list(scopes))


@dataclass(slots=True)
class ExtensionManifest:
    """Canonical representation of an extension manifest."""

    manifest_version: str
    identifier: str
    version: str
    entrypoint: str
    permissions: List[ExtensionPermissionDeclaration] = field(default_factory=list)
    description: Optional[str] = None
    minimum_core_version: Optional[str] = None
    metadata: MutableMapping[str, Any] = field(default_factory=dict)

    def requires_permission(self, permission_name: str) -> bool:
        """Return True if the manifest requests the specified permission."""

        return any(decl.name == permission_name for decl in self.permissions)


def _validate_manifest_dict(payload: Mapping[str, Any]) -> None:
    """Validate required manifest fields and versioning."""

    manifest_version = str(payload.get("manifest_version", ""))
    if manifest_version not in SUPPORTED_MANIFEST_VERSIONS:
        raise ManifestValidationError(
            f"Unsupported manifest_version '{manifest_version}'. Supported versions: {sorted(SUPPORTED_MANIFEST_VERSIONS)}"
        )

    required_fields = {"identifier", "version", "entrypoint"}
    missing = sorted(field for field in required_fields if field not in payload)
    if missing:
        raise ManifestValidationError(f"Missing required manifest fields: {', '.join(missing)}")

    entrypoint = str(payload["entrypoint"])
    if ":" not in entrypoint:
        raise ManifestValidationError("Manifest entrypoint must be in the format 'module:function'.")

    permissions = payload.get("permissions", [])
    if permissions and not isinstance(permissions, list):
        raise ManifestValidationError("Manifest permissions must be provided as a list.")


def parse_manifest(payload: Mapping[str, Any]) -> ExtensionManifest:
    """Parse and validate manifest payload into a dataclass instance."""

    _validate_manifest_dict(payload)

    permission_objects = [ExtensionPermissionDeclaration.from_mapping(item) for item in payload.get("permissions", [])]

    metadata: Dict[str, Any] = dict(payload.get("metadata", {})) if isinstance(payload.get("metadata"), Mapping) else {}

    return ExtensionManifest(
        manifest_version=str(payload["manifest_version"]),
        identifier=str(payload["identifier"]),
        version=str(payload["version"]),
        entrypoint=str(payload["entrypoint"]),
        permissions=permission_objects,
        description=payload.get("description"),
        minimum_core_version=payload.get("minimum_core_version"),
        metadata=metadata,
    )


def load_manifest(path: Path | str) -> ExtensionManifest:
    """Load and parse an extension manifest from disk."""

    manifest_path = Path(path)
    if manifest_path.is_dir():
        manifest_path = manifest_path / MANIFEST_FILENAME

    if not manifest_path.exists():
        raise FileNotFoundError(f"Extension manifest not found at '{manifest_path}'.")

    with manifest_path.open("r", encoding="utf-8") as file:
        try:
            data = json.load(file)
        except json.JSONDecodeError as exc:
            raise ManifestValidationError(f"Invalid JSON manifest: {exc}") from exc

    if not isinstance(data, Mapping):
        raise ManifestValidationError("Manifest root must be an object/dictionary.")

    return parse_manifest(data)


__all__ = [
    "ExtensionManifest",
    "ExtensionPermissionDeclaration",
    "ManifestValidationError",
    "MANIFEST_FILENAME",
    "SUPPORTED_MANIFEST_VERSIONS",
    "load_manifest",
    "parse_manifest",
]
