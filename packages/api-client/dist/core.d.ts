export interface CoreApiClientOptions {
    baseUrl: string;
    getAccessToken?: () => Promise<string | null> | string | null;
    fetchImpl?: typeof fetch;
}
export declare class CoreApiError extends Error {
    readonly status: number;
    readonly body: unknown;
    constructor(message: string, status: number, body: unknown);
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
export declare class CoreApiClient {
    private readonly baseUrl;
    private readonly getAccessToken?;
    private readonly fetchImpl;
    constructor(options: CoreApiClientOptions);
    request<TResponse>(options: RequestOptions): Promise<TResponse>;
}
export declare function toSnakeCaseKeys<T extends Record<string, unknown>>(value: T): Record<string, unknown>;
//# sourceMappingURL=core.d.ts.map