import type { PartnerSla } from '../partners';

export const partnerSlasFixture: PartnerSla[] = [
  {
    id: 1,
    metric: 'pickup_time',
    metricLabel: 'Recolha de lavandaria',
    targetMinutes: 120,
    warningMinutes: 150,
    breachMinutes: 180,
    currentMinutes: 164,
    status: 'at_risk',
    lastViolationAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    updatedAt: new Date().toISOString(),
    partner: {
      id: 31,
      name: 'Lavandaria Atlântica',
      slug: 'lavandaria-atlantica',
      category: 'logistica'
    }
  },
  {
    id: 2,
    metric: 'maintenance_response',
    metricLabel: 'Resposta de manutenção',
    targetMinutes: 90,
    warningMinutes: 110,
    breachMinutes: 140,
    currentMinutes: 86,
    status: 'on_track',
    lastViolationAt: null,
    updatedAt: new Date().toISOString(),
    partner: {
      id: 17,
      name: 'Manutenção Express',
      slug: 'manutencao-express',
      category: 'servicos'
    }
  },
  {
    id: 3,
    metric: 'inventory_restock',
    metricLabel: 'Reposição de amenities',
    targetMinutes: 60,
    warningMinutes: 75,
    breachMinutes: 90,
    currentMinutes: 104,
    status: 'breached',
    lastViolationAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    updatedAt: new Date().toISOString(),
    partner: {
      id: 48,
      name: 'SupplyOne',
      slug: 'supplyone',
      category: 'fornecedor'
    }
  }
];
