import { BmadApiClient, createApiClient } from '@bmad/api-client';

let client: BmadApiClient | null = null;

export function getApiClient(): BmadApiClient {
  if (!client) {
    const baseUrl = process.env.NEXT_PUBLIC_CORE_API_BASE_URL ?? 'http://localhost:8000';
    const fetchProxy: typeof fetch = (input, init) => globalThis.fetch(input, init);

    client = createApiClient({
      baseUrl,
      fetchImpl: fetchProxy
    });
  }
  return client;
}

export function resetApiClient(): void {
  client = null;
}
