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

    expect(screen.getByRole('navigation', { name: 'Módulos principais' })).toBeInTheDocument();
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(14);
    expect(screen.getByRole('link', { name: 'Housekeeping' })).toHaveAttribute('aria-current', 'page');
  });
});
