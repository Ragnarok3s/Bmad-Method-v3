import snakeCase from 'lodash.snakecase';

export interface CoreApiClientOptions {
  baseUrl: string;
  getAccessToken?: () => Promise<string | null> | string | null;
  fetchImpl?: typeof fetch;
}

export class CoreApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body: unknown
  ) {
    super(message);
    this.name = 'CoreApiError';
  }
}

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface RequestOptions {
  method?: HttpMethod;
  path: string;
  query?: Record<string, string | number | boolean | undefined | null>;
  body?: Record<string, unknown> | FormData | string | null;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

export class CoreApiClient {
  private readonly baseUrl: URL;
  private readonly getAccessToken?: CoreApiClientOptions['getAccessToken'];
  private readonly fetchImpl: typeof fetch;

  constructor(options: CoreApiClientOptions) {
    this.baseUrl = new URL(options.baseUrl.replace(/\/$/, ''));
    this.getAccessToken = options.getAccessToken;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  public async request<TResponse>(options: RequestOptions): Promise<TResponse> {
    const url = new URL(options.path, this.baseUrl);
    if (options.query) {
      for (const [key, value] of Object.entries(options.query)) {
        if (value === undefined || value === null) {
          continue;
        }
        url.searchParams.set(snakeCase(key), String(value));
      }
    }

    const headers: Record<string, string> = {
      Accept: 'application/json',
      ...(options.headers ?? {})
    };

    let body: BodyInit | undefined;
    if (options.body instanceof FormData || typeof options.body === 'string') {
      body = options.body;
    } else if (options.body) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(toSnakeCaseKeys(options.body));
    }

    const token = this.getAccessToken ? await this.getAccessToken() : null;
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await this.fetchImpl(url, {
      method: options.method ?? 'GET',
      body,
      signal: options.signal,
      headers
    });

    if (!response.ok) {
      const payload = await safeReadJson(response);
      throw new CoreApiError(
        `Request to ${options.path} failed with status ${response.status}`,
        response.status,
        payload
      );
    }

    if (response.status === 204) {
      return undefined as TResponse;
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      return (await response.json()) as TResponse;
    }

    return undefined as TResponse;
  }
}

export function toSnakeCaseKeys<T extends Record<string, unknown>>(value: T): Record<string, unknown> {
  const entries = Object.entries(value).map(([key, val]) => [snakeCase(key), val] as const);
  return Object.fromEntries(entries);
}

async function safeReadJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}
