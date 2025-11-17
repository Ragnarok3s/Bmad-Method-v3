# syntax=docker/dockerfile:1
FROM node:20-alpine AS deps
WORKDIR /workspace
COPY package.json package-lock.json ./
COPY frontend/package.json frontend/package.json
RUN npm ci

FROM node:20-alpine AS dev
ENV NODE_ENV=development
WORKDIR /workspace
COPY --from=deps /workspace/node_modules ./node_modules
COPY --from=deps /workspace/package.json ./package.json
COPY --from=deps /workspace/package-lock.json ./package-lock.json
COPY frontend ./frontend
WORKDIR /workspace/frontend
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]
