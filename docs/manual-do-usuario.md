# Manual do Usuário Bmad Method v3

## Visão Geral

Este manual orienta administradores e colaboradores na configuração e uso diário da plataforma Bmad Method v3. Ele descreve fluxos críticos, permissões, recursos disponíveis e onde encontrar ajuda.

## Perfis e Responsabilidades

| Perfil | Responsabilidades Principais | Recursos Chave |
|--------|------------------------------|----------------|
| **Administrador de Workspace** | Configura agentes, gerencia playbooks, define permissões, acompanha métricas globais. | Catálogo de agentes, Playbooks, Dashboard de Métricas, Configurações de Segurança. |
| **Colaborador** | Executa playbooks, consulta base de conhecimento, reporta incidentes. | Biblioteca de Playbooks, Base de Conhecimento, Chat de Suporte. |
| **Analista de Operações** | Monitora KPIs, gera relatórios, ajusta SLAs de suporte. | Painel de Analytics, Ferramentas de Observabilidade, Central de Tickets. |

### Matriz de Permissões de Agentes

O backend implementa uma hierarquia de papéis alinhada ao módulo `services/core/security.py`. Cada agente recebe um `role` e herdará os privilégios indicados abaixo.

| Papel | Pode Executar | Escopo Herdado |
|-------|---------------|----------------|
| **admin** | Criar/editar propriedades e reservas, aprovar tarefas de housekeeping, gerir agentes e integrações OTA. | Todos os papéis subordinados. |
| **property_manager** | Confirmar reservas, agendar tarefas de housekeeping, ajustar status de tarefas do seu inventário. | Housekeeping. |
| **housekeeping** | Atualizar status das próprias tarefas, consultar agenda diária. | — |
| **ota** | Consultar fila de sincronização OTA e estado das reservas publicadas. | — |

> **Auditoria Mensal:** O administrador deve rever a lista de agentes ativos em Configurações → Acesso & Permissões, garantindo que colaboradores inativos sejam desativados e que os papéis acima estejam coerentes com a função real.

## Onboarding Inicial

1. **Convite e Acesso**
   - Receba o convite do administrador e finalize o cadastro via e-mail.
   - Configure MFA conforme política de segurança descrita no `engineering-handbook`.
2. **Configuração do Workspace** *(administradores)*
   - Complete o wizard de onboarding preenchendo dados da equipe e metas do trimestre.
   - Selecione agentes essenciais no catálogo e personalize parâmetros iniciais.
3. **Tour Guiado**
   - Execute o tour interativo disponível no primeiro acesso para conhecer as principais áreas.
   - Revise os artigos "Primeiros Passos" na base de conhecimento.
4. **Validação de Permissões**
   - Verifique se colaboradores possuem os papéis corretos em Configurações → Acesso & Permissões.
   - Teste a execução de um playbook sandbox para garantir acesso funcional.

## Navegação da Plataforma

- **Dashboard Inicial**: resumo de agentes ativos, alertas prioritários e métricas de ocupação.
- **Catálogo de Agentes**: filtros por competência, SLA e automações disponíveis. Permite pré-visualizar playbooks associados.
- **Biblioteca de Playbooks**: lista de playbooks aprovados, com tags por domínio e nível de automação. Suporta clonagem e personalização.
- **Centro de Suporte**: acesso rápido à base de conhecimento, abertura de tickets e chat ao vivo.
- **Analytics**: dashboards personalizáveis com métricas de adoção, satisfação e performance.

## Fluxos Operacionais Essenciais

### Execução de Playbook

1. Escolha o playbook na biblioteca e clique em **Iniciar Execução**.
2. Revise pré-requisitos, recursos necessários e impactos.
3. Confirme o escopo (agentes envolvidos, canais de comunicação) e agende ou execute imediatamente.
4. Acompanhe o progresso em tempo real e registre notas ou incidentes.
5. Ao finalizar, avalie o resultado e categorize aprendizados para retroalimentar a base de conhecimento.

### Gestão de Agentes

1. Abra o **Catálogo de Agentes** e selecione o agente desejado.
2. Ajuste parâmetros (competências, horários, integrações) e salve.
3. Vincule playbooks recomendados e defina metas de desempenho.
4. Configure alertas de disponibilidade e notificações em canais corporativos.

### Tratamento de Incidentes

1. Acesse o **Centro de Suporte** e verifique alertas pendentes.
2. Consulte a base de conhecimento para soluções rápidas.
3. Se necessário, abra ticket detalhando impacto, usuários afetados e logs disponíveis.
4. Use o chat para escalonar incidentes críticos com o time de operações.
5. Após resolução, registre post-mortem resumido e associe artigos na base.

### Sincronização com Fluxos de Experiência do Usuário

Para garantir consistência com os fluxos documentados em [`design/hospitality-ux/user-flows.md`](../design/hospitality-ux/user-flows.md), percorra a tabela abaixo a cada revisão do manual. Ela conecta os passos descritos aqui com os cenários validados em protótipos e garante que não haja divergências entre o que é demonstrado ao usuário final e o comportamento previsto na plataforma.

| Fluxo operacional | Referência UX | Pontos verificados |
|-------------------|---------------|--------------------|
| Execução de Playbook → acompanhamento em tempo real | `user-flows.md` → *Fluxo de Housekeeping* (quadro de tarefas mobile) | Checklist mobile confirma possibilidade de registar incidentes e sincronizar status conforme passo 4 deste manual. |
| Gestão de Agentes → ajuste de parâmetros e metas | `prototipo-interativo.md` → *Módulo Housekeeping* + *App Mobile Gestor* | Hotspots de configuração demonstram campos e notificações alinhados ao passo 3 deste manual. |
| Tratamento de Incidentes → escalonamento e pós-incidente | `user-flows.md` → *Fluxo de Calendário Operacional* (resolução de conflitos) | Alertas e sugestões de resolução espelham a etapa 4 deste manual, garantindo mesma nomenclatura e sequência. |
| Métricas em Analytics → revisão de KPIs | `prototipo-interativo.md` → *Dashboard Web* | Cartões de KPIs exibem exatamente os indicadores citados em “Dashboard Inicial”, assegurando terminologia consistente. |
| Checklists de lançamento → validação de acesso | `wireframes.md` → *Onboarding & Access Management* | Estados de confirmação nos wireframes reforçam a necessidade de validar MFA e papéis, conforme a checklist abaixo. |

## Boas Práticas

- Mantenha playbooks atualizados com aprendizados recentes.
- Utilize tags consistentes para facilitar busca e analytics.
- Defina lembretes mensais para revisar permissões e SLAs.
- Registre feedback dos usuários no painel de NPS para orientar priorizações.

## Recursos de Apoio

- **Base de Conhecimento**: artigos, vídeos curtos e FAQs. Atualizada semanalmente pela equipe de operações.
- **Central de Tickets**: acompanhamento de SLAs, histórico de incidentes e integrações com ferramentas ITSM.
- **Chat de Suporte**: canal síncrono para incidentes urgentes e dúvidas rápidas.
- **Status Page**: monitoramento público dos serviços críticos e incidentes em andamento.
- **Protótipo Interativo do MVP**: walkthrough dos fluxos críticos disponível em [`design/hospitality-ux/prototipo-interativo.md`](../design/hospitality-ux/prototipo-interativo.md#hand-off-2024-07-15) com links para o Figma e checklist de acessibilidade.
- **Wireframes e Guia Visual**: documentação de referência para estados de tela e tokens em [`design/hospitality-ux/wireframes.md`](../design/hospitality-ux/wireframes.md) e [`design/hospitality-ux/guia-visual.md`](../design/hospitality-ux/guia-visual.md).

## Limitações Temporárias de Pagamentos

- O módulo de cobranças ainda não opera com PSP real. O flag `BILLING_GATEWAY_ENABLE_REAL` permanece desligado conforme plano de contingência em [`docs/roadmap-riscos.md`](roadmap-riscos.md) e detalhamento em [`docs/feature-flags/billing-gateway-mock.md`](feature-flags/billing-gateway-mock.md).
- Todas as tokenizações, autorizações e reconciliações são simuladas com dados mascarados. Utilize o fluxo financeiro manual descrito nos playbooks até nova orientação.
- Quando o projeto retomar o tema, siga o procedimento de reversão: solicitar aprovação ao steering, habilitar o flag conforme o guia de feature flag, executar a suíte `pytest -m real_gateway` e comunicar o suporte interno (ver instruções atualizadas em [`docs/support/user-manual.md`](support/user-manual.md)).
- Caso algum parceiro questione disponibilidade de pagamentos, comunique que a função está em fase de homologação e registre o interesse para priorização futura.

### Checklist de Acesso e Alinhamento

- [ ] Confirmar que o time possui acesso ao Figma com permissão de visualização nos arquivos listados acima (`HospOps DS`).
- [ ] Validar que o hand-off mais recente está sincronizado com a biblioteca de componentes (consultar seção *Hand-off 2024-07-15* do protótipo).
- [ ] Revisar se artigos "Primeiros Passos" e "Resolução de Incidentes" estão publicados na base de conhecimento com os mesmos termos utilizados neste manual.
- [ ] Garantir que o `runbook` "Gestão de Acessos" está atualizado em [`docs/runbooks/gestao-acessos.md`](../runbooks/gestao-acessos.md) para orientar desbloqueios urgentes.
- [ ] Atualizar o roadmap de conteúdo caso surjam novos fluxos documentados em `design/hospitality-ux/user-flows.md`.

## FAQ Rápido

- **Como redefinir minha senha?** Utilize o link "Esqueci minha senha" na página de login ou contate o administrador.
- **Posso personalizar playbooks?** Sim, clone o playbook desejado e ajuste parâmetros antes de publicar.
- **Onde acompanho métricas?** Acesse Analytics → "Adesão e Desempenho" para dashboards de ocupação, tempo de resposta e NPS.
- **Como reportar uma ideia de automação?** Submeta pela seção "Ideias" na base de conhecimento ou abra ticket do tipo "Melhoria".

## Checklist de Lançamento para Novos Usuários

- [ ] Convite enviado e aceito.
- [ ] MFA configurado.
- [ ] Tour guiado concluído.
- [ ] Playbook sandbox executado com sucesso.
- [ ] Métricas de ocupação e NPS alinhadas com o time.
- [ ] Canais de suporte apresentados e testados.
