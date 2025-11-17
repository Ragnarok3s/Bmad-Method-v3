# Core Hospitality API (referência deslocada)

O catálogo de endpoints REST e GraphQL foi movido para [`docs/api/core.md`](../api/core.md) para centralizar toda a documentação de APIs.

- A tabela de endpoints foi expandida para cobrir comunicações, governança, pricing, marketplace, pagamentos e portal do proprietário conforme implementado em `backend/services/core/api/rest.py`.
- As consultas GraphQL (`properties`, `reservations`, `agents`, `housekeepingTasks`) foram atualizadas segundo `backend/services/core/api/graphql.py`.
- Headers multi-tenant obrigatórios (`X-Tenant-*`) e notas de versionamento estão descritos no novo local.

Use o arquivo consolidado para manter futuras atualizações sincronizadas com o código fonte.
