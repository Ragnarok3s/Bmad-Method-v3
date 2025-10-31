import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ReservasPage from '../page';
import { CoreApiError, getReservations, updateReservationStatus } from '@/services/api/reservations';
import { reservationsFixture, reservationsSecondPageFixture } from '@/services/api/__mocks__/reservations';
import { useOffline } from '@/components/offline/OfflineContext';

jest.mock('@/services/api/reservations', () => {
  const actual = jest.requireActual('@/services/api/reservations');
  return {
    ...actual,
    getReservations: jest.fn(),
    updateReservationStatus: jest.fn()
  };
});

jest.mock('@/components/offline/OfflineContext', () => ({
  useOffline: jest.fn()
}));

const mockGetReservations = getReservations as jest.MockedFunction<typeof getReservations>;
const mockUpdateReservationStatus = updateReservationStatus as jest.MockedFunction<
  typeof updateReservationStatus
>;
const mockUseOffline = useOffline as jest.MockedFunction<typeof useOffline>;

type OfflineContextValue = {
  isOffline: boolean;
  pendingActions: string[];
  enqueueTaskUpdate: jest.Mock;
  removeTaskUpdate: jest.Mock;
  flushQueue: jest.Mock;
  onManualSync: jest.Mock;
  lastChangedAt: number | null;
  isSyncing: boolean;
};

function createOfflineContext(overrides: Partial<OfflineContextValue> = {}): OfflineContextValue {
  return {
    isOffline: false,
    pendingActions: [],
    enqueueTaskUpdate: jest.fn(),
    removeTaskUpdate: jest.fn(),
    flushQueue: jest.fn(),
    onManualSync: jest.fn(() => jest.fn()),
    lastChangedAt: null,
    isSyncing: false,
    ...overrides
  };
}

describe('ReservasPage', () => {
  beforeEach(() => {
    mockGetReservations.mockReset();
    mockUpdateReservationStatus.mockReset();
    mockUseOffline.mockReturnValue(createOfflineContext());
  });

  it('renders loading state while fetching reservations', async () => {
    mockGetReservations.mockReturnValue(new Promise(() => {}));

    render(<ReservasPage />);

    expect(await screen.findByTestId('reservations-loading')).toBeInTheDocument();
  });

  it('shows offline message when connectivity is lost', async () => {
    mockUseOffline.mockReturnValue(createOfflineContext({ isOffline: true }));

    render(<ReservasPage />);

    await waitFor(() => {
      expect(screen.getByTestId('reservations-error')).toHaveTextContent('Modo offline');
    });
    expect(mockGetReservations).not.toHaveBeenCalled();
  });

  it('renders reservations and allows pagination', async () => {
    mockGetReservations
      .mockResolvedValueOnce(reservationsFixture)
      .mockResolvedValueOnce(reservationsSecondPageFixture);

    render(<ReservasPage />);

    await waitFor(() => {
      expect(screen.getByText('Hóspede 1')).toBeInTheDocument();
    });

    expect(screen.getByTestId('reservations-summary')).toHaveTextContent(
      'A mostrar 3 de 6 reservas.'
    );
    expect(screen.getByText('Página 1 de 2')).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Próxima' }));

    await waitFor(() => {
      expect(screen.getByText('Hóspede 4')).toBeInTheDocument();
    });
    expect(screen.getByText('Página 2 de 2')).toBeInTheDocument();
  });

  it('updates reservation status when action is triggered', async () => {
    mockGetReservations.mockResolvedValue(reservationsFixture);
    mockUpdateReservationStatus.mockImplementation(async (id, payload) => {
      const original = reservationsFixture.items.find((item) => item.id === id);
      if (!original) {
        throw new Error('Reservation not found');
      }
      return { ...original, status: payload.status };
    });

    render(<ReservasPage />);

    await waitFor(() => {
      expect(screen.getByText('Registar check-in')).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Registar check-in' }));

    const guestCard = screen.getByText('Hóspede 1').closest('article');
    expect(guestCard).not.toBeNull();

    await waitFor(() => {
      expect(mockUpdateReservationStatus).toHaveBeenCalledWith(1, { status: 'checked_in' });
      expect(within(guestCard as HTMLElement).getByText('Hóspede em casa')).toBeInTheDocument();
    });
  });

  it('surfaces mutation errors when update fails', async () => {
    mockGetReservations.mockResolvedValue(reservationsFixture);
    mockUpdateReservationStatus.mockRejectedValue(new CoreApiError('fail', 503, null));

    render(<ReservasPage />);

    await waitFor(() => {
      expect(screen.getByText('Registar check-in')).toBeInTheDocument();
    });

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Registar check-in' }));

    await waitFor(() => {
      expect(screen.getByTestId('reservations-mutation-error')).toHaveTextContent(
        'Não foi possível atualizar a reserva'
      );
    });
  });

  it('renders service error when reservations cannot be loaded', async () => {
    mockGetReservations.mockRejectedValue(new CoreApiError('fail', 503, null));

    render(<ReservasPage />);

    await waitFor(() => {
      expect(screen.getByTestId('reservations-error')).toHaveTextContent(
        'Serviço de reservas indisponível'
      );
    });
  });
});
