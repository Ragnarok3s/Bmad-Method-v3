'use client';

import { useEffect, useMemo, useRef } from 'react';

import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { PartnerSla, PartnerSlaStatus } from '@/services/api/partners';

interface SlaOverviewProps {
  slas: PartnerSla[];
  context?: 'home' | 'housekeeping';
}

const STATUS_VARIANT: Record<PartnerSlaStatus, 'success' | 'warning' | 'critical'> = {
  on_track: 'success',
  at_risk: 'warning',
  breached: 'critical'
};

const STATUS_LABEL: Record<PartnerSlaStatus, string> = {
  on_track: 'No prazo',
  at_risk: 'Em risco',
  breached: 'Violado'
};

const STATUS_MESSAGES: Record<PartnerSlaStatus, string> = {
  on_track: 'Dentro dos parâmetros acordados.',
  at_risk: 'Acima da meta. Monitorizar e alinhar com o parceiro.',
  breached: 'Violação registada. Acionar plano de contingência.'
};

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('pt-PT', {
  dateStyle: 'short',
  timeStyle: 'short'
});

type MutableAudioContext = AudioContext;

function resolveAudioContext(): typeof AudioContext | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const typedWindow = window as typeof window & {
    webkitAudioContext?: typeof AudioContext;
  };

  return typedWindow.AudioContext ?? typedWindow.webkitAudioContext ?? null;
}

export function SlaOverview({ slas, context = 'home' }: SlaOverviewProps) {
  const audioContextRef = useRef<MutableAudioContext | null>(null);
  const breachedIdsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const breachedIds = new Set(slas.filter((sla) => sla.status === 'breached').map((sla) => sla.id));

    const hasNewBreach = [...breachedIds].some((id) => !breachedIdsRef.current.has(id));
    breachedIdsRef.current = breachedIds;

    if (!hasNewBreach || breachedIds.size === 0) {
      return;
    }

    const AudioCtor = resolveAudioContext();
    if (!AudioCtor) {
      return;
    }

    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new AudioCtor();
      } catch (error) {
        return;
      }
    }

    const contextInstance = audioContextRef.current;
    if (!contextInstance) {
      return;
    }

    if (contextInstance.state === 'suspended') {
      void contextInstance.resume().catch(() => undefined);
    }

    const oscillator = contextInstance.createOscillator();
    const gain = contextInstance.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.value = 880;
    gain.gain.value = 0.08;
    oscillator.connect(gain);
    gain.connect(contextInstance.destination);
    oscillator.start();
    oscillator.stop(contextInstance.currentTime + 0.35);
  }, [slas]);

  const alertMessage = useMemo(() => {
    const breached = slas.filter((sla) => sla.status === 'breached');
    if (!breached.length) {
      return null;
    }

    const partners = breached.map((item) => item.partner.name).join(', ');
    if (context === 'housekeeping') {
      return `Atenção: ${partners} com violações de SLA a impactar housekeeping.`;
    }
    return `Alertas ativos para ${partners}.`; // default for home
  }, [context, slas]);

  if (slas.length === 0) {
    return null;
  }

  const columns = Math.min(3, Math.max(1, slas.length));

  return (
    <div className="sla-overview" aria-live="polite">
      {alertMessage && (
        <div className="sla-overview__alert" role="alert">
          <StatusBadge variant="critical">Violação de SLA</StatusBadge>
          <span>{alertMessage}</span>
        </div>
      )}
      <ResponsiveGrid columns={columns}>
        {slas.map((sla) => {
          const lastViolation = sla.lastViolationAt
            ? DATE_TIME_FORMATTER.format(new Date(sla.lastViolationAt))
            : 'Sem registo';

          return (
            <Card
              key={`${sla.partner.slug}-${sla.metric}`}
              title={`${sla.partner.name} · ${sla.metricLabel}`}
              description={`Meta ${sla.targetMinutes} min · Revisado ${DATE_TIME_FORMATTER.format(new Date(sla.updatedAt))}`}
              accent={STATUS_VARIANT[sla.status]}
            >
              <div className="sla-overview__status">
                <StatusBadge variant={STATUS_VARIANT[sla.status]}>{STATUS_LABEL[sla.status]}</StatusBadge>
                <span>{STATUS_MESSAGES[sla.status]}</span>
              </div>
              <dl className="sla-overview__metrics">
                <div>
                  <dt>Atual</dt>
                  <dd>{formatMinutes(sla.currentMinutes)}</dd>
                </div>
                <div>
                  <dt>Limite alerta</dt>
                  <dd>{formatMinutes(sla.warningMinutes)}</dd>
                </div>
                <div>
                  <dt>Violação</dt>
                  <dd>{formatMinutes(sla.breachMinutes)}</dd>
                </div>
                <div>
                  <dt>Última violação</dt>
                  <dd>{lastViolation}</dd>
                </div>
              </dl>
            </Card>
          );
        })}
      </ResponsiveGrid>
      <style jsx>{`
        .sla-overview {
          display: grid;
          gap: var(--space-4);
        }
        .sla-overview__alert {
          display: inline-flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-sm);
          background: rgba(239, 99, 81, 0.12);
          color: var(--color-coral);
          font-weight: 600;
        }
        .sla-overview__status {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
          color: var(--color-neutral-2);
          font-weight: 500;
        }
        .sla-overview__metrics {
          margin: 0;
          display: grid;
          gap: var(--space-3);
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .sla-overview__metrics div {
          display: grid;
          gap: var(--space-1);
        }
        .sla-overview__metrics dt {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-neutral-2);
          margin: 0;
        }
        .sla-overview__metrics dd {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-deep-blue);
        }
      `}</style>
    </div>
  );
}

function formatMinutes(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return 'Sem dados';
  }
  return `${value} min`;
}
