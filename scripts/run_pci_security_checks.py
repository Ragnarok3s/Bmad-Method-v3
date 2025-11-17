#!/usr/bin/env python3.14
"""Gera relatório simplificado de testes PCI para a pipeline de QA."""
from __future__ import annotations

import argparse
import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]


def _ensure_repo_root() -> None:
    if str(REPO_ROOT) not in sys.path:
        sys.path.insert(0, str(REPO_ROOT))


_ensure_repo_root()

from backend.quality.pci import generate_pci_report  # noqa: E402


def main() -> None:
    parser = argparse.ArgumentParser(description="Executa verificações PCI simuladas")
    parser.add_argument(
        "--output",
        default=REPO_ROOT / "backend/quality/reports",
        help="Diretório onde o relatório pci-report.json será salvo",
    )
    args = parser.parse_args()
    report_path = generate_pci_report(Path(args.output))
    print(f"PCI report generated at {report_path}")


if __name__ == "__main__":
    main()
