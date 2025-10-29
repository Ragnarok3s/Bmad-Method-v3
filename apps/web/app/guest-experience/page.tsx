'use client';

import { useMemo, useState } from 'react';

import { Card } from '@/components/ui/Card';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';

import { useGuestExperience } from './useGuestExperience';

const DEFAULT_RESERVATION_ID = 1;

const stageLabels: Record<string, string> = {
  'check_in.pre_arrival': 'Pré check-in',
  'identity.verification': 'Verificação de identidade',
  'in_stay.experience': 'Experiências em andamento',
  'post_stay.feedback': 'Feedback pós-estadia'
};

function formatDateTime(timestamp: string | null | undefined) {
  if (!timestamp) return '—';
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }
  return date.toLocaleString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: 'short'
  });
}

function formatCurrency(value: number | null | undefined, currency?: string | null) {
  if (value == null) return '—';
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency ?? 'BRL'
  });
  return formatter.format(value / 100);
}

export default function GuestExperiencePage() {
  const [reservationId, setReservationId] = useState<number>(DEFAULT_RESERVATION_ID);
  const { status, data, error, refresh } = useGuestExperience(reservationId);

  const loading = status === 'idle' || status === 'loading';
  const journeyLabel = data?.journey_stage ? stageLabels[data.journey_stage] ?? data.journey_stage : 'Não iniciado';

  const preferences = useMemo(() => {
    if (!data?.preferences) return [] as Array<[string, unknown]>;
    return Object.entries(data.preferences);
  }, [data?.preferences]);

  return (
    <div>
      <SectionHeader
        subtitle="Fluxo digital completo com visão unificada de check-in, chat e ofertas contextuais"
        actions={
          <form
            className="actions"
            onSubmit={(event) => {
              event.preventDefault();
              const form = event.target as HTMLFormElement;
              const field = form.elements.namedItem('reservationId') as HTMLInputElement;
              const value = Number.parseInt(field.value, 10);
              if (!Number.isNaN(value) && value > 0) {
                setReservationId(value);
              }
            }}
          >
            <label htmlFor="reservationId">Reserva</label>
            <input
              id="reservationId"
              name="reservationId"
              type="number"
              min={1}
              defaultValue={reservationId}
            />
            <button type="submit">Carregar</button>
            <button type="button" onClick={() => refresh()} disabled={loading}>
              Atualizar
            </button>
          </form>
        }
      >
        Experiência do Hóspede
      </SectionHeader>

      {status === 'error' && <p className="state state-error">Falha ao carregar jornada: {error}</p>}
      {loading && <p className="state">Carregando experiência do hóspede…</p>}

      {data && (
        <div className="layout">
          <Card
            title={`Reserva #${data.reservation.id}`}
            description={`${data.reservation.guest_name} · ${data.reservation.guest_email}`}
            accent="info"
          >
            <div className="reservation-grid">
              <div>
                <strong>Status</strong>
                <StatusBadge variant={data.reservation.status === 'checked_in' ? 'success' : 'info'}>
                  {data.reservation.status.replace('_', ' ')}
                </StatusBadge>
              </div>
              <div>
                <strong>Check-in</strong>
                <span>{formatDateTime(data.reservation.check_in)}</span>
              </div>
              <div>
                <strong>Check-out</strong>
                <span>{formatDateTime(data.reservation.check_out)}</span>
              </div>
              <div>
                <strong>Satisfação NPS</strong>
                <span>{data.satisfaction_score != null ? data.satisfaction_score.toFixed(1) : '—'}</span>
              </div>
              <div>
                <strong>Fase atual</strong>
                <span>{journeyLabel}</span>
              </div>
              <div>
                <strong>Valor da reserva</strong>
                <span>{formatCurrency(data.reservation.total_amount_minor ?? null, data.reservation.currency_code)}</span>
              </div>
            </div>
          </Card>

          <SectionHeader subtitle="Etapas automatizadas com SLA e status em tempo real">
            Check-in digital
          </SectionHeader>
          <ResponsiveGrid columns={3}>
            {data.check_in.map((step) => (
              <Card
                key={step.id}
                title={step.title}
                description={step.description ?? ''}
                accent={step.completed ? 'success' : 'info'}
              >
                <StatusBadge variant={step.completed ? 'success' : 'warning'}>
                  {step.completed ? 'Concluído' : 'Pendente'}
                </StatusBadge>
                <p className="meta">{formatDateTime(step.completed_at ?? null)}</p>
              </Card>
            ))}
          </ResponsiveGrid>

          <SectionHeader subtitle="Histórico consolidado entre chat, WhatsApp e automações">
            Timeline de interação
          </SectionHeader>
          <Card title="Mensagens recentes" description="Respostas do hóspede e gatilhos inteligentes" accent="info">
            <ul className="timeline">
              {data.chat.map((message) => (
                <li key={message.id} className={`timeline-item timeline-item-${message.direction}`}>
                  <div className="timeline-meta">
                    <span className="timeline-author">{message.author}</span>
                    <span className="timeline-channel">{message.channel}</span>
                    <span>{formatDateTime(message.sent_at)}</span>
                  </div>
                  <p className="timeline-content">{message.content}</p>
                  {message.template_id && <span className="timeline-template">Template: {message.template_id}</span>}
                </li>
              ))}
            </ul>
          </Card>

          <SectionHeader subtitle="Conversões e respostas em tempo real">
            Upsells e ofertas contextuais
          </SectionHeader>
          <ResponsiveGrid columns={3}>
            {data.upsells.length === 0 && (
              <Card title="Sem ofertas" description="Nenhum upsell enviado para esta jornada." accent="info" />
            )}
            {data.upsells.map((upsell) => (
              <Card
                key={upsell.id}
                title={upsell.title}
                description={upsell.description}
                accent={upsell.status === 'accepted' ? 'success' : upsell.status === 'declined' ? 'critical' : 'info'}
              >
                <div className="upsell-details">
                  <span>{formatCurrency(upsell.price_minor ?? null, upsell.currency)}</span>
                  <StatusBadge
                    variant={
                      upsell.status === 'accepted'
                        ? 'success'
                        : upsell.status === 'declined'
                          ? 'critical'
                          : 'info'
                    }
                  >
                    {upsell.status}
                  </StatusBadge>
                </div>
                {upsell.conversion_probability != null && (
                  <p className="meta">Prob. conversão: {(upsell.conversion_probability * 100).toFixed(0)}%</p>
                )}
              </Card>
            ))}
          </ResponsiveGrid>

          {preferences.length > 0 && (
            <Card
              title="Preferências sincronizadas"
              description="Dados enriquecidos disponíveis para automações e squads de atendimento"
              accent="info"
            >
              <ul className="preferences">
                {preferences.map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {String(value)}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      )}

      <style jsx>{`
        .actions {
          display: flex;
          gap: var(--space-2);
          align-items: center;
        }
        .actions label {
          font-weight: 600;
        }
        .actions input {
          width: 6rem;
          border: 1px solid var(--color-neutral-4);
          border-radius: var(--radius-sm);
          padding: var(--space-1) var(--space-2);
        }
        .actions button {
          border: none;
          border-radius: var(--radius-sm);
          padding: var(--space-2) var(--space-3);
          background: var(--color-deep-blue);
          color: #fff;
          font-weight: 600;
          cursor: pointer;
        }
        .actions button[disabled] {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .state {
          margin-bottom: var(--space-4);
          color: var(--color-neutral-2);
        }
        .state-error {
          color: var(--color-coral);
        }
        .layout {
          display: grid;
          gap: var(--space-6);
        }
        .reservation-grid {
          display: grid;
          gap: var(--space-2);
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        }
        .reservation-grid strong {
          display: block;
          font-size: 0.75rem;
          text-transform: uppercase;
          color: var(--color-neutral-3);
        }
        .reservation-grid span {
          font-weight: 600;
        }
        .meta {
          margin-top: var(--space-2);
          color: var(--color-neutral-2);
          font-size: 0.85rem;
        }
        .timeline {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: var(--space-3);
        }
        .timeline-item {
          border-left: 3px solid var(--color-soft-aqua);
          padding-left: var(--space-4);
          position: relative;
        }
        .timeline-item::before {
          content: '';
          position: absolute;
          left: -10px;
          top: 8px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--color-soft-aqua);
        }
        .timeline-item-inbound::before {
          background: var(--color-coral);
        }
        .timeline-meta {
          display: flex;
          gap: var(--space-2);
          font-size: 0.75rem;
          color: var(--color-neutral-3);
        }
        .timeline-content {
          margin: var(--space-1) 0;
          font-weight: 500;
        }
        .timeline-template {
          font-size: 0.75rem;
          color: var(--color-neutral-3);
        }
        .upsell-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: var(--space-2);
        }
        .preferences {
          margin: 0;
          padding-left: var(--space-5);
          display: grid;
          gap: var(--space-1);
        }
      `}</style>
    </div>
  );
}
