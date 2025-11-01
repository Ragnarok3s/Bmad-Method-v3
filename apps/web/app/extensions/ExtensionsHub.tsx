'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

import { Card } from '@/components/ui/Card';

type ExtensionSummary = {
  id: string;
  name: string;
  vendor: string;
  category: string;
  status: 'draft' | 'in-review' | 'approved' | 'live';
  ratings: {
    avg: number;
    votes: number;
    adoption: number;
  };
  lastSubmission: string;
};

const EXTENSIONS: ExtensionSummary[] = [
  {
    id: 'smart-checkin',
    name: 'Smart Check-in Kiosk',
    vendor: 'Hospitality Labs',
    category: 'Operações',
    status: 'in-review',
    ratings: { avg: 4.6, votes: 126, adoption: 43 },
    lastSubmission: '2024-03-08T10:00:00Z'
  },
  {
    id: 'predictive-housekeeping',
    name: 'Predictive Housekeeping',
    vendor: 'CleanAI',
    category: 'Housekeeping',
    status: 'approved',
    ratings: { avg: 4.2, votes: 318, adoption: 58 },
    lastSubmission: '2024-02-27T14:30:00Z'
  },
  {
    id: 'revenue-pilot',
    name: 'Revenue Pilot+ A/B',
    vendor: 'RevOps Studio',
    category: 'Revenue Management',
    status: 'live',
    ratings: { avg: 4.8, votes: 512, adoption: 72 },
    lastSubmission: '2024-01-31T09:15:00Z'
  }
];

const REVIEW_STEPS = [
  {
    label: 'Triagem automática',
    owner: 'BMAD Security',
    sla: '2h',
    description: 'Scans de segurança, permissões e assinatura digital do pacote.'
  },
  {
    label: 'QA funcional',
    owner: 'Equipe QA Híbrida',
    sla: '8h',
    description: 'Validação de contratos de dados, testes de fluxo crítico e métricas de observabilidade.'
  },
  {
    label: 'Aprovação conjunta',
    owner: 'Governança + Produto',
    sla: '24h',
    description: 'Checklist de governança, política de rollout e comunicação de lançamento.'
  }
];

const ROLLOUT_WAVES = [
  {
    id: 'wave-0',
    label: 'Sandbox & parceiros piloto',
    percentage: 5,
    readiness: 'Pré-produção liberada com métricas de confiabilidade.'
  },
  {
    id: 'wave-1',
    label: 'Cluster urbano',
    percentage: 25,
    readiness: 'Treinamentos concluídos e suporte L1 preparado.'
  },
  {
    id: 'wave-2',
    label: 'Rede nacional',
    percentage: 65,
    readiness: 'Feature flags configuradas com rollback automático.'
  },
  {
    id: 'wave-3',
    label: 'Rollout total',
    percentage: 100,
    readiness: 'Análise de impacto concluída e SLA monitorado em tempo real.'
  }
];

export function ExtensionsHub() {
  const [selectedWave, setSelectedWave] = useState<string>('wave-1');
  const activeWave = useMemo(
    () => ROLLOUT_WAVES.find(wave => wave.id === selectedWave) ?? ROLLOUT_WAVES[1],
    [selectedWave]
  );

  const reviewQueue = useMemo(
    () =>
      EXTENSIONS.filter(ext => ext.status === 'in-review' || ext.status === 'approved').map(ext => ({
        ...ext,
        priority: ext.status === 'in-review' ? 'Alta' : 'Média'
      })),
    []
  );

  const adoptionScore = useMemo(() => {
    const totalVotes = EXTENSIONS.reduce((acc, ext) => acc + ext.ratings.votes, 0);
    if (!totalVotes) return 0;
    return Math.round(
      (EXTENSIONS.reduce((acc, ext) => acc + ext.ratings.avg * ext.ratings.votes, 0) /
        totalVotes) *
        10
    ) / 10;
  }, []);

  return (
    <div className="hub-grid">
      <section className="column">
        <Card
          title="Fila de review"
          description="Orquestração de co-inovação com automações de segurança, QA e governança"
          accent="info"
        >
          <ul className="review-list">
            {reviewQueue.map(item => (
              <li key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <p>
                    {item.vendor} · {item.category}
                  </p>
                </div>
                <div className={`badge badge-${item.status}`}>
                  {item.status === 'in-review' ? 'Em revisão' : 'Pronto para rollout'}
                </div>
                <span className="badge badge-priority">Prioridade {item.priority}</span>
              </li>
            ))}
          </ul>
          <Link className="cta" href="/governanca">
            Abrir painel de governança →
          </Link>
        </Card>

        <Card
          title="Pipeline de aprovação"
          description="Checkpoints automatizados com SLA e owners claros."
          accent="success"
        >
          <ol className="timeline">
            {REVIEW_STEPS.map(step => (
              <li key={step.label}>
                <header>
                  <h4>{step.label}</h4>
                  <span className="badge badge-owner">{step.owner}</span>
                </header>
                <p>{step.description}</p>
                <footer>SLA: {step.sla}</footer>
              </li>
            ))}
          </ol>
        </Card>
      </section>

      <section className="column">
        <Card
          title="Métricas de adoção"
          description="Visibilidade sobre satisfação e rollout controlado por ondas"
          accent="warning"
        >
          <div className="metrics">
            <div className="metric">
              <span className="metric-value">{adoptionScore.toFixed(1)}</span>
              <span className="metric-label">Rating médio ponderado</span>
            </div>
            <div className="metric">
              <span className="metric-value">
                {EXTENSIONS.reduce((acc, ext) => acc + ext.ratings.adoption, 0)}%
              </span>
              <span className="metric-label">Adoção média portfolio</span>
            </div>
            <div className="metric">
              <span className="metric-value">{reviewQueue.length}</span>
              <span className="metric-label">Extensões aguardando rollout</span>
            </div>
          </div>
          <div className="wave-picker">
            <label htmlFor="wave-selector">Onda de rollout</label>
            <select
              id="wave-selector"
              value={selectedWave}
              onChange={event => setSelectedWave(event.target.value)}
            >
              {ROLLOUT_WAVES.map(wave => (
                <option key={wave.id} value={wave.id}>
                  {wave.label} · {wave.percentage}%
                </option>
              ))}
            </select>
            <p className="wave-details">{activeWave.readiness}</p>
          </div>
        </Card>

        <Card
          title="Catálogo oficial"
          description="Extensões aprovadas com SLAs monitorados e feedback contínuo"
        >
          <table className="catalog">
            <thead>
              <tr>
                <th>Extensão</th>
                <th>Vendor</th>
                <th>Rating</th>
                <th>Adoção</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {EXTENSIONS.map(ext => (
                <tr key={ext.id}>
                  <td>
                    <strong>{ext.name}</strong>
                    <span className="sub">{ext.category}</span>
                  </td>
                  <td>{ext.vendor}</td>
                  <td>
                    {ext.ratings.avg.toFixed(1)} <span className="sub">({ext.ratings.votes})</span>
                  </td>
                  <td>{ext.ratings.adoption}%</td>
                  <td>
                    <span className={`badge badge-${ext.status}`}>
                      {ext.status === 'live'
                        ? 'Produção'
                        : ext.status === 'approved'
                        ? 'Aprovada'
                        : ext.status === 'in-review'
                        ? 'Em revisão'
                        : 'Rascunho'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="footnote">
            Rollout controlado via feature flags, telemetria em tempo real e coletas automáticas de NPS.
          </p>
        </Card>
      </section>
      <style jsx>{`
        .hub-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: var(--space-6);
          margin-bottom: var(--space-10);
        }
        .column {
          display: grid;
          gap: var(--space-6);
        }
        .review-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: var(--space-4);
        }
        .review-list li {
          display: grid;
          gap: var(--space-2);
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: center;
          border-bottom: 1px solid rgba(37, 99, 235, 0.12);
          padding-bottom: var(--space-3);
        }
        .review-list li:last-of-type {
          border-bottom: none;
        }
        .review-list strong {
          color: var(--color-deep-blue);
        }
        .badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 0.25rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .badge-in-review {
          background: var(--color-soft-aqua);
          color: #08313a;
        }
        .badge-approved {
          background: var(--color-calm-gold);
          color: #4d3508;
        }
        .badge-live {
          background: rgba(14, 165, 233, 0.25);
          color: #04504c;
        }
        .badge-draft {
          background: #e5e7eb;
          color: var(--color-neutral-2);
        }
        .badge-priority {
          background: rgba(255, 99, 132, 0.15);
          color: #b2203f;
        }
        .badge-owner {
          background: rgba(0, 90, 255, 0.15);
          color: #0f3a8d;
        }
        .cta {
          font-weight: 600;
          color: var(--color-deep-blue);
          display: inline-block;
        }
        .timeline {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: var(--space-4);
        }
        .timeline li {
          background: #f8fafc;
          padding: var(--space-4);
          border-radius: var(--radius-md);
          border-left: 4px solid var(--color-soft-aqua);
          display: grid;
          gap: var(--space-3);
        }
        .timeline header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .timeline h4 {
          margin: 0;
          font-size: 1rem;
        }
        .timeline footer {
          color: var(--color-neutral-2);
          font-size: 0.875rem;
        }
        .metrics {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: var(--space-4);
        }
        .metric {
          background: #f8fafc;
          border-radius: var(--radius-md);
          padding: var(--space-4);
          text-align: center;
        }
        .metric-value {
          display: block;
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--color-deep-blue);
        }
        .metric-label {
          font-size: 0.875rem;
          color: var(--color-neutral-2);
        }
        .wave-picker {
          display: grid;
          gap: var(--space-3);
        }
        .wave-picker select {
          padding: var(--space-2);
          border-radius: var(--radius-sm);
          border: 1px solid #d1d5db;
        }
        .wave-details {
          color: var(--color-neutral-2);
          font-size: 0.9rem;
        }
        .catalog {
          width: 100%;
          border-collapse: collapse;
        }
        .catalog th,
        .catalog td {
          text-align: left;
          padding: 0.75rem;
          border-bottom: 1px solid rgba(37, 99, 235, 0.12);
        }
        .catalog .sub {
          display: block;
          font-size: 0.75rem;
          color: var(--color-neutral-2);
        }
        .footnote {
          color: var(--color-neutral-2);
          font-size: 0.85rem;
          margin-top: var(--space-4);
        }
        @media (max-width: 1080px) {
          .hub-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
