from __future__ import annotations

from datetime import datetime, timezone

from .models import KnowledgeBaseArticle, KnowledgeBaseCategory, KnowledgeBaseSnippet


CATEGORIES: list[KnowledgeBaseCategory] = [
    KnowledgeBaseCategory(
        id="getting-started",
        name="Primeiros Passos",
        description="Recursos essenciais para colocar o workspace operativo em minutos."
    ),
    KnowledgeBaseCategory(
        id="incident-response",
        name="Incidentes & Continuidade",
        description="Guias para triagem, comunicação e follow-up de incidentes críticos."
    ),
    KnowledgeBaseCategory(
        id="automation",
        name="Automações & Playbooks",
        description="Modelos prontos para orquestrar fluxos complexos sem sobrecarregar a equipa."
    ),
]


ARTICLES: list[KnowledgeBaseArticle] = [
    KnowledgeBaseArticle(
        id="kb-onboarding-101",
        slug="primeiros-passos-configurar-workspace",
        title="Checklist de configuração inicial do workspace",
        excerpt="Sequência recomendada para activar cadastros, canais e automações base em menos de 30 minutos.",
        category_id="getting-started",
        reading_time_minutes=5,
        tags=("onboarding", "workspace", "configuracao"),
        updated_at=datetime(2024, 3, 3, 8, 30, tzinfo=timezone.utc),
        stage="foundation",
        persona="operations_lead",
        use_case="workspace_launch",
        content=(
            "1. Confirme timezone, meta trimestral e canais principais no módulo de onboarding.\n\n"
            "2. Valide as listas de equipas e convites automáticos para agentes externos.\n\n"
            "3. Active integrações prioritárias (PMS e canal de mensagens) e execute o tour guiado para garantir que todas as secções foram revistas."
        ),
        action_snippets=(
            KnowledgeBaseSnippet(
                id="snippet-onboarding-checklist",
                label="Snippet · Checklist de primeiros passos",
                content=(
                    "- [ ] Timezone e objectivos confirmados\n"
                    "- [ ] Equipa convidada e perfis atribuídos\n"
                    "- [ ] Integrações críticas activadas\n"
                    "- [ ] Tour do suporte concluído"
                ),
                surface="support_center",
                recommended_playbook="workspace_launch"
            ),
        ),
        related_playbooks=("workspace_launch", "channel_readiness"),
    ),
    KnowledgeBaseArticle(
        id="kb-support-tour",
        slug="tour-centro-suporte",
        title="Como tirar máximo proveito do tour multi-passo de suporte",
        excerpt="Aprenda a mapear cada passo do tour, activar autoatendimento e sincronizar a conclusão no onboarding.",
        category_id="getting-started",
        reading_time_minutes=4,
        tags=("tour", "acessibilidade", "onboarding"),
        updated_at=datetime(2024, 3, 10, 10, 15, tzinfo=timezone.utc),
        stage="adoption",
        persona="customer_success",
        use_case="support_center",
        content=(
            "O tour de suporte apresenta pesquisa inteligente, categorias prioritárias e snippets prontos para autoatendimento.\n\n"
            "Para equipas de operações, recomenda-se executar o tour após a criação do workspace. Isso desbloqueia a marcação automática da checklist de prontidão e regista telemetria de leitura."
        ),
        action_snippets=(
            KnowledgeBaseSnippet(
                id="snippet-tour-reminder",
                label="Snippet · Lembrete para equipas",
                content=(
                    "Olá equipa! 👋 Concluam o tour guiado do suporte antes do go-live.\n"
                    "Isso garante que todos conhecem a base de conhecimento e reduz o volume de tickets em 18%."
                ),
                surface="support_center",
                recommended_playbook="support_enablement"
            ),
        ),
        related_playbooks=("support_enablement",),
    ),
    KnowledgeBaseArticle(
        id="kb-incident-swarm",
        slug="resposta-incident-swarm-major",
        title="Resposta colaborativa a incidentes críticos (Swarm 15-30-90)",
        excerpt="Protocolo de swarm com checkpoints de 15, 30 e 90 minutos para incidentes P1.",
        category_id="incident-response",
        reading_time_minutes=6,
        tags=("incidente", "swarm", "comunicacao"),
        updated_at=datetime(2024, 2, 22, 6, 0, tzinfo=timezone.utc),
        stage="stabilize",
        persona="incident_manager",
        use_case="major_incident",
        content=(
            "• 00-15 min: activar swarm, definir lider e abrir canal dedicado.\n\n"
            "• 15-30 min: publicar actualização curta no template P1 e activar snippet automático no centro de suporte.\n\n"
            "• 30-90 min: monitorizar métricas de autoatendimento, escalar playbooks de mitigação e documentar decisões para o post-mortem."
        ),
        action_snippets=(
            KnowledgeBaseSnippet(
                id="snippet-incident-update",
                label="Snippet · Actualização rápida P1",
                content=(
                    "Estado: em mitigação via swarm.\n"
                    "Última actualização: {timestamp}.\n"
                    "Próximo checkpoint: {checkpoint}."
                ),
                surface="support_center",
                recommended_playbook="incident_major_p1"
            ),
        ),
        related_playbooks=("incident_major_p1", "postmortem_review"),
    ),
    KnowledgeBaseArticle(
        id="kb-incident-telemetry",
        slug="telemetria-autoatendimento",
        title="Medir autoatendimento durante incidentes",
        excerpt="Configure alertas para quedas de autoatendimento e alinhe acções com o playbook operacional.",
        category_id="incident-response",
        reading_time_minutes=5,
        tags=("telemetria", "autoatendimento", "analytics"),
        updated_at=datetime(2024, 3, 5, 14, 45, tzinfo=timezone.utc),
        stage="stabilize",
        persona="operations_lead",
        use_case="analytics_incident",
        content=(
            "Utilize o painel de analytics para acompanhar a métrica 'taxa de autoatendimento' por categoria de incidente."
            "\n\nConfigure alertas proactivos quando a taxa ficar abaixo de 65% e sincronize os resultados com o dashboard executivo."
        ),
        action_snippets=(
            KnowledgeBaseSnippet(
                id="snippet-autoatendimento-alert",
                label="Snippet · Alerta de autoatendimento",
                content=(
                    "Autoatendimento caiu para {rate}% nas últimas 2h.\n"
                    "Playbook recomendado: 'Incident Major - Swarm 15-30-90'.\n"
                    "Próxima revisão: {next_review}."
                ),
                surface="analytics_dashboard",
                recommended_playbook="incident_major_p1"
            ),
        ),
        related_playbooks=("incident_major_p1", "analytics_briefing"),
    ),
    KnowledgeBaseArticle(
        id="kb-automation-turnos",
        slug="automacoes-rotina-turnos",
        title="Automação de rotina para mudanças de turno",
        excerpt="Fluxo de automação que envia briefing de turno, estado de incidentes e tarefas pendentes.",
        category_id="automation",
        reading_time_minutes=7,
        tags=("automacao", "turno", "playbook"),
        updated_at=datetime(2024, 2, 28, 7, 20, tzinfo=timezone.utc),
        stage="scale",
        persona="operations_lead",
        use_case="shift_handover",
        content=(
            "Configure um gatilho recorrente 30 minutos antes da troca de turno para gerar briefing automatizado."
            " Inclua KPIs chave, incidentes abertos e links para a base de conhecimento relevante."
        ),
        action_snippets=(
            KnowledgeBaseSnippet(
                id="snippet-shift-briefing",
                label="Snippet · Briefing de turno",
                content=(
                    "Resumo automático do turno:\n"
                    "- KPIs: {kpis}\n"
                    "- Incidentes críticos: {incidentes}\n"
                    "- Playbooks activos: {playbooks}"
                ),
                surface="support_center",
                recommended_playbook="shift_handover_automation"
            ),
        ),
        related_playbooks=("shift_handover_automation", "daily_sync"),
    ),
]
