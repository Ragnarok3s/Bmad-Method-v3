# Runbook – Gestão e Rotação de Secrets

## Escopo
Procedimento para criação, rotação e auditoria de segredos utilizados pelos ambientes `dev` e `staging`.

## Ferramentas
- Hashicorp Vault (`https://vault.bmad-method.internal`)
- GitHub Actions OIDC (repositório `Bmad-Method-v3`)
- ServiceNow (registro de auditorias trimestrais)

## Responsáveis
- **Owner**: Carla Nunes (Security Engineer)
- **Backup**: Bruno Carvalho (Platform Engineer Lead)
- **Aprovação**: Steering Committee Técnico

## Processo de Criação
1. Abrir requisição no ServiceNow com justificativa e owner do serviço.
2. Criar secret no Vault em `kv/<ambiente>/<servico>/<chave>` com TTL padrão (90 dias).
3. Atualizar _policy_ correspondente (`policies/<ambiente>/<servico>.hcl`).
4. Registrar caminho e TTL na planilha `artifacts/security/secret-inventory.xlsx`.
5. Atualizar variável no GitHub Actions (`Settings > Secrets and variables > Actions`) referenciando `VAULT_ROLE` apropriado.

## Rotação Trimestral
1. Executar `vault kv rotate` para o caminho alvo.
2. Atualizar consumidores (pods, jobs, pipelines) e validar _health check_.
3. Registrar data da rotação e responsável na planilha de inventário.
4. Atualizar `docs/atas/ata-security-<data>.md` com evidência.

## Auditoria
- Verificar _access logs_ (`vault audit list`) mensalmente.
- Revisar policies órfãs e revogar tokens sem uso > 30 dias.
- Garantir que secrets expirados sejam removidos em até 24h.

## Incidentes
- Em caso de vazamento suspeito, seguir `docs/runbooks/alertas-criticos.md` e acionar Security on-call.
- Resetar credenciais comprometidas, revogar tokens e rodar _post-incident review_.
