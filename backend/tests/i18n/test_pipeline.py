from __future__ import annotations

import json
from pathlib import Path

from scripts.localization.pipeline import generate_review_markdown, sync_locale_catalog


def test_sync_locale_catalog_fills_missing_keys(tmp_path: Path) -> None:
    source = tmp_path / 'source.json'
    target = tmp_path / 'target.json'

    source.write_text(json.dumps({'greeting': {'hello': 'Hello', 'bye': 'Goodbye'}}), encoding='utf-8')
    target.write_text(json.dumps({'greeting': {'hello': 'Olá'}}), encoding='utf-8')

    translated = sync_locale_catalog(source, target, 'pt-BR', 'en')
    updated = json.loads(target.read_text(encoding='utf-8'))

    assert json.dumps(updated, sort_keys=True) == json.dumps(
        {'greeting': {'hello': 'Olá', 'bye': 'Goodbye'}}, sort_keys=True
    )
    assert translated == [('greeting.bye', 'Goodbye')]


def test_generate_review_markdown() -> None:
    content = generate_review_markdown('pt-BR', [('greeting.bye', 'Goodbye')])
    assert '- **greeting.bye** → Goodbye' in content
    empty = generate_review_markdown('pt-BR', [])
    assert 'No machine-translated entries pending review.' in empty
