import { render, screen } from '@testing-library/react';
import { MainNav } from '../MainNav';
import { usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn()
}));

describe('MainNav', () => {
  it('lista todos os módulos principais com link acessível', async () => {
    (usePathname as jest.Mock).mockReturnValue('/housekeeping');

    render(<MainNav />);

    expect(screen.getByRole('navigation', { name: 'Navegação principal' })).toBeInTheDocument();
    const expectedLinks = [
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
    ];

    expectedLinks.forEach((name) => {
      expect(screen.getByRole('link', { name })).toBeInTheDocument();
    });
    expect(screen.getAllByRole('link')).toHaveLength(expectedLinks.length);
    expect(screen.getByRole('link', { name: /^Housekeeping/ })).toHaveAttribute('aria-current', 'page');
  });
});
