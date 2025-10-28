# Playbook Operacional e Estratégias de Crescimento

## Objetivo

Guiar as equipes de operações, suporte e produto na execução diária da plataforma Bmad Method v3, estruturando canais de suporte, métricas de sucesso e iniciativas de expansão.

## Governança Operacional

- **Owner**: Líder de Operações.
- **Stakeholders**: Produto, Engenharia de Plataforma, Analytics, Customer Success.
- **Cadência de Revisão**: Quinzenal (ritual Ops Review) e revisão estratégica trimestral.
- **Ferramentas Principais**: ITSM (Jira Service Management ou similar), Slack/Teams, Confluence/Notion, Grafana, Data Warehouse.

### Matriz RACI

| Atividade | Operações | Produto | Engenharia de Plataforma | Analytics | Customer Success | UX/Design |
|-----------|-----------|---------|--------------------------|-----------|------------------|-----------|
| Definição e atualização de SLAs | **R**esponsável | **C**onsultado | **A**provador | C | C | I |
| Gestão do backlog de melhorias operacionais | R | **A**provador | C | C | C | C |
| Resposta a incidentes críticos | **A**provador | C | **R**esponsável | C | **I**nformado | I |
| Evolução da base de conhecimento | R | C | I | C | C | **C**onsultado |
| Monitorização de métricas e alertas | C | C | R | **A**provador | I | I |
| Planeamento de integrações externas | C | **R/A** | R | C | I | C |
| Rotinas de feedback com clientes | C | C | I | C | **R/A** | C |
| Aplicação do checklist de acessibilidade nos fluxos operacionais | **C**onsultado | A | R | I | I | **R**esponsável |
| Revisão trimestral do quadro de ações corretivas | **R/A** | C | C | C | I | C |
| Gestão de secrets e conformidade | **A**provador | I | **R**esponsável | C | I | I |

Legenda: **R** = Responsável, **A** = Aprovador, **C** = Consultado, **I** = Informado.

### Critérios de Priorização Operacional

1. **Impacto em SLA e experiência do cliente (40%)**
   - Alto: bloqueia SLA crítico (`S1`/`S2`) ou compromete NPS < 30.
   - Médio: risco de degradação de SLA secundário (`S3`) ou NPS entre 30-45.
   - Baixo: melhoria incremental sem efeito direto em SLA/NPS.
2. **Urgência regulatória/compliance (20%)**
   - Alto: requisito legal ou auditoria marcada com prazo firme.
   - Médio: recomendações de auditorias internas ou políticas corporativas.
   - Baixo: oportunidades de melhoria futura.
3. **Complexidade técnica/esforço (20%)**
   - Baixo esforço: < 3 dias-equipa; Médio: 3-10 dias; Alto: > 10 dias ou dependências externas.
4. **Dependências cross-squad e disponibilidade de recursos (10%)**
   - Avaliar bloqueios em DevOps, Design e Analytics; prioridade maior quando dependências estão desbloqueadas.
5. **Efeito na observabilidade e acessibilidade (10%)**
   - Itens que mitigam gaps de monitorização ou asseguram aderência ao checklist de acessibilidade recebem multiplicador positivo.

> **Fórmula sugerida**: `Prioridade = (Impacto x 0,4) + (Urgência x 0,2) + (Complexidade invertida x 0,2) + (Dependências x 0,1) + (Observabilidade/Acessibilidade x 0,1)` onde cada fator é pontuado de 1 (baixo) a 5 (alto). Itens com pontuação ≥ 3,5 devem entrar no próximo sprint ou rotina quinzenal.

## Canais de Suporte

### Base de Conhecimento

- **Propósito**: Resolver dúvidas frequentes e reduzir volume de tickets.
- **Estrutura**:
  - Primeiros passos, FAQs por persona, guias de troubleshooting, artigos de deep dive técnico.
  - Tagging por produto, módulo e severidade.
- **Processo de Atualização**:
  1. Registrar aprendizados após cada incidente resolvido.
  2. Revisão editorial semanal pelo Analista de Operações.
  3. Publicar métricas de consumo (visualizações, taxa de resolução sem ticket) no painel de analytics.
- **KPIs**: Taxa de autoatendimento ≥ 40%, satisfação dos artigos ≥ 4/5.

### Central de Tickets

- **Fluxo**:
  1. Usuário abre ticket via portal ou e-mail.
  2. Triagem automática classifica severidade e persona.
  3. SLA padrão: `S1` 1h resposta / 4h resolução; `S2` 4h / 1 dia; `S3` 1 dia / 3 dias (ver evidências assinadas em `docs/evidencias/sla-operacionais-2024-06.md` e addendos em `docs/evidencias/sla-operacionais-2024-07.md`).
  4. Engajamento de squads específicos via roteamento automático baseado no componente afetado.
  5. Encerramento exige comunicação ao usuário, atualização da base de conhecimento e captura de NPS transacional.
- **Automação Recomendada**: Integração ITSM ↔ plataforma para anexar logs e telemetria automaticamente.

### Chat de Suporte em Tempo Real

- **Disponibilidade**: 9h-18h BRT em dias úteis, com alerta para plantonistas fora desse horário.
- **Workflow**:
  1. Bot realiza triagem inicial com perguntas padrão.
  2. Se for incidente crítico, abre ticket `S1` automaticamente e convoca war room (canal dedicado).
  3. Para dúvidas simples, envia snippets da base de conhecimento.
- **Boas Práticas**: Registrar resumo da conversa no ticket associado para rastreabilidade.

### Canais Oficiais e Convenções de Uso

- **Slack**
  - `#anuncios-bmad` — canal somente leitura para comunicados executivos; owner: Líder de Operações.
  - `#ops-urgente` — acionamento de incidentes `S1/S2`; owners: Engenheiro de Plataforma on-call + Coordenador de Suporte.
  - `#qa-devops` — sincronização semanal QA/DevOps; owners: Coordenador QA & Líder DevOps.
  - `#squad-<nome>` — huddles diários das squads; owner: Scrum Master do respectivo squad.
  - `#war-room` — canal temporário criado automaticamente via PagerDuty para incidentes críticos; owner rotativo do plantão.
- **Teams**
  - "Bmad Steering" — reunião quinzenal com ata integrada; owner: Líder de Operações.
  - "Exec Escalation" — grupo fechado para escalonamentos nível 3; owners: Diretor de Produto e CTO.
  - "Quality Committee" — reunião quinzenal de qualidade; owner: Gerente de Produto.
- **Governança dos Canais**
  - Revisão trimestral para garantir aderência ao playbook e arquivamento de canais inativos.
  - Toda criação de novo canal deve passar por aprovação do Líder de Operações para manter taxonomia controlada.
  - Padrão de nomenclatura: prefixos por domínio (`ops-`, `squad-`, `war-`) e descrição clara do propósito.

## Métricas de Sucesso

### Taxa de Ocupação dos Agentes

- **Definição**: Percentual de tempo em que agentes estão ativos em playbooks versus capacidade planejada.
- **Cálculo**: `tempo_executado / tempo_disponivel` por agente, agregado semanalmente.
- **Instrumentação**:
  - Capturar logs de execução com timestamps.
  - Armazenar em data warehouse (tabela `agent_utilization` com dimensões de agente, playbook, cliente).
  - Dashboard em Grafana/Looker com alertas quando ocupação < 60% ou > 90%.

### Tempo de Resposta de Suporte

- **Definição**: Tempo médio entre abertura de ticket/chat e primeira interação humana.
- **Cálculo**: Mediana por severidade (`S1`, `S2`, `S3`) para evitar distorções.
- **Instrumentação**:
  - Webhooks do ITSM para registrar timestamps.
  - Monitorar via alertas no Slack quando SLA estourar.
  - Relatórios semanais compartilhados com liderança.

### NPS (Net Promoter Score)

- **Definição**: Métrica de lealdade coletada em momentos chave (após onboarding, após resolução de ticket, revisão trimestral).
- **Coleta**:
  - Formulário integrado ao produto (escala 0-10 + comentário).
  - Classificação automática em detratores (0-6), neutros (7-8), promotores (9-10).
- **Instrumentação**:
  - Pipeline para enviar respostas para ferramenta de analytics.
  - Dashboard com tendência mensal e segmentação por persona.
- **Meta Inicial**: NPS ≥ 35 no pós-onboarding e ≥ 45 no suporte.

## Rotinas Operacionais

### Rituais e Reuniões Recorrentes

| Ritual | Frequência | Responsável | Participantes-Chave | Saídas | Canal Primário |
|--------|------------|-------------|---------------------|--------|----------------|
| Daily das Squads | Diária (dias úteis) às 9h BRT | Scrum Master de cada squad | Tech Lead, Product Owner, QA dedicado | Alinhamento diário, impedimentos sinalizados | Slack huddle `#squad-<nome>` |
| Steering Operacional | Quinzenal às terças 10h BRT | Líder de Operações | Heads de Produto, Engenharia de Plataforma, Customer Success | Plano de ação priorizado, decisões estratégicas registradas | Reunião Teams "Bmad Steering" + ata em Confluence |
| Sync QA/DevOps | Semanal às quintas 16h BRT | Coordenador QA & Líder DevOps | Engenheiros de Qualidade, SREs, representantes de squads | Plano de testes regressivos, matriz de deploys e saúde do pipeline | Canal Slack `#qa-devops` + board Jira |
| Revisão de SLAs | Semanal | Analista de Operações | Customer Success, Engenharia de Plataforma | Relatório com tickets fora do SLA e ações corretivas | Dashboard Grafana + canal `#ops-sla` |
| Comitê de Qualidade | Quinzenal | Gerente de Produto + Líder de Operações | Representantes de squads, Analytics | Backlog de melhorias, updates em playbooks | Reunião Teams "Quality Committee" |
| Auditoria de Permissões | Mensal | Administrador de Workspace | Segurança, Engenharia de Plataforma | Checklist atualizado, revogação de acessos | Ticket Jira + canal `#seguranca` |
| Revisão de Dashboards | Mensal | Data/Analytics | Produto, Operações | Ajustes em métricas, novas visualizações | Dashboard Looker + canal `#analytics` |
| Post-Mortem de Incidentes | Sob demanda (em até 48h após incidente) | Engenheiro de Plataforma on-call | Operações, Produto, QA, DevOps | Documento de lições aprendidas e tarefas de follow-up | War room Teams + canal Slack `#war-room` |

### Fluxo de Escalonamento Operacional

1. **Detecção / Sinalização**
   - Impedimentos levantados no daily devem ser registrados no board do squad e marcados com tag `bloqueio`.
   - Incidentes críticos identificados fora do horário das reuniões acionam imediatamente o canal `#war-room` via PagerDuty.
2. **Escalonamento Nível 1 (Squad)**
   - Scrum Master avalia a remoção de impedimentos; se o bloqueio envolver dependência externa, notifica o Líder de Operações.
   - Tempo alvo: resposta em até 2h úteis.
3. **Escalonamento Nível 2 (Operações + Engenharia de Plataforma)**
   - Líder de Operações convoca mini war room no canal `#ops-urgente` e envolve Tech Lead de Plataforma.
   - Se impacto > SLA `S2`, Steering é antecipado para decisão extraordinária.
4. **Escalonamento Nível 3 (Executivo)**
   - Para riscos de SLA `S1` ou impacto financeiro relevante, Líder de Operações aciona Diretor de Produto e CTO via Teams "Exec Escalation".
   - Registrar decisão e plano de mitigação na ata do Steering.
5. **Follow-up**
   - Resultados e aprendizados são apresentados no Steering quinzenal e incorporados aos playbooks.

### Comunicação de Incidentes

1. **Detecção**: alertas automáticos (Grafana/PagerDuty) ou tickets `S1/S2` acionam `#incident` com resumo inicial.
2. **War Room**: PagerDuty cria canal `#war-room` e agenda call no Teams. Engenheiro de Plataforma on-call lidera conforme `docs/runbooks/alertas-criticos.md`.
3. **Atualizações**: status report a cada 15 minutos durante a mitigação. Customer Success replica mensagens para clientes afetados.
4. **Encerramento**: após recuperação, atualizar ticket e publicar ata `docs/atas/ata-incident-<data>.md` com métricas MTTA/MTTR.
5. **Follow-up**: ações corretivas entram no quadro de débitos técnicos e são acompanhadas no Steering quinzenal.

## Estratégias de Expansão

### Novas Integrações

- **Prioridades**:
  1. Plataformas de CRM (HubSpot, Salesforce) para sincronizar contexto de clientes.
  2. Ferramentas de comunicação (Teams, WhatsApp Business) para ampliar canais de execução.
  3. Sistemas ITSM complementares para clientes enterprise.
- **Etapas**:
  - Avaliar APIs e requisitos de segurança.
  - Prototipar integração com ambiente sandbox.
  - Validar com grupo piloto e medir impacto na taxa de ocupação.

### Automações IoT

- **Cenários**:
  - Monitoramento de dispositivos físicos utilizados pelos agentes (ex.: sensores em hubs de atendimento).
  - Ações automáticas baseadas em eventos (ex.: ligar redundância ao detectar falha de hardware).
- **Plano de Ação**:
  1. Mapear dispositivos e protocolos (MQTT, OPC-UA, Modbus).
  2. Definir gateway seguro para ingestão de dados.
  3. Criar playbooks específicos para alertas IoT com escalonamento automático.
  4. Medir redução de incidentes não planejados e impacto em NPS.

### Analytics Avançado

- **Iniciativas**:
  - Modelos de previsão de demanda para otimizar escala de agentes.
  - Segmentação de usuários baseada em comportamento dentro da plataforma.
  - Detecção de anomalias em tempo de resposta e ocupação.
- **Roadmap**:
  1. Consolidar data lake com eventos de produto, suporte e feedback.
  2. Implementar camada de feature store para machine learning.
  3. Desenvolver dashboards self-service e alertas proativos.
  4. Incorporar insights em reuniões de planejamento trimestral.

## Plano de Execução

| Horizonte | Iniciativas | Entregáveis | Métricas Esperadas |
|-----------|-------------|-------------|--------------------|
| 0-30 dias | Lançar base de conhecimento v1, configurar SLAs na central de tickets, ativar chatbot com triagem. | 20 artigos publicados, SLAs parametrizados, bot integrado. | Tempo de resposta S2 < 4h, taxa autoatendimento 25%. |
| 30-60 dias | Instrumentar métricas de ocupação e NPS, criar dashboards operacionais, iniciar piloto de nova integração (CRM). | Pipelines de dados ativos, dashboards em produção, piloto configurado. | NPS ≥ 30, ocupação medida semanalmente. |
| 60-90 dias | Expandir integrações (comunicação), prototipar automações IoT, iniciar projeto de analytics avançado. | Playbooks multi-canal, gateway IoT em beta, backlog de modelos preditivos. | Redução 15% incidentes críticos, previsão de demanda com acurácia inicial 70%. |

## Gestão de Riscos

| Risco | Mitigação |
|-------|-----------|
| Sobrecarga do time de suporte na implantação dos novos canais | Escalonar implantação em ondas e reforçar treinamento cross-team. |
| Falha em integrações externas impactando SLAs | Implementar fallback manual e monitoramento ativo de APIs externas. |
| Privacidade de dados nos pipelines de analytics | Aplicar mascaramento, controle de acesso granular e auditoria contínua. |

## Próximos Passos

1. Socializar este playbook com líderes das squads.
2. Configurar OKRs alinhados às métricas de sucesso.
3. Agendar primeira revisão quinzenal para acompanhamento das ações de suporte e expansão.
