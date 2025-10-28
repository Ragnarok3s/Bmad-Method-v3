'use client';

import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { StatusBadge } from '@/components/ui/StatusBadge';

const playbooks = [
  {
    nome: 'Resposta a Overbooking',
    etapas: ['Identificar hóspedes elegíveis', 'Oferecer upgrade parceiro', 'Acionar comunicação multicanal'],
    estado: 'Template aprovado',
    variant: 'success' as const
  },
  {
    nome: 'Manutenção preventiva',
    etapas: ['Revisar sensores IoT', 'Notificar equipa técnica', 'Reportar conclusão'],
    estado: 'Nova versão disponível',
    variant: 'warning' as const
  },
  {
    nome: 'Campanha de Upsell',
    etapas: ['Segmentar hóspedes high-value', 'Enviar oferta personalizada', 'Medir conversão'],
    estado: 'Execução em curso',
    variant: 'info' as const
  }
];

export default function PlaybooksPage() {
  return (
    <div>
      <SectionHeader subtitle="Biblioteca inicial alinhada ao roadmap BL-03">
        Playbooks automatizados
      </SectionHeader>
      <ResponsiveGrid columns={3}>
        {playbooks.map((playbook) => (
          <Card key={playbook.nome} title={playbook.nome}>
            <StatusBadge variant={playbook.variant}>{playbook.estado}</StatusBadge>
            <ol>
              {playbook.etapas.map((etapa) => (
                <li key={etapa}>{etapa}</li>
              ))}
            </ol>
          </Card>
        ))}
      </ResponsiveGrid>
      <style jsx>{`
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
