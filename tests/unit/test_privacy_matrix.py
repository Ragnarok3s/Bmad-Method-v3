from pathlib import Path

import pytest

from quality.privacy import build_privacy_matrix


def test_build_privacy_matrix_handles_empty_yaml(tmp_path: Path) -> None:
    matrix_path = tmp_path / "privacy.yaml"
    matrix_path.write_text("", encoding="utf-8")

    controls = build_privacy_matrix(matrix_path)

    assert controls == []


@pytest.mark.parametrize(
    "yaml_content",
    [
        "controles: {}\n",
        "controles:\n  - modulo: Reservas\n    requisito: R1\n    status: aprovado\n",
    ],
)
def test_build_privacy_matrix_requires_all_fields(tmp_path: Path, yaml_content: str) -> None:
    matrix_path = tmp_path / "privacy.yaml"
    matrix_path.write_text(yaml_content, encoding="utf-8")

    with pytest.raises(ValueError):
        build_privacy_matrix(matrix_path)
