# Plano MVP para Plataforma de Gestão Hoteleira

## Objetivo

Estabelecer o escopo mínimo viável, integrações prioritárias, estratégia de validação e roadmap pós-MVP para uma plataforma de gestão de propriedades de hospitalidade.

## Módulos Essenciais do MVP

| Módulo | Principais Capacidades | Critérios de Pronto | Dependências | Métricas de Sucesso |
|--------|------------------------|---------------------|---------------|---------------------|
| Autenticação e Controlo de Acesso | Login seguro, gestão de funções (admin, gestor de propriedade, staff), MFA opcional | Fluxo de login com recuperação de senha; controlo de sessão com timeout configurável | Serviço de identidade, armazenamento seguro de credenciais | Taxa de sucesso no login ≥ 98%; zero incidentes de segurança críticos |
| Inventário de Propriedades | Cadastro de propriedades, unidades, amenidades e tarifas base | CRUD completo com validação; importação em massa via CSV | Autenticação, base de dados central | 100% das unidades piloto registadas; tempo médio de cadastro < 5 min |
| Calendário Centralizado | Visão diária/mensal de disponibilidade, bloqueios e eventos | Atualização em tempo real; filtros por propriedade/unidade; conflitos sinalizados | Inventário de propriedades, sincronização OTA | Sincronização < 2 min; zero conflitos não tratados |
| Gestão de Reservas | Criação/edição/cancelamento de reservas; fluxos de check-in/out; gestão de hóspedes | Regras de disponibilidade aplicadas; notificações por email; auditoria de alterações | Calendário, integrações de pagamento | Conversão reservas internas ≥ 80%; redução de overbookings em 90% |
| Relatórios Básicos | KPIs de ocupação, receita bruta, ADR; exportação CSV | Dashboards responsivos; atualização diária; filtros por propriedade | Dados de reservas e pagamentos | 100% dos gestores usam relatório semanalmente; NPS relatório ≥ 40 |

## Definition of Ready (DoR) e Definition of Done (DoD)

| Fluxo / Módulo | Definition of Ready | Definition of Done |
|----------------|---------------------|--------------------|
| Autenticação e Controlo de Acesso | Histórias com perfis/documentos de segurança identificados, fluxos de exceção descritos e dependências de identidade aprovadas pelo Security Champion. | MFA opcional configurável, logs de auditoria verificados, testes unitários ≥ 80% e checklist LGPD/GDPR atualizado com bases legais. |
| Inventário de Propriedades & Calendário | Requisitos de sincronização com OTAs revisados com parceiros e dados de catálogo limpos em staging. | Sincronização < 2 min validada em staging, políticas de retenção aplicadas e dashboards de métricas populados. |
| Housekeeping Móvel | Personas e jornadas confirmadas, integrações de parceiros com SLAs anexados e wireframes aprovados. | App responsivo/offline disponível em staging, monitorização ativa e documentação operacional atualizada no playbook. |
| Pagamentos PCI | Dependências com PSP aprovadas, contratos PCI arquivados e cenários de falha mapeados. | Tokenização ativa, reconciliação diária automatizada, relatório PCI anexado ao checklist de conformidade. |
| Reservas & Relatórios | Regras de negócio validadas com stakeholders, dados sintéticos preparados e métricas-alvo definidas. | Fluxos de check-in/out executados sem falhas críticas, exportações CSV validadas e métricas operacionais atingidas. |

As evidências associadas às validações acima ficam registradas no relatório de revisão (`docs/revisao-validacao-artefatos.md`) e devem ser atualizadas a cada gate relevante.

## Integrações Prioritárias

### Pagamentos e Faturação
- **Gateway**: integrar com provedor compatível com PCI-DSS (ex.: Stripe, Adyen).
- **Capacidades**: tokenização de cartão, pré-autorização e cobrança, geração de faturas fiscais.
- **Workflows MVP**:
  1. Captura de pagamento no check-in ou confirmação de reserva.
  2. Emissão automática de fatura após check-out.
  3. Relatório conciliatório diário.
- **Requisitos Técnicos**: webhooks para reconciliação; armazenamento seguro de tokens; logs auditáveis.

### Sincronização com OTAs Prioritárias
- **Plataformas Alvo**: Booking.com, Airbnb, Expedia.
- **Escopo MVP**:
  - Sincronização bidirecional de disponibilidade e tarifas.
  - Importação de reservas e atualizações de estado.
  - Gestão de discrepâncias com fila de reconciliação manual.
- **Métricas**: latência de sincronização < 5 minutos; erro de sincronização < 0,5% das operações.
- **Governança de Parceiros**: formalizar SLAs e janelas de manutenção com cada parceiro (OTAs, lavanderia, manutenção) antes do Sprint 0, garantindo comunicação em `docs/plano-kickoff-mvp.md` e atualização contínua do backlog.

## Privacidade, Segurança e Conformidade Regulatório

- **Bases Legais**: mapear dados pessoais tratados em cada módulo, associando finalidades e bases legais LGPD/GDPR (legítimo interesse, execução de contrato) na matriz de dados.
- **Minimização de Dados**: coletar apenas atributos necessários para reservas, faturação e reporting; armazenar dados sensíveis (documentos, cartões) com cifragem AES-256 e segregação de acessos por função.
- **Retenção e Eliminação**: definir políticas automáticas de retenção (ex.: 24 meses para dados operacionais, 7 anos para faturas) com rotinas de anonimização e deleção auditáveis.
- **Direitos do Titular**: disponibilizar mecanismos para exportar, corrigir e excluir dados de hóspedes, com SLA de atendimento de 10 dias úteis e logs de atendimento.
- **Avaliações de Impacto**: executar DPIA inicial antes do go-live e reavaliar a cada mudança de escopo, registrando riscos residuais e planos de mitigação.
- **Conformidade PCI-DSS**: garantir segmentação da zona de pagamentos, com testes de intrusão semestrais e revisão de contratos com PSPs.

### Plano de Compliance Regulatório Encerrado

| Entregável | Responsável | Prazo | Status | Observações |
|------------|-------------|-------|--------|-------------|
| Matriz de dados pessoais e bases legais LGPD/GDPR atualizada por módulo | Privacy Officer + Product Owner | Semana 1 pós-kick-off | Concluído | Referência publicada no repositório de governance compartilhado. |
| Relatório de DPIA inicial com mitigação dos riscos altos | Privacy Officer + Engineering Lead | Semana 2 | Concluído | Próxima revisão programada para incrementos de escopo trimestrais. |
| Plano de segmentação PCI e inventário de ativos de pagamento | Security Champion + Platform Engineer | Semana 3 | Concluído | Alinhado a controles de rede e gestão de tokens do PSP. |
| Checklist LGPD/GDPR/PCI para novas integrações e releases | QA Lead + Privacy Officer | Semana 4 | Concluído | Checklist integrado na estratégia de testes e quality gates. |

- **Documentação**: o plano completo e evidências foram arquivados no diretório de compliance interno e apontados na estratégia de testes (`docs/testing-strategy.md`).
- **Governança Contínua**: revisões trimestrais e auditorias semestrais permanecerão como critérios obrigatórios de saída de release.

## Testes de Aceitação com Utilizadores Piloto

1. **Seleção de Pilotos**: 5-7 propriedades com diferentes perfis (boutique, hostel, hotel urbano).
2. **Roteiro de Testes**:
   - Fluxo completo de reserva (criação, pagamento, check-in/out).
   - Atualização de inventário e bloqueio de datas.
   - Consulta de relatórios e exportação.
   - Resolução de conflito de disponibilidade proveniente de OTA.
3. **Métricas a Recolher**:
   - Tempo médio para completar tarefas críticas.
   - Taxa de erros/reportes por funcionalidade.
   - NPS geral e por módulo.
   - Indicadores de performance (latência API, disponibilidade).
4. **Feedback Qualitativo**: entrevistas semanais, formulário pós-uso diário, canal dedicado em ferramenta de suporte.
5. **Critérios de Aceitação**: ≥ 80% das tarefas concluídas sem suporte; satisfação geral ≥ 4/5; zero falhas bloqueadoras.

## Roadmap Pós-MVP

| Horizonte | Iniciativas | Objetivos de Negócio |
|-----------|------------|----------------------|
| H1 | Automatização de pricing dinâmico; app mobile para staff; integrações adicionais de pagamento locais | Aumentar RevPAR em 10%; expandir base em mercados emergentes |
| H2 | Motor de recomendações de upsell; CRM de hóspedes; suporte a multi-moeda e multi-imposto avançado | Incrementar receita acessória em 15%; melhorar retenção em 20% |
| H3 | Inteligência operacional (previsão de ocupação, staffing), marketplace de parceiros, API pública | Criar novas linhas de receita B2B; reforçar ecossistema e integrações |

## Próximos Passos

1. Finalizar arquitetura técnica detalhada de cada módulo e integrações.
2. Definir backlog de histórias alinhado ao plano MVP e distribuir entre squads, priorizando housekeeping móvel conforme `docs/product-roadmap.md`.
3. Configurar pipelines de QA automatizados para cenários críticos (reservas, pagamentos, sincronização OTA).
4. Agendar ciclo de testes com pilotos e preparar dashboards de acompanhamento de métricas.
5. Revisar roadmap pós-MVP trimestralmente com base nos dados recolhidos e objetivos estratégicos.
