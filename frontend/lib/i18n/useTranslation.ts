'use client';

import { useCallback, useMemo } from 'react';
import { useI18nContext } from './I18nProvider';
import type { TranslationValues } from './translator';

export function useTranslation(namespace?: string) {
  const { locale, ready, setLocale, t } = useI18nContext();

  const translate = useCallback(
    (key: string, values?: TranslationValues) => {
      const scopedKey = namespace ? `${namespace}.${key}` : key;
      return t(scopedKey, values);
    },
    [namespace, t]
  );

  return useMemo(
    () => ({
      locale,
      ready,
      t: translate,
      setLocale
    }),
    [locale, ready, translate, setLocale]
  );
}
