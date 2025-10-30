# Guia de Assets para Web Bundles

Este documento descreve como reconstruir os assets do bundle web quando for necessário atualizar fontes ou outros artefatos gerados pelo build do Next.js.

## Pré-requisitos
- Acesso à internet para baixar dependências e fontes hospedadas pelo Google Fonts.
- Node.js configurado e compatível com a versão do monorepo.

## Passo a passo para reconstruir assets
1. Instale dependências na raiz do monorepo:
   ```bash
   npm install
   ```
2. Gere a build do front-end web para produzir os arquivos em `.next/`:
   ```bash
   npm run build --workspace @bmad/web
   ```
3. Valide que as fontes `.woff2` baixadas possuem tamanho esperado e podem ser carregadas corretamente:
   ```bash
   npm run verify-fonts
   ```
4. Confirme que não existem arquivos `.next/static/media/*.woff2` versionados. Esses artefatos são gerados dinamicamente e já estão ignorados no Git.

> Observação: execute os comandos acima sempre com acesso à internet. Sem conectividade, o Next.js não conseguirá baixar as fontes do Google Fonts e a verificação via `fontkit` falhará.
