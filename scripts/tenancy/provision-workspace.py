#!/usr/bin/env python3
"""Provisiona workspaces multi-tenant com integrações essenciais."""

from __future__ import annotations

import argparse
import logging
import os
from typing import Any

from services.core.config import CoreSettings
from services.core.database import get_database
from services.core.domain.schemas import PropertyCreate, WorkspaceCreate
from services.core.services import PropertyService, WorkspaceService
from services.core.tenancy import create_tenant_manager

logger = logging.getLogger("tenancy.provision")
logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Provisiona um workspace isolado por tenant")
    parser.add_argument("tenant_slug", help="Slug do tenant a ser provisionado")
    parser.add_argument("workspace_name", help="Nome do workspace a ser criado")
    parser.add_argument("--tenant-name", dest="tenant_name", help="Nome descritivo do tenant")
    parser.add_argument("--timezone", default="UTC", help="Timezone principal do workspace")
    parser.add_argument("--team-size", type=int, default=5, help="Tamanho da equipa principal")
    parser.add_argument("--primary-use-case", default="operations", help="Caso de uso principal do workspace")
    parser.add_argument("--communication-channel", default="slack", help="Canal de comunicação preferido")
    parser.add_argument("--plan", default="growth", help="Plano comercial associado ao tenant")
    parser.add_argument("--address", default="", help="Endereço principal da propriedade inicial")
    parser.add_argument("--units", type=int, default=10, help="Número de unidades da propriedade inicial")
    parser.add_argument("--owner-email", default=None, help="Email de referência para faturação")
    return parser.parse_args()


def _provision_iam(tenant_slug: str, workspace_id: int) -> dict[str, Any]:
    logger.info("Provisionando IAM para %s", tenant_slug)
    return {
        "role_arn": f"arn:aws:iam::123456789012:role/bmad/{tenant_slug}/workspace-{workspace_id}",
        "permissions_boundary": "bmad-core-tenant",
    }


def _provision_billing(tenant_slug: str, owner_email: str | None) -> dict[str, Any]:
    logger.info("Provisionando billing para %s", tenant_slug)
    account_code = f"BILL-{tenant_slug.upper()}"
    return {
        "account_code": account_code,
        "owner_email": owner_email,
        "status": "active",
    }


def _configure_observability(tenant_slug: str) -> dict[str, Any]:
    logger.info("Ativando observabilidade isolada para %s", tenant_slug)
    return {
        "dataset": f"otel-{tenant_slug}",
        "dashboards": ["core-operations", "sla-health"],
        "alerts": ["error-rate", "latency"],
    }


def main() -> None:
    args = _parse_args()
    environ = dict(os.environ)
    settings = CoreSettings.from_environ(environ)
    database = get_database(settings)
    tenant_manager = create_tenant_manager(settings, database)

    with database.session_scope() as session:
        tenant = tenant_manager.ensure_tenant(
            session,
            args.tenant_slug,
            args.tenant_name or args.workspace_name,
            attributes={"plan": args.plan},
        )
        tenant_manager.bind_session(session, tenant)

        workspace_service = WorkspaceService(session, tenant_manager=tenant_manager)
        workspace_payload = WorkspaceCreate(
            name=args.workspace_name,
            timezone=args.timezone,
            team_size=args.team_size,
            primary_use_case=args.primary_use_case,
            communication_channel=args.communication_channel,
            quarterly_goal="Expandir operações com qualidade",
            invite_emails=[args.owner_email] if args.owner_email else [],
            team_roles=["operations", "frontdesk"],
            enable_sandbox=True,
            require_mfa=True,
        )
        workspace = workspace_service.create(workspace_payload)

        property_service = PropertyService(session, tenant_manager=tenant_manager)
        property_payload = PropertyCreate(
            name=f"{args.workspace_name} Propriedade",
            timezone=args.timezone,
            address=args.address or None,
            units=args.units,
        )
        property_obj = property_service.create(property_payload)

        iam_info = _provision_iam(tenant.slug, workspace.id)
        billing_info = _provision_billing(tenant.slug, args.owner_email)
        observability_info = _configure_observability(tenant.slug)

        session.flush()

    summary = {
        "tenant": tenant.slug,
        "workspace": {
            "id": workspace.id,
            "slug": workspace.slug,
            "timezone": workspace.timezone,
        },
        "property": {
            "id": property_obj.id,
            "units": property_obj.units,
        },
        "iam": iam_info,
        "billing": billing_info,
        "observability": observability_info,
    }

    logger.info("Provisionamento concluído: %s", summary)


+if __name__ == "__main__":
+    main()
