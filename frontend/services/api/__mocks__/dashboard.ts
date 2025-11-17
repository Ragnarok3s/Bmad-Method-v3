import type { DashboardMetrics } from '../dashboard';

export const dashboardMetricsFixture: DashboardMetrics = {
  occupancy: {
    date: new Date().toISOString().slice(0, 10),
    occupiedUnits: 128,
    totalUnits: 160,
    occupancyRate: 0.8
  },
  nps: {
    score: 62,
    totalResponses: 184,
    trend7d: 4.2
  },
  sla: {
    total: 48,
    onTrack: 33,
    atRisk: 9,
    breached: 6,
    worstOffenders: ['Lavandaria Atlântica', 'Manutenção Express']
  },
  operational: {
    criticalAlerts: {
      total: 7,
      blocked: 2,
      overdue: 3,
      examples: [
        {
          taskId: 9034,
          propertyId: 18,
          status: 'blocked',
          scheduledDate: new Date(Date.now() - 1000 * 60 * 45).toISOString()
        },
        {
          taskId: 9012,
          propertyId: 24,
          status: 'pending',
          scheduledDate: new Date(Date.now() - 1000 * 60 * 90).toISOString()
        },
        {
          taskId: 8999,
          propertyId: 7,
          status: 'in_progress',
          scheduledDate: new Date(Date.now() - 1000 * 60 * 120).toISOString()
        }
      ]
    },
    playbookAdoption: {
      periodStart: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
      periodEnd: new Date().toISOString(),
      totalExecutions: 92,
      completed: 81,
      adoptionRate: 0.64,
      activeProperties: 28
    },
    housekeepingCompletionRate: {
      name: 'Execução de Housekeeping',
      value: 87,
      unit: '%',
      status: 'Última atualização sincronizada via rede móvel'
    },
    otaSyncBacklog: {
      name: 'Pendências OTA',
      value: 14,
      unit: 'reservas',
      status: 'Integração expediu lote às 06h32'
    }
  }
};
