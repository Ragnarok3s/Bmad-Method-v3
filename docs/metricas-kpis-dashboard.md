# Critérios de Sucesso, Métricas e Dashboard Inicial do MVP

## Objetivo
Formalizar os indicadores-chave que acompanharão a implementação do MVP da plataforma de gestão de alojamentos locais e definir um dashboard inicial que permita monitorizar desempenho de produto, operações e tecnologia desde o Sprint 0.

## Princípios de Medição
- **Aderência ao plano MVP**: todas as métricas derivam das capacidades e critérios de sucesso descritos no plano MVP e nos relatórios de revisão.【F:docs/property-mvp-plan.md†L9-L83】【F:docs/revisao-validacao-artefatos.md†L5-L159】
- **Foco na decisão**: cada indicador deve ter owner, cadência de revisão e limiares que suportem decisões de go/no-go por sprint.
- **Automação progressiva**: iniciar com recolha manual/semiautomática, evoluindo para pipelines e dashboards integrados conforme DevOps e observabilidade amadurecem.【F:docs/plano-kickoff-mvp.md†L33-L68】【F:docs/observability-stack.md†L1-L160】

## Indicadores-Chave e Limiar Inicial
| Domínio | Métrica | Objetivo Inicial | Limiar de Alerta | Fonte Primária | Owner |
| --- | --- | --- | --- | --- | --- |
| Produto | Taxa de ocupação agregada (pilotos) | ≥ 65% média móvel 30 dias | < 55% | Integração OTA / módulo Reservas | Product Owner |
| Produto | Net Promoter Score (NPS) Gestor | ≥ 40 | < 25 | Inquérito quinzenal | Product Marketing |
| Produto | Taxa de utilização de relatórios semanais | 100% gestores piloto | < 80% | Telemetria de relatórios / analytics | Product Ops |
| Operações | Tempo médio de resposta a pedidos de hóspedes | ≤ 30 min | > 45 min | Helpdesk / CRM | Operations Manager |
| Operações | Tempo médio de resolução de incidentes críticos | ≤ 4 h | > 6 h | Ferramenta de suporte / incident.io | Operations Manager |
| Operações | Percentagem de tarefas de housekeeping concluídas a tempo | ≥ 95% | < 90% | App staff / checklist | Operations Lead |
| Tecnologia | Lead time para mudança (commit → deploy staging) | ≤ 1 dia | > 2 dias | Pipeline CI/CD | Engineering Lead |
| Tecnologia | Cobertura de testes (unitários / integração) | ≥ 65% / ≥ 50% | < 55% / < 40% | Relatórios CI | QA Lead |
| Tecnologia | Disponibilidade API core | ≥ 99,5% | < 99% | Observabilidade (APM/Synthetics) | Platform Engineer |
| Tecnologia | Latência sincronização OTA | ≤ 5 min | > 8 min | Logs de integração OTA | Engineering Lead |

## Dashboard Inicial (Sprint 0)
Estruturar um painel em três secções (Produto, Operações, Tecnologia) com os widgets abaixo. Enquanto a automação não estiver concluída, utilize uma folha partilhada (Notion/Google Sheets) ligada a gráficos atualizados manualmente pelo owner até que a stack de observabilidade esteja operacional.

### Secção Produto
- **Métricas de Adoção**: gráfico semanal da taxa de utilização de relatórios e volume de reservas por canal.
- **Satisfação do Gestor**: widget de NPS com distribuição de respostas e principais motivos qualitativos.
- **Revenue Snapshot**: tabela com ADR (Average Daily Rate) e RevPAR (Revenue per Available Room) por propriedade piloto.

### Secção Operações
- **SLA Atendimento**: gráfico de linhas para tempo de resposta e resolução; destaque de violações com alertas visuais.
- **Housekeeping Compliance**: gráfico de barras com percentagem de tarefas concluídas vs. atrasadas por propriedade.
- **Mapa de Incidentes**: tabela com incidentes abertos/fechados, owner, idade e próximos passos.

### Secção Tecnologia
- **Fluxo de Deploy**: funil mostrando lead time médio, número de deploys/semana e taxa de sucesso.
- **Saúde do Sistema**: indicadores de disponibilidade, latência API core e consumo de recursos (CPU/RAM) por serviço.
- **Qualidade de Código**: cobertura de testes, contagem de falhas nos pipelines e dívida técnica aberta.

### Painéis Alvo para Deploy, Cobertura de Testes e Incidentes
Criar três painéis interligados (podem coexistir numa mesma workspace de BI) para acelerar diagnósticos e decisões go/no-go durante os sprints iniciais:

1. **Painel de Deploy**
   - **KPIs principais**: número de deploys por ambiente (staging/produção), lead time médio por deploy, taxa de sucesso/rollback e tempo médio para recuperar falhas.
   - **Segmentações**: por serviço/microserviço, por squad e por tipo de mudança (feature, hotfix, infraestrutura).
   - **Widgets recomendados**: funil commit→deploy, heatmap de deploys por dia/hora, tabela de deploys falhados com owner/resolução.
   - **Fontes de dados**: logs do pipeline CI/CD, GitOps (flux/argo) e incident.io para sinalizar rollback.
   - **Responsáveis**: Engineering Lead (curadoria dos dados) e Platform Engineer (automação de extração + alerta de anomalias).

2. **Painel de Cobertura de Testes**
   - **KPIs principais**: cobertura unitária e de integração por repositório, evolução semanal das suites críticas, número de testes instáveis (flaky) e tempo médio de execução por pipeline.
   - **Segmentações**: por módulo/layer (backend, frontend, mobile), por branch (main vs. release candidates) e por tipo de teste.
   - **Widgets recomendados**: gráfico de área com tendência de cobertura, matriz de calor de módulos com cobertura < limiar, tabela de suites instáveis com ações corretivas.
   - **Fontes de dados**: relatórios do SonarQube/Codecov, resultados JUnit exportados pelos pipelines e tickets do backlog QA.
   - **Responsáveis**: QA Lead (definição de metas e curadoria) e Engineering Chapter Leads (execução de planos de melhoria).

3. **Painel de Incidentes**
   - **KPIs principais**: incidentes abertos por severidade, MTTA (tempo até acionar) e MTTR (tempo de resolução), compliance com SLAs por sprint e reincidência.
   - **Segmentações**: por tipo (aplicação, infraestrutura, parceiro), por squad responsável, por canal de reporte (cliente, interno).
   - **Widgets recomendados**: gráfico de controle de MTTR, timeline com incidentes críticos e milestones, tabela de follow-up com ações pendentes/go-no-go.
   - **Fontes de dados**: incident.io/Jira Service Management, runbooks versionados e telemetria da stack de observabilidade (logs/APM).
   - **Responsáveis**: Operations Manager (coordenação da resposta) e Platform Engineer (integrações e qualidade dos dados).

> **Implementação**: iniciar com dashboards em Looker Studio ou Power BI conectados a planilhas governadas; migrar para stack definitiva assim que o data lake estiver operacional. Cada painel deve possuir card de “Estado do Gate” indicando se há impedimento para avançar para a próxima fase.

## Implementação

- **API Core**: o endpoint `GET /metrics/overview` agrega taxa de ocupação diária, alertas críticos de housekeeping e adoção de playbooks com base nas reservas e tarefas, registrando telemetria para cada cálculo no serviço core.【F:backend/services/core/api/rest.py†L1-L126】【F:backend/services/core/services/__init__.py†L220-L352】【F:backend/services/core/metrics.py†L1-L86】
- **Dashboard Web**: o componente `frontend/app/page.tsx` utiliza hooks (`useDashboardMetrics` e `usePartnerSlas`) para atualizar os cards com estados de carregamento, vazio e erro, formatando percentuais e contagens em tempo real a partir da API agregada.【F:frontend/app/page.tsx†L1-L280】
- **Telemetria Frontend**: as consultas ao endpoint gravam spans e histogramas via `TelemetryProvider`, instrumentando fetches, taxas de ocupação e adoção de playbooks para exportação OTLP.【F:frontend/app/page.tsx†L16-L120】【F:frontend/telemetry/init.ts†L1-L96】
- **Testes e2e**: o Playwright verifica que os widgets exibem dados reais (ou mensagens de vazio) ao comparar a resposta da API com o DOM quando `VERIFY_DASHBOARD_METRICS=true`, garantindo consistência em staging.【F:frontend/e2e/dashboard-metrics.spec.ts†L1-L36】

## Cadência de Monitorização e Rituais
- **Daily Stand-up**: revisar indicadores críticos de tecnologia (deploys, incidentes) quando houver alertas.
- **Reunião semanal de steering**: validar métricas chave, acionar planos de mitigação e atualizar roadmap/pipeline.【F:docs/plano-kickoff-mvp.md†L69-L95】
- **Sprint Review**: apresentar evolução das métricas de produto/operacional, recolher feedback dos pilotos e ajustar metas para sprint seguinte.
- **Retro quinzenal**: analisar tendências, identificar causas raiz e planear melhorias de processo.

## Responsabilidades e Ações Imediatas
1. **Definir Owners oficiais** para cada métrica e garantir acesso às fontes de dados correspondentes até ao final da Semana 1.【F:docs/plano-kickoff-mvp.md†L30-L61】
2. **Configurar repositório de dados** inicial (ex.: BigQuery/Redshift ou mesmo planilha governada) com dicionário de dados básico.
3. **Automatizar ingestão incremental** das fontes críticas (reservas, incidentes, CI/CD) durante Sprint 0, usando scripts ETL leves ou integrações nativas.
4. **Publicar guia de interpretação** no playbook operacional, incluindo perguntas diagnósticas e ações recomendadas por cenário.【F:docs/playbook-operacional.md†L1-L200】
5. **Integrar alertas** de limiar (Slack/Email) para métricas tecnológicas e operacionais prioritárias.

## Roadmap de Evolução de Métricas
| Horizonte | Iniciativas | Benefícios Esperados |
| --- | --- | --- |
| Sprint 0 | Dashboard manual + definição de owners + coleta inicial de dados | Visibilidade mínima viável para decisões de go/no-go |
| Sprint 1 | Automação de ingestão OTA, CI/CD e helpdesk; criação de alertas automáticos | Resposta mais rápida a incidentes e regressões |
| Sprint 2 | Integração com BI (Looker/Power BI) e segmentação por propriedade/persona | Insights comparativos e priorização baseada em dados |
| Pós-MVP | Modelos preditivos (previsão de ocupação, churn) e painéis para stakeholders externos | Escala sustentável e vantagem competitiva |

## Indicadores Futuramente Considerar
- **Gross Booking Value (GBV) incremental por canal** para medir dependência de OTAs vs. reservas diretas.
- **Cost-to-Serve por propriedade** combinando horas de suporte, custos de infraestrutura e churn.
- **Score de acessibilidade** das interfaces (WCAG) validado via auditorias periódicas.
- **Índice de satisfação de housekeeping** recolhido junto à equipa operacional após cada sprint.

## Checklist de Pronto (Definition of Ready para Métrica)
- Problema/decisão associada está documentada.
- Owner e cadência definidos.
- Fonte de dados identificada e acessível.
- Método de cálculo validado com stakeholders.
- Limiar de alerta/go-no-go estabelecido.
- Plano de resposta quando o limiar é ultrapassado documentado no playbook.

## Checklist de Conclusão (Definition of Done para Métrica)
- Métrica visível no dashboard com série histórica mínima de duas medições.
- Dados auditados e sem inconsistências críticas.
- Alertas configurados e testados (quando aplicável).
- Documentação atualizada em playbook e repositório de métricas.
- Feedback dos stakeholders incorporado e melhorias priorizadas.

