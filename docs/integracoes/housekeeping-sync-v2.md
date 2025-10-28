# Integração Housekeeping Sync v2

## Escopo
- Sincronização bidirecional entre app móvel e inventário central (`/v2/housekeeping/sync`).
- Suporte a eventos offline com reconciliação idempotente.

## Contrato de API
| Método | Endpoint | Descrição |
| ------ | -------- | --------- |
| POST | `/v2/housekeeping/sync` | Recebe lote de tarefas concluídas/offline; retorna itens confirmados e pendências. |
| GET | `/v2/housekeeping/tasks` | Lista tarefas atribuídas ao colaborador logado com filtros por status. |

### Campos principais (`POST /sync`)
- `property_id` *(string, obrigatório)*
- `device_id` *(string, obrigatório)*
- `operations` *(array)* com itens `{ "task_id", "status", "completed_at", "notes", "attachments" }`
- `offline_token` *(string, opcional)* para reconciliação

## Regras de Negócio
1. Operações devem ser enviadas em lotes de no máximo 50 tarefas.
2. Requests são idempotentes por `offline_token` + `task_id`.
3. Conflitos retornam `409` com payload de resolução; app deve reexibir item.

## Dependências
- Autenticação baseada em token obtido via fluxo OAuth device code.
- Logs publicados no tópico `housekeeping-sync-events` e ingestados pela stack de observabilidade (`docs/observability-stack.md`).

## Testes
- Cobertura de smoke tests registrada em `docs/integracoes/2024-07-03-smoke.md`.
- Cenários offline executados com dataset sintético validado por QA (`docs/testing-strategy.md`).
