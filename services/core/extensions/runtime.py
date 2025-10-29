"""High-level runtime for loading and executing BMAD extensions."""
from __future__ import annotations

import importlib.util
from dataclasses import dataclass, field
from pathlib import Path
from types import ModuleType
from typing import Any, Callable, Dict, Iterable, Optional

from .manifest import MANIFEST_FILENAME, ExtensionManifest, ManifestValidationError, load_manifest
from .permissions import ExtensionPermission, PermissionSet
from .sandbox import ExtensionSandbox, SandboxViolation


@dataclass(slots=True)
class ExtensionModule:
    module: ModuleType
    entrypoint: Callable[..., Any]


@dataclass(slots=True)
class ExtensionRuntime:
    """Coordinates manifest validation, sandboxing and permission checks."""

    root_path: Path
    sandbox: ExtensionSandbox = field(default_factory=ExtensionSandbox)
    allowed_permissions: Iterable[ExtensionPermission] = field(
        default_factory=lambda: tuple(ExtensionPermission)
    )
    _manifest: Optional[ExtensionManifest] = field(default=None, init=False, repr=False)
    _module_cache: Dict[str, ExtensionModule] = field(default_factory=dict, init=False, repr=False)

    @property
    def manifest(self) -> ExtensionManifest:
        if self._manifest is None:
            self._manifest = load_manifest(self.root_path / MANIFEST_FILENAME)
        return self._manifest

    def load(self) -> ExtensionModule:
        """Load the extension entrypoint according to the manifest."""

        manifest = self.manifest
        requested_permissions = PermissionSet.from_manifest([perm.name for perm in manifest.permissions])
        requested_permissions.ensure_allowed(self.allowed_permissions)

        module_name, function_name = manifest.entrypoint.split(":", maxsplit=1)
        module = self._load_module(module_name)
        try:
            entrypoint = getattr(module.module, function_name)
        except AttributeError as exc:  # pragma: no cover - runtime bubble
            raise ManifestValidationError(
                f"Entrypoint function '{function_name}' not found in module '{module_name}'."
            ) from exc

        if not callable(entrypoint):
            raise ManifestValidationError("Manifest entrypoint must reference a callable attribute.")

        module.entrypoint = entrypoint
        self._module_cache[manifest.identifier] = module
        return module

    def execute(self, *args: Any, **kwargs: Any) -> Any:
        """Execute the extension entrypoint inside the sandbox."""

        module = self._module_cache.get(self.manifest.identifier) or self.load()
        return self.sandbox.execute(module.entrypoint, *args, **kwargs)

    def _load_module(self, dotted_path: str) -> ExtensionModule:
        if dotted_path in self._module_cache:
            return self._module_cache[dotted_path]

        relative_path = dotted_path.replace(".", "/") + ".py"
        file_path = (self.root_path / relative_path).resolve()
        if not file_path.exists():
            raise FileNotFoundError(f"Extension module '{dotted_path}' not found at '{file_path}'.")

        spec = importlib.util.spec_from_file_location(dotted_path, file_path)
        if spec is None or spec.loader is None:
            raise SandboxViolation(f"Unable to load extension module '{dotted_path}'.")

        module = importlib.util.module_from_spec(spec)
        loader = spec.loader
        assert loader is not None
        loader.exec_module(module)
        extension_module = ExtensionModule(module=module, entrypoint=lambda *args, **kwargs: None)
        self._module_cache[dotted_path] = extension_module
        return extension_module


def load_extension(path: Path | str) -> ExtensionRuntime:
    """Convenience helper that instantiates an :class:`ExtensionRuntime`."""

    return ExtensionRuntime(root_path=Path(path))


__all__ = ["ExtensionRuntime", "load_extension"]
