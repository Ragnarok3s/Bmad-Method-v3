'use client';

import { useMemo } from 'react';

import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';

const anomalyDataset = [
  {
    metric: 'reservations.daily_volume',
    titulo: 'Queda acentuada nas reservas confirmadas',
    severity: 'critical' as const,
    score: 0.91,
    resumo: 'Volume diário 42% abaixo da média histórica. Último pico registrado às 03h12.',
    explainability: [
      { sinal: 'canal:OTA', descricao: 'Conversões Booking -58% nas últimas 6h.', peso: 0.38 },
      { sinal: 'pricing.delta', descricao: 'Atualização agressiva de tarifas (-15%).', peso: 0.31 },
      { sinal: 'marketing.pause', descricao: 'Campanha Meta Ads pausada pelo parceiro.', peso: 0.22 }
    ],
    recomendacoes: [
      'Acionar playbook de recuperação de demanda imediata.',
      'Sincronizar inventário com canais OTA prioritários.',
      'Notificar pricing para rollback parcial das tarifas.'
    ]
  },
  {
    metric: 'slas.breach_rate',
    titulo: 'SLA de parceiros em alerta vermelho',
    severity: 'warning' as const,
    score: 0.76,
    resumo: 'Taxa de violações atingiu 22% vs. baseline de 8%.',
    explainability: [
      { sinal: 'partner.horizon', descricao: 'Fila de tickets > 45min.', peso: 0.36 },
      { sinal: 'webhook.latency', descricao: 'Latência média do webhook 4x maior.', peso: 0.28 },
      { sinal: 'staffing', descricao: 'Escala reduzida no turno noturno.', peso: 0.18 }
    ],
    recomendacoes: [
      'Executar plano de contingência via playbook Horizon Ops.',
      'Escalar time de suporte compartilhado por 6h.',
      'Abrir incidente com provedor do webhook para estabilização.'
    ]
  },
  {
    metric: 'telemetry.metrics.lag_seconds',
    titulo: 'Telemetria de métricas desatualizada',
    severity: 'critical' as const,
    score: 0.82,
    resumo: 'Coletor sem eventos há 18 minutos (limite: 5).',
    explainability: [
      { sinal: 'collector.health', descricao: 'Sonda HTTP retornando 503.', peso: 0.44 },
      { sinal: 'deployment', descricao: 'Deploy recente sem nova configuração OTLP.', peso: 0.28 },
      { sinal: 'network', descricao: 'Oscilação na VPC detectada pelo observability hub.', peso: 0.1 }
    ],
    recomendacoes: [
      'Reiniciar deployment de metrics-agent com rollback automático.',
      'Executar teste sintético de ingestão para validar conectividade.',
      'Avisar SREs sobre risco de cegueira operacional.'
    ]
  }
];

const driftFindings = [
  { titulo: 'Reservas', drift: 0.38, limite: 0.2, status: 'alerta' as const },
  { titulo: 'SLA Parceiros', drift: 0.12, limite: 0.2, status: 'saudável' as const },
  { titulo: 'Telemetria', drift: 0.44, limite: 0.15, status: 'alerta' as const }
];

const precisionHistory = [
  { titulo: 'Anomalias confirmadas', precision: 0.81, recall: 0.71 },
  { titulo: 'Falsos positivos', precision: 0.81, recall: 0.71, detalhe: 'Reduzidos 18% após feedback dos agentes.' }
];

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export default function AIOpsPage() {
  const summary = useMemo(() => {
    const criticos = anomalyDataset.filter((item) => item.severity === 'critical').length;
    const avisos = anomalyDataset.filter((item) => item.severity === 'warning').length;
    const informativos = anomalyDataset.length - criticos - avisos;
    return { criticos, avisos, informativos };
  }, []);

  return (
    <div>
      <SectionHeader subtitle="Deteção automática de anomalias com telemetria explicável e recomendações prescritivas.">
        AIOps em ação
      </SectionHeader>

      <Card
        title="Resumo das últimas 24h"
        description="Consolide o estado operacional antes de acionar os playbooks automatizados."
        accent="info"
      >
        <div className="summary" role="status" aria-live="polite">
          <div>
            <strong>Anomalias críticas</strong>
            <p>{summary.criticos}</p>
          </div>
          <div>
            <strong>Alertas</strong>
            <p>{summary.avisos}</p>
          </div>
          <div>
            <strong>Informativos</strong>
            <p>{summary.informativos}</p>
          </div>
        </div>
      </Card>

      <SectionHeader subtitle="Explique a origem das anomalias antes de executar ações automatizadas.">
        Painel de explicabilidade
      </SectionHeader>
      <ResponsiveGrid columns={3}>
        {anomalyDataset.map((anomaly) => (
          <Card key={anomaly.metric} title={anomaly.titulo} description={anomaly.resumo} accent="warning">
            <div className="header">
              <StatusBadge variant={anomaly.severity}>{anomaly.severity === 'critical' ? 'Crítica' : 'Alerta'}</StatusBadge>
              <span className="score" aria-label={`Score de anomalia ${anomaly.score}`}>{formatPercent(anomaly.score)}</span>
            </div>
            <dl className="explainability">
              {anomaly.explainability.map((item) => (
                <div key={`${anomaly.metric}:${item.sinal}`}>
                  <dt>{item.sinal}</dt>
                  <dd>
                    <p>{item.descricao}</p>
                    <span className="peso" aria-label={`Peso ${formatPercent(item.peso)}`}>
                      Contribuição: {formatPercent(item.peso)}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
            <div className="actions">
              <span>Recomendações automatizadas</span>
              <ul>
                {anomaly.recomendacoes.map((acao) => (
                  <li key={acao}>{acao}</li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </ResponsiveGrid>

      <SectionHeader subtitle="Monitore drift estatístico e mantenha a precisão dos modelos supervisionada por alertas dedicados.">
        Performance dos modelos
      </SectionHeader>
      <ResponsiveGrid columns={2}>
        <Card title="Drift" description="Comparação entre baseline e período atual.">
          <table className="drift">
            <thead>
              <tr>
                <th>Domínio</th>
                <th>Drift</th>
                <th>Limite</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {driftFindings.map((item) => (
                <tr key={item.titulo}>
                  <td>{item.titulo}</td>
                  <td>{formatPercent(item.drift)}</td>
                  <td>{formatPercent(item.limite)}</td>
                  <td>
                    <StatusBadge variant={item.status === 'alerta' ? 'warning' : 'success'}>
                      {item.status === 'alerta' ? 'Alerta' : 'Saudável'}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title="Precisão" description="Histórico validado automaticamente com feedback dos agentes.">
          <ul className="precision">
            {precisionHistory.map((item) => (
              <li key={item.titulo}>
                <strong>{item.titulo}</strong>
                <p>
                  Precisão {formatPercent(item.precision)} &bull; Recall {formatPercent(item.recall)}
                </p>
                {item.detalhe ? <span className="detalhe">{item.detalhe}</span> : null}
              </li>
            ))}
          </ul>
        </Card>
      </ResponsiveGrid>

      <style jsx>{`
        .summary {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: var(--space-4);
          text-align: center;
        }

        .summary p {
          font-size: 2rem;
          margin: 0;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-3);
        }

        .score {
          font-weight: 600;
          font-size: 1.25rem;
        }

        .explainability {
          display: grid;
          gap: var(--space-3);
          margin: 0 0 var(--space-4) 0;
        }

        .explainability dt {
          font-weight: 600;
        }

        .explainability dd {
          margin: 0;
        }

        .peso {
          display: block;
          color: var(--muted-foreground);
          margin-top: var(--space-1);
        }

        .actions ul {
          margin: 0;
          padding-left: var(--space-5);
          display: grid;
          gap: var(--space-2);
        }

        .drift {
          width: 100%;
          border-collapse: collapse;
        }

        .drift th,
        .drift td {
          padding: var(--space-2);
          text-align: left;
        }

        .drift tbody tr:nth-child(odd) {
          background: var(--surface-subtle);
        }

        .precision {
          margin: 0;
          padding-left: var(--space-4);
          display: grid;
          gap: var(--space-3);
        }

        .precision li {
          list-style: disc;
        }

        .detalhe {
          display: block;
          color: var(--muted-foreground);
        }

        @media (max-width: 960px) {
          .summary {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </div>
  );
}
