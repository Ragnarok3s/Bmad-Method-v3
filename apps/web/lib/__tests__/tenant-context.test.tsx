import type { ReactNode } from 'react';
import { renderHook } from '@testing-library/react';

import { TenantProvider, useTenant } from '../tenant-context';

describe('TenantProvider', () => {
  it('exposes tenant context via useTenant hook', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <TenantProvider
        mode="platform"
        tenant={{ slug: 'alpha', name: 'Alpha' }}
        platformToken="token-123"
        capabilities={{ canProvisionWorkspaces: false }}
      >
        {children}
      </TenantProvider>
    );

    const { result } = renderHook(() => useTenant(), { wrapper });

    expect(result.current.mode).toBe('platform');
    expect(result.current.tenant).toEqual({ slug: 'alpha', name: 'Alpha' });
    expect(result.current.platformToken).toBe('token-123');
    expect(result.current.capabilities.canViewAggregatedReports).toBe(true);
    expect(result.current.capabilities.canProvisionWorkspaces).toBe(false);
    expect(result.current.buildHeaders({ scope: 'platform' })).toEqual({
      'x-tenant-scope': 'platform',
      'x-tenant-platform-token': 'token-123'
    });
  });

  it('keeps context references stable when provider props remain unchanged', () => {
    const tenant = { slug: 'beta', name: 'Beta' };
    const capabilities = { canViewAggregatedReports: true, canProvisionWorkspaces: true };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <TenantProvider mode="platform" tenant={tenant} capabilities={capabilities}>
        {children}
      </TenantProvider>
    );

    const { result, rerender } = renderHook(() => useTenant(), { wrapper });

    const first = result.current;
    const initialHeaders = first.buildHeaders({ scope: 'platform' });

    rerender();

    const second = result.current;
    const rerenderHeaders = second.buildHeaders({ scope: 'platform' });

    expect(second).toBe(first);
    expect(second.buildHeaders).toBe(first.buildHeaders);
    expect(rerenderHeaders).toEqual(initialHeaders);
  });
});
