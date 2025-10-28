# Core Hospitality API

Documentação dos endpoints REST e GraphQL expostos pelo serviço `services/core`, alinhados aos módulos do MVP descritos em `docs/property-mvp-plan.md`.

## Configuração
- **Stack**: FastAPI + SQLAlchemy + PostgreSQL (SQLite em testes) com suporte opcional a GraphQL via Strawberry.
- **URL base**: `/` para REST, `/graphql` para operações GraphQL.
- **Autenticação**: será integrada com o serviço de identidade externo; por ora os endpoints assumem que a camada de gateway já aplicou o contexto do agente.

## Endpoints REST

### Propriedades
| Método | Caminho | Descrição | Payload | Resposta |
|--------|---------|-----------|---------|----------|
| `POST` | `/properties` | Cria uma propriedade com unidades e fuso horário. | `PropertyCreate` | `PropertyRead` |
| `GET` | `/properties` | Lista propriedades ordenadas por nome. | — | `List[PropertyRead]` |

### Agentes
| Método | Caminho | Descrição | Payload | Resposta |
|--------|---------|-----------|---------|----------|
| `POST` | `/agents` | Regista agentes operacionais com função (admin, property_manager, housekeeping, ota). | `AgentCreate` | `AgentRead` |

### Reservas
| Método | Caminho | Descrição | Payload | Resposta |
|--------|---------|-----------|---------|----------|
| `POST` | `/properties/{property_id}/reservations` | Cria reserva validando disponibilidade e disparando sincronização OTA. | `ReservationCreate` | `ReservationRead` |
| `GET` | `/properties/{property_id}/reservations` | Lista reservas com dados pessoais mascarados para proteger PII. | — | `List[ReservationRead]` |
| `PATCH` | `/reservations/{reservation_id}` | Atualiza status (check-in/out, cancelamento). | `ReservationUpdateStatus` | `ReservationRead` |

### Housekeeping
| Método | Caminho | Descrição | Payload | Resposta |
|--------|---------|-----------|---------|----------|
| `POST` | `/housekeeping/tasks` | Agenda tarefas de housekeeping respeitando governança de acesso. | `HousekeepingTaskCreate` | `HousekeepingTaskRead` |
| `PATCH` | `/housekeeping/tasks/{task_id}` | Atualiza status da tarefa (`pending`, `in_progress`, `completed`, `blocked`). | `HousekeepingStatusUpdate` + `actor_id` query | `HousekeepingTaskRead` |
| `GET` | `/properties/{property_id}/housekeeping` | Lista tarefas de housekeeping por propriedade. | — | `List[HousekeepingTaskRead]` |

## GraphQL
- **Endpoint**: `POST /graphql`
- **Consultas disponíveis**:
  - `properties { id name timezone units }`
  - `reservations(propertyId: ID!) { id guestName guestEmail status checkIn checkOut }`
  - `housekeepingTasks(propertyId: ID!) { id status scheduledDate reservationId }`
- **Uso típico**: dashboards reactivos no front-end ou integrações internas que necessitam combinar dados de reservas e housekeeping com um único request.

## Controles de Privacidade e Auditoria
- Dados pessoais de hóspedes são mascarados (`quality.privacy.mask_personal_identifiers`) antes de serem retornados.
- Regras de retenção podem ser aplicadas via `ReservationService.enforce_retention` (automatização planejada para cron jobs).
- Logs de auditoria (`audit_logs`) persistem operações críticas com identificação do agente e timestamp.

## Sincronização OTA
- Cada criação/atualização de reserva gera um item em `ota_sync_queue` com estado inicial `pending`.
- O serviço `OTASynchronizer` controla o ciclo de vida (`mark_in_flight`, `mark_completed`) e deve ser orquestrado por workers assíncronos.

## Governança de Acesso
- A função do agente é validada através de `services.core.security.assert_role`, alinhada às personas de Autenticação/Controlo de Acesso do MVP.
- Housekeeping só pode alterar tarefas atribuídas a si; gestores e administradores têm visão global.

## Testes e Monitorização
- Testes unitários e de integração encontram-se em `tests/unit` e `tests/integration`, respetivamente.
- Recomenda-se expor métricas de auditoria e sincronização OTA em dashboards (`docs/observabilidade/`).
