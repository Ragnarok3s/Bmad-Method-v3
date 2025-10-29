'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  description: string;
}

const NAV_SECTIONS: { heading: string; items: NavItem[] } = [
  {
    heading: 'Operação diária',
    items: [
      { href: '/', label: 'Dashboard', description: 'Resumo diário de ocupação e alertas críticos' },
      { href: '/reservas', label: 'Reservas', description: 'Fluxos de check-in/out e ajustes de estadia' },
      { href: '/calendario', label: 'Calendário', description: 'Disponibilidade por unidade e sincronização OTA' },
      { href: '/housekeeping', label: 'Housekeeping', description: 'Atribuição de tarefas, incidentes e auditorias' },
      { href: '/faturacao', label: 'Faturação', description: 'Checkout, notas de crédito e reconciliações' }
    ]
  },
  {
    heading: 'Produtos e experiências',
    items: [
      { href: '/owners', label: 'Portal Proprietários', description: 'Painel de partilha de resultados e documentos' },
      { href: '/onboarding', label: 'Onboarding', description: 'Wizard guiado para novas propriedades e equipas' },
      { href: '/mobile/housekeeping', label: 'App Housekeeping', description: 'Execução mobile com suporte offline' },
      { href: '/mobile/gestor', label: 'App Gestor', description: 'KPIs móveis e aprovações rápidas' }
    ]
  },
  {
    heading: 'Automação e inteligência',
    items: [
      { href: '/agentes', label: 'Catálogo de Agentes', description: 'Bots operacionais por módulo e contexto' },
      { href: '/playbooks', label: 'Playbooks Automatizados', description: 'Fluxos configurados e monitorização de adoção' },
      { href: '/recommendations', label: 'Recomendações', description: 'Sugestões de upsell e alertas gerados por IA' }
    ]
  },
  {
    heading: 'Governança e suporte',
    items: [
      { href: '/observabilidade', label: 'Observabilidade', description: 'Logs, métricas e tracing da operação' },
      { href: '/governanca', label: 'Governança', description: 'Políticas, auditoria e controlos de acesso' },
      { href: '/analytics', label: 'Analytics', description: 'Dashboards avançados e relatórios exportáveis' },
      { href: '/support/knowledge-base', label: 'Base de Conhecimento', description: 'Guias, SOPs e artigos de apoio' }
    ]
  }
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegação principal" className="main-nav">
      {NAV_SECTIONS.map((section, index) => {
        const headingId = `main-nav-section-${index}`;
        return (
          <section key={section.heading} className="main-nav__section" aria-labelledby={headingId}>
            <p id={headingId} className="main-nav__heading">
              {section.heading}
            </p>
            <ul>
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      data-active={isActive ? 'true' : 'false'}
                    >
                      <span className="main-nav__label">{item.label}</span>
                      <span className="main-nav__description">{item.description}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
      <style jsx>{`
        .main-nav {
          display: grid;
          gap: var(--space-5);
          position: sticky;
          top: var(--space-4);
        }
        .main-nav__section {
          display: grid;
          gap: var(--space-2);
        }
        .main-nav__heading {
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 0.75rem;
          color: var(--color-neutral-2);
        }
        ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: var(--space-2);
        }
        a {
          display: grid;
          gap: var(--space-1);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-sm);
          font-weight: 500;
          color: var(--color-deep-blue);
          background: rgba(11, 60, 93, 0.06);
          border: 1px solid transparent;
          transition: background 0.2s ease, border 0.2s ease, transform 0.2s ease;
        }
        a:hover,
        a:focus-visible {
          background: rgba(46, 196, 182, 0.16);
          border-color: rgba(46, 196, 182, 0.35);
          transform: translateY(-1px);
        }
        a[data-active='true'] {
          background: linear-gradient(135deg, rgba(11, 60, 93, 0.95), rgba(46, 196, 182, 0.85));
          color: #fff;
          box-shadow: var(--shadow-card);
        }
        .main-nav__label {
          font-weight: 600;
        }
        .main-nav__description {
          font-size: 0.8125rem;
          color: var(--color-neutral-2);
        }
        a[data-active='true'] .main-nav__description {
          color: rgba(255, 255, 255, 0.85);
        }
        @media (max-width: 960px) {
          .main-nav {
            position: relative;
            top: auto;
          }
          ul {
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          }
        }
        @media (max-width: 640px) {
          ul {
            grid-template-columns: minmax(0, 1fr);
          }
        }
      `}</style>
    </nav>
  );
}
