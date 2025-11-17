from __future__ import annotations

from collections import Counter
from dataclasses import dataclass
from enum import Enum
from math import ceil
from typing import Iterable, Sequence

from pydantic import BaseModel, ConfigDict, Field

from .schemas import PaginationMeta


class AgentAvailability(str, Enum):
    AVAILABLE = "available"
    LIMITED = "limited"
    MAINTENANCE = "maintenance"


class AgentFilterOption(BaseModel):
    value: str
    label: str
    count: int

    model_config = ConfigDict(frozen=True)


class AgentAvailabilityFilterOption(AgentFilterOption):
    value: AgentAvailability


class AgentCatalogFilters(BaseModel):
    competencies: list[AgentFilterOption] = Field(default_factory=list)
    availability: list[AgentAvailabilityFilterOption] = Field(default_factory=list)

    model_config = ConfigDict(frozen=True)


class AgentCatalogItem(BaseModel):
    slug: str
    name: str
    tagline: str
    description: str
    role: str
    competencies: list[str]
    availability: AgentAvailability
    availability_label: str
    response_time_minutes: int | None = None
    automation_level: str | None = None
    integrations: list[str] = Field(default_factory=list)
    languages: list[str] = Field(default_factory=list)

    model_config = ConfigDict(frozen=True)


class AgentCatalogPage(BaseModel):
    items: list[AgentCatalogItem]
    pagination: PaginationMeta
    available_filters: AgentCatalogFilters

    model_config = ConfigDict(frozen=True)


@dataclass(frozen=True)
class _AgentData:
    slug: str
    name: str
    tagline: str
    description: str
    role: str
    competencies: tuple[str, ...]
    availability: AgentAvailability
    availability_label: str
    response_time_minutes: int | None = None
    automation_level: str | None = None
    integrations: tuple[str, ...] = ()
    languages: tuple[str, ...] = ()


_CATALOG: tuple[_AgentData, ...] = (
    _AgentData(
        slug="concierge-digital",
        name="Concierge Digital",
        tagline="Upsell automatizado com orquestração omnicanal",
        description=(
            "Atende hóspedes via chat, e-mail e WhatsApp, sugerindo upgrades e experiências "
            "com base em dados do CRM e comportamento de reservas."
        ),
        role="guest_experience",
        competencies=(
            "Upsell de experiências",
            "Integração com CRM",
            "Orquestração WhatsApp",
        ),
        availability=AgentAvailability.AVAILABLE,
        availability_label="Disponível",
        response_time_minutes=2,
        automation_level="Autónomo",
        integrations=("Salesforce", "Twilio", "Engine de reservas"),
        languages=("pt-PT", "en-US"),
    ),
    _AgentData(
        slug="maintenance-orchestrator",
        name="Orquestrador de Manutenção",
        tagline="Fluxos corretivos com escalonamento inteligente",
        description=(
            "Prioriza tickets técnicos a partir de alertas IoT, gera planos de ação e controla "
            "SLAs com equipas internas e fornecedores especializados."
        ),
        role="operations",
        competencies=(
            "Workflows corretivos",
            "Alertas IoT",
            "Gestão de SLA",
        ),
        availability=AgentAvailability.LIMITED,
        availability_label="Disponibilidade limitada",
        response_time_minutes=15,
        automation_level="Assistido",
        integrations=("BMS", "IoT Hub"),
        languages=("pt-PT",),
    ),
    _AgentData(
        slug="revenue-assistant",
        name="Assistente de Revenue",
        tagline="Recomendações tarifárias com inteligência competitiva",
        description=(
            "Analisa procura, concorrência e mix de canais para recomendar ajustes dinâmicos "
            "de tarifa, pacotes e restrições."
        ),
        role="revenue_management",
        competencies=(
            "Recomendações tarifárias",
            "Monitorização de concorrentes",
            "Forecasting de procura",
        ),
        availability=AgentAvailability.MAINTENANCE,
        availability_label="Em manutenção",
        response_time_minutes=None,
        automation_level="Supervisionado",
        integrations=("Channel manager", "BI corporativo"),
        languages=("pt-PT", "es-ES"),
    ),
    _AgentData(
        slug="guest-relations-ai",
        name="Gestor de Reputação",
        tagline="Respostas inteligentes para reviews e redes sociais",
        description=(
            "Classifica sentimentos, sugere respostas alinhadas ao tom da marca e identifica "
            "tendências críticas em reviews públicos."
        ),
        role="guest_experience",
        competencies=(
            "Análise de sentimentos",
            "Gestão de reputação",
            "Integração OTA",
        ),
        availability=AgentAvailability.AVAILABLE,
        availability_label="Disponível",
        response_time_minutes=4,
        automation_level="Autónomo",
        integrations=("ReviewPro", "OTA Insights"),
        languages=("pt-PT", "en-US", "fr-FR"),
    ),
    _AgentData(
        slug="housekeeping-optimizer",
        name="Orquestrador de Housekeeping",
        tagline="Roteamento inteligente e sincronização operacional",
        description=(
            "Gera planos de limpeza baseados em reservas, integra-se com PMS e ajusta rotas "
            "em tempo real conforme prioridades do hóspede."
        ),
        role="operations",
        competencies=(
            "Roteamento inteligente",
            "Análise de produtividade",
            "Sincronização com PMS",
        ),
        availability=AgentAvailability.AVAILABLE,
        availability_label="Disponível",
        response_time_minutes=6,
        automation_level="Autónomo",
        integrations=("PMS", "Aplicação móvel de housekeeping"),
        languages=("pt-PT", "en-US"),
    ),
    _AgentData(
        slug="events-coordinator",
        name="Coordenador de Eventos",
        tagline="Gestão integrada de eventos corporativos",
        description=(
            "Orquestra briefings, logística e fornecedores para eventos híbridos, garantindo "
            "alinhamento com equipas F&B e AV."
        ),
        role="sales",
        competencies=(
            "Gestão de eventos",
            "Integração com CRM",
            "Orquestração F&B",
        ),
        availability=AgentAvailability.LIMITED,
        availability_label="Janela limitada",
        response_time_minutes=20,
        automation_level="Assistido",
        integrations=("CRM", "Plataforma de eventos"),
        languages=("pt-PT", "en-US"),
    ),
)


def _build_filters(items: Sequence[AgentCatalogItem]) -> AgentCatalogFilters:
    competency_counter: Counter[str] = Counter()
    availability_counter: Counter[AgentAvailability] = Counter()
    availability_labels: dict[AgentAvailability, str] = {}

    for item in items:
        for competency in item.competencies:
            competency_counter[competency] += 1
        availability_counter[item.availability] += 1
        availability_labels.setdefault(item.availability, item.availability_label)

    competency_filters = [
        AgentFilterOption(value=name, label=name, count=count)
        for name, count in sorted(competency_counter.items(), key=lambda entry: entry[0].lower())
    ]

    availability_filters = [
        AgentAvailabilityFilterOption(
            value=status,
            label=availability_labels.get(status, status.value.title()),
            count=count,
        )
        for status, count in sorted(availability_counter.items(), key=lambda entry: entry[0].value)
    ]

    return AgentCatalogFilters(
        competencies=competency_filters,
        availability=availability_filters,
    )


def _normalize_values(values: Iterable[str]) -> set[str]:
    return {value.strip().lower() for value in values if value and value.strip()}


def list_agent_catalog(
    *,
    competencies: Sequence[str] | None = None,
    availability: Sequence[AgentAvailability] | None = None,
    page: int = 1,
    page_size: int = 6,
) -> AgentCatalogPage:
    page = max(1, page)
    page_size = max(1, min(page_size, 50))

    items = [AgentCatalogItem(**data.__dict__) for data in _CATALOG]
    available_filters = _build_filters(items)

    competency_filters = _normalize_values(competencies or [])
    availability_filters = set(availability or [])

    def _matches(item: AgentCatalogItem) -> bool:
        if competency_filters and not competency_filters.issubset(
            _normalize_values(item.competencies)
        ):
            return False
        if availability_filters and item.availability not in availability_filters:
            return False
        return True

    filtered_items = [item for item in items if _matches(item)]
    total = len(filtered_items)

    if total == 0:
        pagination = PaginationMeta(page=1, page_size=page_size, total=0, total_pages=0)
        return AgentCatalogPage(items=[], pagination=pagination, available_filters=available_filters)

    total_pages = ceil(total / page_size)
    current_page = min(page, total_pages)
    start_index = (current_page - 1) * page_size
    end_index = start_index + page_size

    paginated_items = filtered_items[start_index:end_index]
    pagination = PaginationMeta(
        page=current_page,
        page_size=page_size,
        total=total,
        total_pages=total_pages,
    )

    return AgentCatalogPage(
        items=paginated_items,
        pagination=pagination,
        available_filters=available_filters,
    )
