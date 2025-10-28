'use client';

import { Card } from '@/components/ui/Card';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';

const kpis = [
  { label: 'Taxa de ocupação', value: '87%', trend: '+5% vs semana anterior', variant: 'success' as const },
  { label: 'Alertas críticos', value: '3', trend: '2 housekeeping, 1 faturação', variant: 'critical' as const },
  { label: 'Playbooks ativos', value: '12', trend: '4 execuções nas últimas 24h', variant: 'info' as const }
];

const priorities = [
  {
    title: 'Checklist Housekeeping Sprint 1',
    description: 'Sincronizar revisão de quartos VIP e validar inventário de amenities.',
    status: 'Em progresso',
    statusVariant: 'warning' as const
  },
  {
    title: 'Revisão SLAs de parceiros',
    description: 'Confirmar janelas de recolha com lavanderia e manutenção preventiva.',
    status: 'Atenção',
    statusVariant: 'critical' as const
  },
  {
    title: 'Formação tour guiado',
    description: 'Realizar sessão com equipa de operações e recolher feedback do onboarding.',
    status: 'Agendado',
    statusVariant: 'info' as const
  }
];

export default function DashboardPage() {
  return (
    <div className="dashboard">
      <SectionHeader subtitle="Visão agregada das operações e agentes ativos">
        Dashboard de Operações
      </SectionHeader>
      <ResponsiveGrid columns={3}>
        {kpis.map((kpi) => (
          <Card key={kpi.label} title={kpi.label} description={kpi.trend} accent={kpi.variant}>
            <p className="kpi-value">{kpi.value}</p>
          </Card>
        ))}
      </ResponsiveGrid>
      <SectionHeader subtitle="Acompanhe tarefas críticas alinhadas ao roadmap BL-HK">
        Prioridades desta semana
      </SectionHeader>
      <ResponsiveGrid columns={3}>
        {priorities.map((item) => (
          <Card key={item.title} title={item.title} description={item.description}>
            <StatusBadge variant={item.statusVariant}>{item.status}</StatusBadge>
          </Card>
        ))}
      </ResponsiveGrid>
      <SectionHeader subtitle="Fluxos monitorizados com métricas de adoção e satisfação">
        Destaques rápidos
      </SectionHeader>
      <ResponsiveGrid columns={2}>
        <Card title="Onboarding" description="80% das equipas concluíram o wizard guiado em < 5 minutos." accent="info">
          <ul>
            <li>Checklist de acessibilidade validado (Iteração 2).</li>
            <li>Tour contextual atualizado com artigos "Primeiros Passos".</li>
          </ul>
        </Card>
        <Card title="Housekeeping" description="Sincronização offline validada para 36 quartos." accent="success">
          <ul>
            <li>Alertas críticos resolvidos em média 12 min.</li>
            <li>Inventário atualizado automaticamente após reconexão.</li>
          </ul>
        </Card>
      </ResponsiveGrid>
      <style jsx>{`
        .dashboard ul {
          margin: 0;
          padding-left: var(--space-5);
          display: grid;
          gap: var(--space-2);
        }
        .kpi-value {
          margin: 0;
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--color-deep-blue);
        }
      `}</style>
    </div>
  );
}
