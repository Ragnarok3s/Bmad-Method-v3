import { render, screen, waitFor, within } from '@testing-library/react';

import DashboardPage from '../page';
import { CoreApiError } from '@/services/api/housekeeping';
import { dashboardMetricsFixture } from '@/services/api/__mocks__/dashboard';
import { partnerSlasFixture } from '@/services/api/__mocks__/partners';
import { getDashboardMetrics } from '@/services/api/dashboard';
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

const mockGetDashboardMetrics = getDashboardMetrics as jest.MockedFunction<
  typeof getDashboardMetrics
>;
const mockGetPartnerSlas = getPartnerSlas as jest.MockedFunction<typeof getPartnerSlas>;

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
      message: 'Fallback offline metrics.'
    });
    mockGetPartnerSlas.mockResolvedValue({
      status: 'degraded',
      data: partnerSlasFixture,
      message: 'Fallback offline SLAs.'
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-recovery-cta')).toBeInTheDocument();
    });

    expect(screen.getAllByText('Modo offline').length).toBeGreaterThan(0);
    expect(screen.getByTestId('kpi-occupancy-annotation')).toHaveTextContent('Modo offline');
    expect(screen.getByTestId('kpi-occupancy-annotation')).toHaveAttribute(
      'title',
      expect.stringContaining('Fallback offline metrics')
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
});
