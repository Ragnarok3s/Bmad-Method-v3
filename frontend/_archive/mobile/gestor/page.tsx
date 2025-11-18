'use client';

import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';

const alertas = [
  {
    titulo: 'Aprovação de orçamento',
    descricao: 'Solicitação playbook manutenção · €420',
    status: 'Pendente',
    variant: 'warning' as const
  },
  {
    titulo: 'Indicador NPS',
    descricao: 'Campanha housekeeping acima da meta (+6)',
    status: 'Saudável',
    variant: 'success' as const
  }
];

const acoesRapidas = [
  'Aprovar ajustes de faturação',
  'Delegar tarefas urgentes',
  'Enviar broadcast à equipa'
];

export default function MobileGestorPage() {
  return (
    <div>
      <SectionHeader subtitle="KPIs resumidos e aprovações rápidas">
        App Mobile · Gestor
      </SectionHeader>
      <div className="cartoes">
        {alertas.map((alerta) => (
          <Card key={alerta.titulo} title={alerta.titulo} description={alerta.descricao}>
            <StatusBadge variant={alerta.variant}>{alerta.status}</StatusBadge>
          </Card>
        ))}
      </div>
      <Card title="Ações rápidas" description="Tomadas de decisão em até 2 toques" accent="info">
        <ol>
          {acoesRapidas.map((acao) => (
            <li key={acao}>{acao}</li>
          ))}
        </ol>
      </Card>
      <style jsx>{`
        .cartoes {
          display: grid;
          gap: var(--space-4);
        }
        ol {
          margin: 0;
          padding-left: var(--space-5);
          display: grid;
          gap: var(--space-2);
        }
      `}</style>
    </div>
  );
}
