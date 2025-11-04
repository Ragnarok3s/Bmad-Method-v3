import { render } from '@testing-library/react';
import { axe } from 'jest-axe';

import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { STATUS_VARIANTS } from '@/src/theme/statusTokens';

describe('Acessibilidade de componentes de estado', () => {
  it('StatusBadge não possui violações de acessibilidade nas variantes suportadas', async () => {
    const { container } = render(
      <div>
        {STATUS_VARIANTS.map((variant) => (
          <StatusBadge key={variant} variant={variant} tooltip={`Estado ${variant}`} focusable>
            {`Estado ${variant}`}
          </StatusBadge>
        ))}
      </div>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Card com realce de estado mantém critérios básicos de acessibilidade', async () => {
    const { container } = render(
      <Card accent="warning" title="Monitorização" description="Resumo diário" focusable>
        <p>Todos os fluxos encontram-se monitorizados e dentro dos limiares esperados.</p>
      </Card>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
