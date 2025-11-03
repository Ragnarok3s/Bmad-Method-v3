import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface ModuleStat {
  label: string;
  value: string;
  helper?: string;
  trend?: {
    direction: 'up' | 'down';
    value: string;
  };
}

interface ModuleHighlight {
  title: string;
  description: string;
  status?: 'beta' | 'live' | 'planned';
}

interface ModuleChecklistItem {
  label: string;
  done: boolean;
}

interface ModuleTimelineItem {
  title: string;
  timestamp: string;
  description: string;
}

interface ModuleTemplateProps {
  title: string;
  description: string;
  stats: ModuleStat[];
  highlights: ModuleHighlight[];
  timeline: ModuleTimelineItem[];
  checklist: ModuleChecklistItem[];
}

function ModuleTemplate({ title, description, stats, highlights, timeline, checklist }: ModuleTemplateProps) {
  return (
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      <header className="space-y-2">
        <h1>{title}</h1>
        <p className="text-muted-foreground max-w-3xl">{description}</p>
      </header>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="space-y-1">
                <CardTitle className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                {stat.helper && <p className="text-sm text-muted-foreground">{stat.helper}</p>}
                {stat.trend && (
                  <p
                    className={`text-xs font-medium ${
                      stat.trend.direction === 'up' ? 'text-success' : 'text-danger'
                    }`}
                  >
                    {stat.trend.direction === 'up' ? '▲' : '▼'} {stat.trend.value} vs. último período
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Iniciativas em foco</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {highlights.map((item) => (
              <div key={item.title} className="rounded-lg border border-border bg-card p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                  {item.status && (
                    <Badge variant={item.status === 'live' ? 'default' : 'outline'} className="text-xs capitalize">
                      {item.status === 'beta' ? 'Beta' : item.status === 'planned' ? 'Planeado' : 'Live'}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Checklist operacional</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {checklist.map((item) => (
                <li key={item.label} className="flex items-start gap-3 text-sm">
                  <span
                    className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border text-xs font-semibold ${
                      item.done ? 'border-success text-success' : 'border-muted-foreground text-muted-foreground'
                    }`}
                  >
                    {item.done ? '✓' : '•'}
                  </span>
                  <span className={item.done ? 'text-foreground' : 'text-muted-foreground'}>{item.label}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Linha temporal recente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {timeline.map((event) => (
              <div key={event.title} className="rounded-lg border border-border bg-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-semibold">{event.title}</h3>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    {event.timestamp}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{event.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function createTimeline(base: ModuleTimelineItem[]): ModuleTimelineItem[] {
  return base.map((item) => ({ ...item }));
}

export function AnalyticsModulePage() {
  return (
    <ModuleTemplate
      title="Analytics"
      description="Modelos de previsão, coortes e pipelines consolidados para a operação diária."
      stats={[
        {
          label: 'Dashboards publicados',
          value: '24',
          helper: '6 equipas ativas',
          trend: { direction: 'up', value: '12%' }
        },
        {
          label: 'Atualizações do warehouse',
          value: '15 min',
          helper: 'Refresh incremental',
          trend: { direction: 'down', value: '4 min' }
        },
        {
          label: 'Alertas de dados',
          value: '3',
          helper: '2 críticos, 1 aviso'
        },
        {
          label: 'KPIs chave',
          value: '18',
          helper: 'Monitorização diária'
        }
      ]}
      highlights={[
        {
          title: 'Previsão de ocupação',
          description: 'Modelos Prophet com ajuste semanal e eventos externos. Automatiza recomendações de preço dinâmico.',
          status: 'live'
        },
        {
          title: 'Coortes de canal',
          description: 'Analítica comparativa OTA vs. direto com margem operacional e impacto em housekeeping.',
          status: 'beta'
        },
        {
          title: 'Qualidade de dados',
          description: 'Data contracts e testes automáticos antes de publicar dashboards sensíveis.',
          status: 'planned'
        }
      ]}
      checklist={[
        { label: 'Definir proprietários de métricas por domínio', done: true },
        { label: 'Automatizar alertas no Slack com thresholds dinâmicos', done: false },
        { label: 'Versionar queries críticas no GitOps', done: true }
      ]}
      timeline={createTimeline([
        {
          title: 'Deploy do modelo de forecasting',
          timestamp: 'Ontem · 18:40',
          description: 'Nova versão com feriados nacionais e eventos locais ativados para Porto e Lisboa.'
        },
        {
          title: 'Auditoria de métricas concluída',
          timestamp: 'Há 2 dias',
          description: 'Governança aprovou 12 métricas core e atualizou o dicionário operacional.'
        },
        {
          title: 'Pipeline de reservas unificado',
          timestamp: 'Há 5 dias',
          description: 'Integração com PMS atualizado. Retrabalho de mapeamento de extras concluído.'
        }
      ])}
    />
  );
}

export function GovernanceModulePage() {
  return (
    <ModuleTemplate
      title="Governança"
      description="Controlo de políticas, auditorias e conformidade operacional com visão em tempo real."
      stats={[
        {
          label: 'Políticas ativas',
          value: '42',
          helper: '7 em revisão'
        },
        {
          label: 'Auditorias concluídas',
          value: '12',
          helper: 'Últimos 30 dias',
          trend: { direction: 'up', value: '8%' }
        },
        {
          label: 'Incidentes críticos',
          value: '0',
          helper: 'Todos mitigados',
          trend: { direction: 'down', value: '3' }
        },
        {
          label: 'Acessos provisionados',
          value: '128',
          helper: 'RBAC sincronizado'
        }
      ]}
      highlights={[
        {
          title: 'Mapa de políticas por módulo',
          description: 'Segmentação por reservas, owners e housekeeping com KPIs de aderência.',
          status: 'live'
        },
        {
          title: 'Fluxo de aprovação em 2 passos',
          description: 'Integração com assinatura digital e histórico versionado.',
          status: 'beta'
        },
        {
          title: 'Playbooks de auditoria automática',
          description: 'Executa validações de logs e provisioning semanalmente.',
          status: 'planned'
        }
      ]}
      checklist={[
        { label: 'Configurar owners para novos módulos', done: false },
        { label: 'Sincronizar evidências de auditoria no cofre', done: true },
        { label: 'Rever matrizes de segregação de funções', done: true }
      ]}
      timeline={createTimeline([
        {
          title: 'Revisão trimestral de acessos',
          timestamp: 'Hoje · 10:00',
          description: 'Provisionamento automático removeu 14 acessos inativos.'
        },
        {
          title: 'Checklist ESG disponível',
          timestamp: 'Há 3 dias',
          description: 'Nova política ambiental adicionada ao portal de owners.'
        },
        {
          title: 'Conformidade GDPR revalidada',
          timestamp: 'Há 1 semana',
          description: 'Playbook validou retenção de dados e anonimização de hóspedes.'
        }
      ])}
    />
  );
}

export function ObservabilityModulePage() {
  return (
    <ModuleTemplate
      title="Observabilidade"
      description="Logs, métricas e tracing para serviços críticos de reservas e pagamentos."
      stats={[
        {
          label: 'Serviços monitorizados',
          value: '36',
          helper: '100% cobertura'
        },
        {
          label: 'Tempo médio de resolução',
          value: '18 min',
          trend: { direction: 'down', value: '6 min' }
        },
        {
          label: 'Alertas nas últimas 24h',
          value: '5',
          helper: '1 crítico · 4 aviso'
        },
        {
          label: 'Synthetic checks',
          value: '62',
          helper: '15 países'
        }
      ]}
      highlights={[
        {
          title: 'Mapa de dependências',
          description: 'Serviços de pricing e PMS com tracing distribuído e tempo de resposta por região.',
          status: 'live'
        },
        {
          title: 'Deteção de anomalias',
          description: 'Modelos de baselining em métricas de reservas e webhooks.',
          status: 'beta'
        },
        {
          title: 'Runbooks automatizados',
          description: 'Integração direta com incident response e escalonamento multi-equipa.',
          status: 'planned'
        }
      ]}
      checklist={[
        { label: 'Cobertura de logs estruturados em 100%', done: true },
        { label: 'Ativar dashboards mobile para gestão', done: false },
        { label: 'Rever limites de erro nas OTAs', done: true }
      ]}
      timeline={createTimeline([
        {
          title: 'Incidente de webhook mitigado',
          timestamp: 'Há 4 horas',
          description: 'Falha de OTA Booking resolvida com replay automático das mensagens perdidas.'
        },
        {
          title: 'Upgrade do agente OpenTelemetry',
          timestamp: 'Ontem',
          description: 'Novas labels para segmentar reservas por tipo de propriedade.'
        },
        {
          title: 'Sprint de observabilidade iniciada',
          timestamp: 'Há 6 dias',
          description: 'Meta de reduzir MTTR em 20% com alertas correlacionados.'
        }
      ])}
    />
  );
}

export function AgentsModulePage() {
  return (
    <ModuleTemplate
      title="Catálogo de Agentes"
      description="Assistentes operacionais especializados por módulo com supervisão humana."
      stats={[
        {
          label: 'Agentes ativos',
          value: '14',
          helper: '3 em modo piloto'
        },
        {
          label: 'Tarefas automatizadas',
          value: '318/mês',
          trend: { direction: 'up', value: '22%' }
        },
        {
          label: 'Intervenções humanas',
          value: '9%',
          helper: 'Últimos 7 dias'
        },
        {
          label: 'Satisfação equipa',
          value: '4.7/5'
        }
      ]}
      highlights={[
        {
          title: 'Agente de disponibilidade OTA',
          description: 'Prevê overbookings e propõe ajustes com integrações diretas em canais.',
          status: 'live'
        },
        {
          title: 'Agente de owners',
          description: 'Sintetiza rentabilidade e insights personalizados por propriedade.',
          status: 'beta'
        },
        {
          title: 'Supervisor generativo',
          description: 'Avalia outputs dos agentes com regras de conformidade e fallback humano.',
          status: 'planned'
        }
      ]}
      checklist={[
        { label: 'Treinar datasets específicos por cluster de propriedades', done: false },
        { label: 'Implementar métricas de explicabilidade', done: true },
        { label: 'Rever guardrails de linguagem', done: true }
      ]}
      timeline={createTimeline([
        {
          title: 'Integração com SOPs concluída',
          timestamp: 'Hoje · 08:15',
          description: 'Agentes agora consultam procedimentos aprovados antes de sugerir ações.'
        },
        {
          title: 'Avaliação de performance mensal',
          timestamp: 'Há 2 dias',
          description: 'Precisão média de 92% com 18 recomendações rejeitadas pelo operador.'
        },
        {
          title: 'Treino de linguagem multilingue',
          timestamp: 'Há 1 semana',
          description: 'Modelo ajustado para inglês, espanhol e francês com validação nativa.'
        }
      ])}
    />
  );
}

export function PlaybooksModulePage() {
  return (
    <ModuleTemplate
      title="Playbooks Automatizados"
      description="Fluxos com aprovação, escalonamento e métricas de adoção para toda a operação."
      stats={[
        {
          label: 'Playbooks publicados',
          value: '28',
          helper: '12 críticos'
        },
        {
          label: 'Execuções mensais',
          value: '642',
          trend: { direction: 'up', value: '18%' }
        },
        {
          label: 'Passos médios',
          value: '8',
          helper: '4 automatizados'
        },
        {
          label: 'Tempo médio de conclusão',
          value: '12 min',
          trend: { direction: 'down', value: '3 min' }
        }
      ]}
      highlights={[
        {
          title: 'Resposta a incidentes OTA',
          description: 'Integração com observabilidade e agentes para corrigir falhas e notificar proprietários.',
          status: 'live'
        },
        {
          title: 'Upsell pre-check-in',
          description: 'Automação envia recomendações personalizadas 48h antes da chegada.',
          status: 'beta'
        },
        {
          title: 'Fecho mensal automatizado',
          description: 'Consolida faturação, reconciliação e relatórios em sequência única.',
          status: 'planned'
        }
      ]}
      checklist={[
        { label: 'Garantir owners por playbook crítico', done: true },
        { label: 'Ativar testes sandbox antes do publish', done: false },
        { label: 'Configurar métricas de adoção por equipa', done: true }
      ]}
      timeline={createTimeline([
        {
          title: 'Novo playbook de inventário',
          timestamp: 'Ontem',
          description: 'Atualiza disponibilidade multi-propriedade após auditoria física.'
        },
        {
          title: 'Revisão de aprovação owners',
          timestamp: 'Há 4 dias',
          description: 'Processo reduzido para 2 passos com notificações push.'
        },
        {
          title: 'Monitorização em tempo real',
          timestamp: 'Há 1 semana',
          description: 'Dashboard de adoção agora destaca gargalos e SLA por equipa.'
        }
      ])}
    />
  );
}

export function RecommendationsModulePage() {
  return (
    <ModuleTemplate
      title="Recomendações"
      description="Motor de sugestões para upsell, pricing dinâmico e ações corretivas."
      stats={[
        {
          label: 'Recomendações ativas',
          value: '54',
          helper: '26 executadas esta semana'
        },
        {
          label: 'Taxa de aceitação',
          value: '68%',
          trend: { direction: 'up', value: '9%' }
        },
        {
          label: 'Impacto em receita',
          value: '+€12,4k',
          helper: 'Últimos 30 dias'
        },
        {
          label: 'Modelos treinados',
          value: '7',
          helper: 'Atualização semanal'
        }
      ]}
      highlights={[
        {
          title: 'Upsell de experiências locais',
          description: 'Sugestões com base em preferências, clima e disponibilidade de parceiros.',
          status: 'live'
        },
        {
          title: 'Preço dinâmico por segmento',
          description: 'Modelos consideram procura, lead time e eventos locais.',
          status: 'beta'
        },
        {
          title: 'Ações corretivas de housekeeping',
          description: 'Identifica quartos críticos e gera tarefas prioritárias automáticas.',
          status: 'planned'
        }
      ]}
      checklist={[
        { label: 'Validar explicabilidade com equipa de revenue', done: true },
        { label: 'Adicionar feedback proprietário nas sugestões', done: false },
        { label: 'Mapear impacto em NPS hóspedes', done: false }
      ]}
      timeline={createTimeline([
        {
          title: 'Novos parceiros gastronómicos',
          timestamp: 'Hoje · 11:30',
          description: 'Experiências culinárias adicionadas às recomendações de estadia premium.'
        },
        {
          title: 'Teste A/B concluído',
          timestamp: 'Há 3 dias',
          description: 'Pacote romântico teve aumento de 14% na conversão.'
        },
        {
          title: 'Pipeline de feedback estruturado',
          timestamp: 'Há 1 semana',
          description: 'Owners podem aceitar ou sugerir alternativas diretamente pelo portal.'
        }
      ])}
    />
  );
}

export function MarketplaceModulePage() {
  return (
    <ModuleTemplate
      title="Marketplace"
      description="Gestão de integrações certificadas, parceiros e extensões proprietárias."
      stats={[
        {
          label: 'Integrações disponíveis',
          value: '32',
          helper: '6 novas este mês'
        },
        {
          label: 'Clientes ativos',
          value: '214',
          trend: { direction: 'up', value: '11%' }
        },
        {
          label: 'Avaliação média',
          value: '4.6/5'
        },
        {
          label: 'Tempo médio de setup',
          value: '2.3 dias',
          trend: { direction: 'down', value: '0.5 dia' }
        }
      ]}
      highlights={[
        {
          title: 'Novos parceiros PMS',
          description: 'Integrações com Opera Cloud e Cloudbeds certificadas para sync bidirecional.',
          status: 'live'
        },
        {
          title: 'Segmento housekeeping',
          description: 'Ecossistema de sensores e IoT com métricas ambientais.',
          status: 'beta'
        },
        {
          title: 'Marketplace owners',
          description: 'Pacotes de reporting premium e fiscalidade local.',
          status: 'planned'
        }
      ]}
      checklist={[
        { label: 'Completar due diligence de segurança', done: true },
        { label: 'Lançar programa de comissões parceiros', done: false },
        { label: 'Atualizar documentação API pública', done: true }
      ]}
      timeline={createTimeline([
        {
          title: 'Certificação Stripe Connect',
          timestamp: 'Ontem',
          description: 'Processo de payout para owners homologado com relatórios automáticos.'
        },
        {
          title: 'Parceria com fornecedor de locks',
          timestamp: 'Há 4 dias',
          description: 'Integração sem fio com níveis de acesso por perfil de colaborador.'
        },
        {
          title: 'Campanha de early adopters',
          timestamp: 'Há 1 semana',
          description: 'Primeiros 20 clientes recebem onboarding personalizado e suporte dedicado.'
        }
      ])}
    />
  );
}

export function ExtensionsModulePage() {
  return (
    <ModuleTemplate
      title="Extensões"
      description="Componentes customizados e add-ons específicos para portefólios premium."
      stats={[
        {
          label: 'Extensões instaladas',
          value: '18',
          helper: 'por portefólio'
        },
        {
          label: 'Tempo médio de adoção',
          value: '9 dias',
          trend: { direction: 'down', value: '2 dias' }
        },
        {
          label: 'Extensões beta',
          value: '5',
          helper: 'Em testes controlados'
        },
        {
          label: 'Nível de satisfação',
          value: '4.8/5'
        }
      ]}
      highlights={[
        {
          title: 'Portal de owners white-label',
          description: 'Customização avançada de branding e relatórios interativos.',
          status: 'live'
        },
        {
          title: 'Dashboard ESG',
          description: 'Extensão com métricas ambientais e benchmarking setorial.',
          status: 'beta'
        },
        {
          title: 'Gestão de amenities',
          description: 'Integra sensores IoT para reposição automática.',
          status: 'planned'
        }
      ]}
      checklist={[
        { label: 'Documentar APIs de extensão', done: true },
        { label: 'Criar loja interna de módulos', done: false },
        { label: 'Garantir suporte 24/7 para premium', done: true }
      ]}
      timeline={createTimeline([
        {
          title: 'Entrega da extensão ESG',
          timestamp: 'Hoje · 09:10',
          description: 'Disponível para clientes enterprise com onboarding assistido.'
        },
        {
          title: 'Roadmap Q2 aprovado',
          timestamp: 'Há 2 dias',
          description: 'Novas integrações mobile e suporte offline confirmados.'
        },
        {
          title: 'Avaliação de segurança concluída',
          timestamp: 'Há 1 semana',
          description: 'Extensões passaram por teste de penetração trimestral.'
        }
      ])}
    />
  );
}

export function GuestExperienceModulePage() {
  return (
    <ModuleTemplate
      title="Guest Experience"
      description="Jornadas personalizadas antes, durante e após a estadia com métricas de satisfação."
      stats={[
        {
          label: 'Pontuação NPS',
          value: '67',
          trend: { direction: 'up', value: '5 pontos' }
        },
        {
          label: 'Workflows ativos',
          value: '14',
          helper: 'Pré check-in · in stay · pós-estadia'
        },
        {
          label: 'Taxa de resposta',
          value: '82%',
          helper: 'Survey pós-estadia'
        },
        {
          label: 'Upsell médio',
          value: '€34',
          helper: 'por reserva'
        }
      ]}
      highlights={[
        {
          title: 'App de concierge digital',
          description: 'Assistente com itinerários dinâmicos e chat integrado com agentes.',
          status: 'live'
        },
        {
          title: 'Mensagens proativas',
          description: 'Campanhas segmentadas de boas-vindas e upgrades em tempo real.',
          status: 'beta'
        },
        {
          title: 'Relatórios de feedback proprietários',
          description: 'Transparência total com insights por unidade.',
          status: 'planned'
        }
      ]}
      checklist={[
        { label: 'Ativar tradução automática para 5 idiomas', done: true },
        { label: 'Sincronizar com housekeeping para follow-up', done: false },
        { label: 'Monitorizar reviews OTAs semanalmente', done: true }
      ]}
      timeline={createTimeline([
        {
          title: 'Campanha de aniversário',
          timestamp: 'Ontem',
          description: 'E-mails personalizados disparados com vouchers para experiências locais.'
        },
        {
          title: 'Integração WhatsApp concluída',
          timestamp: 'Há 3 dias',
          description: 'Mensagens automáticas com confirmação instantânea para pedidos especiais.'
        },
        {
          title: 'Workshop de feedback com equipa',
          timestamp: 'Há 6 dias',
          description: 'Ajustes na jornada digital com foco em hóspedes repetentes.'
        }
      ])}
    />
  );
}

export function OwnersModulePage() {
  return (
    <ModuleTemplate
      title="Portal de Proprietários"
      description="Transparência financeira, documentos e colaboração contínua com parceiros."
      stats={[
        {
          label: 'Proprietários ativos',
          value: '92',
          helper: 'Portefólio completo'
        },
        {
          label: 'Documentos partilhados',
          value: '1.240',
          helper: 'Últimos 30 dias'
        },
        {
          label: 'Tempo médio de resposta',
          value: '3h 20m',
          trend: { direction: 'down', value: '45m' }
        },
        {
          label: 'Satisfação dos owners',
          value: '4.9/5'
        }
      ]}
      highlights={[
        {
          title: 'Relatórios de performance',
          description: 'Dashboards interativos com drill-down por imóvel, canal e custo.',
          status: 'live'
        },
        {
          title: 'Gestão de faturação',
          description: 'Workflow completo de reconciliação, notas de crédito e assinaturas.',
          status: 'beta'
        },
        {
          title: 'Hub de documentos legais',
          description: 'Acesso controlado com histórico e alertas de expiração.',
          status: 'planned'
        }
      ]}
      checklist={[
        { label: 'Garantir versão mobile responsiva', done: true },
        { label: 'Automatizar notificações fiscais', done: false },
        { label: 'Personalizar branding por owner premium', done: false }
      ]}
      timeline={createTimeline([
        {
          title: 'Envio mensal concluído',
          timestamp: 'Hoje · 07:45',
          description: 'Relatórios de rentabilidade partilhados com 100% de entrega confirmada.'
        },
        {
          title: 'Sessão de Q&A com owners',
          timestamp: 'Há 2 dias',
          description: 'Feedback positivo sobre transparência e previsibilidade.'
        },
        {
          title: 'Integração com contabilidade',
          timestamp: 'Há 1 semana',
          description: 'Dados sincronizados em tempo real com software fiscal.'
        }
      ])}
    />
  );
}

export function SupportModulePage() {
  return (
    <ModuleTemplate
      title="Suporte & Conhecimento"
      description="Base de conhecimento unificada, SOPs e gestão de tickets multicanal."
      stats={[
        {
          label: 'Artigos publicados',
          value: '186',
          helper: 'Curadoria mensal'
        },
        {
          label: 'Tempo médio de resolução',
          value: '6h 40m',
          trend: { direction: 'down', value: '1h 10m' }
        },
        {
          label: 'Tickets ativos',
          value: '34',
          helper: '9 prioridade alta'
        },
        {
          label: 'Satisfação do suporte',
          value: '4.6/5'
        }
      ]}
      highlights={[
        {
          title: 'Assistente inteligente de artigos',
          description: 'Busca semântica com IA e snippets aprovados pelo compliance.',
          status: 'live'
        },
        {
          title: 'Playbooks self-service',
          description: 'Clientes executam fluxos guiados diretamente no portal.',
          status: 'beta'
        },
        {
          title: 'Centro de formação',
          description: 'Cursos de onboarding por função com certificação.',
          status: 'planned'
        }
      ]}
      checklist={[
        { label: 'Atualizar taxonomia de tags', done: true },
        { label: 'Sincronizar integrações com suporte telefónico', done: false },
        { label: 'Criar métricas de deflection', done: true }
      ]}
      timeline={createTimeline([
        {
          title: 'Campanha de onboarding atualizada',
          timestamp: 'Ontem',
          description: 'Novos vídeos e artigos para equipa de housekeeping.'
        },
        {
          title: 'Avaliação de artigos críticos',
          timestamp: 'Há 3 dias',
          description: '12 SOPs auditados com aprovação de governança.'
        },
        {
          title: 'Automação de triagem publicada',
          timestamp: 'Há 1 semana',
          description: 'Tickets categorizados automaticamente com priorização dinâmica.'
        }
      ])}
    />
  );
}

export function OnboardingModulePage() {
  return (
    <ModuleTemplate
      title="Onboarding"
      description="Processo guiado para novas propriedades, equipas e integrações essenciais."
      stats={[
        {
          label: 'Projetos em curso',
          value: '8',
          helper: '4 propriedades urbanas · 4 resort'
        },
        {
          label: 'Tempo médio de go-live',
          value: '21 dias',
          trend: { direction: 'down', value: '6 dias' }
        },
        {
          label: 'Checklist concluída',
          value: '78%',
          helper: 'KPIs de documentação'
        },
        {
          label: 'Stakeholders envolvidos',
          value: '32'
        }
      ]}
      highlights={[
        {
          title: 'Wizard de configuração',
          description: 'Fluxo passo a passo com validação automática de integrações.',
          status: 'live'
        },
        {
          title: 'Portal de parceiros',
          description: 'Gestão de tarefas partilhadas com fornecedores de limpeza e manutenção.',
          status: 'beta'
        },
        {
          title: 'Checklist de conformidade fiscal',
          description: 'Assistente orienta documentação por região.',
          status: 'planned'
        }
      ]}
      checklist={[
        { label: 'Mapear stakeholders e responsabilidades', done: true },
        { label: 'Automatizar notificações de atraso', done: false },
        { label: 'Validar integrações PMS/OTA', done: true }
      ]}
      timeline={createTimeline([
        {
          title: 'Kickoff propriedade Douro Prime',
          timestamp: 'Ontem',
          description: 'Equipa comercial e operações alinharam go-live em 45 dias.'
        },
        {
          title: 'Checklist fiscal concluída',
          timestamp: 'Há 4 dias',
          description: 'Documentação entregue e aprovada pela governança.'
        },
        {
          title: 'Formação equipa housekeeping',
          timestamp: 'Há 1 semana',
          description: 'Sessão híbrida com foco em app mobile e standards de limpeza.'
        }
      ])}
    />
  );
}
