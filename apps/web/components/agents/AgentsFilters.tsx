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
    <section className="agents-filters" aria-label="Filtros do catálogo de agentes">
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
