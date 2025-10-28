'use client';

import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';

const passos = [
  {
    titulo: '1 · Configuração inicial',
    detalhes: ['Dados da equipa', 'Metas trimestrais', 'Preferências de comunicação']
  },
  {
    titulo: '2 · Seleção de agentes',
    detalhes: ['Filtros por competência', 'Sugestões baseadas em objetivos', 'Pré-visualização de playbooks']
  },
  {
    titulo: '3 · Checklist de prontidão',
    detalhes: ['Validação de permissões', 'Execução de playbook sandbox', 'Configuração MFA']
  }
];

const materiais = [
  'Tour guiado obrigatório no primeiro acesso',
  'Artigos "Primeiros Passos" com leitores de ecrã validados',
  'Checklist de acessibilidade aplicado e disponível para download'
];

export default function OnboardingPage() {
  return (
    <div>
      <SectionHeader subtitle="Wizard guiado conforme manual do usuário e roadmap BL-01">
        Onboarding de workspaces
      </SectionHeader>
      <ResponsiveGrid columns={3}>
        {passos.map((passo) => (
          <Card key={passo.titulo} title={passo.titulo}>
            <ul>
              {passo.detalhes.map((detalhe) => (
                <li key={detalhe}>{detalhe}</li>
              ))}
            </ul>
          </Card>
        ))}
      </ResponsiveGrid>
      <Card title="Materiais de apoio" description="Recursos disponíveis após completar o onboarding" accent="info">
        <ul>
          {materiais.map((item) => (
            <li key={item}>{item}</li>
          ))}
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
