# Flag: BILLING_GATEWAY_ENABLE_REAL

## Objetivo
- Manter o backend de billing apontando para o driver mock (`InMemoryGatewayDriver`).
- Evitar disparo de cobranças reais enquanto o risco "Atraso na integração com gateway de pagamentos" estiver ativo (`docs/roadmap-riscos.md`).
- Permitir reversão controlada para o PSP real somente quando o readiness for concluído.

## Estado Atual
- **Valor padrão:** `0` (ou ausente) — mantém o gateway real desligado.
- **Ambiente:** todas as execuções de desenvolvimento, CI/CD e staging devem seguir com o valor `0` até nova decisão do steering.
- **Driver configurado:** alias `sandbox` (personalizável via `BILLING_GATEWAY_SANDBOX_ALIAS`). O segredo de webhook pode ser sobrescrito com `BILLING_GATEWAY_SANDBOX_WEBHOOK_SECRET`.
- **Efeito técnico:** `services/billing/api/dependencies.configure_gateway_service` registra automaticamente o mock e emite log confirmando o fallback.

## Procedimento para Ativar o PSP Real
1. **Pré-requisitos**
   - Drivers reais registrados em `backend/services/payments/gateways/` e validados em staging.
   - Evidências atualizadas no checklist PCI e no roadmap de riscos.
   - Aprovação do steering operacional documentada em `docs/roadmap-riscos.md`.
2. **Passos**
   - Definir `BILLING_GATEWAY_ENABLE_REAL=1` (ou `true`) no ambiente alvo.
   - Configurar credenciais (`CORE_PAYMENTS_*`) do PSP correspondente.
   - Executar a suíte de contratos (`pytest tests/contracts -m payments or real_gateway`) e os E2E específicos (`pytest tests/e2e/payments -m real_gateway`).
   - Atualizar o README da release vigente com a mudança de estado e anexar logs das execuções.
   - Notificar o canal interno de suporte conforme instruções em `docs/support/user-manual.md`.
3. **Rollback**
   - Reverter `BILLING_GATEWAY_ENABLE_REAL` para `0`.
   - Desabilitar credenciais do PSP no cofre correspondente.
   - Registrar o evento no ledger de releases e comunicar o canal de suporte.

## Observações Operacionais
- Enquanto o flag estiver desligado, cenários marcados com `@pytest.mark.real_gateway` são automaticamente ignorados (ver `pyproject.toml` e `tests/conftest.py`).
- Qualquer alteração neste comportamento deve ser refletida no `docs/manual-do-usuario.md` e no manual de suporte.
- Runbooks de incidentes continuam válidos, porém ações relacionadas a PSP externo devem ser tratadas como não disponíveis.
