'use client';

import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';

const recursos = [
  {
    titulo: 'Base de conhecimento',
    itens: ['Artigos semanais', 'Tutoriais em vídeo', 'FAQs acessíveis']
  },
  {
    titulo: 'Central de tickets',
    itens: ['Acompanhamento de SLA', 'Histórico de incidentes', 'Integração ITSM']
  },
  {
    titulo: 'Chat de suporte',
    itens: ['Escalonamento em tempo real', 'Registo automático de conversas', 'Hand-off pós incidentes']
  }
];

const checklist = [
  'Concluir tour guiado de suporte no onboarding',
  'Validar canais de atendimento com equipas',
  'Registar feedback no painel de NPS interno'
];

export default function SuportePage() {
  return (
    <div>
      <SectionHeader subtitle="Centro de suporte completo conforme manual do usuário">
        Base de conhecimento & Ajuda
      </SectionHeader>
      <ResponsiveGrid columns={3}>
        {recursos.map((recurso) => (
          <Card key={recurso.titulo} title={recurso.titulo}>
            <ul>
              {recurso.itens.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>
        ))}
      </ResponsiveGrid>
      <Card title="Checklist de lançamento" description="Valide antes do go-live" accent="info">
        <ul>
          {checklist.map((item) => (
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
