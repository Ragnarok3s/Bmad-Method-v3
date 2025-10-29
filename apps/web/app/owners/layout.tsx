'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';
import { OwnerAccessProvider, useOwnerAccess } from './OwnerAccessContext';

const NAV_ITEMS = [
  { href: '/owners', label: 'Overview' },
  { href: '/owners/propriedades', label: 'Propriedades' },
  { href: '/owners/faturas', label: 'Faturas' },
  { href: '/owners/relatorios', label: 'Relatórios' }
] as const;

export default function OwnersLayout({ children }: { children: React.ReactNode }) {
  return (
    <OwnerAccessProvider>
      <OwnersGuard>{children}</OwnersGuard>
    </OwnerAccessProvider>
  );
}

function OwnersGuard({ children }: { children: React.ReactNode }) {
  const { status, authenticate, logout, ownerId } = useOwnerAccess();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (status === 'checking') {
    return (
      <div className="owners-gate" role="status">
        <p>Validando sessão segura do proprietário…</p>
      </div>
    );
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const success = authenticate(code);
    if (!success) {
      setError('Código inválido. Confirme as credenciais enviadas pelo gestor de operações.');
    } else {
      setError(null);
    }
  };

  if (status !== 'authenticated') {
    return (
      <div className="owners-gate">
        <section className="owners-card">
          <h1>Portal do Proprietário</h1>
          <p>Introduza o código de acesso fornecido pela equipa Bmad Method.</p>
          <form onSubmit={handleSubmit} className="owners-form">
            <label htmlFor="owner-code">Código de acesso</label>
            <input
              id="owner-code"
              name="owner-code"
              type="password"
              autoComplete="one-time-code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              data-testid="owner-access-code"
            />
            {error && <p className="owners-error">{error}</p>}
            <button type="submit">Entrar</button>
          </form>
        </section>
      </div>
    );
  }

  return <OwnersShell ownerId={ownerId} logout={logout}>{children}</OwnersShell>;
}

function OwnersShell({
  children,
  ownerId,
  logout
}: {
  children: React.ReactNode;
  ownerId: number;
  logout: () => void;
}) {
  const pathname = usePathname();
  const navItems = useMemo(
    () =>
      NAV_ITEMS.map((item) => ({
        ...item,
        active: pathname === item.href || pathname.startsWith(`${item.href}/`)
      })),
    [pathname]
  );

  return (
    <div className="owners-shell">
      <header className="owners-header">
        <div>
          <p className="owners-subtitle">Área reservada · Proprietário #{ownerId}</p>
          <h1>Painel de resultados e documentação</h1>
          <p>
            Acompanhe receita consolidada, métricas operacionais e atualize informações críticas com
            proteção reforçada.
          </p>
        </div>
        <button type="button" className="owners-logout" onClick={logout}>
          Terminar sessão
        </button>
      </header>
      <nav aria-label="Secções do portal" className="owners-nav">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} aria-current={item.active ? 'page' : undefined}>
            {item.label}
          </Link>
        ))}
      </nav>
      <main className="owners-content" data-testid="owner-content">
        {children}
      </main>
      <style jsx>{`
        .owners-gate {
          min-height: 70vh;
          display: grid;
          place-items: center;
          padding: var(--space-6);
        }
        .owners-card {
          background: #fff;
          border-radius: var(--radius-lg);
          padding: var(--space-6);
          max-width: 420px;
          display: grid;
          gap: var(--space-4);
          box-shadow: var(--shadow-card);
        }
        .owners-form {
          display: grid;
          gap: var(--space-3);
        }
        input {
          border: 1px solid rgba(11, 60, 93, 0.2);
          border-radius: var(--radius-sm);
          padding: var(--space-3) var(--space-4);
          font-size: 1rem;
        }
        button {
          border: none;
          border-radius: var(--radius-sm);
          padding: var(--space-3) var(--space-4);
          background: var(--color-deep-blue);
          color: #fff;
          font-weight: 600;
          cursor: pointer;
        }
        .owners-error {
          color: var(--color-coral);
          margin: 0;
        }
        .owners-shell {
          display: grid;
          gap: var(--space-5);
        }
        .owners-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: var(--space-5);
          background: linear-gradient(135deg, rgba(11, 60, 93, 0.95), rgba(46, 196, 182, 0.85));
          color: #fff;
          padding: var(--space-5);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card);
        }
        .owners-subtitle {
          margin: 0 0 var(--space-2) 0;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 600;
        }
        .owners-logout {
          align-self: flex-start;
          background: rgba(255, 255, 255, 0.18);
        }
        .owners-nav {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-3);
          background: #fff;
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-card);
        }
        .owners-nav a {
          padding: var(--space-2) var(--space-4);
          border-radius: var(--radius-sm);
          font-weight: 500;
          color: var(--color-deep-blue);
          background: rgba(11, 60, 93, 0.08);
        }
        .owners-nav a[aria-current='page'] {
          background: var(--color-deep-blue);
          color: #fff;
        }
        .owners-content {
          display: grid;
          gap: var(--space-5);
        }
        @media (max-width: 960px) {
          .owners-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .owners-nav {
            flex-direction: column;
          }
        }
        @media (max-width: 640px) {
          .owners-card {
            padding: var(--space-5);
          }
          .owners-header {
            padding: var(--space-4);
          }
          .owners-nav {
            padding: var(--space-3);
          }
        }
      `}</style>
    </div>
  );
}
