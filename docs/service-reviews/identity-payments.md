# Revisão dos serviços Identity e Payments

## Visão geral
- **Status atual:** não existem diretórios `services/identity` ou `services/payments` no repositório.
- **Impacto:** impossibilidade de mapear dependências, revisar controladores/repositórios/middlewares ou executar suítes de testes específicas para cada serviço.
- **Ações correlatas:** issues abertas para rastrear a ausência dos serviços e a falha de testes globais relacionada a métricas do serviço Core.

## Evidências coletadas
- Busca por diretórios e arquivos relacionados a Identity ou Payments não retornou resultados.
- Comandos `pytest` e `npm test` foram executados a partir da raiz do monorepo. `pytest` falhou na coleta devido à referência a `record_dashboard_alerts` em `services.core.metrics`, enquanto `npm test` não possui script configurado.

## Dependências e fluxos
Sem código-fonte para os serviços solicitados, não foi possível mapear integrações, fluxos REST/GraphQL, camadas de domínio ou dependências externas. A ausência dos diretórios indica que os serviços ainda não foram adicionados ao repositório ou estão localizados em outra base de código.

## Testes executados
- `pytest`: falhou na coleta por `ImportError` ao importar `record_dashboard_alerts` a partir de `services.core.metrics`.
- `npm test`: falhou porque não existe script `test` definido no `package.json` raiz.

## Revisão de validações e tratamento de erros
Não há artefatos de controladores, repositórios ou middlewares relacionados aos serviços Identity e Payments disponíveis para inspeção. A revisão fica bloqueada até que os serviços sejam adicionados.

## Recomendações
1. Criar/recuperar o código dos serviços Identity e Payments dentro do repositório.
2. Adicionar scripts de teste específicos (por exemplo, `pytest` para serviços Python ou `npm test` para serviços Node) quando os serviços forem incluídos.
3. Resolver a falha em `services.core.metrics` (`record_dashboard_alerts` ausente) para que a suíte de testes global volte a funcionar.
4. Após disponibilizar o código, repetir a análise de dependências e validações.

## Issues relacionadas
- [docs/issues/identity-service-missing.md](../issues/identity-service-missing.md)
- [docs/issues/payments-service-missing.md](../issues/payments-service-missing.md)
- [docs/issues/core-metrics-missing-alerts-counter.md](../issues/core-metrics-missing-alerts-counter.md)
