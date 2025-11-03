'use client';

import { useMemo, useState } from 'react';

import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ResponsiveGrid } from '@/components/layout/ResponsiveGrid';
import { StatusBadge } from '@/components/ui/StatusBadge';

type PropertyRef = {
  id: number;
  name: string;
};

type RolePolicy = {
  id: number;
  role: string;
  name: string;
  persona: string;
  property: PropertyRef | null;
  permissions: string[];
  isDefault: boolean;
  updatedAt: string;
  owner: string;
};

type AuditEntry = {
  id: number;
  action: string;
  detail: string;
  actor: string;
  occurredAt: string;
};

const rolePolicies: RolePolicy[] = [
  {
    id: 1,
    role: 'admin',
    name: 'Administrador Global',
    persona: 'corporate',
    property: null,
    permissions: [
      'governance.roles.read',
      'governance.roles.manage',
      'governance.permissions.manage',
      'governance.audit.export'
    ],
    isDefault: true,
    updatedAt: '2024-07-21T10:00:00Z',
    owner: 'Laura (Segurança)'
  },
  {
    id: 2,
    role: 'property_manager',
    name: 'Gestor Operacional Premium',
    persona: 'operacional',
    property: { id: 10, name: 'Residencial Atlântico' },
    permissions: [
      'governance.roles.read',
      'governance.audit.export',
      'reservations.manage',
      'housekeeping.schedule'
    ],
    isDefault: false,
    updatedAt: '2024-07-19T09:30:00Z',
    owner: 'Bruno (Operações)'
  },
  {
    id: 3,
    role: 'housekeeping',
    name: 'Housekeeping On-site',
    persona: 'field',
    property: { id: 4, name: 'Hotel Aurora' },
    permissions: ['housekeeping.update_self', 'governance.roles.read'],
    isDefault: false,
    updatedAt: '2024-07-18T15:20:00Z',
    owner: 'Camila (Facilities)'
  },
  {
    id: 4,
    role: 'ota',
    name: 'Channel Manager OTA',
    persona: 'partner',
    property: null,
    permissions: ['governance.roles.read', 'ota.sync.monitor'],
    isDefault: true,
    updatedAt: '2024-07-17T11:05:00Z',
    owner: 'Equipe Integrations'
  }
];

const auditTrail: AuditEntry[] = [
  {
    id: 341,
    action: 'role_policy_created',
    detail: 'Gestor Operacional Premium vinculado à Residencial Atlântico',
    actor: 'Laura (Segurança)',
    occurredAt: '2024-07-19T09:30:45Z'
  },
  {
    id: 342,
    action: 'permission_created',
    detail: 'Permissão reservations.manage adicionada ao catálogo',
    actor: 'Laura (Segurança)',
    occurredAt: '2024-07-19T09:31:02Z'
  },
  {
    id: 355,
    action: 'role_policy_deleted',
    detail: 'Exceção temporária exception::jira-OPS-142 removida',
    actor: 'CISO',
    occurredAt: '2024-07-20T17:58:12Z'
  }
];

function exportAuditCsv(entries: AuditEntry[]) {
  const header = 'timestamp,action,detail,actor\n';
  const rows = entries
    .map((entry) =>
      [entry.occurredAt, entry.action, entry.detail.replace(/"/g, "''"), entry.actor]
        .map((value) => `"${value}"`)
        .join(',')
    )
    .join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'governanca-audit.csv';
  link.click();
  URL.revokeObjectURL(url);
}

function exportAuditPdf(entries: AuditEntry[]) {
  const popup = window.open('', '_blank');
  if (!popup) {
    return;
  }
  const rows = entries
    .map(
      (entry) =>
        `<tr><td>${entry.occurredAt}</td><td>${entry.action}</td><td>${entry.detail}</td><td>${entry.actor}</td></tr>`
    )
    .join('');
  popup.document.write(`
    <html>
      <head>
        <title>Trilha de auditoria</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 16px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background: #f4f6fb; }
        </style>
      </head>
      <body>
        <h1>Trilha de auditoria - Governança</h1>
        <table>
          <thead>
            <tr>
              <th>Quando</th>
              <th>Ação</th>
              <th>Detalhe</th>
              <th>Responsável</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
    </html>
  `);
  popup.document.close();
  popup.focus();
  popup.print();
  popup.close();
}

export default function GovernancaPage() {
  const [selectedPersona, setSelectedPersona] = useState<string>('todas');
  const [selectedProperty, setSelectedProperty] = useState<number | 'todas'>('todas');

  const personaOptions = useMemo(() => {
    const personas = new Set(rolePolicies.map((policy) => policy.persona));
    return ['todas', ...Array.from(personas)];
  }, []);

  const propertyOptions = useMemo(() => {
    const properties = new Map<number, string>();
    rolePolicies.forEach((policy) => {
      if (policy.property) {
        properties.set(policy.property.id, policy.property.name);
      }
    });
    return ['todas', ...Array.from(properties.entries())];
  }, []);

  const filteredPolicies = useMemo(() => {
    return rolePolicies.filter((policy) => {
      const personaMatches = selectedPersona === 'todas' || policy.persona === selectedPersona;
      const propertyMatches =
        selectedProperty === 'todas' || policy.property?.id === selectedProperty;
      return personaMatches && propertyMatches;
    });
  }, [selectedPersona, selectedProperty]);

  return (
    <div>
      <SectionHeader subtitle="Papéis, permissões e auditoria alinhados ao BL-05">
        Governança &amp; Segurança
      </SectionHeader>
      <ResponsiveGrid columns={3}>
        <Card title="Resumo" description="Visão agregada das políticas ativas" accent="info">
          <ul>
            <li>Políticas ativas: {rolePolicies.length}</li>
            <li>Customizações por propriedade: {rolePolicies.filter((p) => p.property).length}</li>
            <li>Última atualização: 20/07/2024 17:58Z</li>
          </ul>
        </Card>
        <Card title="Filtros" description="Personas e propriedades" accent="success">
          <div className="filters">
            <label htmlFor="persona-select">
              Persona
              <select
                id="persona-select"
                value={selectedPersona}
                onChange={(event) => setSelectedPersona(event.target.value)}
              >
                {personaOptions.map((persona) => (
                  <option key={persona} value={persona}>
                    {persona === 'todas' ? 'Todas as personas' : persona}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="property-select">
              Propriedade
              <select
                id="property-select"
                value={selectedProperty}
                onChange={(event) =>
                  setSelectedProperty(
                    event.target.value === 'todas' ? 'todas' : Number.parseInt(event.target.value, 10)
                  )
                }
              >
                {propertyOptions.map((option) =>
                  typeof option === 'string' ? (
                    <option key={option} value={option}>
                      Todas as propriedades
                    </option>
                  ) : (
                    <option key={option[0]} value={option[0]}>
                      {option[1]}
                    </option>
                  )
                )}
              </select>
            </label>
          </div>
          <p className="filters__result">{filteredPolicies.length} políticas compatíveis</p>
        </Card>
        <Card
          title="Trilha rápida"
          description="Exportações CSV/PDF disponíveis na secção de auditoria"
          accent="warning"
        >
          <p>
            Acompanhe o log consolidado com `governance.audit.view` e valide STRIDE em cada exceção
            aprovada.
          </p>
          <p>
            Para exceções, utilize persona `exception::` e programe rollback automático na data limite.
          </p>
        </Card>
      </ResponsiveGrid>

      <section aria-labelledby="roles-heading">
        <h2 id="roles-heading">Políticas por papel</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Papel</th>
                <th>Nome</th>
                <th>Persona</th>
                <th>Propriedade</th>
                <th>Permissões</th>
                <th>Atualizado</th>
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              {filteredPolicies.map((policy) => (
                <tr key={policy.id}>
                  <td>
                    <div className="role-cell">
                      <span>{policy.role}</span>
                      <StatusBadge variant={policy.isDefault ? 'info' : 'success'}>
                        {policy.isDefault ? 'Padrão' : 'Custom'}
                      </StatusBadge>
                    </div>
                  </td>
                  <td>{policy.name}</td>
                  <td>{policy.persona}</td>
                  <td>{policy.property ? policy.property.name : 'Global'}</td>
                  <td>
                    <ul className="permissions">
                      {policy.permissions.map((permission) => (
                        <li key={permission}>{permission}</li>
                      ))}
                    </ul>
                  </td>
                  <td>{new Date(policy.updatedAt).toLocaleString('pt-PT')}</td>
                  <td>{policy.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="audit-heading" className="audit-section">
        <Card
          title="Trilha de auditoria"
          description="Últimas ações registradas nos endpoints /governance"
          accent="info"
        >
          <div className="audit-actions">
            <button type="button" onClick={() => exportAuditCsv(auditTrail)}>
              Exportar CSV
            </button>
            <button type="button" onClick={() => exportAuditPdf(auditTrail)}>
              Exportar PDF
            </button>
          </div>
          <ul className="audit-list">
            {auditTrail.map((entry) => (
              <li key={entry.id}>
                <span className="audit-list__timestamp">
                  {new Date(entry.occurredAt).toLocaleString('pt-PT')}
                </span>
                <span className="audit-list__action">{entry.action}</span>
                <span className="audit-list__detail">{entry.detail}</span>
                <span className="audit-list__actor">{entry.actor}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <style jsx>{`
        ul {
          margin: 0;
          padding-left: var(--space-5);
          display: grid;
          gap: var(--space-2);
        }
        section {
          margin-top: var(--space-6);
        }
        h2 {
          font-size: 1.5rem;
          margin: var(--space-5) 0 var(--space-3);
        }
        .table-wrapper {
          overflow-x: auto;
          background: var(--color-neutral-0);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-neutral-4);
        }
        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 720px;
        }
        th,
        td {
          padding: var(--space-3);
          text-align: left;
          border-bottom: 1px solid var(--color-neutral-3);
          vertical-align: top;
        }
        th {
          background: var(--color-neutral-5);
          font-weight: 600;
        }
        .role-cell {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }
        .permissions {
          list-style: none;
          padding-left: 0;
        }
        .permissions li {
          background: var(--color-neutral-5);
          border-radius: var(--radius-sm);
          padding: 2px 6px;
          display: inline-flex;
          margin-right: var(--space-2);
          margin-bottom: var(--space-2);
        }
        .filters {
          display: grid;
          gap: var(--space-3);
        }
        label {
          display: flex;
          flex-direction: column;
          font-weight: 600;
          gap: var(--space-2);
        }
        select {
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-neutral-3);
          padding: var(--space-2);
        }
        .filters__result {
          margin-top: var(--space-3);
          font-size: 0.875rem;
          color: var(--color-deep-blue);
        }
        .audit-actions button {
          border: none;
          border-radius: var(--radius-sm);
          background: var(--color-deep-blue);
          color: #fff;
          padding: var(--space-2) var(--space-4);
          font-weight: 600;
          cursor: pointer;
        }
        .audit-actions {
          display: flex;
          gap: var(--space-2);
          margin-bottom: var(--space-3);
        }
        .audit-list {
          list-style: none;
          padding-left: 0;
          margin: 0;
          display: grid;
          gap: var(--space-3);
        }
        .audit-list li {
          display: grid;
          grid-template-columns: 160px 180px 1fr 200px;
          gap: var(--space-3);
          font-size: 0.9rem;
          align-items: center;
        }
        .audit-list__timestamp {
          font-variant-numeric: tabular-nums;
          color: var(--color-neutral-7);
        }
        .audit-list__action {
          font-weight: 600;
        }
        .audit-list__detail {
          color: var(--color-neutral-8);
        }
        .audit-list__actor {
          justify-self: end;
          color: var(--color-deep-blue);
          font-weight: 500;
        }
        @media (max-width: 960px) {
          .audit-list li {
            grid-template-columns: 1fr;
            gap: var(--space-1);
          }
          .audit-list__actor {
            justify-self: start;
          }
        }
      `}</style>
    </div>
  );
}
