'use client';

import { AgentsCatalogView, type AgentsCatalogCopy } from '@/components/agents/AgentsCatalogView';

const copy: AgentsCatalogCopy = {
  header: {
    title: 'Configuração de agentes',
    subtitle: 'Catálogo centralizado com filtros e pré-configurações'
  },
  loadingLabel: 'A sincronizar catálogo de agentes…',
  error: {
    title: 'Não foi possível carregar o catálogo',
    description: 'Verifique a ligação ao Core Service ou tente novamente em instantes.',
    actionLabel: 'Tentar novamente',
    actionLoadingLabel: 'A tentar novamente…'
  },
  empty: {
    title: 'Nenhum agente encontrado com os filtros atuais',
    description: 'Altere os filtros de competência ou disponibilidade para explorar mais opções.',
    actionLabel: 'Limpar filtros'
  },
  metadata: {
    competenciesTitle: 'Competências principais',
    integrationsTitle: 'Integrações certificadas',
    automationLabel: 'Automação',
    automationFallback: 'Sob consulta',
    languagesLabel: 'Idiomas',
    responseLabel: (value) => `Resposta média: ${value} min`,
    responseFallback: 'Resposta média: Sob consulta'
  },
  pagination: {
    ariaLabel: 'Paginação do catálogo de agentes',
    previousLabel: 'Anterior',
    nextLabel: 'Seguinte',
    summary: (page, totalPages, totalItems) => `Página ${page} de ${totalPages} · ${totalItems} agentes`
  },
  bundleAction: {
    label: 'Lançar bundle',
    loadingLabel: 'A preparar bundle…'
  }
};

export default function AgentesPage() {
  return <AgentsCatalogView copy={copy} />;
}
