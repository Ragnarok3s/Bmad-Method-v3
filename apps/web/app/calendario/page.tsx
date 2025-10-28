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

const auditorias = [
  {
    titulo: 'Auditoria de Permissões',
    owner: 'Administrador de Workspace',
    janela: 'Mensal (1ª segunda-feira)',
    passos: [
      'Executar scripts/governanca/auditar-permissoes.py com planilha RH',
      'Atualizar políticas em /governanca e exportar CSV/PDF',
      'Registrar evidências na ata padrão e confirmar rollback de exceções'
    ],
    stride: ['Spoofing', 'Tampering', 'Repudiation', 'Information Disclosure', 'Denial of Service', 'Elevation of Privilege']
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
      <SectionHeader subtitle="Responsáveis e salvaguardas das auditorias críticas">
        Calendário de auditoria
      </SectionHeader>
      <ResponsiveGrid columns={1}>
        {auditorias.map((auditoria) => (
          <Card key={auditoria.titulo} title={auditoria.titulo} accent="warning">
            <p>
              <strong>Owner:</strong> {auditoria.owner} · <strong>Janela:</strong> {auditoria.janela}
            </p>
            <ul>
              {auditoria.passos.map((passo) => (
                <li key={passo}>{passo}</li>
              ))}
            </ul>
            <p>
              <strong>Checklist STRIDE:</strong> {auditoria.stride.join(', ')}
            </p>
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
