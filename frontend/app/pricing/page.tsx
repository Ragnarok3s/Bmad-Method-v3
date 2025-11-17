'use client';

import { FormEvent, useMemo, useState } from 'react';

import { Card } from '@/components/ui/Card';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface CompetitorRate {
  channel: string;
  amountMinor: number;
}

interface SimulationBreakdown {
  name: 'occupancy' | 'seasonality' | 'competition';
  factor: number;
  contributionMinor: number;
  context: Record<string, string | number>;
}

interface SimulationResult {
  baseRateMinor: number;
  recommendedRateMinor: number;
  currencyCode: string;
  nights: number;
  occupancyRate: number;
  seasonalIndex: number;
  competitorIndex: number;
  expectedDeltaMinor: number;
  components: SimulationBreakdown[];
}

interface PendingUpdate {
  reservationId: number;
  guest: string;
  currentRateMinor: number;
  recommendedRateMinor: number;
  currencyCode: string;
  status?: 'ready' | 'synced' | 'manual';
  manualReason?: string;
  selected: boolean;
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

const defaultCompetitors: CompetitorRate[] = [
  { channel: 'Booking.com', amountMinor: 52000 },
  { channel: 'Expedia', amountMinor: 54800 },
  { channel: 'Airbnb', amountMinor: 50500 }
];

const defaultUpdates: PendingUpdate[] = [
  {
    reservationId: 9812,
    guest: 'Ana Souza',
    currentRateMinor: 49800,
    recommendedRateMinor: 54600,
    currencyCode: 'BRL',
    selected: true
  },
  {
    reservationId: 9818,
    guest: 'Grupo Atlas',
    currentRateMinor: 71200,
    recommendedRateMinor: 76800,
    currencyCode: 'BRL',
    selected: true
  },
  {
    reservationId: 9823,
    guest: 'Diego Martins',
    currentRateMinor: 46200,
    recommendedRateMinor: 48900,
    currencyCode: 'BRL',
    selected: false
  }
];

function minorToMajor(amountMinor: number, currency: string) {
  return currencyFormatter.format(amountMinor / 100);
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

export default function PricingPage() {
  const [propertyId, setPropertyId] = useState('501');
  const [checkIn, setCheckIn] = useState('2024-08-15');
  const [checkOut, setCheckOut] = useState('2024-08-20');
  const [baseRateMinor, setBaseRateMinor] = useState(54000);
  const [competitors, setCompetitors] = useState<CompetitorRate[]>(defaultCompetitors);
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [updates, setUpdates] = useState<PendingUpdate[]>(defaultUpdates);
  const [isPublishing, setIsPublishing] = useState(false);

  const nights = useMemo(() => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(1, Math.round(diff));
  }, [checkIn, checkOut]);

  const competitorAverage = useMemo(() => {
    if (!competitors.length) {
      return null;
    }
    const values = competitors.map((item) => item.amountMinor);
    const total = values.reduce((acc, value) => acc + value, 0);
    return total / values.length;
  }, [competitors]);

  async function handleSimulate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      property_id: Number(propertyId),
      base_rate_minor: baseRateMinor,
      currency_code: 'BRL',
      check_in: `${checkIn}T15:00:00Z`,
      check_out: `${checkOut}T11:00:00Z`,
      competitor_rates: competitors.map((item) => ({
        channel: item.channel,
        amount_minor: item.amountMinor
      }))
    };

    try {
      const response = await fetch('/api/core/pricing/simulate', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-actor-id': '101'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        setSimulation({
          baseRateMinor: result.base_rate_minor ?? payload.base_rate_minor,
          recommendedRateMinor: result.recommended_rate_minor,
          currencyCode: result.currency_code,
          nights: result.nights ?? nights,
          occupancyRate: result.occupancy_rate,
          seasonalIndex: result.seasonal_index,
          competitorIndex: result.competitor_index,
          expectedDeltaMinor: result.expected_revenue_delta_minor,
          components: result.components ?? []
        });
        return;
      }
    } catch (error) {
      console.warn('Falha ao chamar API de simulação, usando fallback local.', error);
    }

    const competitorIndex = competitorAverage
      ? competitorAverage / baseRateMinor
      : 1;

    const fallback: SimulationResult = {
      baseRateMinor,
      recommendedRateMinor: Math.round(baseRateMinor * 1.08),
      currencyCode: 'BRL',
      nights,
      occupancyRate: 0.81,
      seasonalIndex: 0.63,
      competitorIndex,
      expectedDeltaMinor: Math.round(baseRateMinor * 0.08 * nights),
      components: [
        {
          name: 'occupancy',
          factor: 0.12,
          contributionMinor: Math.round(baseRateMinor * 0.12),
          context: {
            current_ratio: 0.78,
            baseline_ratio: 0.62
          }
        },
        {
          name: 'seasonality',
          factor: 0.04,
          contributionMinor: Math.round(baseRateMinor * 0.04),
          context: {
            seasonal_index: 0.63
          }
        },
        {
          name: 'competition',
          factor: -0.08,
          contributionMinor: Math.round(baseRateMinor * -0.08),
          context: {
            competitor_index: Number(competitorIndex.toFixed(2))
          }
        }
      ]
    };

    setSimulation(fallback);
  }

  function handleToggleReservation(reservationId: number) {
    setUpdates((current) =>
      current.map((update) =>
        update.reservationId === reservationId
          ? { ...update, selected: !update.selected }
          : update
      )
    );
  }

  async function handlePublish() {
    setIsPublishing(true);
    const selected = updates.filter((update) => update.selected);
    const payload = {
      property_id: Number(propertyId),
      updates: selected.map((update) => ({
        reservation_id: update.reservationId,
        rate_minor: update.recommendedRateMinor,
        currency_code: update.currencyCode,
        reason: 'Ajuste inteligente de yield',
        expected_accuracy: simulation ? Math.min(0.95, Math.max(0.55, simulation.occupancyRate)) : undefined
      }))
    };

    try {
      const response = await fetch('/api/core/reservations/pricing', {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          'x-actor-id': '101'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        setUpdates((current) =>
          current.map((update) => {
            const serverResult = result.results?.find(
              (item: any) => item.reservation_id === update.reservationId
            );
            if (!serverResult) {
              return update;
            }
            return {
              ...update,
              status: serverResult.status === 'synced' ? 'synced' : 'manual',
              manualReason: serverResult.manual_fallback_reason ?? undefined
            };
          })
        );
        setIsPublishing(false);
        return;
      }
    } catch (error) {
      console.warn('Falha ao aplicar publicação em lote, usando resultado offline.', error);
    }

    setUpdates((current) =>
      current.map((update) =>
        update.selected
          ? { ...update, status: 'manual', manualReason: 'Requer revisão OTA manual' }
          : update
      )
    );
    setIsPublishing(false);
  }

  return (
    <div>
      <SectionHeader subtitle="Combine dados de ocupação, sazonalidade e concorrência para otimizar tarifas.">
        Centro de Inteligência de Pricing
      </SectionHeader>

      <Card
        title="Simular estratégia"
        description="Gere previsões de impacto antes de publicar ajustes."
        accent="info"
      >
        <form className="pricing-form" onSubmit={handleSimulate}>
          <div className="form-grid">
            <label>
              <span>Propriedade</span>
              <input
                value={propertyId}
                onChange={(event) => setPropertyId(event.target.value)}
                required
              />
            </label>
            <label>
              <span>Check-in</span>
              <input
                type="date"
                value={checkIn}
                onChange={(event) => setCheckIn(event.target.value)}
                required
              />
            </label>
            <label>
              <span>Check-out</span>
              <input
                type="date"
                value={checkOut}
                onChange={(event) => setCheckOut(event.target.value)}
                required
              />
            </label>
            <label>
              <span>Tarifa base</span>
              <input
                type="number"
                value={baseRateMinor}
                onChange={(event) => setBaseRateMinor(Number(event.target.value))}
                required
                min={1000}
                step={100}
              />
            </label>
          </div>
          <div className="competitor-list">
            <strong>Concorrentes monitorados</strong>
            <ResponsiveGrid columns={competitors.length || 1}>
              {competitors.map((competitor) => (
                <div key={competitor.channel} className="competitor-item">
                  <span>{competitor.channel}</span>
                  <strong>{minorToMajor(competitor.amountMinor, 'BRL')}</strong>
                </div>
              ))}
            </ResponsiveGrid>
          </div>
          <button type="submit">Simular tarifa dinâmica</button>
        </form>
      </Card>

      {simulation && (
        <>
          <SectionHeader subtitle="Analise cada componente do algoritmo e compare com a concorrência.">
            Resultado da simulação
          </SectionHeader>
          <ResponsiveGrid columns={3}>
            <Card
              title="Tarifa recomendada"
              description={`Projeção para ${nights} noite(s)`}
              accent="success"
            >
              <div className="highlight">
                {minorToMajor(simulation.recommendedRateMinor, simulation.currencyCode)}
              </div>
              <p>
                Base atual: <strong>{minorToMajor(simulation.baseRateMinor, simulation.currencyCode)}</strong>
              </p>
              <p>
                Variação esperada: <strong>{minorToMajor(simulation.expectedDeltaMinor, simulation.currencyCode)}</strong>
              </p>
            </Card>
            <Card title="Sensibilidade" description="Confiabilidade do modelo" accent="info">
              <ul>
                <li>Ocupação projetada: {formatPercent(simulation.occupancyRate)}</li>
                <li>Índice sazonal: {formatPercent(simulation.seasonalIndex)}</li>
                <li>Pressão competitiva: {formatPercent(simulation.competitorIndex - 1)}</li>
              </ul>
            </Card>
            <Card title="Detalhamento" description="Pesos do algoritmo" accent="warning">
              <ul>
                {simulation.components.map((component) => (
                  <li key={component.name}>
                    <strong>{component.name}</strong>{' '}
                    ({formatPercent(component.factor)}) ·{' '}
                    {minorToMajor(component.contributionMinor, simulation.currencyCode)}
                  </li>
                ))}
              </ul>
            </Card>
          </ResponsiveGrid>
        </>
      )}

      <SectionHeader subtitle="Selecione as reservas e publique ajustes em lote com auditoria automática.">
        Publicação inteligente
      </SectionHeader>

      <Card
        title="Reservas impactadas"
        description="Conferir difusão para OTAs e fallback manual quando necessário."
        accent="info"
      >
        <div className="updates-grid">
          {updates.map((update) => {
            const spread = update.recommendedRateMinor - update.currentRateMinor;
            return (
              <div key={update.reservationId} className="update-row">
                <label>
                  <input
                    type="checkbox"
                    checked={update.selected}
                    onChange={() => handleToggleReservation(update.reservationId)}
                  />
                  <span>
                    <strong>#{update.reservationId}</strong> · {update.guest}
                  </span>
                </label>
                <div className="amounts">
                  <span>{minorToMajor(update.currentRateMinor, update.currencyCode)}</span>
                  <span className="arrow">→</span>
                  <strong>{minorToMajor(update.recommendedRateMinor, update.currencyCode)}</strong>
                </div>
                <div className="spread">
                  {minorToMajor(spread, update.currencyCode)}
                </div>
                <div className="status">
                  {update.status ? (
                    <StatusBadge variant={update.status === 'synced' ? 'success' : 'warning'}>
                      {update.status === 'synced' ? 'OTA sincronizada' : 'Ação manual'}
                    </StatusBadge>
                  ) : (
                    <StatusBadge variant={update.selected ? 'info' : 'neutral'}>
                      {update.selected ? 'Pronto para publicar' : 'Ignorado'}
                    </StatusBadge>
                  )}
                  {update.manualReason && <small>{update.manualReason}</small>}
                </div>
              </div>
            );
          })}
        </div>
        <div className="actions">
          <button onClick={handlePublish} disabled={isPublishing}>
            {isPublishing ? 'Publicando...' : 'Publicar em lote'}
          </button>
        </div>
      </Card>

      <style jsx>{`
        .pricing-form {
          display: grid;
          gap: var(--space-5);
        }
        .form-grid {
          display: grid;
          gap: var(--space-4);
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        }
        label {
          display: grid;
          gap: var(--space-2);
          font-size: 0.95rem;
        }
        input {
          padding: var(--space-2);
          border-radius: var(--radius-md);
          border: 1px solid rgba(15, 23, 42, 0.1);
        }
        button {
          justify-self: flex-start;
          padding: var(--space-2) var(--space-4);
          border-radius: var(--radius-md);
          border: none;
          cursor: pointer;
          background: var(--color-primary-500);
          color: var(--color-surface);
          font-weight: 600;
        }
        .competitor-list {
          display: grid;
          gap: var(--space-3);
        }
        .competitor-item {
          display: grid;
          gap: var(--space-1);
          padding: var(--space-3);
          border-radius: var(--radius-md);
          background: rgba(59, 130, 246, 0.1);
        }
        .highlight {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--color-success-600);
        }
        ul {
          margin: 0;
          padding-left: var(--space-4);
          display: grid;
          gap: var(--space-2);
        }
        .updates-grid {
          display: grid;
          gap: var(--space-4);
        }
        .update-row {
          display: grid;
          gap: var(--space-3);
          grid-template-columns: minmax(200px, 2fr) repeat(3, minmax(120px, 1fr));
          align-items: center;
        }
        .amounts {
          display: flex;
          gap: var(--space-2);
          align-items: center;
          font-variant-numeric: tabular-nums;
        }
        .arrow {
          opacity: 0.5;
        }
        .spread {
          font-weight: 600;
          color: var(--color-info-600);
        }
        .status {
          display: grid;
          gap: var(--space-1);
          justify-items: start;
        }
        .status small {
          color: rgba(15, 23, 42, 0.6);
        }
        .actions {
          display: flex;
          justify-content: flex-end;
          margin-top: var(--space-5);
        }
        .actions button {
          background: var(--color-success-600);
        }
        @media (max-width: 900px) {
          .update-row {
            grid-template-columns: 1fr;
          }
          .amounts {
            justify-content: space-between;
          }
          .actions {
            justify-content: stretch;
          }
          .actions button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
