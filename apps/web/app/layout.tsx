import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers/Providers';
import { AppChrome } from '@/components/layout/AppChrome';
import { SkipToContentLink } from '@/components/a11y/SkipToContentLink';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
  fallback: ['system-ui', 'Segoe UI', 'Helvetica Neue', 'Arial']
});

export const metadata: Metadata = {
  title: 'Bmad Method Hospitality Ops',
  description:
    'Plataforma de operações hoteleiras com módulos de reservas, housekeeping, faturação e analytics.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <body>
        <Providers initialLocale="pt-BR">
          <SkipToContentLink targetId="conteudo-principal" />
          <AppChrome>{children}</AppChrome>
        </Providers>
      </body>
    </html>
  );
}
