# Issue: Serviço Identity ausente do repositório

## Problema
Não há diretório `services/identity` nem artefatos (APIs, domínios, pipelines de testes) relacionados ao serviço de identidade. A ausência impede o mapeamento de dependências, a execução de testes específicos e a revisão de controles de validação.

## Evidências
- `find . -path '*services/identity*'` não retorna resultados.
- Não existem suites `pytest` ou `npm test` configuradas para o serviço.

## Impacto
- Bloqueio total para análise de segurança, autenticação/autorização e gestão de credenciais.
- Falta de cobertura de testes e monitoramento dedicado ao serviço de identidade.
- Dependências de outros serviços (por exemplo, Core) não podem ser verificadas.

## Ações recomendadas
1. Incluir o código-fonte do serviço Identity no monorepo, com documentação de endpoints e dependências externas (ex.: provedores OAuth).
2. Adicionar suíte de testes automatizados (`pytest`, `npm test` ou equivalente) e instruções de execução.
3. Documentar contratos de integração com os demais serviços e atualizar diagramas de arquitetura.
