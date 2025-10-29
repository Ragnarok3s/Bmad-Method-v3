import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { BmadApiClient, createApiClient } from '@bmad/api-client';

interface ApiProviderProps {
  children: ReactNode;
  baseUrl?: string;
}

const ApiContext = createContext<BmadApiClient | null>(null);

export function ApiProvider({ children, baseUrl }: ApiProviderProps): JSX.Element {
  const client = useMemo(() => {
    const url = baseUrl ?? process.env.EXPO_PUBLIC_CORE_API_BASE_URL ?? 'http://localhost:8000';
    return createApiClient({ baseUrl: url });
  }, [baseUrl]);

  return <ApiContext.Provider value={client}>{children}</ApiContext.Provider>;
}

export function useApiClient(): BmadApiClient {
  const ctx = useContext(ApiContext);
  if (!ctx) {
    throw new Error('useApiClient must be used within ApiProvider');
  }
  return ctx;
}
