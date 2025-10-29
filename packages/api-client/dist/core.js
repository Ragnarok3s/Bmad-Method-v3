import snakeCase from 'lodash.snakecase';
export class CoreApiError extends Error {
    constructor(message, status, body) {
        super(message);
        this.status = status;
        this.body = body;
        this.name = 'CoreApiError';
    }
}
export class CoreApiClient {
    constructor(options) {
        var _a;
        this.baseUrl = new URL(options.baseUrl.replace(/\/$/, ''));
        this.getAccessToken = options.getAccessToken;
        this.fetchImpl = (_a = options.fetchImpl) !== null && _a !== void 0 ? _a : fetch;
    }
    async request(options) {
        var _a, _b, _c;
        const url = new URL(options.path, this.baseUrl);
        if (options.query) {
            for (const [key, value] of Object.entries(options.query)) {
                if (value === undefined || value === null) {
                    continue;
                }
                url.searchParams.set(snakeCase(key), String(value));
            }
        }
        const headers = {
            Accept: 'application/json',
            ...((_a = options.headers) !== null && _a !== void 0 ? _a : {})
        };
        let body;
        if (options.body instanceof FormData || typeof options.body === 'string') {
            body = options.body;
        }
        else if (options.body) {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(toSnakeCaseKeys(options.body));
        }
        const token = this.getAccessToken ? await this.getAccessToken() : null;
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        const response = await this.fetchImpl(url, {
            method: (_b = options.method) !== null && _b !== void 0 ? _b : 'GET',
            body,
            signal: options.signal,
            headers
        });
        if (!response.ok) {
            const payload = await safeReadJson(response);
            throw new CoreApiError(`Request to ${options.path} failed with status ${response.status}`, response.status, payload);
        }
        if (response.status === 204) {
            return undefined;
        }
        const contentType = (_c = response.headers.get('content-type')) !== null && _c !== void 0 ? _c : '';
        if (contentType.includes('application/json')) {
            return (await response.json());
        }
        return undefined;
    }
}
export function toSnakeCaseKeys(value) {
    const entries = Object.entries(value).map(([key, val]) => [snakeCase(key), val]);
    return Object.fromEntries(entries);
}
async function safeReadJson(response) {
    try {
        return await response.json();
    }
    catch (error) {
        return null;
    }
}
