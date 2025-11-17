import { ReactNode } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import CalendarPage from '../page';

jest.mock('@/services/api/index', () => ({
  fetchPropertyCalendar: jest.fn(),
  fetchInventoryReconciliation: jest.fn(),
  resolveInventoryReconciliationItem: jest.fn()
}));

type ApiModule = typeof import('@/services/api/index');

const {
  fetchPropertyCalendar: mockFetchPropertyCalendar,
  fetchInventoryReconciliation: mockFetchInventoryReconciliation,
  resolveInventoryReconciliationItem: mockResolveInventoryReconciliationItem
} = jest.requireMock('@/services/api/index') as {
  fetchPropertyCalendar: jest.MockedFunction<ApiModule['fetchPropertyCalendar']>;
  fetchInventoryReconciliation: jest.MockedFunction<
    ApiModule['fetchInventoryReconciliation']
  >;
  resolveInventoryReconciliationItem: jest.MockedFunction<
    ApiModule['resolveInventoryReconciliationItem']
  >;
};

const calendarResponse = {
  reservations: [
    {
      id: 101,
      checkIn: '2024-06-10T15:00:00Z',
      checkOut: '2024-06-12T11:00:00Z',
      createdAt: '2024-05-20T09:00:00Z',
      status: 'confirmed',
      guestName: 'Maria Souza',
      guestEmail: 'maria@example.com',
      totalAmountMinor: 180000,
      currencyCode: 'EUR'
    }
  ],
  reconciliationItems: [
    {
      id: 401,
      status: 'pending',
      source: 'manual',
      attempts: 2,
      externalBookingId: 'EXT-7788',
      payload: { channel: 'booking', mismatch: 'inventory' },
      updatedAt: '2024-06-01T10:00:00Z'
    }
  ],
  generatedAt: '2024-06-01T08:30:00Z'
};

const reconciliationResponse = {
  items: [
    {
      id: 301,
      status: 'pending',
      source: 'ota',
      attempts: 3,
      externalBookingId: 'OTA-991',
      payload: { source: 'Airbnb', mismatch: 'double booking' },
      updatedAt: '2024-06-03T12:00:00Z'
    }
  ],
  pendingCount: 2
};

function renderWithQueryClient(children: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity
      }
    }
  });

  return render(
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('CalendarPage', () => {
  beforeEach(() => {
    mockFetchPropertyCalendar.mockReset();
    mockFetchInventoryReconciliation.mockReset();
    mockResolveInventoryReconciliationItem.mockReset();
  });

  afterAll(() => {
    mockFetchPropertyCalendar.mockRestore();
    mockFetchInventoryReconciliation.mockRestore();
    mockResolveInventoryReconciliationItem.mockRestore();
  });

  it('renders filters and data from the calendar and reconciliation queues', async () => {
    mockFetchPropertyCalendar.mockResolvedValue(calendarResponse as never);
    mockFetchInventoryReconciliation.mockResolvedValue(
      reconciliationResponse as never
    );

    renderWithQueryClient(<CalendarPage />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: 'Calendário operacional unificado'
        })
      ).toBeInTheDocument();
    });

    const filtersToolbar = screen.getByRole('toolbar', {
      name: 'Filtros do calendário'
    });
    expect(within(filtersToolbar).getByLabelText('Data inicial')).toBeInTheDocument();
    expect(within(filtersToolbar).getByText('Visualização')).toBeInTheDocument();
    expect(
      within(filtersToolbar).getByRole('button', { name: 'Eventos completos' })
    ).toHaveAttribute('aria-pressed', 'true');

    const statusFilterGroup = screen.getByLabelText(
      'Filtro por status de reconciliação'
    );
    expect(
      within(statusFilterGroup).getByRole('button', { name: /^Todos/ })
    ).toBeInTheDocument();
    expect(
      within(statusFilterGroup).getByRole('button', { name: /Pendentes/ })
    ).toBeInTheDocument();

    const typeFilterGroup = screen.getByLabelText(
      'Filtro por tipo de reconciliação'
    );
    expect(
      within(typeFilterGroup).getByRole('button', { name: /^Todos os tipos/ })
    ).toBeInTheDocument();

    expect(await screen.findByText('2 pendentes')).toBeInTheDocument();
    expect(await screen.findByText('Reserva #101')).toBeInTheDocument();
    expect(await screen.findByText('Item #301')).toBeInTheDocument();
  });

  it('shows loading states while calendar and reconciliation data are being fetched', () => {
    mockFetchPropertyCalendar.mockReturnValue(new Promise(() => {}) as never);
    mockFetchInventoryReconciliation.mockReturnValue(
      new Promise(() => {}) as never
    );

    renderWithQueryClient(<CalendarPage />);

    expect(
      screen.getByText('A carregar calendário…')
    ).toBeInTheDocument();
    expect(
      screen.getByText('A carregar fila de reconciliação…')
    ).toBeInTheDocument();
  });

  it('displays error states when calendar or reconciliation requests fail', async () => {
    mockFetchPropertyCalendar.mockRejectedValue(new Error('calendar fail'));
    mockFetchInventoryReconciliation.mockRejectedValue(
      new Error('reconciliation fail')
    );

    renderWithQueryClient(<CalendarPage />);

    await waitFor(() => {
      expect(
        screen.getByText('Não foi possível carregar o calendário')
      ).toBeInTheDocument();
    });

    expect(screen.getByText('calendar fail')).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText('Não foi possível carregar a reconciliação')
      ).toBeInTheDocument();
    });

    expect(screen.getByText('reconciliation fail')).toBeInTheDocument();
  });

  it('allows reconciling an item and updates the queue after success', async () => {
    mockFetchPropertyCalendar.mockResolvedValue(calendarResponse as never);
    mockFetchInventoryReconciliation
      .mockResolvedValueOnce(reconciliationResponse as never)
      .mockResolvedValueOnce({ items: [], pendingCount: 0 } as never);
    mockResolveInventoryReconciliationItem.mockImplementation(
      () => new Promise<void>((resolve) => setTimeout(resolve, 0))
    );

    renderWithQueryClient(<CalendarPage />);

    const reconcileButton = await screen.findByRole('button', {
      name: 'Conciliar manualmente'
    });

    await userEvent.click(reconcileButton);

    await waitFor(() => {
      expect(reconcileButton).toBeDisabled();
    });

    await waitFor(() => {
      expect(reconcileButton).toHaveTextContent('A conciliar…');
    });

    await waitFor(() => {
      expect(mockResolveInventoryReconciliationItem).toHaveBeenCalledWith(1, 301);
    });

    await waitFor(() => {
      expect(screen.getByText(/Item reconciliado manualmente/)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(mockFetchInventoryReconciliation).toHaveBeenCalledTimes(2);
    });

    await waitFor(() => {
      expect(screen.queryByText('Item #301')).not.toBeInTheDocument();
    });
  });
});
