# Runbook – Gestão de Acessos

## Objetivo
Garantir que pedidos de criação, atualização ou revogação de acesso aos workspaces Bmad Method v3 sejam tratados com rastreabilidade, respeitando papéis/permissões definidos pelo time de segurança.

## Escopo
- Provisionamento de novos usuários (administradores, property managers, housekeeping, OTA).
- Ajuste de papéis existentes conforme auditorias ou mudanças de função.
- Revogação imediata para colaboradores desligados ou contas comprometidas.

## Papéis Envolvidos
- **Administrador de Workspace**: executa mudanças operacionais no painel de Configurações → Acesso & Permissões.
- **Security Ops**: aprova solicitações sensíveis e acompanha logs de auditoria.
- **TI Corporativo**: garante integração com IdP (SSO) e registros de compliance.

## Pré-Requisitos
1. Solicitação registrada no sistema ITSM (`ServiceNow` ou `Jira Service Management`) com justificativa e data de expiração.
2. Verificação de identidade do solicitante via MFA ativo ou confirmação do gestor.
3. Validação de que o usuário passou pelo onboarding de segurança (MFA, políticas de senha, aceite de termos).

## Procedimento
1. **Triagem do Pedido**
   - Conferir se o ticket contém o e-mail corporativo, papel desejado e data de revisão obrigatória.
   - Validar se existe aprovação do gestor imediato em comentário/documento anexado.
2. **Aplicar Mudança no Workspace**
   - Acessar Configurações → Acesso & Permissões.
   - Localizar usuário (ou clicar em "Adicionar membro").
   - Definir papel conforme tabela descrita no [Manual do Usuário](../manual-do-usuario.md#matriz-de-permiss%C3%B5es-de-agentes).
   - Para novos usuários, enviar convite e registrar data de expiração de acesso temporário (se aplicável).
3. **Verificações Pós-Mudança**
   - Confirmar login executando teste de acesso ao playbook sandbox (conforme checklist de onboarding).
   - Registrar evidência de mudança (screenshot/log) no ticket e atualizar status para "Em Monitoramento".
   - Criar lembrete para revisão de acesso na data indicada (mínimo trimestral) usando o módulo de Analytics → "Auditorias".
4. **Revogação Emergencial**
   - Para incidentes de segurança, alterar papel para `suspended` via CLI `poetry run manage access suspend <email>`.
   - Revogar sessões ativas na aba "Sessões" e invalidar tokens OAuth.
   - Abrir incidente de segurança seguindo o runbook [`security/stride-integracoes-housekeeping.md`](../security/stride-integracoes-housekeeping.md) quando houver risco de comprometimento.

## SLAs
- Provisionamento padrão: até 8 horas úteis após aprovação.
- Revogação emergencial: até 15 minutos após abertura do ticket.
- Ajuste de papéis pós-auditoria: até 2 dias úteis após identificação.

## Evidências e Auditoria
- Exportar relatório mensal de acessos via botão "Exportar CSV" em Configurações → Acesso & Permissões.
- Armazenar relatórios e capturas em `drive://bmad/security/auditorias`.
- Revisar logs na API `/audit/access` para confirmar propagação das mudanças em integrações OTA.

## Links Úteis
- Manual do Usuário – seção [Checklist de Lançamento](../manual-do-usuario.md#checklist-de-lan%C3%A7amento-para-novos-usu%C3%A1rios).
- Dashboard de Auditoria de Acessos: `https://analytics.bmad-method.internal/d/ops-access`.
- Política de Segurança de Identidades: `https://intranet.bmad/security/policies/identity`.
