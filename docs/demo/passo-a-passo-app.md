# Passo a passo para mostrar a app ao cliente

Guia rápido para apresentar a Bmad Method v3 como gestor de alojamento local com 4 alojamentos sem ruído visual ou passos confusos.

## Pré-requisitos de demonstração
- Entrar no workspace de **staging** com o utilizador `property_manager`.
- Garantir que o dataset de demonstração está carregado (inventário de 4 propriedades e reservas de exemplo).
- Abrir as seguintes áreas em separadores: Dashboard, Reservas, Housekeeping, Calendário e Portal do Proprietário (`/owners`).

## Sequência sugerida (10–15 min)
1. **Dashboard inicial (Home)**
   - Mostrar os cartões de **taxa de ocupação**, **NPS**, **SLAs de parceiros** e a lista de prioridades para provar que os dados estão a fluir.
   - Confirmar o banner de estado está verde (modo live). Se aparecer “Modo offline”, mencionar que as métricas entram em cache até o Core API voltar.
2. **Reservas**
   - Confirmar o resumo “A mostrar X de Y reservas”.
   - Abrir a reserva do **Hóspede 1** e clicar em **“Registar check-in”** para mostrar a atualização imediata do estado “Hóspede em casa”.
   - Avançar para a página 2 com o botão **“Próxima”** para evidenciar paginação sem lag.
3. **Housekeeping**
   - Ver o quadro de tarefas com estado (Pendente, Em progresso, Concluída, Bloqueada) e SLA lateral.
   - Alterar o estado de uma tarefa para “Concluída” para mostrar sincronização e contagem de pendências a diminuir.
   - Mencionar que, se o dispositivo ficar offline, a UI mostra “Modo offline” e mantém a fila para sincronizar depois.
4. **Calendário Operacional**
   - Filtrar por intervalo de datas e mostrar as reservas do período.
   - Abrir a fila de reconciliação (secção “Inventário”) e resolver um item com o botão de ação para ilustrar gestão de overbooking/OTA.
5. **Portal do Proprietário (4 alojamentos)**
   - Inserir o código seguro fornecido e entrar no portal `/owners`.
   - Na aba **Propriedades**, confirmar a presença das 4 unidades: Lisboa Downtown Boutique, Porto Riverside Lofts, Coimbra Business Suites e Faro Beach Villas.
   - Destacar que cada card mostra ocupação, ADR e incidentes, com alertas a vermelho apenas quando há mais de 1 incidente.
   - Na aba principal, atualizar o **IBAN (últimos 4 dígitos)** e o **limite de pagamento** para mostrar o fluxo de preferências e o alerta de revisão manual quando necessário.

## Checks rápidos para evitar ruído visual
- Usar apenas os filtros essenciais em cada ecrã; limpar filtros antigos antes de mudar de módulo.
- Manter o modo claro predefinido (não alterar o tema para evitar diferenças visuais inesperadas).
- Se surgir algum estado de erro temporário, referir o CTA “Configurações > Integrações” em vez de tentar recarregar repetidamente.

## Testes rápidos como gestor de AL (4 alojamentos)
- Verificar que os 4 cards de propriedades aparecem e que “Coimbra Business Suites” surge com alerta (2 incidentes abertos) enquanto “Faro Beach Villas” está sem alertas.
- Executar um **check-in** e um **check-out** no módulo de Reservas para confirmar atualização de estados.
- Completar pelo menos uma tarefa de housekeeping e validar que a barra de progresso sobe.
- Resolver um item na fila de reconciliação do Calendário para provar que conflitos OTA ficam a zero.
