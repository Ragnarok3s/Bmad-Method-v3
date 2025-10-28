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
| Autenticação e Controlo de Acesso | Histórias com dependências de identidade aprovadas, fluxos de exceção documentados, ameaças priorizadas na matriz STRIDE e plano de rollback definido. | MFA opcional e recovery testados, auditoria de logs revisada, alertas críticos configurados e checklist LGPD/GDPR atualizado. |
| Inventário & Calendário | Dados de catálogo limpos em staging, integrações OTA com SLAs anexados e critérios de sincronia revistos com parceiros. | Sincronização < 2 min validada, retenção automatizada habilitada, dashboards de disponibilidade publicados. |
| Housekeeping Móvel | Personas confirmadas, wireframes aprovados e dependências móveis (MDM, push) prontas, com riscos operacionais registrados. | App responsivo/offline em staging, monitorização ativa com SLAs de parceiros, runbook atualizado com fluxos de contingência. |
| Pagamentos PCI | Contratos PCI arquivados, cenários de falha e de chargeback descritos, segregação de ambientes aprovada pela segurança. | Tokenização ativa, reconciliação diária automatizada, relatório PCI anexado, testes de penetração aprovados. |
| Reservas & Relatórios | Dados sintéticos e métricas-alvo definidos, regras de negócio revisadas com stakeholders e dependências de BI mapeadas. | Fluxos de check-in/out estáveis, exportações CSV validadas, KPIs atingidos e documentação de suporte pronta. |

As evidências associadas às validações acima ficam registradas no relatório de revisão (`docs/revisao-validacao-artefatos.md`) e devem ser atualizadas a cada gate relevante. A versão consolidada dos critérios e checklist está publicada em `docs/dor-dod-package.md`, que passa a ser a referência oficial para auditorias de readiness.

> **Alinhamento e aprovação 2024-07-08**: Ana Ribeiro (PO) e Carlos Mendes (QA Lead) revisaram este quadro juntamente com `docs/dor-dod-package.md`, confirmando que os critérios estão sincronizados entre os documentos e permanecem válidos para o ciclo atual.

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

### Checklist Regulatório do MVP

| Item | Descrição | Responsável | Evidência |
|------|-----------|-------------|-----------|
| Mapeamento de dados pessoais | Inventário de atributos por módulo com base legal e tempo de retenção. | Privacy Officer + Product Owner | Matriz publicada em `artifacts/compliance/matriz-dados-lgpd-v1.0.xlsx`. |
| DPIA inicial | Avaliação de impacto com mitigação dos riscos altos identificados. | Privacy Officer + Engineering Lead | Relatório arquivado em `docs/evidencias/dpia-inicial-2024-05.md`. |
| Segmentação PCI | Documento de arquitetura PCI e inventário de ativos críticos. | Security Champion + Platform Engineer | Diagrama assinado na ata de segurança da Semana 3. |
| Checklist LGPD/GDPR/PCI por release | Lista de verificação a ser marcada antes de cada deploy. | QA Lead + Privacy Officer | Checklist integrado à pipeline (`artifacts/compliance/checklist-lgpd-gdpr-pci-v1.0.xlsx`). |

### Plano de Compliance Regulatório Encerrado

| Entregável | Responsável | Prazo | Status | Observações |
|------------|-------------|-------|--------|-------------|
| Matriz de dados pessoais e bases legais LGPD/GDPR atualizada por módulo | Privacy Officer + Product Owner | Semana 1 pós-kick-off | Concluído | Referência publicada no repositório de governance compartilhado. |
| Relatório de DPIA inicial com mitigação dos riscos altos | Privacy Officer + Engineering Lead | Semana 2 | Concluído | Próxima revisão programada para incrementos de escopo trimestrais. |
| Plano de segmentação PCI e inventário de ativos de pagamento | Security Champion + Platform Engineer | Semana 3 | Concluído | Alinhado a controles de rede e gestão de tokens do PSP. |
| Checklist LGPD/GDPR/PCI para novas integrações e releases | QA Lead + Privacy Officer | Semana 4 | Concluído | Checklist integrado na estratégia de testes e quality gates. |

- **Documentação**: o plano completo e evidências foram arquivados no diretório de compliance interno e apontados na estratégia de testes (`docs/testing-strategy.md`).
- **Governança Contínua**: revisões trimestrais e auditorias semestrais permanecerão como critérios obrigatórios de saída de release.

### Integração com Estratégia de Testes e Quality Gates

| Domínio do MVP | Controles de Privacidade/Segurança | Cenários de Teste Associados | Evidências Registradas |
|----------------|------------------------------------|------------------------------|------------------------|
| Autenticação, Reservas e Pagamentos | Validação de consentimento, segregação PCI, logs de auditoria para perfis sensíveis | Suites de integração verificam consentimentos, DSRs simulados e segmentação PCI (`Week 1-3` roadmap de QA) | Checklist LGPD/GDPR/PCI assinado por release e anexado ao relatório de QA (`docs/testing-strategy.md`) |
| Inventário, Calendário e OTAs | Minimização de dados nos payloads de sincronização e retenção automatizada | Testes E2E exercitam sincronização com dados mascarados e verificações de retenção no staging | Logs de execução e relatórios de retenção anexados à ata de readiness em `docs/revisao-validacao-artefatos.md` |
| Relatórios e Analytics | Aplicação de políticas de anonimização e exportações com red masking | Testes unitários garantem mascaramento e exportações seguem política de pseudonimização | Execução registrada no dashboard `QA-Quality` com apontamento de owners (QA Lead + Privacy Officer) |

- **Integração com QA**: o roadmap de testes incorpora as verificações acima como pré-condição de saída para cada sprint; qualquer exceção deve ser aprovada pelo Privacy Officer e documentada na ata de steering.

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
