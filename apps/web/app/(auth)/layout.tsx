'use client';

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-shell">
      <main className="auth-content" role="main">
        {children}
      </main>
      <style jsx>{`
        .auth-shell {
          display: grid;
          align-items: center;
          justify-items: center;
          min-height: 100vh;
          padding: var(--space-6);
          background: linear-gradient(
            135deg,
            rgba(11, 60, 93, 0.15),
            rgba(46, 196, 182, 0.2)
          );
        }
        .auth-content {
          width: min(480px, 100%);
          display: grid;
          gap: var(--space-4);
        }
      `}</style>
    </div>
  );
}
