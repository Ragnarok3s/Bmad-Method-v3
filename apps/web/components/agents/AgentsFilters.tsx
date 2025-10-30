'use client';

import { FilterPill } from '@/components/ui/FilterPill';
import { AgentAvailability } from '@/services/api/agents';

export interface AgentsFilterOption {
  value: string;
  label: string;
  count: number;
}

export interface AgentsAvailabilityFilterOption {
  value: AgentAvailability;
  label: string;
  count: number;
}

interface AgentsFiltersProps {
  competencies: AgentsFilterOption[];
  availability: AgentsAvailabilityFilterOption[];
  selectedCompetencies: string[];
  selectedAvailability: AgentAvailability[];
  onCompetenciesChange: (values: string[]) => void;
  onAvailabilityChange: (values: AgentAvailability[]) => void;
  disabled?: boolean;
}

export function AgentsFilters({
  competencies,
  availability,
  selectedCompetencies,
  selectedAvailability,
  onCompetenciesChange,
  onAvailabilityChange,
  disabled = false
}: AgentsFiltersProps) {
  const isLoading = disabled;
  const selectedCompetencyLabels = competencies
    .filter((option) => selectedCompetencies.includes(option.value))
    .map((option) => option.label);
  const selectedAvailabilityLabels = availability
    .filter((option) => selectedAvailability.includes(option.value))
    .map((option) => option.label);
  const activeFiltersCount = selectedCompetencyLabels.length + selectedAvailabilityLabels.length;

  const summaryParts: string[] = [];
  if (selectedCompetencyLabels.length > 0) {
    summaryParts.push(`Competências: ${selectedCompetencyLabels.join(', ')}`);
  }
  if (selectedAvailabilityLabels.length > 0) {
    summaryParts.push(`Disponibilidade: ${selectedAvailabilityLabels.join(', ')}`);
  }

  const filtersSummary =
    activeFiltersCount === 0
      ? 'Nenhum filtro ativo.'
      : `Filtros ativos (${activeFiltersCount}): ${summaryParts.join(' · ')}.`;

  const handleClearAll = () => {
    onCompetenciesChange([]);
    onAvailabilityChange([]);
  };
  const isClearButtonDisabled = isLoading || activeFiltersCount === 0;

  const handleCompetencyToggle = (value: string) => (nextSelected: boolean) => {
    if (nextSelected) {
      const nextValues = Array.from(new Set([...selectedCompetencies, value]));
      onCompetenciesChange(nextValues);
      return;
    }
    onCompetenciesChange(selectedCompetencies.filter((item) => item !== value));
  };

  const handleAvailabilityToggle = (value: AgentAvailability) => (nextSelected: boolean) => {
    if (nextSelected) {
      const nextValues = Array.from(new Set([...selectedAvailability, value]));
      onAvailabilityChange(nextValues);
      return;
    }
    onAvailabilityChange(selectedAvailability.filter((item) => item !== value));
  };

  return (
    <section
      className="agents-filters"
      aria-label="Filtros do catálogo de agentes"
      aria-busy={isLoading}
    >
      <div className="agents-filters__summary" role="status" aria-live="polite">
        <p id="agents-filters-summary-text">{filtersSummary}</p>
        <button
          type="button"
          className="agents-filters__clear-button"
          onClick={handleClearAll}
          disabled={isClearButtonDisabled}
          aria-describedby="agents-filters-summary-text"
          data-loading={isLoading}
        >
          {isLoading ? 'A actualizar filtros…' : 'Limpar tudo'}
        </button>
      </div>
      <div className="agents-filters__group">
        <header>
          <h3>Competências</h3>
          <p>Combine competências para encontrar o agente ideal para cada jornada.</p>
        </header>
        <div className="pill-list">
          {competencies.length === 0 ? (
            <span className="empty-hint">Nenhuma competência disponível para filtragem.</span>
          ) : (
            competencies.map((option) => {
              const isSelected = selectedCompetencies.includes(option.value);
              return (
                <FilterPill
                  key={option.value}
                  label={option.label}
                  count={option.count}
                  selected={isSelected}
                  disabled={disabled}
                  onToggle={handleCompetencyToggle(option.value)}
                />
              );
            })
          )}
        </div>
      </div>
      <div className="agents-filters__group">
        <header>
          <h3>Disponibilidade</h3>
          <p>Entenda quais agentes estão prontos para produção ou com janelas limitadas.</p>
        </header>
        <div className="pill-list">
          {availability.length === 0 ? (
            <span className="empty-hint">Nenhum estado de disponibilidade configurado.</span>
          ) : (
            availability.map((option) => {
              const isSelected = selectedAvailability.includes(option.value);
              return (
                <FilterPill
                  key={option.value}
                  label={option.label}
                  count={option.count}
                  selected={isSelected}
                  disabled={disabled}
                  onToggle={handleAvailabilityToggle(option.value)}
                />
              );
            })
          )}
        </div>
      </div>
      <style jsx>{`
        .agents-filters {
          display: grid;
          gap: var(--space-6);
        }
        .agents-filters__summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4);
          flex-wrap: wrap;
        }
        .agents-filters__summary p {
          margin: 0;
          color: var(--color-deep-blue);
          font-weight: 500;
        }
        .agents-filters__clear-button {
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-neutral-3);
          background: #fff;
          color: var(--color-deep-blue);
          padding: var(--space-2) var(--space-4);
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease-in-out, color 0.2s ease-in-out;
        }
        .agents-filters__clear-button:not(:disabled):hover {
          background: var(--color-deep-blue);
          color: #fff;
        }
        .agents-filters__clear-button:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
        .agents-filters__group {
          display: grid;
          gap: var(--space-3);
        }
        header h3 {
          margin: 0;
          font-size: 1rem;
          color: var(--color-deep-blue);
        }
        header p {
          margin: var(--space-1) 0 0;
          color: var(--color-neutral-2);
        }
        .pill-list {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2);
        }
        .empty-hint {
          color: var(--color-neutral-3);
          font-size: 0.875rem;
        }
      `}</style>
    </section>
  );
}
