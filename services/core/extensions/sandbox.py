"""Runtime sandbox utilities for executing extensions safely."""
from __future__ import annotations

import builtins
import contextlib
from dataclasses import dataclass, field
from types import MappingProxyType
from typing import Any, Callable, Dict, Iterable

_SAFE_BUILTINS: Dict[str, Any] = {
    name: getattr(builtins, name)
    for name in (
        "abs",
        "all",
        "any",
        "bool",
        "bytes",
        "dict",
        "enumerate",
        "float",
        "int",
        "len",
        "list",
        "map",
        "max",
        "min",
        "next",
        "range",
        "reversed",
        "set",
        "slice",
        "sorted",
        "str",
        "sum",
        "tuple",
        "zip",
        "__build_class__",
        "BaseException",
        "Exception",
        "getattr",
        "hasattr",
        "isinstance",
        "issubclass",
        "object",
        "property",
        "setattr",
        "classmethod",
        "staticmethod",
        "super",
        "type",
        "print",
    )
}


class SandboxViolation(RuntimeError):
    """Raised when sandbox constraints are violated."""


@dataclass(slots=True)
class ExtensionSandbox:
    """Executes callables within a restricted builtin scope."""

    allowed_modules: Iterable[str] = field(default_factory=lambda: ("datetime", "math"))
    safe_builtins: Dict[str, Any] = field(default_factory=lambda: dict(_SAFE_BUILTINS))

    def __post_init__(self) -> None:
        self.safe_builtins.setdefault("__import__", self._guarded_import)
        self._module_whitelist = set(self.allowed_modules)

    def _guarded_import(self, name: str, globals=None, locals=None, fromlist=(), level: int = 0):  # type: ignore[override]
        """Very small import wrapper that only allows whitelisted modules."""

        root_name = name.split(".")[0]
        if root_name not in self._module_whitelist:
            raise SandboxViolation(f"Extension attempted to import unauthorized module '{name}'.")
        return __import__(name, globals, locals, fromlist, level)

    @contextlib.contextmanager
    def patched_builtins(self):
        """Temporarily replace builtin namespace with a safe mapping."""

        original = builtins.__dict__.copy()
        builtins.__dict__.clear()
        builtins.__dict__.update(self.safe_builtins)
        try:
            yield MappingProxyType(self.safe_builtins)
        finally:
            builtins.__dict__.clear()
            builtins.__dict__.update(original)

    def execute(self, func: Callable[..., Any], *args: Any, **kwargs: Any) -> Any:
        """Execute ``func`` within the sandbox, returning the result."""

        try:
            with self.patched_builtins():
                return func(*args, **kwargs)
        except SandboxViolation:
            raise
        except Exception as exc:  # pragma: no cover - runtime bubble
            raise SandboxViolation(f"Extension execution failed: {exc}") from exc


__all__ = ["ExtensionSandbox", "SandboxViolation"]
