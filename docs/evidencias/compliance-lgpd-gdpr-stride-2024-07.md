# Evidências de Validação LGPD/GDPR e STRIDE — Julho/2024

## Contexto
- **Data da validação:** 2024-07-12
- **Equipe responsável:** Privacy Officer (Inês Duarte), Security Champion (Rafael Gomes), Architecture Lead (Joana Silva)
- **Escopo:** fluxos de autenticação (MFA, recuperação), gestão de perfis de agentes, novos registos de auditoria e alertas críticos integrados ao observability hub.

## Checklist LGPD/GDPR
1. **Base legal e finalidade mapeadas:** atualização do inventário de dados pessoais (`artefatos/compliance/inventario-dados-2024-07.xlsx`) incluindo campos de auditoria e sessões de autenticação.
2. **Minimização de dados:** tokens de sessão expiram automaticamente (30 minutos configuráveis) e recovery codes são hashados, com evidência no relatório técnico `artefatos/compliance/mfa-recuperacao-detalhes.pdf`.
3. **Direitos do titular:** processos de revogação e recuperação documentados no runbook `docs/security/runbooks/recuperacao-conta-mfa.md`.
4. **Segurança e confidencialidade:** MFA obrigatório para workspaces sensíveis, logs criptografados e anexados em `artefatos/compliance/logs-auditoria-amostra-2024-07.jsonl`.

## Análise STRIDE
- **Spoofing:** MFA com TOTP e códigos de recuperação validados; brute force gera bloqueio e alerta crítico (`auth.account_locked`).
- **Tampering:** auditoria detalhada (`AuditLog`) registra mudanças de perfil com checksum incluído no pipeline OTEL.
- **Repudiation:** Observability mantém 50 eventos recentes e integrações com alertas críticos com timestamp UTC (`docs/observability-stack.md` atualizado).
- **Information Disclosure:** códigos de recuperação hashados e nunca persistidos em claro.
- **Denial of Service:** lockout temporário após 5 tentativas falhadas, mitigando ataques automatizados.
- **Elevation of Privilege:** atualização de perfis exige papel admin/property_manager e gera alerta de auditoria.

## Evidências Anexadas
- `artefatos/compliance/inventario-dados-2024-07.xlsx`
- `artefatos/compliance/mfa-recuperacao-detalhes.pdf`
- `artefatos/compliance/logs-auditoria-amostra-2024-07.jsonl`
- `docs/security/runbooks/recuperacao-conta-mfa.md`

## Atualização 2024-07-15
- **Testes automatizados:** execução de `pytest tests/integration/test_authentication.py` confirmando MFA, bloqueio antiforça bruta (HTTP 423) e rejeição de sessões expiradas.
- **Configuração dinâmica:** validação do parâmetro `CORE_AUTH_SESSION_TIMEOUT_SECONDS`, com timeout ajustável refletido nas respostas da API (`session_timeout_seconds`) e na expiração das sessões persistidas.
- **Observabilidade e auditoria:** snapshot `/health/otel` registrando contadores `audit` e `alerts`, garantindo rastreabilidade dos eventos `auth_login_*`, `auth_session_expired` e `auth.account_locked`.
- **Recuperação segura:** verificação da emissão única dos códigos de recuperação, acompanhada da atualização do inventário de dados e hash dos códigos em repouso.

## Decisão
A validação conjunta LGPD/GDPR e STRIDE foi **aprovada**, sem bloqueios. Ações de melhoria contínua foram registradas no quadro de correções (`docs/revisao-validacao-artefatos.md`) para revisão no checkpoint de agosto/2024.
