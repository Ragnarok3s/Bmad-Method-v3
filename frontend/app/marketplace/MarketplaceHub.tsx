'use client';

import { useMemo, useState } from 'react';

import { FilterPill } from '@/components/ui/FilterPill';

const CATEGORIES = [
  'Revenue',
  'Automation',
  'Finance',
  'Operations',
  'Compliance',
  'Guest Experience'
];

const MARKETPLACE_APPS = [
  {
    id: 'smart-pricing',
    name: 'Smart Pricing AI',
    shortDescription: 'Machine learning forecasts that push smart prices to your PMS.',
    categories: ['Revenue', 'Automation'],
    scopes: ['bookings', 'analytics'],
    rating: 4.8,
    installs: 287,
    sandboxOnly: false,
    icon: '🤖'
  },
  {
    id: 'guest-messaging',
    name: 'Guest Messaging Studio',
    shortDescription: 'Unified guest inbox with workflows, AI replies and translation.',
    categories: ['Guest Experience', 'Automation'],
    scopes: ['profile', 'bookings'],
    rating: 4.6,
    installs: 402,
    sandboxOnly: false,
    icon: '💬'
  },
  {
    id: 'payments-360',
    name: 'Payments 360',
    shortDescription: 'Ledger, reconciliation and dispute tooling for every payment provider.',
    categories: ['Finance', 'Compliance'],
    scopes: ['payments', 'analytics'],
    rating: 4.9,
    installs: 132,
    sandboxOnly: true,
    icon: '💳'
  },
  {
    id: 'housekeeping-pro',
    name: 'Housekeeping Pro',
    shortDescription: 'Predictive cleaning routes, mobile checklists and inventory visibility.',
    categories: ['Operations', 'Automation'],
    scopes: ['profile', 'bookings'],
    rating: 4.4,
    installs: 196,
    sandboxOnly: false,
    icon: '🧽'
  }
] as const;

const SHOWCASES = [
  {
    title: 'Lançamentos',
    description: 'Novas integrações verificadas pelo time BMAD.',
    appIds: ['smart-pricing', 'guest-messaging']
  },
  {
    title: 'Operações Inteligentes',
    description: 'Automatize o operacional e mantenha a equipe alinhada.',
    appIds: ['housekeeping-pro', 'smart-pricing']
  }
];

type MarketplaceApp = (typeof MARKETPLACE_APPS)[number];

type InstallState = {
  consent: Record<string, boolean>;
  sandbox: boolean;
};

const defaultInstallState: InstallState = {
  consent: {},
  sandbox: true
};

export function MarketplaceHub() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedApp, setSelectedApp] = useState<MarketplaceApp | null>(null);
  const [installState, setInstallState] = useState<InstallState>(defaultInstallState);

  const filteredApps = useMemo(() => {
    if (!selectedCategories.length) {
      return MARKETPLACE_APPS;
    }
    return MARKETPLACE_APPS.filter((app) =>
      selectedCategories.every((category) => app.categories.includes(category))
    );
  }, [selectedCategories]);

  const toggleCategory = (category: string, selected: boolean) => {
    setSelectedCategories((prev) => {
      if (selected) {
        return [...prev, category];
      }
      return prev.filter((item) => item !== category);
    });
  };

  const beginInstall = (app: MarketplaceApp) => {
    setSelectedApp(app);
    setInstallState({
      consent: Object.fromEntries(app.scopes.map((scope) => [scope, false])),
      sandbox: app.sandboxOnly
    });
  };

  const closeInstall = () => {
    setSelectedApp(null);
    setInstallState(defaultInstallState);
  };

  const selectedConsentCount = selectedApp
    ? Object.values(installState.consent).filter(Boolean).length
    : 0;

  return (
    <div className="marketplace">
      <header className="marketplace__hero">
        <div>
          <h1>Marketplace de parceiros</h1>
          <p>
            Descubra integrações validadas com contratos públicos, sandbox imediato e métricas de
            confiabilidade em tempo real.
          </p>
        </div>
        <div className="marketplace__hero-card">
          <h2>Sandbox instantâneo</h2>
          <p>
            Gere credenciais sintéticas e valide webhooks antes de ir para produção. Todos os apps
            oferecem ambientes isolados.
          </p>
          <ul>
            <li>Tokens válidos por 30 dias</li>
            <li>Trilhas de auditoria disponíveis</li>
            <li>Throttling configurável por contrato</li>
          </ul>
        </div>
      </header>

      <section className="marketplace__filters" aria-label="Filtros de categoria">
        {CATEGORIES.map((category) => {
          const count = MARKETPLACE_APPS.filter((app) => app.categories.includes(category)).length;
          return (
            <FilterPill
              key={category}
              label={category}
              selected={selectedCategories.includes(category)}
              count={count}
              onToggle={(nextSelected) => toggleCategory(category, nextSelected)}
            />
          );
        })}
      </section>

      <section className="marketplace__showcases">
        {SHOWCASES.map((showcase) => (
          <article key={showcase.title} className="marketplace__showcase">
            <header>
              <h2>{showcase.title}</h2>
              <p>{showcase.description}</p>
            </header>
            <div className="marketplace__cards">
              {showcase.appIds.map((appId) => {
                const app = MARKETPLACE_APPS.find((item) => item.id === appId);
                if (!app) return null;
                return <AppCard key={app.id} app={app} onInstall={beginInstall} />;
              })}
            </div>
          </article>
        ))}
      </section>

      <section className="marketplace__catalog" aria-label="Resultados filtrados">
        <header>
          <h2>Catálogo completo</h2>
          <p>{filteredApps.length} apps disponíveis</p>
        </header>
        <div className="marketplace__cards">
          {filteredApps.map((app) => (
            <AppCard key={app.id} app={app} onInstall={beginInstall} />
          ))}
        </div>
      </section>

      {selectedApp && (
        <div className="marketplace__install" role="dialog" aria-modal="true">
          <div className="marketplace__install-panel">
            <header>
              <div className="marketplace__install-icon" aria-hidden>{selectedApp.icon}</div>
              <div>
                <h2>Instalar {selectedApp.name}</h2>
                <p>{selectedApp.shortDescription}</p>
              </div>
            </header>
            <section>
              <h3>Consentimentos granulares</h3>
              <p>Selecione os escopos aprovados para o workspace.</p>
              <ul className="marketplace__consent-list">
                {selectedApp.scopes.map((scope) => (
                  <li key={scope}>
                    <label>
                      <input
                        type="checkbox"
                        checked={installState.consent[scope] ?? false}
                        onChange={(event) =>
                          setInstallState((state) => ({
                            ...state,
                            consent: { ...state.consent, [scope]: event.target.checked }
                          }))
                        }
                      />
                      <span>{scope}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3>Ambiente</h3>
              <label className="marketplace__switch">
                <input
                  type="checkbox"
                  checked={installState.sandbox}
                  disabled={selectedApp.sandboxOnly}
                  onChange={(event) =>
                    setInstallState((state) => ({ ...state, sandbox: event.target.checked }))
                  }
                />
                <span>Provisionar sandbox</span>
                {selectedApp.sandboxOnly && <em>Obrigatório</em>}
              </label>
            </section>
            <footer>
              <button type="button" className="marketplace__button-secondary" onClick={closeInstall}>
                Cancelar
              </button>
              <button
                type="button"
                className="marketplace__button-primary"
                disabled={!selectedConsentCount}
                onClick={() => {
                  // Simula emissão de webhook + auditoria
                  console.info('install', {
                    partnerId: selectedApp.id,
                    consent: installState.consent,
                    sandbox: installState.sandbox
                  });
                  closeInstall();
                }}
              >
                Confirmar instalação
              </button>
            </footer>
          </div>
        </div>
      )}

      <style jsx>{`
        .marketplace {
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
          padding: var(--space-8) var(--space-10);
        }
        .marketplace__hero {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: var(--space-8);
          align-items: stretch;
        }
        .marketplace__hero h1 {
          font-size: 2.5rem;
          margin-bottom: var(--space-2);
        }
        .marketplace__hero-card {
          background: linear-gradient(135deg, var(--color-soft-aqua), #fff);
          border-radius: 24px;
          padding: var(--space-6);
          box-shadow: 0 20px 45px rgba(14, 32, 84, 0.12);
        }
        .marketplace__hero-card ul {
          margin-top: var(--space-4);
          display: grid;
          gap: var(--space-2);
        }
        .marketplace__filters {
          display: flex;
          gap: var(--space-2);
          flex-wrap: wrap;
          align-items: center;
        }
        .marketplace__showcases {
          display: grid;
          gap: var(--space-6);
        }
        .marketplace__showcase {
          border: 1px solid var(--color-neutral-3);
          border-radius: 20px;
          padding: var(--space-6);
          background: var(--color-neutral-0);
        }
        .marketplace__showcase header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: var(--space-4);
          margin-bottom: var(--space-4);
        }
        .marketplace__cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: var(--space-4);
        }
        .marketplace__catalog {
          display: grid;
          gap: var(--space-4);
        }
        .marketplace__catalog header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .marketplace__install {
          position: fixed;
          inset: 0;
          background: rgba(11, 22, 53, 0.3);
          display: grid;
          place-items: center;
          padding: var(--space-6);
        }
        .marketplace__install-panel {
          background: var(--color-neutral-0);
          border-radius: 24px;
          width: min(520px, 100%);
          padding: var(--space-6);
          display: grid;
          gap: var(--space-4);
          max-height: 90vh;
          overflow-y: auto;
        }
        .marketplace__install header {
          display: flex;
          gap: var(--space-4);
          align-items: center;
        }
        .marketplace__install-icon {
          width: 56px;
          height: 56px;
          display: grid;
          place-items: center;
          background: var(--color-soft-aqua);
          border-radius: 16px;
          font-size: 2rem;
        }
        .marketplace__consent-list {
          display: grid;
          gap: var(--space-3);
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .marketplace__consent-list label {
          display: flex;
          gap: var(--space-2);
          align-items: center;
          padding: var(--space-2) var(--space-3);
          border-radius: 16px;
          border: 1px solid var(--color-neutral-3);
        }
        .marketplace__switch {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }
        .marketplace__switch em {
          font-size: 0.75rem;
          color: var(--color-warning-500);
        }
        footer {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-3);
        }
        .marketplace__button-primary,
        .marketplace__button-secondary {
          border-radius: 999px;
          padding: var(--space-2) var(--space-4);
          border: none;
          cursor: pointer;
          font-weight: 600;
        }
        .marketplace__button-primary {
          background: var(--color-deep-blue);
          color: #fff;
        }
        .marketplace__button-primary:disabled {
          background: var(--color-neutral-3);
          cursor: not-allowed;
        }
        .marketplace__button-secondary {
          background: transparent;
          border: 1px solid var(--color-neutral-3);
        }
        @media (max-width: 900px) {
          .marketplace {
            padding: var(--space-6) var(--space-4);
          }
          .marketplace__hero {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

type AppCardProps = {
  app: MarketplaceApp;
  onInstall: (app: MarketplaceApp) => void;
};

function AppCard({ app, onInstall }: AppCardProps) {
  return (
    <article className="marketplace-card">
      <div className="marketplace-card__icon" aria-hidden>
        {app.icon}
      </div>
      <header>
        <h3>{app.name}</h3>
        <p>{app.shortDescription}</p>
      </header>
      <dl className="marketplace-card__meta">
        <div>
          <dt>Categoria</dt>
          <dd>{app.categories.join(', ')}</dd>
        </div>
        <div>
          <dt>Avaliação</dt>
          <dd>{app.rating.toFixed(1)}</dd>
        </div>
        <div>
          <dt>Instalações</dt>
          <dd>{app.installs}</dd>
        </div>
      </dl>
      {app.sandboxOnly && <span className="marketplace-card__badge">Sandbox</span>}
      <button type="button" onClick={() => onInstall(app)}>
        Instalar
      </button>
      <style jsx>{`
        .marketplace-card {
          position: relative;
          border: 1px solid var(--color-neutral-3);
          border-radius: 24px;
          padding: var(--space-4);
          background: var(--color-neutral-0);
          display: grid;
          gap: var(--space-3);
        }
        .marketplace-card__icon {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          background: var(--color-soft-aqua);
          display: grid;
          place-items: center;
          font-size: 1.5rem;
        }
        .marketplace-card__meta {
          display: grid;
          gap: var(--space-2);
          font-size: 0.85rem;
          color: var(--color-neutral-7);
        }
        .marketplace-card__meta dt {
          font-weight: 600;
        }
        .marketplace-card__badge {
          position: absolute;
          top: var(--space-4);
          right: var(--space-4);
          background: var(--color-neutral-2);
          border-radius: 999px;
          padding: 0 var(--space-2);
          font-size: 0.75rem;
        }
        button {
          justify-self: flex-start;
          border-radius: 999px;
          border: none;
          background: var(--color-deep-blue);
          color: #fff;
          padding: var(--space-2) var(--space-4);
          cursor: pointer;
          font-weight: 600;
          transition: transform 0.15s ease;
        }
        button:hover {
          transform: translateY(-1px);
        }
      `}</style>
    </article>
  );
}
