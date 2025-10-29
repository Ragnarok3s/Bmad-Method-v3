'use client';

import { createContext, useContext, useMemo } from 'react';

export type TenantMode = 'tenant' | 'platform';

export interface TenantInfo {
  slug: string;
  name?: string;
}

export interface TenantCapabilities {
  canViewAggregatedReports: boolean;
  canProvisionWorkspaces: boolean;
}

interface BuildHeadersOptions {
  scope?: TenantMode;
  tenantSlug?: string;
}

export interface TenantContextValue {
  mode: TenantMode;
  tenant?: TenantInfo;
  platformToken?: string | null;
  capabilities: TenantCapabilities;
  buildHeaders: (options?: BuildHeadersOptions) => Record<string, string>;
}

const TenantContext = createContext<TenantContextValue | null>(null);

interface TenantProviderProps {
  children: React.ReactNode;
  tenant?: TenantInfo;
  mode?: TenantMode;
  platformToken?: string | null;
  capabilities?: Partial<TenantCapabilities>;
}

function resolveInitialMode(): TenantMode {
  const scope = process.env.NEXT_PUBLIC_TENANT_SCOPE;
  return scope === 'platform' ? 'platform' : 'tenant';
}

function resolveInitialTenant(): TenantInfo | undefined {
  const slug = process.env.NEXT_PUBLIC_TENANT_SLUG;
  if (!slug) {
    return undefined;
  }
  return {
    slug,
    name: process.env.NEXT_PUBLIC_TENANT_NAME ?? slug
  };
}

export function TenantProvider({
  children,
  tenant,
  mode,
  platformToken,
  capabilities
}: TenantProviderProps) {
  const resolvedMode = mode ?? resolveInitialMode();
  const resolvedTenant = tenant ?? resolveInitialTenant();
  const resolvedToken =
    platformToken ?? process.env.NEXT_PUBLIC_TENANT_PLATFORM_TOKEN ?? null;
  const resolvedCapabilities: TenantCapabilities = {
    canViewAggregatedReports: resolvedMode === 'platform',
    canProvisionWorkspaces: resolvedMode === 'platform',
    ...capabilities
  };

  const value = useMemo<TenantContextValue>(() => {
    function buildHeaders(options?: BuildHeadersOptions): Record<string, string> {
      const headers: Record<string, string> = {};
      const targetScope = options?.scope ?? resolvedMode;
      const overrideSlug = options?.tenantSlug;

      if (targetScope === 'platform') {
        headers['x-tenant-scope'] = 'platform';
        if (resolvedToken) {
          headers['x-tenant-platform-token'] = resolvedToken;
        }
        if (overrideSlug) {
          headers['x-tenant-slug'] = overrideSlug;
        }
      } else {
        const activeSlug = overrideSlug ?? resolvedTenant?.slug;
        if (activeSlug) {
          headers['x-tenant-slug'] = activeSlug;
        }
      }
      return headers;
    }

    return {
      mode: resolvedMode,
      tenant: resolvedTenant,
      platformToken: resolvedToken,
      capabilities: resolvedCapabilities,
      buildHeaders
    };
  }, [resolvedMode, resolvedTenant, resolvedToken, resolvedCapabilities]);

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
}

export function useTenant(): TenantContextValue {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('TenantProvider não encontrado no contexto da aplicação');
  }
  return context;
}
