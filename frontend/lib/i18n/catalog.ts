export type MessageValue = string | MessageDictionary;
export type MessageDictionary = { [key: string]: MessageValue };
export type LocaleCode = 'en' | 'pt-BR';

const FALLBACK_LOCALE: LocaleCode = 'en';

const LOCALE_LOADERS: Record<LocaleCode, () => Promise<MessageDictionary>> = {
  en: async () => (await import('./locales/en.json')).default,
  'pt-BR': async () => (await import('./locales/pt-BR.json')).default
};

const LOCALE_ALIASES: Record<string, LocaleCode> = {
  en: 'en',
  'en-us': 'en',
  'en-gb': 'en',
  pt: 'pt-BR',
  'pt-br': 'pt-BR',
  'pt-pt': 'pt-BR',
  'pt_br': 'pt-BR'
};

const catalogCache = new Map<LocaleCode, Promise<MessageDictionary>>();

export function normalizeLocaleCode(input?: string | null): LocaleCode {
  if (!input) {
    return FALLBACK_LOCALE;
  }
  const normalized = input.trim();
  if (!normalized) {
    return FALLBACK_LOCALE;
  }
  const lookupKey = normalized.toLowerCase();
  if (lookupKey in LOCALE_ALIASES) {
    return LOCALE_ALIASES[lookupKey];
  }
  if ((LOCALE_LOADERS as Record<string, unknown>)[normalized]) {
    return normalized as LocaleCode;
  }
  return FALLBACK_LOCALE;
}

export function getFallbackLocale(): LocaleCode {
  return FALLBACK_LOCALE;
}

export function listSupportedLocales(): LocaleCode[] {
  return Object.keys(LOCALE_LOADERS) as LocaleCode[];
}

export async function loadLocaleMessages(locale: string): Promise<MessageDictionary> {
  const normalized = normalizeLocaleCode(locale);
  if (!catalogCache.has(normalized)) {
    const loader = LOCALE_LOADERS[normalized];
    catalogCache.set(
      normalized,
      loader().catch(async () => {
        if (normalized !== FALLBACK_LOCALE) {
          return LOCALE_LOADERS[FALLBACK_LOCALE]();
        }
        return {};
      })
    );
  }
  return catalogCache.get(normalized)!;
}
