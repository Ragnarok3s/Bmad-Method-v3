from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP
from typing import Dict, Iterable, List
from zoneinfo import ZoneInfo

LocaleCode = str


@dataclass(frozen=True)
class LocaleProfile:
    code: LocaleCode
    language: str
    territory: str
    currency: str
    currency_symbol: str
    currency_position: str
    timezone: str
    decimal_separator: str
    group_separator: str
    datetime_formats: Dict[str, str]


SUPPORTED_LOCALES: Dict[LocaleCode, LocaleProfile] = {
    'en-US': LocaleProfile(
        code='en-US',
        language='en',
        territory='US',
        currency='USD',
        currency_symbol='$',
        currency_position='prefix',
        timezone='America/New_York',
        decimal_separator='.',
        group_separator=',',
        datetime_formats={
            'short': '%m/%d/%Y %H:%M',
            'medium': '%b %d, %Y %H:%M'
        }
    ),
    'pt-BR': LocaleProfile(
        code='pt-BR',
        language='pt',
        territory='BR',
        currency='BRL',
        currency_symbol='R$',
        currency_position='prefix',
        timezone='America/Sao_Paulo',
        decimal_separator=',',
        group_separator='.',
        datetime_formats={
            'short': '%d/%m/%Y %H:%M',
            'medium': '%d de %B de %Y %H:%M'
        }
    ),
    'es-ES': LocaleProfile(
        code='es-ES',
        language='es',
        territory='ES',
        currency='EUR',
        currency_symbol='€',
        currency_position='suffix',
        timezone='Europe/Madrid',
        decimal_separator=',',
        group_separator='.',
        datetime_formats={
            'short': '%d/%m/%Y %H:%M',
            'medium': '%d de %B de %Y %H:%M'
        }
    )
}

FALLBACK_LOCALE: LocaleCode = 'en-US'

_LOCALE_ALIASES = {
    'en': 'en-US',
    'en-us': 'en-US',
    'pt': 'pt-BR',
    'pt-br': 'pt-BR',
    'pt_br': 'pt-BR',
    'pt_pt': 'pt-BR',
    'es': 'es-ES',
    'es-es': 'es-ES'
}


def list_supported_locales() -> List[LocaleCode]:
    return list(SUPPORTED_LOCALES.keys())


def normalize_locale(locale: str | None) -> LocaleCode:
    if not locale:
        return FALLBACK_LOCALE
    lookup = locale.replace('-', '_').lower()
    if lookup in _LOCALE_ALIASES:
        return _LOCALE_ALIASES[lookup]
    canonical = locale.replace('_', '-')
    if canonical in SUPPORTED_LOCALES:
        return canonical
    return FALLBACK_LOCALE


def get_locale_profile(locale: str | None) -> LocaleProfile:
    normalized = normalize_locale(locale)
    return SUPPORTED_LOCALES.get(normalized, SUPPORTED_LOCALES[FALLBACK_LOCALE])


def get_currency(locale: str | None) -> str:
    return get_locale_profile(locale).currency


def get_timezone(locale: str | None) -> str:
    return get_locale_profile(locale).timezone


def to_timezone(moment: datetime, locale: str | None = None) -> datetime:
    profile = get_locale_profile(locale)
    tz = ZoneInfo(profile.timezone)
    if moment.tzinfo is None:
        moment = moment.replace(tzinfo=timezone.utc)
    return moment.astimezone(tz)


def _format_number(value: Decimal, profile: LocaleProfile) -> str:
    sign = '-' if value < 0 else ''
    quantized = abs(value)
    integral, fractional = f"{quantized:.2f}".split('.')
    grouped = _group_digits(integral, profile.group_separator)
    return f"{sign}{grouped}{profile.decimal_separator}{fractional}"


def _group_digits(value: str, separator: str) -> str:
    parts: List[str] = []
    while value:
        parts.append(value[-3:])
        value = value[:-3]
    return separator.join(reversed(parts or ['0']))


def format_currency(amount: float | int | Decimal, locale: str | None = None) -> str:
    profile = get_locale_profile(locale)
    value = Decimal(str(amount)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    formatted = _format_number(value, profile)
    if profile.currency_position == 'suffix':
        return f"{formatted} {profile.currency_symbol}"
    return f"{profile.currency_symbol} {formatted}"


def format_datetime(moment: datetime, locale: str | None = None, style: str = 'medium') -> str:
    profile = get_locale_profile(locale)
    localized = to_timezone(moment, profile.code)
    fmt = profile.datetime_formats.get(style, profile.datetime_formats['medium'])
    return localized.strftime(fmt)


def describe_locale(locale: str | None) -> Dict[str, str]:
    profile = get_locale_profile(locale)
    return {
        'code': profile.code,
        'currency': profile.currency,
        'timezone': profile.timezone,
        'language': profile.language,
        'territory': profile.territory
    }


__all__ = [
    'LocaleProfile',
    'describe_locale',
    'format_currency',
    'format_datetime',
    'get_currency',
    'get_locale_profile',
    'get_timezone',
    'list_supported_locales',
    'normalize_locale',
    'to_timezone'
]
