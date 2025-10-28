# Guia Rápido — Onboarding Housekeeping

## Objetivo
Garantir que novos colaboradores configurem o app móvel e compreendam o fluxo de sincronização offline em menos de 15 minutos.

## Pré-requisitos
- Dispositivo cadastrado no MDM corporativo.
- Credenciais provisionadas via fluxo OAuth device code.

## Passo a Passo
1. **Configuração Inicial**
   - Acessar `Configurações > Sincronização` e validar status do endpoint `/v2/housekeeping/sync`.
   - Executar teste de conexão; registrar log em `#hk-ops`.
2. **Download de Tarefas**
   - Forçar sincronização manual e validar recebimento de tarefas atribuídas.
   - Simular modo offline ativando "Modo Avião" e concluir 2 tarefas.
3. **Reconciliação Offline**
   - Restaurar conexão e confirmar status "Sincronizado" no histórico.
   - Validar dashboards em `Housekeeping Sync` (Grafana) para confirmar ingestão.
4. **Checklist Final**
   - Revisar manual de contingência (`docs/dor-dod-package.md` — seção Housekeeping).
   - Confirmar que o colaborador sabe acionar suporte via `#hk-ops`.

## Responsáveis
- **Owner**: Mariana Lopes (Operations Manager).
- **Backup**: Bruno Carvalho (Platform Engineer).

## Indicadores
- Tempo médio de onboarding < 15 minutos.
- Taxa de sincronização pós-onboarding ≥ 98% nas primeiras 24h.
