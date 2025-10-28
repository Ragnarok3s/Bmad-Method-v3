# Registro de Atualização de SLAs Operacionais (Julho/2024)

## Contexto
Após a revisão de readiness para o gate de Kick-off, foram negociados ajustes finos nos contratos com os parceiros operacionais críticos para refletir o aumento de volume previsto para o Sprint 1.

- **Data da negociação**: 2024-07-08
- **Facilitador**: Luís Ferreira (Operations Manager)
- **Participantes externos**: AirLaundry, FixItNow, Partner-OTA Hub
- **Participantes internos**: Ana Ribeiro (PO), Bruno Carvalho (Platform Engineer), Carlos Mendes (QA Lead)

## Atualizações Contratuais
1. Inclusão de cláusulas de notificação de incidentes com janela máxima de 30 minutos para Partner-OTA Hub.
2. Reajuste de capacidade para AirLaundry durante picos de ocupação, com alocação de equipe extra em até 6h após solicitação.
3. FixItNow passou a disponibilizar dashboard de SLA compartilhado, com acesso concedido ao time de Operações.
4. Revisão conjunta das janelas de manutenção para evitar sobreposição com deploys críticos do MVP.

## Integrações de Processo
- Playbook operacional (`docs/playbook-operacional.md`) atualizado com novos contatos de escalonamento e procedimento de aviso prévio.
- Matriz de readiness em `docs/plano-kickoff-mvp.md` recebe novo checklist para confirmação semanal dos SLAs durante Sprint 0.
- Dashboard de observabilidade configurado para monitorizar o cumprimento das cláusulas adicionais e gerar alertas no canal `#steering-bmad`.

## Evidências Arquivadas
- `artefatos/sla/2024-07/addendum-airlaundry-2024-07.pdf`
- `artefatos/sla/2024-07/addendum-fixitnow-2024-07.pdf`
- `artefatos/sla/2024-07/addendum-partner-ota-hub-2024-07.pdf`
- Resumo de negociação e checklist de aceite: `artefatos/sla/2024-07/ata-ajustes-sla-2024-07.md`

## Próximos Passos
- Monitorar indicadores no dashboard conjunto e recolher métricas para a reunião de 2024-07-15.
- Registrar qualquer desvio de SLA nas atas dos gates e atualizar o quadro de ações corretivas.
- Validar com o time jurídico se os addendos exigem homologação adicional antes do Go-Live do MVP.
