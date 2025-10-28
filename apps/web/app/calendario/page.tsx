'use client';

import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';

const calendarioNotas = [
  {
    periodo: 'Esta semana',
    apontamentos: ['Taxa de ocupação média 84%', '3 conflitos resolvidos com ajuste automático', '2 eventos corporativos com bloqueio de inventário']
  },
  {
    periodo: 'Semana seguinte',
    apontamentos: ['Campanha NPS com 120 reservas confirmadas', 'Equipe housekeeping reforçada ( +3 colaboradores temporários )', 'Visita inspeção governamental - preparar documentação']
  }
];

const checklists = [
  {
    titulo: 'Fluxo semanal',
    itens: ['Validar feriados regionais', 'Conciliar integrações OTA', 'Revisar disponibilidade canal direto']
  },
  {
    titulo: 'Gestão de conflitos',
    itens: ['Aplicar regra VIP', 'Notificar manutenção', 'Executar playbook reserva múltipla']
  }
];

export default function CalendarioPage() {
  return (
    <div>
      <SectionHeader subtitle="Calendário operacional com visão semanal e mensal" actions={<button type="button">Exportar ICS</button>}>
        Calendário inteligente
      </SectionHeader>
      <ResponsiveGrid columns={2}>
        {calendarioNotas.map((notas) => (
          <Card key={notas.periodo} title={notas.periodo} accent="info">
            <ul>
              {notas.apontamentos.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>
        ))}
      </ResponsiveGrid>
      <SectionHeader subtitle="Checklist alinhado ao protótipo para garantir ritmo semanal">
        Rotinas recomendadas
      </SectionHeader>
      <ResponsiveGrid columns={2}>
        {checklists.map((checklist) => (
          <Card key={checklist.titulo} title={checklist.titulo}>
            <ul>
              {checklist.itens.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>
        ))}
      </ResponsiveGrid>
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
