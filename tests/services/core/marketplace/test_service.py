import pytest

from services.core.marketplace import (
    ConsentScope,
    InstallationConsent,
    MarketplaceService,
    PartnerApp,
    PartnerInstallRequest,
    PublicContract,
    RateLimitExceeded,
)


@pytest.fixture()
def service() -> MarketplaceService:
    service = MarketplaceService()
    service.register(
        PartnerApp(
            id="smart-pricing",
            name="Smart Pricing AI",
            description="",
            categories=["Revenue"],
            contract=PublicContract(
                version="1",
                summary="",
                scopes=[ConsentScope.BOOKINGS, ConsentScope.ANALYTICS],
                webhook_endpoints=["https://example.com"],
                rate_limit_per_minute=2,
                sandbox_required=True,
            ),
        )
    )
    return service


def test_request_install_provisions_sandbox_and_audit(service: MarketplaceService) -> None:
    consent = InstallationConsent(
        granted_scopes=[ConsentScope.BOOKINGS],
        granted_by="ana@bmad.example",
    )
    sandbox = service.request_install(
        PartnerInstallRequest(
            partner_id="smart-pricing",
            workspace_id="ws-1",
            consent=consent,
            sandbox_requested=True,
        )
    )
    assert sandbox is not None
    events = service.list_audit_events("smart-pricing")
    assert any(event.action == "install.requested" for event in events)
    assert any(event.action == "sandbox.issued" for event in events)


def test_request_install_rejects_extra_scopes(service: MarketplaceService) -> None:
    consent = InstallationConsent(
        granted_scopes=[ConsentScope.PAYMENTS],
    )
    request = PartnerInstallRequest(
        partner_id="smart-pricing",
        workspace_id="ws-1",
        consent=consent,
        sandbox_requested=True,
    )
    with pytest.raises(PermissionError):
        service.request_install(request)


def test_rate_limiting(service: MarketplaceService) -> None:
    consent = InstallationConsent(
        granted_scopes=[ConsentScope.BOOKINGS],
        granted_by="ana@bmad.example",
    )
    request = PartnerInstallRequest(
        partner_id="smart-pricing",
        workspace_id="ws-1",
        consent=consent,
        sandbox_requested=True,
    )
    service.request_install(request)
    service.request_install(request)
    with pytest.raises(RateLimitExceeded):
        service.request_install(request)


def test_list_filters_by_category(service: MarketplaceService) -> None:
    apps = service.list(categories=["Revenue"])
    assert len(apps) == 1
    apps = service.list(categories=["Automation"])
    assert not apps
