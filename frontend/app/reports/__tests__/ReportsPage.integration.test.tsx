import { render, screen, waitFor } from '@testing-library/react';

import ReportsPage from '../page';
import { TenantProvider } from '@/lib/tenant-context';
import { getMultiTenantKpiReport } from '@/services/api/tenancy';
import { listProperties } from '@/services/api/properties';

jest.mock('../useKpiReport', () => {
  const refresh = jest.fn();
  return {
    useKpiReport: jest.fn(() => ({
      status: 'ready',
      data: {
        periodStart: '2024-01-01',
        periodEnd: '2024-01-31',
        generatedAt: '2024-02-01T00:00:00Z',
        items: [],
        summary: {
          propertiesCovered: 0,
          totalReservations: 0,
          totalOccupiedNights: 0,
          totalAvailableNights: 0,
          averageOccupancyRate: 0,
          revenueBreakdown: {}
        }
      },
      error: undefined,
      refresh
    }))
  };
});

jest.mock('@/services/api/tenancy', () => {
  const actual = jest.requireActual('@/services/api/tenancy');
  return {
    ...actual,
    getMultiTenantKpiReport: jest.fn()
  };
});

jest.mock('@/services/api/properties', () => {
  const actual = jest.requireActual('@/services/api/properties');
  return {
    ...actual,
    listProperties: jest.fn()
  };
});

const mockGetMultiTenantKpiReport = getMultiTenantKpiReport as jest.MockedFunction<
  typeof getMultiTenantKpiReport
>;
const mockListProperties = listProperties as jest.MockedFunction<typeof listProperties>;

const multiTenantFixture = {
  generatedAt: '2024-02-01T00:00:00Z',
  totalSummary: {
    propertiesCovered: 5,
    totalReservations: 42,
    totalOccupiedNights: 120,
    totalAvailableNights: 200,
    averageOccupancyRate: 0.6,
    revenueBreakdown: {
      BRL: 12345
    }
  },
  tenants: [
    {
      tenantSlug: 'alpha',
      tenantName: 'Alpha',
      generatedAt: '2024-02-01T00:00:00Z',
      items: [],
      summary: {
        propertiesCovered: 2,
        totalReservations: 21,
        totalOccupiedNights: 60,
        totalAvailableNights: 100,
        averageOccupancyRate: 0.6,
        revenueBreakdown: {
          BRL: 6000
        }
      }
    }
  ]
};

describe('ReportsPage tenant banners', () => {
  beforeEach(() => {
    mockGetMultiTenantKpiReport.mockResolvedValue(multiTenantFixture);
    mockListProperties.mockResolvedValue([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('avoids capability-driven banner flicker when tenant provider re-renders without changes', async () => {
    const tenantInfo = { slug: 'alpha', name: 'Alpha' };
    const capabilities = { canViewAggregatedReports: true, canProvisionWorkspaces: true };

    const element = (
      <TenantProvider mode="platform" tenant={tenantInfo} capabilities={capabilities}>
        <ReportsPage />
      </TenantProvider>
    );

    const { rerender } = render(element);

    await waitFor(() => {
      expect(mockGetMultiTenantKpiReport).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByText('Reservas totais')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockListProperties).toHaveBeenCalledTimes(1);
    });

    expect(screen.queryByText('Carregando visão consolidada…')).not.toBeInTheDocument();

    rerender(element);

    await waitFor(() => {
      expect(mockGetMultiTenantKpiReport).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockListProperties).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText('Visão multi-tenant')).toBeInTheDocument();
    expect(screen.queryByText('Carregando visão consolidada…')).not.toBeInTheDocument();
  });
});
