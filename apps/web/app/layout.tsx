import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers/Providers';
import { AppChrome } from '@/components/layout/AppChrome';
import { SkipToContentLink } from '@/components/a11y/SkipToContentLink';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'Bmad Method Hospitality Ops',
  description:
    'Plataforma de operações hoteleiras com módulos de reservas, housekeeping, faturação e analytics.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body>
        <Providers>
          <SkipToContentLink targetId="conteudo-principal" />
          <AppChrome>{children}</AppChrome>
        </Providers>
      </body>
    </html>
  );
}
