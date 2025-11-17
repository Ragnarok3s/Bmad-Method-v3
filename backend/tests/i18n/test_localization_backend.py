from __future__ import annotations

from datetime import datetime, timezone

import pytest

from services.core.localization import (
    describe_locale,
    format_currency,
    format_datetime,
    get_currency,
    get_locale_profile,
    get_timezone,
    list_supported_locales,
    normalize_locale,
    to_timezone
)


def test_normalize_locale_aliases() -> None:
    assert normalize_locale('pt-br') == 'pt-BR'
    assert normalize_locale('es') == 'es-ES'
    assert normalize_locale(None) == 'en-US'


def test_currency_formatting_respects_locale() -> None:
    assert format_currency(1234.5, 'pt-BR') == 'R$ 1.234,50'
    assert format_currency(1234.5, 'es-ES') == '1.234,50 €'
    assert format_currency(1234.5, 'en-US') == '$ 1,234.50'


def test_datetime_conversion_applies_timezone() -> None:
    moment = datetime(2024, 1, 5, 12, 0, tzinfo=timezone.utc)
    localized = to_timezone(moment, 'pt-BR')
    assert localized.tzinfo.key == 'America/Sao_Paulo'
    assert localized.hour == 9
    assert format_datetime(moment, 'pt-BR', style='short') == '05/01/2024 09:00'


def test_locale_metadata_helpers() -> None:
    profile = get_locale_profile('es-ES')
    assert profile.currency == 'EUR'
    assert get_currency('es-ES') == 'EUR'
    assert get_timezone('es-ES') == 'Europe/Madrid'
    info = describe_locale('es-ES')
    assert info['language'] == 'es'


def test_list_supported_locales() -> None:
    locales = list_supported_locales()
    assert {'en-US', 'pt-BR', 'es-ES'}.issubset(set(locales))
