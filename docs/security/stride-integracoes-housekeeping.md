# Matriz STRIDE — Integrações Housekeeping

| Ameaça | Descrição | Mitigação | Owner |
| ------ | --------- | --------- | ----- |
| Spoofing | Impersonação de parceiro enviando webhook falso | Assinatura HMAC + validação IP permitida | Thiago Ramos (Facilities) |
| Tampering | Alteração de payload durante trânsito | TLS mTLS obrigatório + versionamento de esquema | Bruno Carvalho (Platform Engineering) |
| Repudiation | Parceiro nega envio de evento | Logs imutáveis em S3 + correlação com IDs de mensagem | Gabriela Nunes (Parcerias) |
| Information Disclosure | Exposição de dados sensíveis no payload | Campos sensíveis criptografados; mascaramento em logs | Privacy Officer |
| Denial of Service | Explosão de eventos causando backlog | Limite de throughput e fila dedicada com circuit breaker | Mariana Lopes (Operations Manager) |
| Elevation of Privilege | Parceiro tenta executar comandos fora do escopo | Escopos OAuth restritos; auditoria semanal dos tokens | Security Champion |

## Atualizações 2024-07-22
- Revisão conjunta com Security Champion confirmando ausência de gaps críticos.
- Plano de testes de penetração agendado para Sprint 2, com owners nomeados.

## Camada de Identidade Multi-Tenant

| Ameaça | Descrição | Mitigação | Owner |
| ------ | --------- | --------- | ----- |
| Spoofing cruzado entre tenants | Tentativa de login com credenciais válidas fora do tenant associado | Repositório `TenantAccessRepository` valida vínculo na tabela `tenant_agent_access` antes de delegar ao `AuthenticationService`; auditado pela suíte `pytest tests/services/identity -q`. | Security Champion |
| Repudiation | Agente alega não ter sofrido bloqueio ou MFA adicional | Eventos `auth_login_blocked` e `auth_mfa_failed` enviados para observabilidade conforme descrito em [`services/identity/api.py`](../../services/identity/api.py) e rastreados no [roadmap](../product-roadmap.md#atualização-2025-02-15-identidade-multi-tenant). | Observability Lead |
| Elevation of Privilege | Concessão indevida de papéis administrativos | Endpoints `/tenants/{tenant_slug}/roles` exigem associação prévia e registram alterações na tabela `tenant_agent_access`; revisões semanais do log agregadas na rotina de governança. | Governance Squad |
