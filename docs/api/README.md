# Catálogo de APIs Bmad Method

Esta pasta concentra a documentação de referência dos serviços HTTP expostos pelo MVP.

- [`core.md`](core.md) — Endpoints REST e operações GraphQL do serviço `services/core`.
- [`identity.md`](identity.md) — Fluxos de autenticação e governança multi-tenant do serviço `services/identity`.

> **Headers multi-tenant**
>
> - `X-Tenant-Slug`: obrigatório para chamadas de escopo *tenant* (default).
> - `X-Tenant-Scope: platform` + `X-Tenant-Platform-Token`: habilitam operações de plataforma quando suportado.
> - `X-Request-Id` e `X-Trace-Id` são respeitados para correlação com observabilidade.

Consulte cada documento para payloads, códigos de resposta e integrações relevantes.
