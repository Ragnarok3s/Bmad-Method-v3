from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from services.core.config import CoreSettings, TenantSettings
from services.core.main import build_application


pytestmark = pytest.mark.integration


def build_client(tmp_path) -> TestClient:
    settings = CoreSettings(
        database_url=f"sqlite:///{tmp_path}/governanca.db",
        tenancy=TenantSettings(platform_token="platform-secret"),
    )
    app = build_application(settings)
    return TestClient(app, headers={"x-tenant-slug": settings.tenancy.default_slug})


def test_governance_permission_crud_and_audit(tmp_path) -> None:
    client = build_client(tmp_path)

    admin = client.post(
        '/agents',
        json={'name': 'Admin', 'email': 'admin@example.com', 'role': 'admin'},
    ).json()

    create_response = client.post(
        '/governance/permissions',
        headers={'X-Actor-Id': str(admin['id'])},
        json={
            'key': 'governance.custom.report',
            'label': 'Relatórios customizados',
            'description': 'Permite gerar relatórios específicos de auditoria',
            'category': 'governanca'
        },
    )
    assert create_response.status_code == 201
    permission_id = create_response.json()['id']

    update_response = client.patch(
        f'/governance/permissions/{permission_id}',
        headers={'X-Actor-Id': str(admin['id'])},
        json={'description': 'Relatórios customizados e exportações avançadas'},
    )
    assert update_response.status_code == 200
    assert update_response.json()['description'].startswith('Relatórios customizados')

    list_response = client.get('/governance/permissions', headers={'X-Actor-Id': str(admin['id'])})
    assert list_response.status_code == 200
    keys = [item['key'] for item in list_response.json()]
    assert 'governance.custom.report' in keys

    audit_response = client.get('/governance/audit', headers={'X-Actor-Id': str(admin['id'])})
    assert audit_response.status_code == 200
    assert any(entry['action'] == 'permission_created' for entry in audit_response.json())

    missing_actor = client.get('/governance/permissions')
    assert missing_actor.status_code == 401


def test_governance_roles_filters_and_authorization(tmp_path) -> None:
    client = build_client(tmp_path)

    admin = client.post(
        '/agents',
        json={'name': 'Laura', 'email': 'laura@example.com', 'role': 'admin'},
    ).json()
    manager = client.post(
        '/agents',
        json={'name': 'Bruno', 'email': 'bruno@example.com', 'role': 'property_manager'},
    ).json()

    property_payload = {
        'name': 'Residencial Atlântico',
        'timezone': 'Europe/Lisbon',
        'address': 'Rua das Flores, 100',
        'units': 18,
    }
    property_id = client.post('/properties', json=property_payload).json()['id']

    forbidden = client.post(
        '/governance/permissions',
        headers={'X-Actor-Id': str(manager['id'])},
        json={
            'key': 'governance.temp',
            'label': 'Permissão temporária',
            'description': 'Teste de acesso',
            'category': 'teste'
        },
    )
    assert forbidden.status_code == 403

    client.post(
        '/governance/permissions',
        headers={'X-Actor-Id': str(admin['id'])},
        json={
            'key': 'reservations.override',
            'label': 'Override de reservas',
            'description': 'Permite forçar reservas em conflito',
            'category': 'reservas'
        },
    )

    role_response = client.post(
        '/governance/roles',
        headers={'X-Actor-Id': str(admin['id'])},
        json={
            'role': 'property_manager',
            'name': 'Gestor Atlântico',
            'persona': 'operacional',
            'property_id': property_id,
            'permissions': ['reservations.override'],
            'inherits': ['housekeeping'],
            'is_default': False
        },
    )
    assert role_response.status_code == 201

    filtered_by_property = client.get(
        '/governance/roles',
        headers={'X-Actor-Id': str(manager['id'])},
        params={'property_id': property_id},
    )
    assert filtered_by_property.status_code == 200
    assert filtered_by_property.json()[0]['property_id'] == property_id

    filtered_by_persona = client.get(
        '/governance/roles',
        headers={'X-Actor-Id': str(manager['id'])},
        params={'persona': 'operacional'},
    )
    assert filtered_by_persona.status_code == 200
    assert all(item['persona'] == 'operacional' for item in filtered_by_persona.json())

    audit_response = client.get('/governance/audit', headers={'X-Actor-Id': str(admin['id'])})
    assert any(entry['action'] == 'role_policy_created' for entry in audit_response.json())
