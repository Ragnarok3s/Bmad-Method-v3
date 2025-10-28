'use client';

import { useMemo, useState } from 'react';

import { SectionHeader } from '@/components/layout/SectionHeader';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { Card } from '@/components/ui/Card';
import { FilterPill } from '@/components/ui/FilterPill';
import { StatusBadge } from '@/components/ui/StatusBadge';

const statusFilters = [
  { id: 'all', label: 'Todas', description: 'Eventos confirmados, bloqueios e reconciliações' },
  { id: 'confirmed', label: 'Confirmadas', description: 'Reservas publicadas sem pendências' },
  { id: 'conflict', label: 'Conflitos', description: 'Necessitam revisão manual' },
  { id: 'manual', label: 'Em reconciliação', description: 'Fila manual atribuída a operadores' }
] as const;

type StatusFilterId = (typeof statusFilters)[number]['id'];

type CalendarEntry = {
  id: string;
  property: string;
  unit: string;
  channel: string;
  status: StatusFilterId | 'blocked';
  start: string;
  end: string;
  guests: string;
  notes?: string;
  conflictReason?: string;
};

type QueueItem = {
  id: string;
  partner: string;
  version: string;
  detectedAt: string;
  slaTarget: string;
  status: 'pending' | 'in_review' | 'resolved';
  summary: string;
  bookingCode: string;
};

const inventoryEntries: CalendarEntry[] = [
  {
    id: 'bk-001',
    property: 'Hotel Solaris',
    unit: 'Piso 3 · Suite 305',
    channel: 'Booking.com',
    status: 'confirmed',
    start: '2024-09-18 14:00',
    end: '2024-09-21 11:00',
    guests: 'Ana & Pedro',
    notes: 'Upgrade automático · early check-in garantido'
  },
  {
    id: 'ab-441',
    property: 'Casa Horizonte',
    unit: 'Casa inteira',
    channel: 'Airbnb',
    status: 'conflict',
    start: '2024-09-19 15:00',
    end: '2024-09-23 10:00',
    guests: 'Bruno',
    conflictReason: 'OTA sinalizou alteração fora da janela de SLA (8 min)'
  },
  {
    id: 'ex-990',
    property: 'Expedia Palace',
    unit: 'Torre Leste · 2107',
    channel: 'Expedia',
    status: 'manual',
    start: '2024-09-20 13:00',
    end: '2024-09-22 11:00',
    guests: 'Clara & Igor',
    notes: 'Revisão de tarifa · aguardando confirmação financeira'
  },
  {
    id: 'direct-32',
    property: 'Residencial Atlântico',
    unit: 'Cobertura 801',
    channel: 'Canal direto',
    status: 'blocked',
    start: '2024-09-20 08:00',
    end: '2024-09-20 18:00',
    guests: 'Manutenção preventiva',
    notes: 'Bloqueio operacional · vistoria engenharia'
  }
];

const reconciliationQueue: QueueItem[] = [
  {
    id: 'queue-1',
    partner: 'Booking.com',
    version: 'v3 · vigente desde 2024-08-01',
    detectedAt: '2024-09-19 11:04',
    slaTarget: '≤ 5 min',
    status: 'pending',
    summary: 'Reserva BK-123 excedeu SLA em 2 minutos após atualização de hóspedes.',
    bookingCode: 'BK-123'
  },
  {
    id: 'queue-2',
    partner: 'Airbnb',
    version: 'v2 · vigente desde 2024-08-18',
    detectedAt: '2024-09-18 17:42',
    slaTarget: '≤ 5 min',
    status: 'in_review',
    summary: 'Alteração de datas sem disponibilidade equivalente. Necessário ajustar bloqueio.',
    bookingCode: 'AB-777'
  }
];

const slaTimeline = [
  {
    partner: 'Booking.com',
    metric: 'Ingestão de reservas',
    version: 'v3',
    target: '≤ 5 min',
    warning: '≥ 6 min gera alerta',
    breach: '≥ 10 min envia conflito manual'
  },
  {
    partner: 'Expedia',
    metric: 'Retorno OTA',
    version: 'v1',
    target: '≤ 5 min',
    warning: '≥ 7 min notifica suporte',
    breach: '≥ 10 min coloca fila manual'
  },
  {
    partner: 'Airbnb',
    metric: 'Atualização de tarifas',
    version: 'v2',
    target: '≤ 4 min',
    warning: '≥ 5 min gera playbook',
    breach: '≥ 8 min bloqueia publicação'
  }
];

export default function CalendarPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilterId>('all');
  const [queueState, setQueueState] = useState(reconciliationQueue);

  const filteredEntries = useMemo(() => {
    if (statusFilter === 'all') {
      return inventoryEntries;
    }
    return inventoryEntries.filter((entry) => entry.status === statusFilter);
  }, [statusFilter]);

  const handleToggleFilter = (nextFilter: StatusFilterId) => {
    setStatusFilter((current) => (current === nextFilter ? 'all' : nextFilter));
  };

  const handleManualReconcile = (id: string) => {
    setQueueState((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'resolved',
              summary: `${item.summary} · Conciliado manualmente às ${new Date().toLocaleTimeString('pt-BR').slice(0, 5)}`
            }
          : item
      )
    );
  };

  const pendingCount = queueState.filter((item) => item.status !== 'resolved').length;

  return (
    <div className="calendar-page">
      <SectionHeader subtitle="Visão consolidada de inventário, canais OTA e reconciliação" actions={<button type="button">Exportar ICS</button>}>
        Calendário operacional unificado
      </SectionHeader>

      <div className="filter-bar" role="toolbar" aria-label="Filtros do calendário">
        {statusFilters.map((filter) => (
          <FilterPill
            key={filter.id}
            label={filter.label}
            selected={statusFilter === filter.id}
            count={filter.id === 'conflict' ? pendingCount : undefined}
            onToggle={() => handleToggleFilter(filter.id)}
          >
            <span className="filter-description">{filter.description}</span>
          </FilterPill>
        ))}
      </div>

      <ResponsiveGrid columns={2}>
        {filteredEntries.map((entry) => (
          <Card
            key={entry.id}
            title={`${entry.property} · ${entry.unit}`}
            description={`${entry.channel} · ${entry.start} → ${entry.end}`}
            accent={entry.status === 'conflict' ? 'critical' : entry.status === 'manual' ? 'warning' : undefined}
          >
            <div className="card-content">
              <div>
                <strong>Hóspedes:</strong> {entry.guests}
              </div>
              {entry.notes && <div className="card-note">{entry.notes}</div>}
              {entry.conflictReason && (
                <div className="card-conflict">
                  <StatusBadge variant="critical">Conflito OTA</StatusBadge>
                  <span>{entry.conflictReason}</span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </ResponsiveGrid>

      <SectionHeader subtitle="Filas de reconciliação com SLA versionado" actions={<StatusBadge variant="warning">{pendingCount} pendentes</StatusBadge>}>
        Reconciliação manual
      </SectionHeader>

      <ResponsiveGrid columns={2}>
        {queueState.map((item) => (
          <Card
            key={item.id}
            title={`${item.partner} · ${item.bookingCode}`}
            description={`${item.version} · Detectado às ${item.detectedAt}`}
            accent={item.status === 'resolved' ? 'success' : item.status === 'in_review' ? 'warning' : 'critical'}
          >
            <div className="queue-row">
              <StatusBadge variant={item.status === 'resolved' ? 'success' : item.status === 'in_review' ? 'warning' : 'critical'}>
                {item.status === 'resolved' ? 'Resolvido' : item.status === 'in_review' ? 'Em análise' : 'Pendente'}
              </StatusBadge>
              <span className="queue-target">SLA: {item.slaTarget}</span>
            </div>
            <p>{item.summary}</p>
            {item.status !== 'resolved' && (
              <button type="button" className="manual-button" onClick={() => handleManualReconcile(item.id)}>
                Conciliar manualmente
              </button>
            )}
          </Card>
        ))}
      </ResponsiveGrid>

      <SectionHeader subtitle="Histórico de versões de SLA por parceiro">
        Linha do tempo de SLAs
      </SectionHeader>

      <ResponsiveGrid columns={3}>
        {slaTimeline.map((sla) => (
          <Card key={`${sla.partner}-${sla.metric}`} title={`${sla.partner} · ${sla.metric}`}>
            <ul className="sla-list">
              <li>
                <strong>Versão ativa:</strong> {sla.version}
              </li>
              <li>
                <strong>Meta:</strong> {sla.target}
              </li>
              <li>
                <strong>Alerta:</strong> {sla.warning}
              </li>
              <li>
                <strong>Quebra:</strong> {sla.breach}
              </li>
            </ul>
          </Card>
        ))}
      </ResponsiveGrid>

      <style jsx>{`
        .calendar-page {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }
        .filter-bar {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-3);
        }
        .filter-description {
          font-size: 0.75rem;
          color: var(--color-neutral-2);
        }
        .card-content {
          display: grid;
          gap: var(--space-2);
        }
        .card-note {
          color: var(--color-neutral-2);
        }
        .card-conflict {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          color: var(--color-neutral-2);
        }
        .queue-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-2);
        }
        .queue-target {
          font-weight: 600;
          color: var(--color-deep-blue);
        }
        .manual-button,
        .calendar-page button {
          border: none;
          border-radius: var(--radius-sm);
          background: var(--color-deep-blue);
          color: #fff;
          padding: var(--space-2) var(--space-4);
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s ease-in-out;
        }
        .manual-button:hover,
        .calendar-page button:hover {
          background: var(--color-midnight);
        }
        .sla-list {
          margin: 0;
          padding-left: var(--space-5);
          display: grid;
          gap: var(--space-1);
        }
      `}</style>
    </div>
  );
}
