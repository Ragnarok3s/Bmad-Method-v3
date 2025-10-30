import { render, screen, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import AgentsPage from '../page';
import {
  useAgentsCatalog,
  type AgentCatalogItem,
  type UseAgentsCatalogResult
} from '@/services/api/agents';

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
    slug: 'agent-1',
    name: 'Agente Orion',
    tagline: 'Hiperautomação para equipas de hospitalidade',
    description: 'Descrição detalhada do agente.',
    role: 'assistente',
    competencies: ['Integração com CRM'],
    availability: 'available',
    availabilityLabel: 'Disponível',
    responseTimeMinutes: 5,
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

describe('AgentsPage accessibility', () => {
  afterEach(() => {
    mockedUseAgentsCatalog.mockReset();
  });

  it('gera alerta de erro focável sem violações de acessibilidade', async () => {
    const result = createCatalogResult({ error: new Error('Falha') });
    mockedUseAgentsCatalog.mockReturnValue(result);

    const { container } = render(<AgentsPage />);
    const alert = await screen.findByRole('alert');

    await waitFor(() => expect(alert).toHaveFocus());
    await expect(axe(container)).resolves.toHaveNoViolations();
  });

  it('gera estado vazio anunciável com foco automático', async () => {
    const result = createCatalogResult({ items: [], loading: false, error: null });
    mockedUseAgentsCatalog.mockReturnValue(result);

    const { container } = render(<AgentsPage />);
    const statuses = await screen.findAllByRole('status');
    const emptyState = statuses.find((element) =>
      element.textContent?.includes('Nenhum agente encontrado com os filtros atuais')
    );

    expect(emptyState).toBeDefined();
    await waitFor(() => expect(emptyState).toHaveFocus());
    await expect(axe(container)).resolves.toHaveNoViolations();
  });

  it('foca a paginação quando a página atual muda', async () => {
    const result = createCatalogResult({
      items: [createAgent()],
      pagination: { page: 1, pageSize: 6, total: 12, totalPages: 2 },
      filters: { competencies: [], availability: [], page: 1, pageSize: 6 }
    });

    mockedUseAgentsCatalog.mockReturnValue(result);

    const { rerender } = render(<AgentsPage />);
    expect(screen.getByRole('navigation', { name: 'Paginação do catálogo de agentes' })).toBeInTheDocument();

    result.filters = { ...result.filters, page: 2 };
    result.pagination = { page: 2, pageSize: 6, total: 12, totalPages: 2 };

    rerender(<AgentsPage />);

    const pagination = screen.getByRole('navigation', { name: 'Paginação do catálogo de agentes' });
    await waitFor(() => expect(pagination).toHaveFocus());
  });
});
