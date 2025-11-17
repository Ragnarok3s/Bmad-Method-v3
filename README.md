# Bmad Method – Aplicação Web

Este repositório está estruturado apenas para experiência web: frontend em Next.js/TypeScript e backend em FastAPI/Python, conectados via chamadas REST. Todo o código, assets e automações estão preparados para rodar em ambientes locais ou em contêineres sem dependências de apps mobile, Expo ou builds para lojas.

## Estrutura do projeto
- `frontend/`: app Next.js (App Router) com TypeScript, componentes responsivos e pasta `public/` para assets estáticos.
- `backend/`: serviços FastAPI (ex.: `backend/services/core`), testes e artefatos de qualidade.
- `docs/`: documentação funcional, técnica e procedimentos de operação.
- `packages/`: pacotes compartilhados como o cliente API utilizado pelo frontend.
- `docker-compose.yml`: orquestração simples para levantar frontend + backend.
- `.env.example`: variáveis de ambiente base para desenvolvimento.

## Pré-requisitos
- Node.js 20+
- Python 3.11+ (recomendado usar `venv`)
- Docker e Docker Compose (opcional, para subir tudo com um comando)

## Configuração de ambiente
1. Copie `.env.example` para `.env` (ou exporte as variáveis no shell) e ajuste URLs/segredos conforme necessário.
2. Para servir assets estáticos, coloque-os em `frontend/public/`.

## Executar localmente (sem Docker)
1. **Instalar dependências do frontend**
   ```bash
   npm install
   ```
2. **Instalar dependências do backend**
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate
   pip install -e .
   ```
3. **Subir o backend (FastAPI)**
   ```bash
   cd backend
   uvicorn services.core.main:app --reload --host 0.0.0.0 --port 8000
   ```
4. **Subir o frontend (Next.js)**
   ```bash
   npm run dev
   ```
5. Acesse a aplicação em http://localhost:3000 (o frontend usará `NEXT_PUBLIC_CORE_API_BASE_URL` para falar com o backend).

## Executar com Docker Compose
1. Garanta que Docker esteja ativo.
2. Construa e suba o stack completo:
   ```bash
   docker compose up --build
   ```
3. O backend ficará em http://localhost:8000 e o frontend em http://localhost:3000. Alterações nos arquivos serão refletidas porque o diretório `backend/` é montado no contêiner de API.

## Scripts úteis
- `npm run dev:backend`: inicia o backend com recarregamento (necessário Python instalado localmente).
- `npm run dev`: inicia o frontend Next.js.
- `npm run dev:stack`: sobe frontend + backend via Docker Compose.
- `./scripts/test-unit.sh`: roda testes unitários (Python + frontend) e gera cobertura.
- `./scripts/test-integration.sh`: executa cenários de integração do backend.
- `./scripts/test-e2e.sh`: executa Playwright no frontend e cenários e2e do backend.

## Observações
- A navegação, autenticação e manipulação de dados acontecem exclusivamente pela interface web.
- Não há dependências de React Native/Expo; qualquer funcionalidade de notificações push utiliza gateways web/logging dentro do backend.
- Ajuste `CORE_ALLOWED_ORIGINS` e `NEXT_PUBLIC_CORE_API_BASE_URL` no `.env` para alinhar CORS entre frontend e backend.
