'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  getFallbackLocale,
  loadLocaleMessages,
  normalizeLocaleCode,
  type LocaleCode,
  type MessageDictionary
} from './catalog';
import { translate, type TranslationValues } from './translator';

type I18nContextValue = {
  locale: LocaleCode;
  ready: boolean;
  setLocale: (locale: string) => void;
  t: (key: string, values?: TranslationValues) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

function determineInitialLocale(initialLocale?: string): LocaleCode {
  if (initialLocale) {
    return normalizeLocaleCode(initialLocale);
  }
  if (typeof document !== 'undefined' && document.documentElement?.lang) {
    return normalizeLocaleCode(document.documentElement.lang);
  }
  if (typeof navigator !== 'undefined' && navigator.language) {
    return normalizeLocaleCode(navigator.language);
  }
  return getFallbackLocale();
}

export function I18nProvider({
  initialLocale,
  children
}: {
  initialLocale?: string;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<LocaleCode>(() => determineInitialLocale(initialLocale));
  const [messages, setMessages] = useState<MessageDictionary | null>(null);
  const [fallbackMessages, setFallbackMessages] = useState<MessageDictionary | null>(null);
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    setReady(false);
    loadLocaleMessages(locale)
      .then((loaded) => {
        if (mounted) {
          setMessages(loaded);
          setReady(true);
        }
      })
      .catch(() => {
        if (mounted) {
          setMessages(null);
          setReady(true);
        }
      });
    return () => {
      mounted = false;
    };
  }, [locale]);

  useEffect(() => {
    let mounted = true;
    const fallbackLocale = getFallbackLocale();
    loadLocaleMessages(fallbackLocale)
      .then((loaded) => {
        if (mounted) {
          setFallbackMessages(loaded);
        }
      })
      .catch(() => {
        if (mounted) {
          setFallbackMessages(null);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const value = useMemo<I18nContextValue>(() => {
    return {
      locale,
      ready,
      setLocale: (next) => setLocaleState(normalizeLocaleCode(next)),
      t: (key: string, values?: TranslationValues) => translate(messages, fallbackMessages, key, values)
    };
  }, [locale, ready, messages, fallbackMessages]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18nContext(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18nContext must be used within I18nProvider');
  }
  return context;
}
