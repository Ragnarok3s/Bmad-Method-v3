import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { axe } from 'jest-axe';
import AgentesPage from '../page';
import {
  type AgentCatalogItem,
  type UseAgentsCatalogResult,
  useAgentsCatalog
} from '@/services/api/agents';

jest.mock('@/components/analytics/AnalyticsContext', () => ({
  __esModule: true,
  AnalyticsProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAnalytics: () => ({
    track: jest.fn(),
    flushQueue: jest.fn()
  })
}));

jest.mock('@/lib/tenant-context', () => ({
  __esModule: true,
  useTenant: () => ({ tenant: { slug: 'lisboa' } })
}));

jest.mock('@/services/api/agents', () => {
  const actual = jest.requireActual('@/services/api/agents');
  return {
    ...actual,
    useAgentsCatalog: jest.fn()
  };
});

const mockedUseAgentsCatalog = jest.mocked(useAgentsCatalog);

function createAgent(overrides: Partial<AgentCatalogItem> = {}): AgentCatalogItem {
  return {
    slug: 'agente-1',
    name: 'Agente Polaris',
    tagline: 'Automação para equipas de hospitalidade',
    description: 'Descrição detalhada do agente Polaris.',
    role: 'assistente',
    competencies: ['Integração com CRM'],
    availability: 'available',
    availabilityLabel: 'Disponível',
    responseTimeMinutes: 3,
    automationLevel: 'Total',
    integrations: ['PMS'],
    languages: ['pt-PT'],
    ...overrides
  };
}

function createCatalogResult(
  overrides: Partial<UseAgentsCatalogResult>
): UseAgentsCatalogResult {
  return {
    items: [],
    pagination: { page: 1, pageSize: 6, total: 0, totalPages: 0 },
    availableFilters: { competencies: [], availability: [] },
    filters: { competencies: [], availability: [], page: 1, pageSize: 6 },
    loading: false,
    error: null,
    setCompetencies: jest.fn(),
    setAvailability: jest.fn(),
    setPage: jest.fn(),
    refresh: jest.fn(),
    ...overrides
  };
}

describe('AgentesPage accessibility', () => {
  afterEach(() => {
    mockedUseAgentsCatalog.mockReset();
  });

  it('anuncia erro com foco e sem violações de acessibilidade', async () => {
    const result = createCatalogResult({ error: new Error('Falha') });
    mockedUseAgentsCatalog.mockReturnValue(result);

    const { container } = render(<AgentesPage />);
    const alert = await screen.findByRole('alert');

    await waitFor(() => expect(alert).toHaveFocus());
    await expect(axe(container)).resolves.toHaveNoViolations();
  });

  it('anuncia estado vazio com foco automático e aria-live', async () => {
    const result = createCatalogResult({ items: [], loading: false, error: null });
    mockedUseAgentsCatalog.mockReturnValue(result);

    const { container } = render(<AgentesPage />);
    const statusRegions = await screen.findAllByRole('status');
    const emptyState = statusRegions.find((element) =>
      element.textContent?.includes('Nenhum agente encontrado com os filtros atuais')
    );

    expect(emptyState).toBeDefined();
    await waitFor(() => expect(emptyState).toHaveFocus());
    await expect(axe(container)).resolves.toHaveNoViolations();
  });

  it('foca a navegação da paginação quando a página muda e resume via aria-live', async () => {
    const result = createCatalogResult({
      items: [createAgent()],
      pagination: { page: 1, pageSize: 6, total: 12, totalPages: 2 },
      filters: { competencies: [], availability: [], page: 1, pageSize: 6 }
    });

    mockedUseAgentsCatalog.mockReturnValue(result);

    const { rerender } = render(<AgentesPage />);
    const summaryBefore = screen
      .getAllByRole('status')
      .find((element) => element.textContent?.includes('Página 1 de 2'));
    expect(summaryBefore).toBeDefined();

    result.filters = { ...result.filters, page: 2 };
    result.pagination = { page: 2, pageSize: 6, total: 12, totalPages: 2 };

    rerender(<AgentesPage />);

    const summaryAfter = screen
      .getAllByRole('status')
      .find((element) => element.textContent?.includes('Página 2 de 2'));
    expect(summaryAfter).toBeDefined();

    const pagination = screen.getByRole('navigation', { name: 'Paginação do catálogo de agentes' });
    await waitFor(() => expect(pagination).toHaveFocus());
  });
});
