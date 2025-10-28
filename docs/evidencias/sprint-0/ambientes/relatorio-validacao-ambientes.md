# Evidência - Validação de Ambientes (Sprint 0)

- **Data/Hora:** 2024-06-11 10:30 BRT
- **Responsável:** Plataforma - Squad DevEx

## 1. Provisionamento em Kubernetes (DEV/STG)
- Comando executado: `kubectl get ns --context=platform-dev`
- Resultado: Namespaces `app-dev` e `app-stg` ativos, com quotas aplicadas.
- Log anexado: `logs/kubectl-get-ns-20240611.txt`

## 2. Paridade de Configuração
- Diff automatizado entre DEV e STG utilizando `kustomize build`.
- Saída arquivada em: `logs/kustomize-diff-20240611.txt`.
- Resultado: Sem diferenças estruturais, apenas variáveis de ambiente sensíveis mascaradas.

## 3. Acesso Controlado
- Revisão de RBAC exportada via `kubectl get roles --context=platform-dev -o yaml`.
- Confirmação de papéis somente-leitura para squads consumidores.

> Logs detalhados armazenados em `docs/evidencias/sprint-0/ambientes/logs/` para auditoria.
