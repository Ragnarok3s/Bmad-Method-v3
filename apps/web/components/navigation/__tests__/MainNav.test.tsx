import { act, render, screen } from '@testing-library/react';
import { MainNav } from '../MainNav';
import { usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn()
}));

describe('MainNav', () => {
  it('lista todos os módulos principais com link acessível', async () => {
    (usePathname as jest.Mock).mockReturnValue('/housekeeping');

    await act(async () => {
      render(<MainNav />);
    });

    expect(screen.getByRole('navigation', { name: 'Navegação principal' })).toBeInTheDocument();
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(16);
    const linkLabels = links.map((link) => link.querySelector('.main-nav__label')?.textContent?.trim());
    expect(linkLabels).toEqual([
      'Dashboard',
      'Reservas',
      'Calendário',
      'Housekeeping',
      'Faturação',
      'Portal Proprietários',
      'Onboarding',
      'App Housekeeping',
      'App Gestor',
      'Catálogo de Agentes',
      'Playbooks Automatizados',
      'Recomendações',
      'Observabilidade',
      'Governança',
      'Analytics',
      'Base de Conhecimento'
    ]);
    expect(screen.getByRole('link', { name: /^Housekeeping/ })).toHaveAttribute('aria-current', 'page');
  });
});
