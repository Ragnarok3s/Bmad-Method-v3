# Portal de desenvolvedores do Marketplace BMAD

Bem-vindo ao centro de integração com o ecossistema BMAD. Aqui você encontra contratos públicos,
ambiente sandbox, ferramentas de testes e guias para publicar integrações no marketplace.

## Visão geral

- **Contratos públicos**: cada app possui um contrato versionado descrevendo escopos, limites de
  requisições e webhooks esperados.
- **Sandbox instantâneo**: gere credenciais sintéticas com validade de 30 dias para validar seus
  fluxos antes de ir para produção.
- **Auditoria e consentimento**: toda instalação registra eventos com granularidade de escopo e
  operador responsável.
- **Billing transparente**: consumo e faturamento disponíveis via API e webhooks assíncronos.

> 📘 Consulte também o [guia de API de parceiros](./partners-api.md) e o [SDK Node.js](./sdk-node.md).

## Fluxo de publicação

1. Solicite acesso enviando seu identificador fiscal e endpoints de webhook.
2. Modele o contrato público definindo escopos mínimos, limites de rate limiting e atributos de
   sandbox.
3. Implemente consentimento granular utilizando os eventos de auditoria descritos abaixo.
4. Configure os webhooks de faturamento e auditoria para acompanhar uso em tempo real.
5. Publique a vitrine com assets (ícone SVG, capturas, vídeo) e checklists de conformidade.

## Contatos

- **Suporte técnico**: marketplace-tech@bmad.example
- **Equipe de review**: review@bmad.example
- **Comunidade**: canal `#marketplace-builders` no Slack BMAD
