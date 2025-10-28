'use client';

import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { StatusBadge } from '@/components/ui/StatusBadge';

const agentes = [
  {
    nome: 'Concierge Digital',
    competencias: ['Upsell de experiências', 'Integração com CRM'],
    sla: 'Tempo de resposta < 2 min',
    estado: 'Disponível',
    variant: 'success' as const
  },
  {
    nome: 'Agente de Manutenção',
    competencias: ['Workflows corretivos', 'Alertas IoT'],
    sla: 'Escalonamento automático',
    estado: 'Atualizar credenciais',
    variant: 'warning' as const
  },
  {
    nome: 'Assistente Revenue',
    competencias: ['Recomendações tarifárias', 'Monitorização de concorrentes'],
    sla: 'Relatórios diários às 07h',
    estado: 'Manutenção programada',
    variant: 'critical' as const
  }
];

export default function AgentesPage() {
  return (
    <div>
      <SectionHeader subtitle="Catálogo centralizado com filtros e pré-configurações">
        Configuração de agentes
      </SectionHeader>
      <ResponsiveGrid columns={3}>
        {agentes.map((agente) => (
          <Card key={agente.nome} title={agente.nome} description={agente.sla}>
            <StatusBadge variant={agente.variant}>{agente.estado}</StatusBadge>
            <ul>
              {agente.competencias.map((competencia) => (
                <li key={competencia}>{competencia}</li>
              ))}
            </ul>
          </Card>
        ))}
      </ResponsiveGrid>
      <style jsx>{`
        ul {
          margin: 0;
          padding-left: var(--space-5);
          display: grid;
          gap: var(--space-2);
        }
      `}</style>
    </div>
  );
}
