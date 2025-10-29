import { MessageDictionary, MessageValue } from './catalog';

export type TranslationValues = Record<string, string | number | boolean | Date>;

function isDictionary(value: MessageValue): value is MessageDictionary {
  return typeof value === 'object' && value !== null;
}

function resolveMessage(dictionary: MessageDictionary, key: string): string | undefined {
  const segments = key.split('.');
  let current: MessageValue = dictionary;
  for (const segment of segments) {
    if (!isDictionary(current)) {
      return undefined;
    }
    if (!(segment in current)) {
      return undefined;
    }
    current = current[segment];
  }
  return typeof current === 'string' ? current : undefined;
}

function stringifyValue(value: string | number | boolean | Date): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return String(value);
}

function formatTemplate(template: string, values?: TranslationValues): string {
  if (!values) {
    return template;
  }
  return template.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (match, token) => {
    if (!(token in values)) {
      return match;
    }
    return stringifyValue(values[token]);
  });
}

export function translate(
  messages: MessageDictionary | null,
  fallbackMessages: MessageDictionary | null,
  key: string,
  values?: TranslationValues
): string {
  const primary = messages ? resolveMessage(messages, key) : undefined;
  const fallback = !primary && fallbackMessages ? resolveMessage(fallbackMessages, key) : undefined;
  const resolved = primary ?? fallback;
  if (!resolved) {
    return key;
  }
  return formatTemplate(resolved, values);
}
