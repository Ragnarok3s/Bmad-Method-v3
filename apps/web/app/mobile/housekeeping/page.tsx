'use client';

import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useOffline } from '@/components/offline/OfflineContext';

const mobileTarefas = [
  {
    quarto: '102',
    estado: 'Em andamento',
    variant: 'warning' as const,
    passos: ['Checklist rápido', 'Capturar fotos', 'Reportar incidente?']
  },
  {
    quarto: '305',
    estado: 'Concluído',
    variant: 'success' as const,
    passos: ['Limpeza finalizada', 'Sincronizar notas', 'Validar assinatura digital']
  }
];

export default function MobileHousekeepingPage() {
  const { isOffline } = useOffline();

  return (
    <div>
      <SectionHeader subtitle="Fluxo mobile inspirado no protótipo Iteração 2">
        App Mobile · Housekeeping
      </SectionHeader>
      <Card
        title="Estado"
        description="O app móvel continua funcional mesmo sem conexão"
        accent={isOffline ? 'critical' : 'success'}
      >
        <p>{isOffline ? 'Modo offline ativo · Conteúdo sincroniza mais tarde.' : 'Ligação ativa · Sync automático a cada ação.'}</p>
      </Card>
      <SectionHeader subtitle="Tarefas rápidas">
        Quadro de quartos
      </SectionHeader>
      <div className="listagem">
        {mobileTarefas.map((tarefa) => (
          <Card key={tarefa.quarto} title={`Quarto ${tarefa.quarto}`} description="">
            <StatusBadge variant={tarefa.variant}>{tarefa.estado}</StatusBadge>
            <ol>
              {tarefa.passos.map((passo) => (
                <li key={passo}>{passo}</li>
              ))}
            </ol>
          </Card>
        ))}
      </div>
      <style jsx>{`
        .listagem {
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
