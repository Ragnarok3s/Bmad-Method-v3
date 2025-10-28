'use client';

import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useOffline } from '@/components/offline/OfflineContext';

const tarefas = [
  {
    quarto: '1204 · VIP',
    estado: 'Limpeza profunda',
    statusVariant: 'warning' as const,
    notas: ['Prioridade alta', 'Verificar amenities premium', 'Reportar avarias']
  },
  {
    quarto: '908',
    estado: 'Check-out concluído',
    statusVariant: 'success' as const,
    notas: ['Fotos anexadas (3)', 'Sincronizado às 08:40', 'Sem incidentes']
  },
  {
    quarto: '415',
    estado: 'Aguardando manutenção',
    statusVariant: 'critical' as const,
    notas: ['Vazamento em lavatório', 'Playbook manutenção acionado', 'Alertar receção']
  }
];

const sincronizacoes = [
  {
    titulo: 'Fila de sincronização',
    itens: ['Atualizar estoque de amenities', 'Enviar fotos quarto 1204', 'Confirmar ajuste de SLA lavanderia']
  },
  {
    titulo: 'Indicadores de eficiência',
    itens: ['Tempo médio de limpeza: 14min', 'Quartos inspeccionados: 32', 'Incidentes abertos: 2']
  }
];

export default function HousekeepingPage() {
  const { isOffline } = useOffline();

  return (
    <div>
      <SectionHeader subtitle="Planeamento diário com suporte offline-first">
        Housekeeping
      </SectionHeader>
      <Card
        title="Estado da conexão"
        description="Monitorize tarefas pendentes e sincronizações agendadas."
        accent={isOffline ? 'critical' : 'success'}
      >
        <p>
          {isOffline
            ? 'Modo offline ativo. As tarefas concluídas serão sincronizadas automaticamente quando a conexão retornar.'
            : 'Online. Sincronização automática a cada 2 minutos e sincronização manual disponível.'}
        </p>
      </Card>
      <SectionHeader subtitle="Atribuições priorizadas conforme protótipo mobile">
        Tarefas de hoje
      </SectionHeader>
      <ResponsiveGrid columns={3}>
        {tarefas.map((tarefa) => (
          <Card key={tarefa.quarto} title={tarefa.quarto} description={tarefa.estado}>
            <StatusBadge variant={tarefa.statusVariant}>{tarefa.estado}</StatusBadge>
            <ul>
              {tarefa.notas.map((nota) => (
                <li key={nota}>{nota}</li>
              ))}
            </ul>
          </Card>
        ))}
      </ResponsiveGrid>
      <SectionHeader subtitle="Sincronizações e métricas para gestores">
        Operação em tempo real
      </SectionHeader>
      <ResponsiveGrid columns={2}>
        {sincronizacoes.map((bloco) => (
          <Card key={bloco.titulo} title={bloco.titulo}>
            <ul>
              {bloco.itens.map((item) => (
                <li key={item}>{item}</li>
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
