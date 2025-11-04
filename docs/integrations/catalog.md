# Integration Catalog

This catalog maps the critical integrations that sustain the Bmad platform. It captures each integration's purpose, owning team, environments, data contracts, and leading KPIs associated with the integration health.

## Summary Table

| Integration | Category | Description | Owning Team | Environments | Data Contract | Leading KPIs |
| --- | --- | --- | --- | --- | --- | --- |
| Identity Provider (Auth0) | Identity & Access | Handles SSO flows, token issuance, and user profile sync. | Identity Platform | Staging, Production | `iam/authentication/v2` (JSON over HTTPS) | Identity proofing conversion rate, IDP sync latency |
| Property PMS Bridge | Property Supply | Ingests property inventory and availability from partner PMS providers. | Core Supply | Sandbox, Staging, Production | `supply/pms-import/v1` (SQS + JSON payload) | Listing publish lead time, Pricing refresh rate |
| Payments Gateway (Stripe) | Financial | Processes authorizations, captures, and refunds. | Payments | Sandbox, Staging, Production | `payments/transactions/v3` (REST + idempotency keys) | Authorization success rate, Settlement lead time |
| Fraud Scoring (Sift) | Risk | Evaluates fraud risk for bookings and payouts. | Payments | Staging, Production | `risk/decisioning/v1` (REST) | Dispute response SLA compliance |
| CRM (HubSpot) | Sales Enablement | Syncs qualified leads and onboarding tasks. | Property Ops | Sandbox, Production | `crm/deals/v1` (REST) | Partner onboarding cycle time |
| Notification Service (Twilio SendGrid) | Communications | Sends transactional emails and SMS to guests and hosts. | Core Platform | Staging, Production | `comms/events/v2` (Webhook + REST fallback) | Deployment change failure rate, Integration success rate |
| Data Warehouse (Snowflake) | Analytics | Receives daily data extracts for reporting and ML. | Data & Analytics | Staging, Production | `analytics/export/v1` (S3 + manifest) | Observability coverage score |
| Service Mesh (Istio) | Platform | Enables zero-trust communication between services. | Platform Engineering | Staging, Production | `platform/service-mesh/v1` (gRPC) | Mean time to detect integration regression |

## Integration Details

### Identity Provider (Auth0)
- **Interfaces**: Authorization Code + PKCE, machine-to-machine token exchange, profile webhook.
- **Error Handling**: Retries via exponential backoff; alerts to `#identity-oncall` on elevated 5xx.
- **Dependencies**: Relies on Secrets Manager rotation, identity Kafka topics.
- **Leading KPIs**
  - `bmad_leading_kpi_identity_identity_proofing_conversion_rate`
  - `bmad_leading_kpi_identity_idp_sync_latency_seconds`
  - `bmad_leading_kpi_identity_support_backlog_ratio`

### Property PMS Bridge
- **Interfaces**: Partner push via SQS queue with payload validation in schema registry.
- **Error Handling**: Dead-letter queue with automatic replay every 15 minutes.
- **Dependencies**: Property normalization service, pricing engine.
- **Leading KPIs**
  - `bmad_leading_kpi_core_listing_publish_lead_time_hours`
  - `bmad_leading_kpi_property_pricing_refresh_rate`
  - `bmad_leading_kpi_property_onboarding_cycle_time_hours`

### Payments Gateway (Stripe)
- **Interfaces**: REST API with idempotent keys; webhooks for asynchronous events.
- **Error Handling**: Automatic replay with jitter, custom circuit breaker for degraded regions.
- **Dependencies**: Fraud scoring integration, ledger service.
- **Leading KPIs**
  - `bmad_leading_kpi_payments_authorization_success_rate`
  - `bmad_leading_kpi_payments_settlement_lead_time_hours`
  - `bmad_leading_kpi_payments_dispute_response_sla`

### Fraud Scoring (Sift)
- **Interfaces**: REST scoring endpoint + async decisions via webhook.
- **Error Handling**: Back-pressure controls and fallback to rule-based scoring after 3 consecutive failures.
- **Dependencies**: Payments service, case management tooling.
- **Leading KPIs**
  - `bmad_leading_kpi_payments_authorization_success_rate`
  - `bmad_leading_kpi_payments_dispute_response_sla`

### CRM (HubSpot)
- **Interfaces**: Batch sync using incremental fetch API, custom webhooks for playbook tasks.
- **Error Handling**: Retries with stateful checkpointing; alerts on SLA breach via PagerDuty.
- **Dependencies**: Identity data enrichment, property onboarding workflows.
- **Leading KPIs**
  - `bmad_leading_kpi_property_onboarding_cycle_time_hours`
  - `bmad_leading_kpi_core_partner_training_completion_ratio`

### Notification Service (Twilio SendGrid)
- **Interfaces**: REST API for transactional mail; SMS via Twilio Verify.
- **Error Handling**: Rate limiter with queue fallback and dead-letter bucket.
- **Dependencies**: Template renderer, localization service.
- **Leading KPIs**
  - `bmad_leading_kpi_core_integration_success_rate`
  - `bmad_leading_kpi_core_release_change_failure_rate`

### Data Warehouse (Snowflake)
- **Interfaces**: Daily manifest + parquet drop on S3, ingestion via Snowpipe.
- **Error Handling**: Checksum validation with Slack alerts on missing batches.
- **Dependencies**: Data contract with analytics dbt pipelines.
- **Leading KPIs**
  - `bmad_leading_kpi_core_integration_success_rate`
  - `bmad_leading_kpi_identity_idp_sync_latency_seconds`

### Service Mesh (Istio)
- **Interfaces**: mTLS encrypted traffic, Envoy sidecars, control plane config via GitOps.
- **Error Handling**: Automatic retry budgets, circuit-breaking per route.
- **Dependencies**: Platform GitOps repo, observability stack.
- **Leading KPIs**
  - `bmad_leading_kpi_core_release_change_failure_rate`
  - `bmad_leading_kpi_core_integration_success_rate`
  - `bmad_leading_kpi_identity_support_backlog_ratio`

## Change Management

- All integrations must have an assigned service owner and escalation policy.
- New integrations require architecture review and signed data contract.
- Changes impacting PII must be approved by security and compliance before rollout.
- Track updates in the integration backlog within Jira project `INT` and synchronize with this catalog at least once per sprint.

## Observability Expectations

- Each integration must emit health metrics into the leading KPI collectors defined under `analytics/metrics/`.
- Dashboards for real-time monitoring are maintained in `grafana/dashboards/leading-kpis.json`.
- Alerts must fire within five minutes when KPIs breach their thresholds. Thresholds should be documented in the respective service runbooks.

