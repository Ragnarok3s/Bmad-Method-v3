# Controles de Segurança do Serviço de Identidade

## Visão Geral
O serviço `backend/services/identity` implementa autenticação multi-tenant reutilizando os componentes centrais de segurança (`AuthenticationService`) e o repositório `TenantAccessRepository` para garantir isolamento entre tenants. Cada requisição é isolada por slug de tenant e validada pelo `TenantManager`, que associa a sessão de banco de dados ao escopo correto antes de executar a lógica de autenticação.

## MFA e Gestão de Sessões
- O login inicia via `TenantAwareAuthenticationService`, que delega à `AuthenticationService` as verificações de senha, bloqueio antiforça bruta e desafio MFA.
- As rotas `/tenants/{tenant_slug}/login` e `/tenants/{tenant_slug}/mfa/verify` retornam `session_id`, `expires_at` e `session_timeout_seconds`, reforçando o controle de sessões por tenant.
- A verificação MFA valida códigos TOTP ou de recuperação, registrando eventos de auditoria `auth_login_challenge`, `auth_mfa_failed` e `auth_login_success` através da camada core.

## Auditoria e Observabilidade
- O repositório multi-tenant grava eventos `tenant_access_denied`, `tenant_role_assigned` e `tenant_role_revoked` sempre que ocorre tentativa inválida, concessão, atualização ou revogação de papéis.
- Todos os eventos são propagados para `services.core.observability.record_audit_event`, produzindo logs estruturados e persistindo registros em `AuditLog` com contexto de tenant (`tenant_id`, `tenant_slug`).
- O serviço ativa a instrumentação OTEL quando `observability.enable_*` está habilitado, exportando métricas e traces para a stack de monitoramento.

## Evidências e Testes
- A suíte `pytest tests/backend/services/identity` cobre fluxos de login, MFA, atribuição de papéis e cenários de isolamento multi-tenant. Ela também valida a presença de eventos de auditoria persistidos.
- O pipeline `backend.yml` garante a execução automatizada desses testes, gerando relatórios JUnit e cobertura para revisão do time de segurança.

## Checklist de Conformidade
- [x] MFA obrigatório para agentes com credenciais ativas.
- [x] Auditoria de tentativas de acesso negadas por escopo de tenant.
- [x] Logging de concessão e revogação de papéis com contexto de tenant.
- [x] Instrumentação OTEL integrada ao serviço.
- [x] Testes automatizados garantindo regressão dos controles de segurança.
