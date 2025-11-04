# Confirmação de Alinhamento — SLAs & Escalonamentos Billing Gateway

- **Data:** 2024-07-18
- **Participantes:**
  - Joana Lima (Suporte L1)
  - Rafael Prado (Suporte L1)
  - Carlos Mendes (SRE)
  - Luísa Peixoto (SRE)
  - Ana Rocha (Plataforma)
- **Escopo:** Revisão dos SLAs pós-lançamento, janelas de monitoramento 24h e procedimentos de escalonamento descritos em `releases/2024-07-15-billing-gateway/post-launch-plan.md`.

## Pontos acordados
- SLA de resposta inicial L1: **5 minutos** para incidentes P0/P1 e **15 minutos** para P2 durante janela de monitoramento.
- Escalonamento automático para SRE após 10 minutos sem mitigação em incidentes P0 e 20 minutos em P1.
- Engenharia de produto em regime de plantão rotativo durante período 18/07-01/08 para suporte a decisões de rollback.
- Comunicação com clientes piloto via e-mail dedicado em até 30 minutos após detecção de incidente crítico.

## Evidências registradas
- Atualização do playbook de incidentes no PagerDuty confirmada (registro #PD-4471).
- Checklist de handover entre turnos anexada ao ticket `INCIDENT-472`.
- Runbooks revisados com assinaturas no repositório `quality/observability/runbooks/`.

## Assinaturas
- Joana Lima — _Team Lead Suporte L1_
- Carlos Mendes — _SRE_
- Ana Rocha — _Plataforma_
