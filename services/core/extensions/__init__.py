"""Extension runtime package.

Provides sandboxed execution, manifest management and permission handling for
BMAD extensions.  Public entrypoints:
- :func:`load_extension`
- :class:`ExtensionRuntime`
"""

from .manifest import ExtensionManifest, ManifestValidationError, load_manifest
from .permissions import ExtensionPermission, PermissionSet
from .runtime import ExtensionRuntime, load_extension
from .sandbox import ExtensionSandbox, SandboxViolation

__all__ = [
    "ExtensionManifest",
    "ManifestValidationError",
    "load_manifest",
    "ExtensionPermission",
    "PermissionSet",
    "ExtensionRuntime",
    "load_extension",
    "ExtensionSandbox",
    "SandboxViolation",
]
