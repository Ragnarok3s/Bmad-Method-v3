'use client';

import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { StatusBadge } from '@/components/ui/StatusBadge';

const pipelines = [
  {
    nome: 'Logs Agentes Housekeeping',
    status: 'Ingestão estável',
    variant: 'success' as const,
    detalhes: ['Latência média 2.4min', 'Alertas críticos configurados', 'Dashboards publicados']
  },
  {
    nome: 'Métricas Playbooks',
    status: 'Ajustes necessários',
    variant: 'warning' as const,
    detalhes: ['Normalizar tags', 'Sincronizar com BI', 'Atualizar painel de rollback']
  },
  {
    nome: 'Integração parceiros',
    status: 'Monitorização reforçada',
    variant: 'info' as const,
    detalhes: ['Webhooks lavanderia', 'Alertas SLA em beta', 'Documentação atualizada']
  }
];

export default function ObservabilidadePage() {
  return (
    <div>
      <SectionHeader subtitle="Integração com pipeline de logs, métricas e alertas (BL-04)">
        Observabilidade unificada
      </SectionHeader>
      <ResponsiveGrid columns={3}>
        {pipelines.map((pipeline) => (
          <Card key={pipeline.nome} title={pipeline.nome}>
            <StatusBadge variant={pipeline.variant}>{pipeline.status}</StatusBadge>
            <ul>
              {pipeline.detalhes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>
        ))}
      </ResponsiveGrid>
      <SectionHeader subtitle="Ações rápidas">
        Próximos passos
      </SectionHeader>
      <Card>
        <ul>
          <li>Publicar runbook de incidentes críticos.</li>
          <li>Configurar alertas de disponibilidade mobile.</li>
          <li>Realizar workshop de onboarding observabilidade.</li>
        </ul>
      </Card>
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
