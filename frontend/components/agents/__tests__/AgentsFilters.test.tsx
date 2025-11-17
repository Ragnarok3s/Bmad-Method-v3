import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';

import { AgentAvailability } from '@/services/api/agents';
import { AgentsFilters, AgentsAvailabilityFilterOption, AgentsFilterOption } from '../AgentsFilters';

describe('AgentsFilters', () => {
  const competencyOptions: AgentsFilterOption[] = [
    { value: 'crm', label: 'Integração com CRM', count: 3 },
    { value: 'upsell', label: 'Upsell de experiências', count: 4 }
  ];
  const availabilityOptions: AgentsAvailabilityFilterOption[] = [
    { value: 'available' as AgentAvailability, label: 'Disponível', count: 2 },
    { value: 'maintenance' as AgentAvailability, label: 'Em manutenção', count: 1 }
  ];

  it('renderiza todas as opções de filtro com acessibilidade', async () => {
    const { container } = render(
      <AgentsFilters
        competencies={competencyOptions}
        availability={availabilityOptions}
        selectedCompetencies={[]}
        selectedAvailability={[]}
        onCompetenciesChange={jest.fn()}
        onAvailabilityChange={jest.fn()}
      />
    );

    expect(screen.getByRole('region', { name: 'Filtros do catálogo de agentes' })).toBeInTheDocument();
    expect(screen.getByText('Nenhum filtro ativo.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Integração com CRM 3' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Disponível 2' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Limpar tudo' })).toBeDisabled();

    await expect(axe(container)).resolves.toHaveNoViolations();
  });

  it('adiciona e remove competências ao alternar um filtro', async () => {
    const user = userEvent.setup();
    const handleCompetenciesChange = jest.fn();

    const { rerender } = render(
      <AgentsFilters
        competencies={competencyOptions}
        availability={availabilityOptions}
        selectedCompetencies={[]}
        selectedAvailability={[]}
        onCompetenciesChange={handleCompetenciesChange}
        onAvailabilityChange={jest.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Integração com CRM 3' }));
    expect(handleCompetenciesChange).toHaveBeenLastCalledWith(['crm']);

    rerender(
      <AgentsFilters
        competencies={competencyOptions}
        availability={availabilityOptions}
        selectedCompetencies={['crm']}
        selectedAvailability={[]}
        onCompetenciesChange={handleCompetenciesChange}
        onAvailabilityChange={jest.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Integração com CRM 3' }));
    expect(handleCompetenciesChange).toHaveBeenLastCalledWith([]);
  });

  it('controla a seleção de disponibilidade mantendo valores únicos', async () => {
    const user = userEvent.setup();
    const handleAvailabilityChange = jest.fn();

    const { rerender } = render(
      <AgentsFilters
        competencies={competencyOptions}
        availability={availabilityOptions}
        selectedCompetencies={[]}
        selectedAvailability={[]}
        onCompetenciesChange={jest.fn()}
        onAvailabilityChange={handleAvailabilityChange}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Disponível 2' }));
    expect(handleAvailabilityChange).toHaveBeenLastCalledWith(['available']);

    rerender(
      <AgentsFilters
        competencies={competencyOptions}
        availability={availabilityOptions}
        selectedCompetencies={[]}
        selectedAvailability={['available']}
        onCompetenciesChange={jest.fn()}
        onAvailabilityChange={handleAvailabilityChange}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Disponível 2' }));
    expect(handleAvailabilityChange).toHaveBeenLastCalledWith([]);
  });

  it('exibe resumo dos filtros ativos e limpa todos ao solicitar', async () => {
    const user = userEvent.setup();
    const handleCompetenciesChange = jest.fn();
    const handleAvailabilityChange = jest.fn();

    const { rerender } = render(
      <AgentsFilters
        competencies={competencyOptions}
        availability={availabilityOptions}
        selectedCompetencies={['crm']}
        selectedAvailability={['available']}
        onCompetenciesChange={handleCompetenciesChange}
        onAvailabilityChange={handleAvailabilityChange}
      />
    );

    expect(
      screen.getByText('Filtros ativos (2): Competências: Integração com CRM · Disponibilidade: Disponível.')
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Limpar tudo' }));

    expect(handleCompetenciesChange).toHaveBeenCalledWith([]);
    expect(handleAvailabilityChange).toHaveBeenCalledWith([]);

    rerender(
      <AgentsFilters
        competencies={competencyOptions}
        availability={availabilityOptions}
        selectedCompetencies={[]}
        selectedAvailability={[]}
        onCompetenciesChange={handleCompetenciesChange}
        onAvailabilityChange={handleAvailabilityChange}
        disabled
      />
    );

    expect(screen.getByRole('button', { name: 'A actualizar filtros…' })).toBeDisabled();
  });
});
