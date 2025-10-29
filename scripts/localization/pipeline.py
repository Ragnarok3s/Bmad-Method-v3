from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Dict, Iterable, List, Tuple

from .providers import TranslationProvider, get_translator

Messages = Dict[str, object]
FlatMessages = Dict[str, str]


def load_messages(path: Path) -> Messages:
    if not path.exists():
        return {}
    with path.open('r', encoding='utf-8') as handle:
        return json.load(handle)


def save_messages(path: Path, data: Messages) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open('w', encoding='utf-8') as handle:
        json.dump(data, handle, ensure_ascii=False, indent=2, sort_keys=True)
        handle.write('\n')


def flatten_messages(data: Messages, prefix: str = '') -> FlatMessages:
    flattened: FlatMessages = {}
    for key, value in data.items():
        scoped_key = f'{prefix}.{key}' if prefix else key
        if isinstance(value, dict):
            flattened.update(flatten_messages(value, scoped_key))
        else:
            flattened[scoped_key] = '' if value is None else str(value)
    return flattened


def unflatten_messages(flattened: FlatMessages) -> Messages:
    tree: Messages = {}
    for key, value in sorted(flattened.items()):
        cursor = tree
        parts = key.split('.')
        for part in parts[:-1]:
            cursor = cursor.setdefault(part, {})  # type: ignore[assignment]
        cursor[parts[-1]] = value
    return tree


def merge_translations(
    source: FlatMessages,
    target: FlatMessages,
    translator: TranslationProvider,
    source_locale: str,
    target_locale: str
) -> Tuple[FlatMessages, List[Tuple[str, str]]]:
    missing: List[Tuple[str, str]] = []
    updated = dict(target)
    for key, value in source.items():
        target_value = updated.get(key)
        if not target_value:
            translated = translator.translate(value, source_locale, target_locale)
            updated[key] = translated
            missing.append((key, translated))
    return updated, missing


def sync_locale_catalog(
    source_path: Path,
    target_path: Path,
    target_locale: str,
    source_locale: str = 'en'
) -> List[Tuple[str, str]]:
    source_messages = load_messages(source_path)
    target_messages = load_messages(target_path)

    source_flat = flatten_messages(source_messages)
    target_flat = flatten_messages(target_messages)

    translator = get_translator()
    merged, translated = merge_translations(
        source_flat,
        target_flat,
        translator,
        source_locale,
        target_locale
    )

    save_messages(target_path, unflatten_messages(merged))
    return translated


def generate_review_markdown(locale: str, items: Iterable[Tuple[str, str]]) -> str:
    lines = [f'# Pending review for {locale}', '']
    has_items = False
    for key, value in items:
        has_items = True
        lines.append(f'- **{key}** → {value}')
    if not has_items:
        lines.append('No machine-translated entries pending review.')
    return '\n'.join(lines) + '\n'


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description='Synchronise localization catalogs with machine translation.')
    parser.add_argument('--source', type=Path, required=True, help='Path to the source locale JSON file.')
    parser.add_argument('--target', type=Path, required=True, help='Path to the target locale JSON file.')
    parser.add_argument('--target-locale', required=True, help='Locale code for the target file (e.g. pt-BR).')
    parser.add_argument('--source-locale', default='en', help='Locale code for the source catalog.')
    parser.add_argument('--review', type=Path, help='Optional path to write a human review checklist.')

    args = parser.parse_args(argv)

    translated = sync_locale_catalog(args.source, args.target, args.target_locale, args.source_locale)

    if args.review:
        review_content = generate_review_markdown(args.target_locale, translated)
        args.review.write_text(review_content, encoding='utf-8')

    return 0


if __name__ == '__main__':
    raise SystemExit(main())
