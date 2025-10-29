'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard' },
  { href: '/reservas', label: 'Reservas' },
  { href: '/calendario', label: 'Calendário' },
  { href: '/housekeeping', label: 'Housekeeping' },
  { href: '/faturacao', label: 'Faturação' },
  { href: '/owners', label: 'Portal Proprietários' },
  { href: '/onboarding', label: 'Onboarding' },
  { href: '/agentes', label: 'Catálogo de Agentes' },
  { href: '/playbooks', label: 'Playbooks Automatizados' },
  { href: '/observabilidade', label: 'Observabilidade' },
  { href: '/governanca', label: 'Governança' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/support/knowledge-base', label: 'Base de Conhecimento' },
  { href: '/mobile/housekeeping', label: 'App Housekeeping' },
  { href: '/mobile/gestor', label: 'App Gestor' }
] as const;

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Módulos principais" className="main-nav">
      <ul>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <li key={item.href}>
              <Link href={item.href} aria-current={isActive ? 'page' : undefined}>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <style jsx>{`
        .main-nav {
          position: sticky;
          top: var(--space-4);
        }
        ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: var(--space-2);
        }
        a {
          display: block;
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-sm);
          font-weight: 500;
          color: var(--color-deep-blue);
          background: rgba(11, 60, 93, 0.06);
          transition: background 0.2s ease;
        }
        a:hover,
        a:focus-visible {
          background: rgba(46, 196, 182, 0.2);
        }
        [aria-current='page'] {
          background: var(--color-deep-blue);
          color: #fff;
          box-shadow: var(--shadow-card);
        }
        @media (max-width: 960px) {
          .main-nav {
            position: relative;
            top: auto;
          }
          ul {
            grid-auto-flow: column;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            overflow-x: auto;
            padding-bottom: var(--space-2);
          }
        }
      `}</style>
    </nav>
  );
}
