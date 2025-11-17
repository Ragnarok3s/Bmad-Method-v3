import { render, screen, waitFor, within } from '@testing-library/react';

import OwnerPropertiesPage from '../propriedades/page';
import { fetchOwnerProperties, resolveOwnerToken } from '@/services/api/owners';

jest.mock('../OwnerAccessContext', () => ({
  useOwnerAccess: () => ({
    ownerId: 99,
    token: 'owner-token',
    status: 'authenticated',
    authenticate: jest.fn(),
    logout: jest.fn()
  })
}));

jest.mock('@/services/api/owners', () => {
  const actual = jest.requireActual('@/services/api/owners');
  return {
    ...actual,
    fetchOwnerProperties: jest.fn(),
    resolveOwnerToken: jest.fn()
  };
});

const mockFetchOwnerProperties =
  fetchOwnerProperties as jest.MockedFunction<typeof fetchOwnerProperties>;
const mockResolveOwnerToken = resolveOwnerToken as jest.MockedFunction<typeof resolveOwnerToken>;

const propertyFixtures = [
  {
    propertyId: 101,
    propertyName: 'Lisboa Downtown Boutique',
    occupancyRate: 0.87,
    revenueMtd: 18200,
    adr: 142,
    lastIncidentAt: '2024-06-02T10:00:00Z',
    issuesOpen: 1
  },
  {
    propertyId: 102,
    propertyName: 'Porto Riverside Lofts',
    occupancyRate: 0.78,
    revenueMtd: 15840,
    adr: 135,
    lastIncidentAt: null,
    issuesOpen: 0
  },
  {
    propertyId: 103,
    propertyName: 'Coimbra Business Suites',
    occupancyRate: 0.69,
    revenueMtd: 9000,
    adr: 118,
    lastIncidentAt: '2024-05-25T10:00:00Z',
    issuesOpen: 2
  },
  {
    propertyId: 104,
    propertyName: 'Faro Beach Villas',
    occupancyRate: 0.91,
    revenueMtd: 12650,
    adr: 156,
    lastIncidentAt: '2024-05-30T10:00:00Z',
    issuesOpen: 0
  }
];

describe('OwnerPropertiesPage', () => {
  beforeEach(() => {
    mockFetchOwnerProperties.mockReset();
    mockResolveOwnerToken.mockReset();
  });

  it('renders the four accommodations for the owner portfolio', async () => {
    mockResolveOwnerToken.mockReturnValue('resolved-owner-token');
    mockFetchOwnerProperties.mockResolvedValue(propertyFixtures);

    render(<OwnerPropertiesPage />);

    expect(await screen.findByText('A carregar inventário…')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId('owner-properties-list')).toBeInTheDocument();
    });

    const cards = within(screen.getByTestId('owner-properties-list')).getAllByRole('article');
    expect(cards).toHaveLength(4);

    const coimbraCard = cards.find((card) =>
      within(card).queryByRole('heading', { name: 'Coimbra Business Suites' })
    );
    expect(coimbraCard).toHaveAttribute('data-accent', 'critical');

    const lisbonCard = within(cards[0]);
    expect(
      lisbonCard.getByRole('heading', { name: 'Lisboa Downtown Boutique' })
    ).toBeInTheDocument();
    expect(lisbonCard.getByText(/Ocupação 87/)).toBeInTheDocument();
    expect(lisbonCard.getByText(/ADR .*142/)).toBeInTheDocument();
  });

  it('shows a friendly error when properties cannot be loaded', async () => {
    mockResolveOwnerToken.mockReturnValue('resolved-owner-token');
    mockFetchOwnerProperties.mockRejectedValue(new Error('Network down'));

    render(<OwnerPropertiesPage />);

    await waitFor(() => {
      expect(
        screen.getByText('Não foi possível carregar propriedades.')
      ).toBeInTheDocument();
    });
  });
});
