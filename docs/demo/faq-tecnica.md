# FAQ Técnica – Suporte Pré e Pós-Demo

Guia rápido para times de suporte e engenharia durante execuções de demo do Bmad Method.

## Pré-demo

### Como inicializar rapidamente o backend para uma demo?
- Use `uvicorn services.core.main:create_app --factory --reload` apontando para um banco SQLite (default). O app já injeta `TenantManager` e configura CORS conforme `CoreSettings`.
- Para identity, rode `uvicorn services.identity.api:create_app --factory` em paralelo. Ambos serviços expõem `/health`/`/healthz` para smoke rápido.

### Quais headers devo configurar no API client?
- `X-Tenant-Slug`: obrigatório para escopo padrão.
- `Authorization`: bearer token emitido pelo fluxo `/tenants/{tenant}/login` + `/mfa/verify`.
- `X-Owner-Token`: necessário apenas para rotas do portal do proprietário.
- Opcional: `X-Request-Id` para correlação com dashboards de observabilidade.

### Como gerar dados de demonstração consistentes?
- Execute `scripts/infra/seed-dev-data.sh` ou `scripts/infra/seed-data.sh` para popular o banco local com entidades base.
- O `MarketplaceService` (registrado em `services/core/api/partners.py`) já inclui apps de exemplo para integrações.
- Funções de mascaramento (`quality.privacy.mask_personal_identifiers`) garantem que PII não apareça em listagens.

### Quais testes devo rodar antes da apresentação?
- `pytest tests/integration/test_privacy_controls.py` garante que o mascaramento continua válido.
- `pytest tests/integration/test_core_api.py -k smoke` cobre os principais fluxos REST.
- Opcional: `pytest tests/e2e` para fluxo ponta a ponta, dependendo da janela de tempo.

## Pós-demo

### Como resetar o ambiente rapidamente?
- Restaure o banco SQLite apagando `tmp/*.db` e reiniciando os serviços.
- Reexecute qualquer script de seed necessário (ver seção Pré-demo).

### Onde encontro logs de auditoria da sessão demo?
- Consulte `/governance/audit` no Core ou acesse o dashboard `grafana/compliance/compliance-overview.json`.
- Eventos de autenticação ficam registrados via `record_audit_event` (`services/core/security/auth.py`).

### Como responder dúvidas sobre integrações de parceiros?
- Direcione para `docs/api/core.md#marketplace-e-parcerias` que lista os endpoints `/marketplace`.
- Mostre que o mock `MarketplaceService` inclui contratos e SLAs prontos para demonstração.

### Preciso exportar métricas pós-demo. Qual endpoint usar?
- Utilize `GET /reports/kpis?format=csv` para exportar o período desejado.
- Para múltiplos tenants (cenário plataforma), `GET /tenants/reports/kpis` agrega os dados automaticamente.

### Como validar que notificações push foram registradas?
- Chame `GET /owners/{owner_id}/devices` com o `X-Owner-Token` usado na demo.
- Compare com os eventos de entrega em `/communications/delivery/summary`.

> Em caso de incidentes ou dúvidas adicionais, acione o time de Plataforma & Security Engineering que mantém os controles descritos em `docs/compliance/controles.md`.
