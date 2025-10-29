from __future__ import annotations

import os
from abc import ABC, abstractmethod
from typing import Optional

import requests


class TranslationProvider(ABC):
    """Abstract provider responsible for translating strings between locales."""

    @abstractmethod
    def translate(self, text: str, source_locale: str, target_locale: str) -> str:
        """Translate *text* from ``source_locale`` to ``target_locale``."""


class EchoTranslator(TranslationProvider):
    """Fallback translator that returns the source text unchanged."""

    def translate(self, text: str, source_locale: str, target_locale: str) -> str:
        return text


class LibreTranslateProvider(TranslationProvider):
    """Adapter for LibreTranslate-compatible APIs."""

    def __init__(self, endpoint: str, api_key: Optional[str] = None) -> None:
        self._endpoint = endpoint.rstrip('/')
        self._api_key = api_key

    def translate(self, text: str, source_locale: str, target_locale: str) -> str:
        payload = {
            'q': text,
            'source': source_locale or 'auto',
            'target': target_locale,
            'format': 'text'
        }
        headers = {'Accept': 'application/json'}
        if self._api_key:
            headers['Authorization'] = f'Bearer {self._api_key}'
        response = requests.post(f'{self._endpoint}/translate', json=payload, headers=headers, timeout=15)
        response.raise_for_status()
        data = response.json()
        translated = data.get('translatedText')
        if not isinstance(translated, str):
            raise ValueError('Unexpected response from translation service')
        return translated


def get_translator() -> TranslationProvider:
    """Resolve the most suitable translation provider based on environment variables."""

    endpoint = os.getenv('LOCALIZATION_LIBRETRANSLATE_URL')
    if endpoint:
        return LibreTranslateProvider(endpoint, os.getenv('LOCALIZATION_LIBRETRANSLATE_API_KEY'))
    return EchoTranslator()
