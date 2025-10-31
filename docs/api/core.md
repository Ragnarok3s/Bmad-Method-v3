# Core Hospitality API

Referência dos endpoints expostos por `services/core`. O serviço é entregue via FastAPI, usa autenticação delegada pelo gateway e aplica isolamento multi-tenant através dos headers `X-Tenant-*` descritos em [`README.md`](README.md).

- **Base URL REST:** `/`
- **Base URL GraphQL:** `/graphql`
- **Autenticação:** tokens geridos pelo gateway/Identity. Operações que alteram estado requerem agente autenticado.
- **Versionamento:** o schema atual corresponde à versão `0.1.0` do serviço (vide `services/core/main.py`).

## Endpoints REST

### Observabilidade e Saúde

| Método | Caminho | Descrição | Request | Response |
| --- | --- | --- | --- | --- |
| `GET` | `/health/otel` | Health-check de instrumentação OTEL (signals, collector, auditoria). | — | `status`, `ready`, `active`, `signals`, `audit`. |

### Comunicações e Jornada do Hóspede

| Método | Caminho | Descrição | Request | Response |
| --- | --- | --- | --- | --- |
| `GET` | `/communications/templates` | Lista templates registrados em memória (`CommunicationService`). | — | `List[CommunicationTemplateRead]`. |
| `POST` | `/communications/send` | Enfileira envio de mensagem multicanal para hóspede. | `CommunicationMessageSendRequest` JSON. | `CommunicationMessageRead` (status `accepted`). |
| `POST` | `/communications/messages/inbound` | Registra mensagem recebida de hóspede/canal externo. | `CommunicationInboundMessageRequest` JSON. | `CommunicationMessageRead`. |
| `GET` | `/communications/messages` | Consulta histórico filtrável de mensagens. | Query `channel`, `guestId`, `limit`. | `List[CommunicationMessageRead]`. |
| `GET` | `/communications/delivery/summary` | KPIs de entrega por canal/tempo. | Query `window`. | `CommunicationDeliverySummaryRead`. |
| `POST` | `/guest-experience/journey` | Sincroniza jornada do hóspede com automações (`GuestJourneyAutomationBridge`). | `GuestJourneySnapshotRequest`. | `GuestJourneySyncResponse`. |
| `GET` | `/guest-experience/journey` | Recupera visão consolidada da jornada. | Query `reservationId`. | `GuestJourneySummaryRead`. |
| `GET` | `/guest-experience/{reservation_id}` | Telemetria completa da experiência. | — | `GuestExperienceOverviewRead`. |

### Autenticação, Recuperação e Governança

| Método | Caminho | Descrição | Request | Response |
| --- | --- | --- | --- | --- |
| `POST` | `/auth/login` | Inicia sessão com MFA opcional. | `LoginRequest`. | `LoginResponse` (inclui `session_id`). |
| `POST` | `/auth/mfa/verify` | Conclui MFA para sessão iniciada. | `MFAVerificationRequest`. | `LoginResponse`. |
| `POST` | `/auth/recovery/initiate` | Inicia fluxo de recuperação com códigos de backup. | `RecoveryInitiateRequest`. | `RecoveryInitiateResponse`. |
| `POST` | `/auth/recovery/complete` | Finaliza recuperação e gera nova sessão. | `RecoveryCompleteRequest`. | `LoginResponse`. |
| `GET` | `/governance/permissions` | Lista catálogo de permissões (`SecurityService`). | — | `List[PermissionRead]`. |
| `POST` | `/governance/permissions` | Cria permissão customizada com checkpoint de auditoria. | `PermissionCreate`. | `PermissionRead`. |
| `PATCH` | `/governance/permissions/{permission_id}` | Atualiza metadados de permissão. | `PermissionUpdate`. | `PermissionRead`. |
| `DELETE` | `/governance/permissions/{permission_id}` | Remove permissão (soft delete). | — | `204 No Content`. |
| `GET` | `/governance/roles` | Lista políticas agregando permissões. | — | `List[RolePolicyRead]`. |
| `POST` | `/governance/roles` | Cria política com lista de permissões. | `RolePolicyCreate`. | `RolePolicyRead`. |
| `PATCH` | `/governance/roles/{policy_id}` | Atualiza política existente. | `RolePolicyUpdate`. | `RolePolicyRead`. |
| `DELETE` | `/governance/roles/{policy_id}` | Remove política. | — | `204 No Content`. |
| `GET` | `/governance/audit` | Recupera trilha de auditoria governança/acesso. | Query `limit`, `cursor`. | `List[GovernanceAuditRead]`. |

### Métricas, Analytics e Relatórios

| Método | Caminho | Descrição | Request | Response |
| --- | --- | --- | --- | --- |
| `GET` | `/metrics/overview` | KPIs operacionais consolidados (dashboards). | Query `target_date`. | `DashboardMetricsRead`. |
| `GET` | `/analytics/query` | Engine SQL-lite para datasets sincronizados. | Query `dataset`, `filter`, `group_by`, `metric`, `limit`, `offset`. | `AnalyticsQueryResponse` (com `groups` e `records`). |
| `GET` | `/reports/kpis` | Relatório KPI diário/mensal (JSON ou CSV). | Query `start_date`, `end_date`, `property_id`, `format`. | `KPIReportRead` ou CSV stream. |
| `GET` | `/tenants/reports/kpis` | Agrega relatório por tenant (escopo plataforma). | Query `start_date`, `end_date`. | `MultiTenantKPIReportRead`. |

### Propriedades, Workspaces e Inventário

| Método | Caminho | Descrição | Request | Response |
| --- | --- | --- | --- | --- |
| `POST` | `/properties` | Cria propriedade respeitando limites por tenant. | `PropertyCreate`. | `PropertyRead`. |
| `GET` | `/properties` | Lista propriedades do tenant atual. | — | `List[PropertyRead]`. |
| `GET` | `/properties/{property_id}/calendar` | Calendário operacional (reservas + reconciliação). | Query `start`, `end` opcionais. | `PropertyCalendarResponse`. |
| `GET` | `/properties/{property_id}/inventory/reconciliation` | Itens de reconciliação de inventário. | — | `PropertyInventoryReconciliationResponse`. |
| `POST` | `/workspaces` | Cria workspace de marketplace/integração (escopo plataforma). | `WorkspaceCreate`. | `WorkspaceRead`. |

### Catálogo de Agentes, Reservas e Pricing

| Método | Caminho | Descrição | Request | Response |
| --- | --- | --- | --- | --- |
| `GET` | `/agents` | Lista catálogo público com filtros ou cadastro interno (`registry=true`). | Query `competency`, `availability`, `page`, `registry`. | `AgentCatalogPage` ou `List[AgentRead]`. |
| `POST` | `/agents` | Cadastra agente operacional. | `AgentCreate`. | `AgentRead`. |
| `PATCH` | `/agents/{agent_id}` | Atualiza perfil de agente autenticado. | `AgentProfileUpdate`. | `AgentRead`. |
| `GET` | `/bundles/usage` | Métricas de consumo de bundles e automações. | Query `bundle_id`, `workspace`, `granularity`, `window`. | `BundleUsageCollection`. |
| `POST` | `/properties/{property_id}/reservations` | Cria reserva e agenda sincronização OTA. | `ReservationCreate`. | `ReservationRead`. |
| `GET` | `/properties/{property_id}/reservations` | Lista reservas mascarando PII (`mask_personal_identifiers`). | — | `List[ReservationRead]`. |
| `PATCH` | `/reservations/{reservation_id}` | Atualiza status (check-in/out, cancelamento). | `ReservationUpdateStatus`. | `ReservationRead`. |
| `POST` | `/pricing/simulate` | Simula cenário de preços para múltiplas unidades. | `PricingSimulationRequest`. | `PricingSimulationRead`. |
| `PATCH` | `/reservations/pricing` | Aplica atualizações em lote de tarifas. | `PricingBulkUpdateRequest`. | `PricingBulkUpdateResponse`. |

### Housekeeping e Knowledge Base

| Método | Caminho | Descrição | Request | Response |
| --- | --- | --- | --- | --- |
| `POST` | `/housekeeping/tasks` | Agenda tarefa atrelada a agente responsável. | `HousekeepingTaskCreate`. | `HousekeepingTaskRead`. |
| `PATCH` | `/housekeeping/tasks/{task_id}` | Atualiza status com auditoria de agente (`actor_id`). | `HousekeepingStatusUpdate`. | `HousekeepingTaskRead`. |
| `GET` | `/properties/{property_id}/housekeeping` | Paginação de tarefas por propriedade com filtros. | Query `start_date`, `end_date`, `status`, `page`. | `HousekeepingTaskCollection`. |
| `GET` | `/support/knowledge-base/catalog` | Catálogo de artigos da base de conhecimento. | Query `q`, `category`, `limit`. | `KnowledgeBaseCatalogRead`. |
| `POST` | `/support/knowledge-base/events` | Telemetria de uso (views, feedback). | `KnowledgeBaseTelemetryEvent`. | `202 Accepted`. |

### Marketplace e Parcerias

| Método | Caminho | Descrição | Request | Response |
| --- | --- | --- | --- | --- |
| `GET` | `/marketplace/apps` | Catálogo público de apps parceiros (seed interno). | Query `categories`. | `List[PartnerAppRead]`. |
| `GET` | `/marketplace/apps/{partner_id}/contract` | Detalha contrato público de integração. | — | `ContractRead`. |
| `POST` | `/marketplace/apps/{partner_id}/install` | Solicita instalação concedendo escopos. | `InstallRequestBody`. | `InstallResponse` (`sandboxId` quando aplicável). |
| `GET` | `/partners/slas` | Lista SLAs ativos monitorados pelo módulo de parcerias. | — | `List[PartnerSLARead]`. |
| `POST` | `/partners/webhooks/reconcile` | Reconcilia webhook informado pelo parceiro. | `PartnerWebhookPayload`. | `PartnerSLARead` atualizado. |

### Pagamentos

| Método | Caminho | Descrição | Request | Response |
| --- | --- | --- | --- | --- |
| `POST` | `/payments/reconciliation` | Executa reconciliação diária dos intents de pagamento. | — | JSON com `status`, `total_intents`, `discrepancies`. |
| `POST` | `/payments/webhooks/{provider}` | Recebe webhook autenticado (HMAC) de provedores de pagamento. | Payload raw + header `X-Payment-Signature`. | `{ "status": <enum>, "event_type": str }`. |

### Portal do Proprietário

| Método | Caminho | Descrição | Request | Response |
| --- | --- | --- | --- | --- |
| `GET` | `/owners/{owner_id}/overview` | Resumo financeiro e operacional do proprietário. | Header `X-Owner-Token`. | `OwnerOverviewRead`. |
| `GET` | `/owners/{owner_id}/properties` | Lista propriedades associadas. | Header `X-Owner-Token`. | `List[OwnerPropertySummaryRead]`. |
| `GET` | `/owners/{owner_id}/invoices` | Notas fiscais e cobranças. | Header `X-Owner-Token`. | `List[OwnerInvoiceRead]`. |
| `GET` | `/owners/{owner_id}/reports` | Relatórios disponibilizados no portal. | Header `X-Owner-Token`. | `List[OwnerReportRead]`. |
| `GET` | `/owners/{owner_id}/notifications` | Comunicações recentes. | Header `X-Owner-Token`. | `List[OwnerNotificationRead]`. |
| `GET` | `/owners/{owner_id}/devices` | Dispositivos registrados para push. | Header `X-Owner-Token`. | `List[PushDeviceRead]`. |
| `POST` | `/owners/{owner_id}/payout-preferences` | Atualiza preferências de repasse financeiro. | `OwnerPayoutPreferencesUpdate`. | `OwnerPayoutPreferencesRead`. |
| `POST` | `/owners/{owner_id}/kyc-documents` | Upload de documentos KYC (multipart). | Arquivo + campos `OwnerDocumentUploadResponse`. | `OwnerDocumentUploadResponse`. |
| `POST` | `/owners/{owner_id}/incidents` | Reporta incidente operacional (assíncrono). | `OwnerIncidentReport`. | `{ "status": "received" }`. |
| `POST` | `/owners/{owner_id}/devices` | Registra device token para push. | `PushDeviceRegistration`. | `204 No Content`. |
| `DELETE` | `/owners/{owner_id}/devices/{token}` | Revoga device token. | — | `204 No Content`. |

## GraphQL

O schema GraphQL (`strawberry.Schema`) expõe consultas apenas-leitura e respeita o mesmo modelo multi-tenant (headers `X-Tenant-*`).

- **Endpoint:** `POST /graphql`
- **Schema raiz:** `Query`

### Consultas Disponíveis

| Campo | Argumentos | Retorno | Observações |
| --- | --- | --- | --- |
| `properties` | — | `[PropertyType]` (`id`, `name`, `timezone`, `units`). | Usa `PropertyService.list`. |
| `reservations` | `property_id: Int!` | `[ReservationType]` (`guestName`, `guestEmail` mascarado, `status`, `checkIn/out`). | Encapsula `ReservationService.list_for_property`. |
| `agents` | `competencies: [String]`, `availability: [AgentAvailability]`, `page`, `page_size` | `AgentCatalogPageType` (itens + paginação + filtros). | Reutiliza `list_agent_catalog`. |
| `housekeeping_tasks` | `property_id: Int!` | `[HousekeepingTaskType]`. | Reutiliza `HousekeepingService.list_for_property`. |

> **Dica:** Use o mesmo token do gateway e defina `Content-Type: application/json`. O body deve seguir o formato padrão GraphQL: `{ "query": "{ properties { id name } }" }`.

### Erros

- Respostas de erro usam envelope padrão GraphQL com `errors[].message`.
- Violação de escopo retorna `HTTP 403` com detalhe `Escopo de plataforma não autorizado` ou `Cabeçalho X-Tenant-Slug obrigatório` antes de chegar ao resolutor.

## Versionamento e Evidências

- Os endpoints REST e GraphQL são cobertos por testes de integração em `tests/integration` e `tests/e2e`.
- Eventos críticos registram checkpoints via `register_control_checkpoint` e `record_audit_event`, alimentando os relatórios de compliance (`docs/compliance/reports/`).
