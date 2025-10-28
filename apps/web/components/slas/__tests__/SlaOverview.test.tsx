import { render } from '@testing-library/react';

import { SlaOverview } from '../SlaOverview';

const SAMPLE_SLAS = [
  {
    id: 1,
    metric: 'pickup_window',
    metricLabel: 'Janela de recolha',
    targetMinutes: 45,
    warningMinutes: 60,
    breachMinutes: 90,
    currentMinutes: 40,
    status: 'on_track' as const,
    lastViolationAt: null,
    updatedAt: '2024-07-22T10:00:00Z',
    partner: {
      id: 1,
      name: 'AirLaundry',
      slug: 'airlaundry',
      category: 'lavandaria'
    }
  },
  {
    id: 2,
    metric: 'repair_dispatch',
    metricLabel: 'Despacho manutenção',
    targetMinutes: 60,
    warningMinutes: 75,
    breachMinutes: 90,
    currentMinutes: 72,
    status: 'at_risk' as const,
    lastViolationAt: null,
    updatedAt: '2024-07-22T09:45:00Z',
    partner: {
      id: 2,
      name: 'FixItNow',
      slug: 'fixitnow',
      category: 'manutenção'
    }
  },
  {
    id: 3,
    metric: 'api_availability',
    metricLabel: 'Disponibilidade API',
    targetMinutes: 15,
    warningMinutes: 30,
    breachMinutes: 45,
    currentMinutes: 58,
    status: 'breached' as const,
    lastViolationAt: '2024-07-22T08:55:00Z',
    updatedAt: '2024-07-22T09:00:00Z',
    partner: {
      id: 3,
      name: 'Partner OTA Hub',
      slug: 'partner-ota-hub',
      category: 'ota'
    }
  }
];

describe('SlaOverview', () => {
  it('renderiza os estados principais de SLA', () => {
    const { container } = render(<SlaOverview slas={SAMPLE_SLAS} context="home" />);
    expect(container).toMatchSnapshot();
  });
});
