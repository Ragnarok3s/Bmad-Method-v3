import { render, screen, waitFor, within } from '@testing-library/react';

import DashboardPage from '../page';
import { CoreApiError } from '@/services/api/housekeeping';
import { dashboardMetricsFixture } from '@/services/api/__mocks__/dashboard';
import { partnerSlasFixture } from '@/services/api/__mocks__/partners';
import { DashboardMetrics, getDashboardMetrics } from '@/services/api/dashboard';
import { getPartnerSlas } from '@/services/api/partners';

jest.mock('@/services/api/dashboard', () => {
  const actual = jest.requireActual('@/services/api/dashboard');
  return {
    ...actual,
    getDashboardMetrics: jest.fn()
  };
});

jest.mock('@/services/api/partners', () => {
  const actual = jest.requireActual('@/services/api/partners');
  return {
    ...actual,
    getPartnerSlas: jest.fn()
  };
});

jest.mock('@/components/tour/TourLauncher', () => ({
  TourLauncher: () => <div data-testid="tour-launcher" />
}));

const mockGetDashboardMetrics = getDashboardMetrics as jest.MockedFunction<typeof getDashboardMetrics>;
const mockGetPartnerSlas = getPartnerSlas as jest.MockedFunction<typeof getPartnerSlas>;

const emptyMetrics: DashboardMetrics = {
  occupancy: {
    date: '2024-01-01',
    occupiedUnits: 0,
    totalUnits: 0,
    occupancyRate: 0
  },
  nps: {
    score: 0,
    totalResponses: 0,
    trend7d: null
  },
  sla: {
    total: 0,
    onTrack: 0,
    atRisk: 0,
    breached: 0,
    worstOffenders: []
  },
  operational: {
    criticalAlerts: {
      total: 0,
      blocked: 0,
      overdue: 0,
      examples: []
    },
    playbookAdoption: {
      periodStart: '2024-01-01T00:00:00.000Z',
      periodEnd: '2024-01-07T00:00:00.000Z',
      totalExecutions: 0,
      completed: 0,
      adoptionRate: 0,
      activeProperties: 0
    },
    housekeepingCompletionRate: {
      name: 'Execução de Housekeeping',
      value: 0,
      unit: '%',
      status: null
    },
    otaSyncBacklog: {
      name: 'Pendências OTA',
      value: 0,
      unit: 'reservas',
      status: null
    }
  }
};

describe('DashboardPage', () => {
  beforeEach(() => {
    mockGetDashboardMetrics.mockReset();
    mockGetPartnerSlas.mockReset();
  });

  it('renders loading state while fetching data', () => {
    mockGetDashboardMetrics.mockReturnValue(new Promise(() => {}));
    mockGetPartnerSlas.mockReturnValue(new Promise(() => {}));

    render(<DashboardPage />);

    expect(screen.getByTestId('kpi-occupancy-loading')).toHaveTextContent(
      'Carregando métricas do core...'
    );
    const statusBanner = screen.getByTestId('dashboard-status-banner');
    expect(within(statusBanner).getByText('A sincronizar…')).toBeInTheDocument();
    expect(screen.queryByTestId('dashboard-recovery-cta')).not.toBeInTheDocument();
  });

  it('renders offline fallback data when core API is degraded', async () => {
    mockGetDashboardMetrics.mockResolvedValue({
      status: 'degraded',
      data: dashboardMetricsFixture,
      message:
        'Não foi possível contactar o Core API. A mostrar métricas de exemplo enquanto a ligação é restabelecida.'
    });
    mockGetPartnerSlas.mockResolvedValue({
      status: 'degraded',
      data: partnerSlasFixture,
      message: 'Não foi possível contactar o Core API. A mostrar SLAs de exemplo até à reconexão.'
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-recovery-cta')).toBeInTheDocument();
    });

    expect(screen.getAllByText('Modo offline').length).toBeGreaterThan(0);
    expect(screen.getByTestId('kpi-occupancy-annotation')).toHaveTextContent('Modo offline');
    expect(screen.getByTestId('kpi-occupancy-annotation')).toHaveAttribute(
      'title',
      expect.stringContaining('Não foi possível contactar o Core API')
    );
    expect(screen.getByTestId('sla-offline-banner')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Configurações > Integrações' })
    ).toBeInTheDocument();
  });

  it('renders temporary error state when dashboard metrics fail', async () => {
    mockGetDashboardMetrics.mockRejectedValue(new CoreApiError('fail', 503, null));
    mockGetPartnerSlas.mockResolvedValue({
      status: 'live',
      data: partnerSlasFixture
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId('kpi-occupancy-error')).toBeInTheDocument();
    });

    const errorBanner = screen.getByTestId('dashboard-status-banner');
    expect(within(errorBanner).getByText('Erro temporário')).toBeInTheDocument();
    expect(screen.getByTestId('kpi-occupancy-annotation')).toHaveAttribute(
      'title',
      expect.stringContaining('Erro temporário')
    );
    expect(screen.getByTestId('dashboard-recovery-cta')).toBeInTheDocument();
    expect(screen.getByText('Valide as credenciais e tokens do Core API.')).toBeInTheDocument();
  });

  it('renders initial empty state when metrics and SLAs contain no data', async () => {
    mockGetDashboardMetrics.mockResolvedValue({ status: 'live', data: emptyMetrics });
    mockGetPartnerSlas.mockResolvedValue({ status: 'live', data: [] });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId('kpi-occupancy-empty')).toHaveTextContent('Sem inventário cadastrado.');
    });

    expect(screen.getByTestId('dashboard-status-banner')).toHaveTextContent('Configuração inicial');
    expect(screen.getByTestId('kpi-occupancy-annotation')).toHaveTextContent('Configuração inicial');
    expect(screen.getByTestId('kpi-occupancy-annotation')).toHaveAttribute(
      'title',
      expect.stringContaining('Conclua a configuração inicial para começar a acompanhar as métricas.')
    );
  });
});
