"""Public API surface for partner marketplace operations."""

from __future__ import annotations

from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field

from ..marketplace import (
    ConsentScope,
    InstallationConsent,
    MarketplaceService,
    PartnerApp,
    PartnerInstallRequest,
    PublicContract,
    RateLimitExceeded,
)

router = APIRouter(prefix="/marketplace", tags=["Marketplace"])


class PartnerAppRead(BaseModel):
    id: str
    name: str
    description: str
    categories: list[str]
    icon_url: str | None = None
    contract_version: str = Field(..., alias="contractVersion")
    sandbox_only: bool = Field(False, alias="sandboxOnly")

    @classmethod
    def from_entity(cls, app: PartnerApp) -> "PartnerAppRead":
        return cls(
            id=app.id,
            name=app.name,
            description=app.description,
            categories=list(app.categories),
            icon_url=app.icon_url,
            contractVersion=app.contract.version,
            sandboxOnly=app.sandbox_only,
        )


class ContractRead(BaseModel):
    version: str
    summary: str
    scopes: list[ConsentScope]
    webhook_endpoints: list[str] = Field(alias="webhookEndpoints")
    rate_limit_per_minute: int = Field(alias="rateLimitPerMinute")
    sandbox_required: bool = Field(alias="sandboxRequired")

    @classmethod
    def from_entity(cls, contract: PublicContract) -> "ContractRead":
        return cls(
            version=contract.version,
            summary=contract.summary,
            scopes=list(contract.scopes),
            webhookEndpoints=list(contract.webhook_endpoints),
            rateLimitPerMinute=contract.rate_limit_per_minute,
            sandboxRequired=contract.sandbox_required,
        )


class InstallRequestBody(BaseModel):
    workspace_id: str = Field(..., alias="workspaceId")
    scopes: list[ConsentScope]
    granted_by: str = Field(..., alias="grantedBy")
    sandbox_requested: bool = Field(False, alias="sandboxRequested")
    correlation_id: str | None = Field(default=None, alias="correlationId")


class InstallResponse(BaseModel):
    sandbox_id: str | None = Field(default=None, alias="sandboxId")
    expires_at: datetime | None = Field(default=None, alias="expiresAt")
    credentials: dict[str, str] | None = None


class AuditRead(BaseModel):
    timestamp: datetime
    action: str
    actor: str
    metadata: dict[str, str]


_marketplace_service: MarketplaceService | None = None


def get_marketplace_service() -> MarketplaceService:
    global _marketplace_service
    if _marketplace_service is None:
        service = MarketplaceService()
        # Seed catalogue with a few curated partner apps for quick experimentation.
        service.register(
            PartnerApp(
                id="smart-pricing",
                name="Smart Pricing AI",
                description="Automated pricing updates using ML-driven demand forecasts.",
                categories=["Revenue", "Automation"],
                contract=PublicContract(
                    version="2024-05-01",
                    summary="AI powered pricing suggestions with revenue share billing",
                    scopes=[ConsentScope.BOOKINGS, ConsentScope.ANALYTICS],
                    webhook_endpoints=["https://smart-pricing.example/hooks/pricing"],
                    rate_limit_per_minute=90,
                    sandbox_required=True,
                ),
            )
        )
        service.register(
            PartnerApp(
                id="housekeeping-pro",
                name="Housekeeping Pro",
                description="Optimize housekeeping routes and staffing via predictive insights.",
                categories=["Operations", "Automation"],
                contract=PublicContract(
                    version="2024-04-18",
                    summary="Staff scheduling and workflow automation for cleaning teams",
                    scopes=[ConsentScope.PROFILE, ConsentScope.BOOKINGS],
                    webhook_endpoints=["https://hooks.housekeeping.pro/events"],
                ),
                icon_url="https://cdn.bmad.io/marketplace/housekeeping-pro.svg",
            )
        )
        service.register(
            PartnerApp(
                id="payments-360",
                name="Payments 360",
                description="Unified ledger, reconciliation, and payouts automation.",
                categories=["Finance", "Compliance"],
                contract=PublicContract(
                    version="2024-03-30",
                    summary="Real time payment reconciliation with risk scoring",
                    scopes=[ConsentScope.PAYMENTS, ConsentScope.ANALYTICS],
                    webhook_endpoints=["https://payments360.example/webhooks"],
                    rate_limit_per_minute=60,
                ),
                sandbox_only=True,
            )
        )
        _marketplace_service = service
    return _marketplace_service


@router.get("/apps", response_model=list[PartnerAppRead])
def list_apps(
    categories: list[str] | None = Query(None, description="Filter by category"),
    service: MarketplaceService = Depends(get_marketplace_service),
) -> list[PartnerAppRead]:
    apps = service.list(categories=categories)
    return [PartnerAppRead.from_entity(app) for app in apps]


@router.get("/apps/{partner_id}/contract", response_model=ContractRead)
def get_contract(
    partner_id: str,
    service: MarketplaceService = Depends(get_marketplace_service),
) -> ContractRead:
    try:
        contract = service.get_contract(partner_id)
    except Exception as exc:  # pragma: no cover - FastAPI handles
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    return ContractRead.from_entity(contract)


@router.post("/apps/{partner_id}/install", response_model=InstallResponse, status_code=status.HTTP_202_ACCEPTED)
def request_install(
    partner_id: str,
    payload: InstallRequestBody,
    service: MarketplaceService = Depends(get_marketplace_service),
) -> InstallResponse:
    consent = InstallationConsent(
        granted_scopes=payload.scopes,
        granted_by=payload.granted_by,
    )
    try:
        sandbox = service.request_install(
            PartnerInstallRequest(
                partner_id=partner_id,
                workspace_id=payload.workspace_id,
                consent=consent,
                sandbox_requested=payload.sandbox_requested,
                correlation_id=payload.correlation_id,
            )
        )
    except RateLimitExceeded as exc:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=str(exc)) from exc
    except PermissionError as exc:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc

    if sandbox:
        return InstallResponse(
            sandboxId=sandbox.id,
            expiresAt=sandbox.expires_at,
            credentials=sandbox.credentials,
        )
    return InstallResponse()


@router.get("/apps/{partner_id}/audit", response_model=list[AuditRead])
def list_audit(
    partner_id: str,
    service: MarketplaceService = Depends(get_marketplace_service),
) -> list[AuditRead]:
    events = service.list_audit_events(partner_id)
    return [
        AuditRead(
            timestamp=event.timestamp,
            action=event.action,
            actor=event.actor,
            metadata=event.metadata,
        )
        for event in events
    ]
