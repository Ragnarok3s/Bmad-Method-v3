export type MarketplaceClientOptions = {
  baseUrl: string;
  token?: string;
  fetchFn?: typeof fetch;
};

export type ListAppsParams = {
  categories?: string[];
};

export type MarketplaceApp = {
  id: string;
  name: string;
  description: string;
  categories: string[];
  contractVersion: string;
  sandboxOnly: boolean;
  iconUrl?: string | null;
};

export type Contract = {
  version: string;
  summary: string;
  scopes: string[];
  webhookEndpoints: string[];
  rateLimitPerMinute: number;
  sandboxRequired: boolean;
};

export type InstallRequest = {
  workspaceId: string;
  scopes: string[];
  grantedBy: string;
  sandboxRequested?: boolean;
  correlationId?: string;
};

export type InstallResponse = {
  sandboxId?: string;
  expiresAt?: string;
  credentials?: Record<string, string>;
};

export class MarketplaceClient {
  private readonly baseUrl: URL;
  private readonly token?: string;
  private readonly fetchFn: typeof fetch;

  constructor(options: MarketplaceClientOptions) {
    if (!options.baseUrl) {
      throw new Error('baseUrl is required');
    }
    this.baseUrl = new URL(options.baseUrl);
    this.token = options.token;
    this.fetchFn = options.fetchFn ?? fetch;
  }

  async listApps(params: ListAppsParams = {}): Promise<MarketplaceApp[]> {
    const url = new URL('/apps', this.baseUrl);
    if (params.categories?.length) {
      params.categories.forEach((category) => {
        url.searchParams.append('categories', category);
      });
    }
    const response = await this.request(url);
    return (await response.json()) as MarketplaceApp[];
  }

  async getContract(partnerId: string): Promise<Contract> {
    const url = new URL(`/apps/${partnerId}/contract`, this.baseUrl);
    const response = await this.request(url);
    return (await response.json()) as Contract;
  }

  async requestInstall(partnerId: string, body: InstallRequest): Promise<InstallResponse> {
    const url = new URL(`/apps/${partnerId}/install`, this.baseUrl);
    const response = await this.request(url, {
      method: 'POST',
      body: JSON.stringify(body)
    });
    return (await response.json()) as InstallResponse;
  }

  private async request(url: URL, init: RequestInit = {}): Promise<Response> {
    const headers = new Headers(init.headers);
    headers.set('accept', 'application/json');
    if (init.body) {
      headers.set('content-type', 'application/json');
    }
    if (this.token) {
      headers.set('authorization', `Bearer ${this.token}`);
    }
    const response = await this.fetchFn(url, { ...init, headers });
    if (!response.ok) {
      const message = await safeReadError(response);
      throw new Error(`Marketplace API error: ${response.status} ${message}`);
    }
    return response;
  }
}

async function safeReadError(response: Response): Promise<string> {
  try {
    const json = await response.clone().json();
    if (typeof json === 'string') {
      return json;
    }
    if (json && typeof json.detail === 'string') {
      return json.detail;
    }
    return JSON.stringify(json);
  } catch (error) {
    try {
      return await response.clone().text();
    } catch (_err) {
      return 'unknown';
    }
  }
}
