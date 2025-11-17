'use client';

import { useMemo, useState } from 'react';

import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';

type Priority = 'high' | 'medium' | 'low';
type Domain = 'reservas' | 'housekeeping' | 'sla';
type Decision = 'approved' | 'rejected' | 'pending';

type ExplainabilityDetail = {
  signal: string;
  description: string;
  weight: number;
};

type RecommendationRecord = {
  key: string;
  title: string;
  summary: string;
  priority: Priority;
  score: number;
  domain: Domain;
  explainability: ExplainabilityDetail[];
  actions: string[];
  metadata: Record<string, string | number>;
};

const recommendationDataset: RecommendationRecord[] = [
  {
    key: 'reservation:501:housekeeping_backlog',
    title: 'Priorizar limpeza - Laura Campos',
    summary: 'Check-in em 3h com manutenção pendente bloqueando a limpeza.',
    priority: 'high',
    score: 0.82,
    domain: 'housekeeping',
    explainability: [
      { signal: 'reservas', description: 'Check-in previsto em 3h.', weight: 0.92 },
      { signal: 'housekeeping', description: '2 tarefas bloqueadas aguardando manutenção.', weight: 0.88 }
    ],
    actions: ['Acionar playbook Limpeza Acelerada', 'Notificar manutenção e housekeeping'],
    metadata: { property: 'Aurora Suites', tarefasCriticas: 2 }
  },
  {
    key: 'sla:44:at_risk',
    title: 'Risco de SLA - Parceiro Horizon',
    summary: 'Tempo médio de primeira resposta ultrapassou o limite de alerta.',
    priority: 'medium',
    score: 0.74,
    domain: 'sla',
    explainability: [
      { signal: 'telemetria', description: 'Tempo atual em 70 minutos vs alvo de 30.', weight: 0.7 },
      { signal: 'sla', description: 'Status AT_RISK reportado pela integração do parceiro.', weight: 0.68 }
    ],
    actions: ['Acionar plano de contingência', 'Revisar escala de suporte do parceiro'],
    metadata: { parceiro: 'Horizon Ops', metric: 'first_response' }
  },
  {
    key: 'reservation:612:overdue_check_in',
    title: 'Check-in atrasado - Diego Martins',
    summary: 'Hóspede não realizou check-in há 2h e bloqueia disponibilidade do apartamento.',
    priority: 'high',
    score: 0.79,
    domain: 'reservas',
    explainability: [
      { signal: 'reservas', description: 'Check-in atrasado há 2h.', weight: 0.84 },
      { signal: 'housekeeping', description: 'Equipe aguardando confirmação para liberar unidade.', weight: 0.52 }
    ],
    actions: ['Contactar hóspede imediatamente', 'Liberar inventário caso não haja resposta'],
    metadata: { apartamento: '1204A', origem: 'OTA - Booking' }
  },
  {
    key: 'reservation:845:housekeeping_backlog',
    title: 'Balancear escala de limpeza - Grupo Atlas',
    summary: 'Check-in em 10h com 3 unidades aguardando inspeção final.',
    priority: 'medium',
    score: 0.63,
    domain: 'housekeeping',
    explainability: [
      { signal: 'reservas', description: 'Grupo corporativo com chegada em 10h.', weight: 0.55 },
      { signal: 'housekeeping', description: '3 tarefas pendentes e 1 bloqueada por avaria.', weight: 0.58 }
    ],
    actions: ['Reforçar turno extra', 'Delegar inspeção final a supervisor'],
    metadata: { unidadesPendentes: 3, prioridade: 'corporativo' }
  }
];

const priorityFilters: { value: 'all' | Priority; label: string }[] = [
  { value: 'all', label: 'Todas as prioridades' },
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Média' },
  { value: 'low', label: 'Baixa' }
];

const domainFilters: { value: 'all' | Domain; label: string }[] = [
  { value: 'all', label: 'Todos os domínios' },
  { value: 'reservas', label: 'Reservas' },
  { value: 'housekeeping', label: 'Housekeeping' },
  { value: 'sla', label: 'SLAs' }
];

function mapPriorityToVariant(priority: Priority) {
  switch (priority) {
    case 'high':
      return 'critical' as const;
    case 'medium':
      return 'warning' as const;
    default:
      return 'info' as const;
  }
}

function formatPercent(value: number) {
  return `${Math.round(Math.max(0, Math.min(value, 1)) * 100)}%`;
}

export default function RecommendationsPage() {
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all');
  const [domainFilter, setDomainFilter] = useState<'all' | Domain>('all');
  const [decisions, setDecisions] = useState<Record<string, Decision>>(() => {
    return Object.fromEntries(recommendationDataset.map((item) => [item.key, 'pending']));
  });
  const [search, setSearch] = useState('');

  const filteredRecommendations = useMemo(() => {
    return recommendationDataset.filter((item) => {
      const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
      const matchesDomain = domainFilter === 'all' || item.domain === domainFilter;
      const matchesSearch = !search.trim()
        || item.title.toLowerCase().includes(search.toLowerCase())
        || item.summary.toLowerCase().includes(search.toLowerCase());
      return matchesPriority && matchesDomain && matchesSearch;
    });
  }, [priorityFilter, domainFilter, search]);

  const summary = useMemo(() => {
    const values = Object.values(decisions);
    const approvals = values.filter((value) => value === 'approved').length;
    const rejections = values.filter((value) => value === 'rejected').length;
    const pending = values.filter((value) => value === 'pending').length;
    return { approvals, rejections, pending };
  }, [decisions]);

  function handleDecision(key: string, decision: Decision) {
    setDecisions((current) => {
      const nextState = current[key] === decision ? 'pending' : decision;
      return { ...current, [key]: nextState };
    });
  }

  return (
    <div>
      <SectionHeader subtitle="Combine insights operacionais e feedback humano para evoluir as heurísticas do motor.">
        Recomendações Inteligentes
      </SectionHeader>
      <Card
        title="Painel de governança"
        description="Acompanhe aprovações, rejeições e backlog para treinar o motor de recomendações."
        accent="info"
      >
        <div className="summary-grid" role="status" aria-live="polite">
          <div>
            <strong>Aprovadas</strong>
            <p>{summary.approvals}</p>
          </div>
          <div>
            <strong>Rejeitadas</strong>
            <p>{summary.rejections}</p>
          </div>
          <div>
            <strong>Pendentes</strong>
            <p>{summary.pending}</p>
          </div>
        </div>
      </Card>
      <Card title="Filtros avançados" description="Refine o foco por severidade, domínio operacional ou pesquisa livre." accent="info">
        <div className="filters">
          <div className="filter-group">
            <span>Prioridade</span>
            <div className="chip-group" role="group" aria-label="Filtrar por prioridade">
              {priorityFilters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  className={`chip ${priorityFilter === filter.value ? 'active' : ''}`}
                  onClick={() => setPriorityFilter(filter.value)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <span>Domínio</span>
            <div className="chip-group" role="group" aria-label="Filtrar por domínio">
              {domainFilters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  className={`chip ${domainFilter === filter.value ? 'active' : ''}`}
                  onClick={() => setDomainFilter(filter.value)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          <label className="search">
            <span className="sr-only">Pesquisar recomendação</span>
            <input
              type="search"
              placeholder="Pesquisar por hóspede, parceiro ou contexto"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        </div>
      </Card>
      <SectionHeader subtitle="Revise justificativas, ajuste prioridades e dispare ações com transparência.">
        Recomendações em tempo real
      </SectionHeader>
      <ResponsiveGrid columns={2}>
        {filteredRecommendations.map((item) => {
          const decision = decisions[item.key];
          const actionLabel = decision === 'approved' ? 'Aprovado' : decision === 'rejected' ? 'Rejeitado' : 'Pendente';
          const actionVariant = decision === 'approved' ? 'success' : decision === 'rejected' ? 'critical' : 'neutral';

          return (
            <Card key={item.key} title={item.title} description={item.summary} accent="info">
              <div className="header">
                <StatusBadge variant={mapPriorityToVariant(item.priority)}>
                  Prioridade {item.priority === 'high' ? 'Alta' : item.priority === 'medium' ? 'Média' : 'Baixa'}
                </StatusBadge>
                <span className="score" aria-label={`Score de prioridade ${item.score.toFixed(2)}`}>
                  Score {item.score.toFixed(2)}
                </span>
              </div>
              <div className="explainability">
                <h4>Justificativas</h4>
                <ul>
                  {item.explainability.map((detail) => (
                    <li key={`${item.key}-${detail.signal}`}>
                      <strong>{detail.signal}</strong>
                      <span>{detail.description}</span>
                      <span className="weight">Contribuição {formatPercent(detail.weight)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="actions">
                <h4>Ações sugeridas</h4>
                <ul>
                  {item.actions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
              </div>
              <div className="decision-bar" role="group" aria-label="Registrar decisão">
                <StatusBadge variant={actionVariant}>{actionLabel}</StatusBadge>
                <div className="buttons">
                  <button
                    type="button"
                    className={`decision-button approve ${decision === 'approved' ? 'selected' : ''}`}
                    onClick={() => handleDecision(item.key, 'approved')}
                  >
                    Aprovar
                  </button>
                  <button
                    type="button"
                    className={`decision-button reject ${decision === 'rejected' ? 'selected' : ''}`}
                    onClick={() => handleDecision(item.key, 'rejected')}
                  >
                    Rejeitar
                  </button>
                </div>
              </div>
              <dl className="metadata">
                {Object.entries(item.metadata).map(([key, value]) => (
                  <div key={key}>
                    <dt>{key}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </Card>
          );
        })}
      </ResponsiveGrid>
      <style jsx>{`
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: var(--space-4);
        }
        .summary-grid p {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0;
        }
        .filters {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-4);
          align-items: flex-end;
        }
        .filter-group {
          display: grid;
          gap: var(--space-2);
        }
        .chip-group {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
        }
        .chip {
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-sm);
          background: rgba(37, 99, 235, 0.08);
          border: none;
          font-weight: 500;
          color: var(--color-deep-blue);
          cursor: pointer;
          transition: transform 0.15s ease, background 0.15s ease;
        }
        .chip:hover,
        .chip:focus-visible {
          transform: translateY(-1px);
          background: rgba(14, 165, 233, 0.25);
        }
        .chip.active {
          background: var(--color-deep-blue);
          color: #fff;
          box-shadow: var(--shadow-card);
        }
        .search input {
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-sm);
          border: 1px solid rgba(37, 99, 235, 0.18);
          min-width: 260px;
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-3);
        }
        .score {
          font-weight: 600;
          color: var(--color-deep-blue);
        }
        .explainability ul,
        .actions ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: var(--space-2);
        }
        .explainability li {
          display: grid;
          gap: 2px;
        }
        .explainability strong {
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          color: var(--color-neutral-2);
        }
        .explainability .weight {
          font-size: 0.75rem;
          color: var(--color-neutral-2);
        }
        .decision-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-3);
          margin-top: var(--space-4);
        }
        .buttons {
          display: flex;
          gap: var(--space-2);
        }
        .decision-button {
          border: none;
          border-radius: var(--radius-sm);
          padding: var(--space-2) var(--space-3);
          cursor: pointer;
          font-weight: 600;
          background: rgba(37, 99, 235, 0.08);
          color: var(--color-deep-blue);
          transition: background 0.2s ease;
        }
        .decision-button.approve.selected,
        .decision-button.approve:hover {
          background: rgba(14, 165, 233, 0.2);
        }
        .decision-button.reject.selected,
        .decision-button.reject:hover {
          background: rgba(239, 99, 81, 0.2);
        }
        .metadata {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: var(--space-2);
          margin-top: var(--space-4);
        }
        .metadata dt {
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-neutral-2);
          margin: 0;
        }
        .metadata dd {
          margin: 0;
          font-weight: 600;
        }
        @media (max-width: 960px) {
          .summary-grid {
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          }
          .filters {
            flex-direction: column;
            align-items: stretch;
          }
          .search input {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
