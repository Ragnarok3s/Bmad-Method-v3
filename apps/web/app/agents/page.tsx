'use client';

import { AgentsFilters } from '@/components/agents/AgentsFilters';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import {
  AgentAvailability,
  useAgentsCatalog
} from '@/services/api/agents';

const AVAILABILITY_VARIANT: Record<AgentAvailability, 'success' | 'warning' | 'critical'> = {
  available: 'success',
  limited: 'warning',
  maintenance: 'critical'
};

export default function AgentsPage() {
  const {
    items,
    availableFilters,
    filters,
    pagination,
    loading,
    error,
    setCompetencies,
    setAvailability,
    setPage,
    refresh
  } = useAgentsCatalog({ pageSize: 6 });

  const totalPages = pagination?.totalPages ?? (items.length > 0 ? 1 : 0);
  const totalItems = pagination?.total ?? items.length;
  const currentPage = filters.page;

  return (
    <div className="agents-page">
      <SectionHeader subtitle="Catálogo vivo de agentes BMAD para equipas de hospitalidade digital">
        Orquestração de agentes inteligentes
      </SectionHeader>

      <AgentsFilters
        competencies={availableFilters.competencies}
        availability={availableFilters.availability}
        selectedCompetencies={filters.competencies}
        selectedAvailability={filters.availability}
        onCompetenciesChange={setCompetencies}
        onAvailabilityChange={setAvailability}
        disabled={loading}
      />

      {error && (
        <Card
          accent="critical"
          title="Não foi possível carregar o catálogo"
          description="Verifique a ligação ao Core Service ou tente novamente em instantes."
        >
          <button type="button" className="retry-button" onClick={refresh}>
            Tentar novamente
          </button>
        </Card>
      )}

      {loading && !error && <p className="agents-page__loading">A sincronizar catálogo de agentes…</p>}

      {!loading && items.length === 0 && !error && (
        <Card
          accent="warning"
          title="Nenhum agente encontrado com os filtros atuais"
          description="Altere os filtros de competência ou disponibilidade para explorar mais opções."
        >
          <button
            type="button"
            className="retry-button"
            onClick={() => {
              setCompetencies([]);
              setAvailability([]);
              setPage(1);
            }}
          >
            Limpar filtros
          </button>
        </Card>
      )}

      <ResponsiveGrid columns={3}>
        {items.map((agent) => (
          <Card key={agent.slug} title={agent.name} description={agent.tagline}>
            <StatusBadge variant={AVAILABILITY_VARIANT[agent.availability]}>
              {agent.availabilityLabel}
            </StatusBadge>
            <p className="agent-description">{agent.description}</p>
            <div className="agent-section">
              <strong>Competências principais</strong>
              <ul>
                {agent.competencies.map((competency) => (
                  <li key={competency}>{competency}</li>
                ))}
              </ul>
            </div>
            {agent.integrations.length > 0 && (
              <div className="agent-section">
                <strong>Integrações certificadas</strong>
                <p>{agent.integrations.join(', ')}</p>
              </div>
            )}
            <div className="agent-metadata">
              <span>Automação: {agent.automationLevel ?? 'Sob consulta'}</span>
              <span>Idiomas: {agent.languages.join(', ')}</span>
              {agent.responseTimeMinutes !== null && (
                <span>Resposta média: {agent.responseTimeMinutes} min</span>
              )}
            </div>
          </Card>
        ))}
      </ResponsiveGrid>

      {totalItems > 0 && (
        <nav className="agents-pagination" aria-label="Paginação do catálogo de agentes">
          <button
            type="button"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage <= 1 || loading}
          >
            Anterior
          </button>
          <span>
            Página {Math.min(currentPage, Math.max(totalPages, 1))} de {Math.max(totalPages, 1)} · {totalItems} agentes
          </span>
          <button
            type="button"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage >= totalPages || loading}
          >
            Seguinte
          </button>
        </nav>
      )}

      <style jsx>{`
        .agents-page {
          display: grid;
          gap: var(--space-6);
        }
        .agents-page__loading {
          color: var(--color-neutral-2);
        }
        .retry-button {
          background: var(--color-deep-blue);
          color: #fff;
          border: none;
          border-radius: var(--radius-sm);
          padding: var(--space-2) var(--space-4);
          cursor: pointer;
        }
        .retry-button:hover {
          opacity: 0.9;
        }
        .agent-description {
          margin: 0;
          color: var(--color-neutral-2);
        }
        .agent-section {
          display: grid;
          gap: var(--space-2);
        }
        .agent-section ul {
          margin: 0;
          padding-left: var(--space-5);
          display: grid;
          gap: var(--space-1);
        }
        .agent-metadata {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
          font-size: 0.875rem;
          color: var(--color-neutral-2);
        }
        .agents-pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-3);
          border-top: 1px solid var(--color-neutral-4);
          padding-top: var(--space-3);
        }
        .agents-pagination button {
          background: none;
          border: 1px solid var(--color-neutral-3);
          border-radius: var(--radius-sm);
          padding: var(--space-2) var(--space-4);
          cursor: pointer;
        }
        .agents-pagination button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        @media (max-width: 960px) {
          .agents-pagination {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--space-2);
          }
          .agent-metadata {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
