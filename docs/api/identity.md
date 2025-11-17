# Identity Service API

O serviço `backend/services/identity` expõe fluxos REST multi-tenant para autenticação de agentes, MFA e delegação de papéis. O prefixo padrão de todos os endpoints é `/tenants/{tenant_slug}`.

- **Base URL:** `/tenants/{tenant_slug}`
- **Autenticação:** combina credenciais do agente e MFA; tokens de sessão são entregues para uso no gateway/Core.
- **Headers obrigatórios:**
  - `X-Request-Id` e `X-Trace-Id` opcionais para observabilidade.
  - `Content-Type: application/json` para requests com body.
- **Versão do serviço:** `0.1.0` (`backend/services/identity/api.py`).

## Endpoints

| Método | Caminho | Descrição | Request | Response |
| --- | --- | --- | --- | --- |
| `POST` | `/tenants/{tenant_slug}/login` | Inicia sessão autenticando credenciais do agente e avalia necessidade de MFA. | `TenantLoginRequest` (e-mail, senha). | `TenantLoginResponse` com `session_id`, `agent_id`, `mfa_required`, `expires_at`. |
| `POST` | `/tenants/{tenant_slug}/mfa/verify` | Valida código MFA associado ao `session_id`. | `TenantMFAVerificationRequest` (`session_id`, `code`, `method`). | `TenantLoginResponse` com `mfa_required=false` e tempo restante de sessão. |
| `GET` | `/tenants/{tenant_slug}/roles` | Lista atribuições de papéis para agentes do tenant. | — | `List[RoleAssignmentRead]` (inclui `agent_email`, `role`). |
| `PUT` | `/tenants/{tenant_slug}/roles/{agent_id}` | Cria ou atualiza papel de um agente. | `RoleAssignmentUpdate` (`role`). | `RoleAssignmentRead`. |
| `DELETE` | `/tenants/{tenant_slug}/roles/{agent_id}` | Remove associação de papel de um agente. | — | `204 No Content` (erro 404 se inexistente). |
| `GET` | `/healthz` | Health-check simples do serviço Identity. | — | `{ "status": "ok" }`. |

## Notas de Implementação

- Todas as operações interagem com o `TenantAccessRepository`, que garante isolamento usando `TenantManager` (`backend/services/identity/api.py`).
- Exceções de autenticação retornam `401 Unauthorized` com mensagem derivada de `AuthenticationError` ou `TenantAccessError`.
- O tempo de expiração da sessão é derivado de `settings.auth_session_timeout_seconds` e retornado em `session_timeout_seconds`.
- Instrumentação OTEL é ativada automaticamente quando `observability.enable_*` está habilitado na configuração (`CoreSettings`).
