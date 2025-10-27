# Wireframes de Baixa Fidelidade

Os wireframes abaixo focam nos ecrãs críticos para reservas, calendário operacional, housekeeping e faturação. Cada iteração incorpora feedback recolhido junto das personas "Gestora de Operações", "Rececionista" e "Supervisor de Housekeeping".

## 1. Painel de Reservas (Desktop)

```
+--------------------------------------------------------------------------------+
| Header com logo | Seleção de hotel | Alerta ocupação alta | Perfil/Notificações |
+--------------------------------------------------------------------------------+
| Filtros rápidos: [Datas] [Estado] [Fonte] [Tag VIP] [Grupo]                     |
+--------------------------------------------------------------------------------+
| Lista de reservas                                                               |
| --------------------------------------------------------------------------------|
| # | Hóspede | Check-in | Check-out | Quartos | Estado | Ações                   |
| --------------------------------------------------------------------------------|
| ...                                                                            |
+--------------------------------------------------------------------------------+
| CTA primário: "Criar Reserva"   CTA secundário: "Importar Canal"               |
+--------------------------------------------------------------------------------+
```

**Feedback Iteração 1 → 2**
- Rececionista pediu campo de pesquisa global por nome/booking ID → adicionado na barra superior.
- Gestora solicitou destaque para reservas em espera → coluna "Estado" agora inclui etiquetas coloridas.

## 2. Calendário Operacional (Desktop)

```
+------------------------------------------------------------------------------+
| Header | Tabs: Reservas | Calendário | Housekeeping | Faturação              |
+------------------------------------------------------------------------------+
| Subheader: [Vista Diária] [Vista Semana] [Vista Mês]  Filtros avançados       |
+------------------------------------------------------------------------------+
| Legenda cores | Overbooking alert | Exportar | Print                         |
+------------------------------------------------------------------------------+
| Grade do calendário (colunas = quartos, linhas = dias)                       |
| Bloques: cartões com nome hóspede, ícone status housekeeping, aviso VIP       |
+------------------------------------------------------------------------------+
| Painel lateral (deslizante) com detalhes e ações rápidas                     |
+------------------------------------------------------------------------------+
```

**Feedback Iteração 1 → 2**
- Gestora queria arrastar e largar reservas → adicionada área lateral com botões "Realocar" e "Contactar".
- Rececionista solicitou vista semanal compacta → toggle de densidade incluído na subheader.

## 3. App Mobile de Housekeeping

```
+-------------------------------+
| Header: Quartos atribuídos    |
+-------------------------------+
| Cartão quarto #201            |
| - Estado: A limpar            |
| - Hora check-out: 11:00       |
| - Tarefas: [ ] Roupa cama     |
|           [ ] Amenities       |
| Botões: [Iniciar] [Reportar]  |
+-------------------------------+
| Cartão quarto #305 ...        |
+-------------------------------+
| Barra inferior: Dashboard | Tarefas | Alertas | Perfil |
+-------------------------------+
```

**Feedback Iteração 1 → 2**
- Supervisor solicitou prioridade visual para quartos urgentes → etiqueta vermelha "Express" junto ao número do quarto.
- Equipa pediu modo offline → incluído indicador de sincronização no header.

## 4. Faturação & Checkout (Desktop e Tablet)

```
+--------------------------------------------------------------------------------+
| Barra superior: Pesquisa reserva | Botão "Checkout Rápido" | Alertas fiscais   |
+--------------------------------------------------------------------------------+
| Colunas:                                                                |      |
| A) Resumo hóspede: foto, contactos, preferências                         |      |
| B) Itens consumidos (lista com categorias e preços)                      |      |
| C) Pagamentos & descontos                                               |      |
| -------------------------------------------------------------------------------|
| Rodapé: Totais | Seleção método de pagamento | Botão "Gerar Fatura"             |
+--------------------------------------------------------------------------------+
```

**Feedback Iteração 1 → 2**
- Financeira pediu campo para notas internas → adicionado abaixo dos totais.
- Rececionista queria ver histórico de cobranças → tab secundária com histórico.

## Próximos Passos para Wireframes
- Validar com persona "Diretor Financeiro" para garantir requisitos de auditoria.
- Preparar transição para protótipos de média fidelidade com componentes reutilizáveis.

