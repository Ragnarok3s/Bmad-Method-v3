# Manual do Usuário Bmad Method v3

## Visão Geral

Este manual orienta administradores e colaboradores na configuração e uso diário da plataforma Bmad Method v3. Ele descreve fluxos críticos, permissões, recursos disponíveis e onde encontrar ajuda.

## Perfis e Responsabilidades

| Perfil | Responsabilidades Principais | Recursos Chave |
|--------|------------------------------|----------------|
| **Administrador de Workspace** | Configura agentes, gerencia playbooks, define permissões, acompanha métricas globais. | Catálogo de agentes, Playbooks, Dashboard de Métricas, Configurações de Segurança. |
| **Colaborador** | Executa playbooks, consulta base de conhecimento, reporta incidentes. | Biblioteca de Playbooks, Base de Conhecimento, Chat de Suporte. |
| **Analista de Operações** | Monitora KPIs, gera relatórios, ajusta SLAs de suporte. | Painel de Analytics, Ferramentas de Observabilidade, Central de Tickets. |

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
