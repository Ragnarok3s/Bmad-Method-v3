'use client';

import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { useAnalytics } from '@/components/analytics/AnalyticsContext';

const metricas = [
  { nome: 'Conclusão Onboarding', valor: '82%', meta: '≥ 60%', variant: 'success' as const },
  { nome: 'NPS interno', valor: '+34', meta: '≥ +30', variant: 'success' as const },
  { nome: 'Adoção Playbooks', valor: '5 execuções/dia', meta: '≥ 4', variant: 'info' as const }
];

const iniciativas = [
  'Exportação CSV automática para comitê executivo',
  'Alertas de variação súbita em métricas de satisfação',
  'Segmentação por perfil (Administrador, Colaborador, Analista)'
];

export default function AnalyticsPage() {
  const { flushQueue } = useAnalytics();

  return (
    <div>
      <SectionHeader
        subtitle="Dashboards MVP e instrumentação alinhados ao manual do usuário"
        actions={
          <button type="button" onClick={() => console.table(flushQueue())}>
            Exportar eventos recentes
          </button>
        }
      >
        Analytics & Insights
      </SectionHeader>
      <ResponsiveGrid columns={3}>
        {metricas.map((metrica) => (
          <Card key={metrica.nome} title={metrica.nome} description={`Meta: ${metrica.meta}`} accent={metrica.variant}>
            <p className="valor">{metrica.valor}</p>
          </Card>
        ))}
      </ResponsiveGrid>
      <Card title="Próximas evoluções" description="Roadmap BL-06" accent="info">
        <ul>
          {iniciativas.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Card>
      <style jsx>{`
        button {
          border: none;
          border-radius: var(--radius-sm);
          padding: var(--space-2) var(--space-4);
          background: var(--color-deep-blue);
          color: #fff;
          font-weight: 600;
          cursor: pointer;
        }
        .valor {
          margin: 0;
          font-size: 1.75rem;
          font-weight: 700;
        }
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
