'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  BarChart3,
  BookOpen,
  Bot,
  Building2,
  CalendarCheck,
  CalendarDays,
  CheckSquare,
  ClipboardCheck,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Workflow
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const NAV_SECTIONS: { heading: string; items: NavItem[] }[] = [
  {
    heading: 'Operação diária',
    items: [
      {
        href: '/',
        label: 'Dashboard',
        description: 'Resumo diário de ocupação e alertas críticos',
        icon: LayoutDashboard
      },
      {
        href: '/reservas',
        label: 'Reservas',
        description: 'Fluxos de check-in/out e ajustes de estadia',
        icon: CalendarCheck
      },
      {
        href: '/calendario',
        label: 'Calendário',
        description: 'Disponibilidade por unidade e sincronização OTA',
        icon: CalendarDays
      },
      {
        href: '/housekeeping',
        label: 'Housekeeping',
        description: 'Atribuição de tarefas, incidentes e auditorias',
        icon: ClipboardCheck
      },
      {
        href: '/faturacao',
        label: 'Faturação',
        description: 'Checkout, notas de crédito e reconciliações',
        icon: CheckSquare
      }
    ]
  },
  {
    heading: 'Produtos e experiências',
    items: [
      {
        href: '/owners',
        label: 'Portal Proprietários',
        description: 'Painel de partilha de resultados e documentos',
        icon: Building2
      },
      {
        href: '/onboarding',
        label: 'Onboarding',
        description: 'Wizard guiado para novas propriedades e equipas',
        icon: Sparkles
      }
    ]
  },
  {
    heading: 'Automação e inteligência',
    items: [
      {
        href: '/agentes',
        label: 'Catálogo de Agentes',
        description: 'Bots operacionais por módulo e contexto',
        icon: Bot
      },
      {
        href: '/playbooks',
        label: 'Playbooks Automatizados',
        description: 'Fluxos configurados e monitorização de adoção',
        icon: Workflow
      },
      {
        href: '/recommendations',
        label: 'Recomendações',
        description: 'Sugestões de upsell e alertas gerados por IA',
        icon: Sparkles
      }
    ]
  },
  {
    heading: 'Governança e suporte',
    items: [
      {
        href: '/observabilidade',
        label: 'Observabilidade',
        description: 'Logs, métricas e tracing da operação',
        icon: Activity
      },
      {
        href: '/governanca',
        label: 'Governança',
        description: 'Políticas, auditoria e controlos de acesso',
        icon: ShieldCheck
      },
      {
        href: '/analytics',
        label: 'Analytics',
        description: 'Dashboards avançados e relatórios exportáveis',
        icon: BarChart3
      },
      {
        href: '/support/knowledge-base',
        label: 'Base de Conhecimento',
        description: 'Guias, SOPs e artigos de apoio',
        icon: BookOpen
      }
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
                const tooltipId = `nav-tooltip-${slugify(item.href)}-${slugify(item.label)}`;
                const Icon = item.icon;
                return (
                  <li key={item.href} className="main-nav__item">
                    <Link
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      data-active={isActive ? 'true' : 'false'}
                      aria-describedby={tooltipId}
                    >
                      <span className="main-nav__icon" aria-hidden="true">
                        <Icon size={18} strokeWidth={1.6} />
                      </span>
                      <span className="main-nav__label">{item.label}</span>
                    </Link>
                    <span role="tooltip" id={tooltipId} className="main-nav__tooltip">
                      {item.description}
                    </span>
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
          /* Keep navigation accessible when guided tour overlays are visible */
          z-index: 2050;
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
        .main-nav__item {
          position: relative;
        }
        a {
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-sm);
          font-weight: 500;
          color: var(--color-neutral-3);
          background: var(--tint-neutral-soft);
          border: 1px solid transparent;
          transition: background 0.2s ease, border 0.2s ease, transform 0.2s ease, color 0.2s ease;
        }
        a:hover,
        a:focus-visible {
          background: var(--tint-primary-soft);
          border-color: var(--tint-primary-strong);
          transform: translateY(-1px);
          color: var(--color-deep-blue);
        }
        a[data-active='true'] {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.96), rgba(14, 165, 233, 0.92));
          color: #fff;
          box-shadow: var(--shadow-card);
        }
        .main-nav__icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 999px;
          background: var(--tint-neutral-soft);
          color: inherit;
        }
        .main-nav__label {
          font-weight: 600;
        }
        .main-nav__tooltip {
          pointer-events: none;
          position: absolute;
          left: calc(100% + var(--space-2));
          top: 50%;
          transform: translateY(-50%);
          width: min(240px, 32vw);
          background: var(--tooltip-surface);
          color: var(--tooltip-text);
          padding: var(--space-3);
          border-radius: var(--radius-sm);
          box-shadow: var(--shadow-flyout);
          font-size: 0.8125rem;
          line-height: 1.45;
          opacity: 0;
          transition: opacity 0.2s ease, transform 0.2s ease;
          transform-origin: left center;
        }
        .main-nav__tooltip::before {
          content: '';
          position: absolute;
          left: -6px;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
          border-right: 6px solid var(--tooltip-surface);
        }
        .main-nav__item:hover .main-nav__tooltip,
        a:focus-visible + .main-nav__tooltip {
          opacity: 1;
          transform: translateY(-50%) translateX(4px);
        }
        a[data-active='true'] + .main-nav__tooltip {
          background: var(--tooltip-strong);
        }
        a[data-active='true'] .main-nav__icon {
          background: var(--tint-neutral-strong);
        }
        @media (prefers-reduced-motion: reduce) {
          .main-nav__tooltip {
            transition: none;
          }
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
          .main-nav__item {
            position: static;
          }
          .main-nav__tooltip {
            position: relative;
            left: 0;
            top: auto;
            transform: none;
            opacity: 1;
            margin-top: var(--space-2);
            width: auto;
          }
          .main-nav__tooltip::before {
            display: none;
          }
          ul {
            grid-template-columns: minmax(0, 1fr);
          }
        }
      `}</style>
    </nav>
  );
}
