from __future__ import annotations

import json
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[2]
LOCALES_DIR = ROOT / 'apps' / 'web' / 'lib' / 'i18n' / 'locales'


def load_locale(locale: str) -> dict:
    with (LOCALES_DIR / f'{locale}.json').open(encoding='utf-8') as handle:
        return json.load(handle)


def flatten(messages: dict, prefix: str = '') -> dict[str, str]:
    flattened: dict[str, str] = {}
    for key, value in messages.items():
        scoped = f'{prefix}.{key}' if prefix else key
        if isinstance(value, dict):
            flattened.update(flatten(value, scoped))
        else:
            flattened[scoped] = value
    return flattened


@pytest.fixture(scope='module')
def locale_catalogs() -> tuple[dict[str, str], dict[str, str]]:
    en = flatten(load_locale('en'))
    pt = flatten(load_locale('pt-BR'))
    return en, pt


def test_locales_have_matching_keys(locale_catalogs: tuple[dict[str, str], dict[str, str]]) -> None:
    en, pt = locale_catalogs
    assert set(en.keys()) == set(pt.keys())


@pytest.mark.parametrize(
    'key,expected',
    [
        ('auth.login.cardTitle', 'Authentication'),
        ('auth.mfa.methods.totp', 'Authenticator code'),
        ('housekeeping.sections.main.title', 'Housekeeping'),
        ('owners.overview.cards.payout.submit', 'Save preferences')
    ]
)
def test_english_reference_values(locale_catalogs: tuple[dict[str, str], dict[str, str]], key: str, expected: str) -> None:
    en, _ = locale_catalogs
    assert en[key] == expected


@pytest.mark.parametrize(
    'key',
    [
        'auth.login.success.sessionStarted',
        'housekeeping.metrics.upcomingItem',
        'owners.overview.cards.notifications.meta'
    ]
)
def test_templates_include_placeholders(locale_catalogs: tuple[dict[str, str], dict[str, str]], key: str) -> None:
    en, pt = locale_catalogs
    assert '{{' in en[key] and '}}' in en[key]
    assert '{{' in pt[key] and '}}' in pt[key]
