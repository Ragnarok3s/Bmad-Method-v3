# Issue: Serviço Payments ausente do repositório

## Problema
O repositório não contém diretório `services/payments`, nem componentes de aplicação ou testes associados ao processamento de pagamentos.

## Evidências
- `find . -path '*services/payments*'` não localiza arquivos.
- Ausência de documentação ou scripts de execução de testes (`npm test`, `pytest`) relacionados ao serviço.

## Impacto
- Impossibilidade de auditar integrações com gateways de pagamento, PCI DSS ou fluxos de faturamento.
- Bloqueio para análises de validação de entrada, tratamento de erros financeiros e reconciliação.
- Outros serviços que dependam de pagamentos não podem ser verificados.

## Ações recomendadas
1. Restaurar ou adicionar o código do serviço Payments ao monorepo com suas dependências declaradas.
2. Publicar instruções de configuração (chaves de API, ambientes sandbox) e scripts de teste automatizado.
3. Registrar contratos de integração com serviços consumidores (ex.: faturamento, reservas) e requisitos de conformidade.
