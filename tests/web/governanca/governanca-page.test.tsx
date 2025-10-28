import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import GovernancaPage from '@/app/governanca/page';

describe('Governança & Segurança page', () => {
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;
  let createObjectURLMock: jest.Mock;
  let revokeObjectURLMock: jest.Mock;

  beforeEach(() => {
    jest.restoreAllMocks();
    createObjectURLMock = jest.fn(() => 'blob:governanca');
    revokeObjectURLMock = jest.fn();
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      writable: true,
      value: createObjectURLMock
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      writable: true,
      value: revokeObjectURLMock
    });
  });

  afterEach(() => {
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      writable: true,
      value: originalCreateObjectURL
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      writable: true,
      value: originalRevokeObjectURL
    });
  });

  it('filtra políticas por persona e propriedade', async () => {
    const user = userEvent.setup();
    render(<GovernancaPage />);

    const personaSelect = screen.getByLabelText(/Persona/i);
    const propertySelect = screen.getByLabelText(/Propriedade/i);

    await user.selectOptions(personaSelect, 'operacional');
    await user.selectOptions(propertySelect, 'Residencial Atlântico');

    expect(screen.getByText('Gestor Operacional Premium')).toBeInTheDocument();
    expect(screen.queryByText('Administrador Global')).not.toBeInTheDocument();
  });

  it('exporta CSV e PDF a partir da trilha de auditoria', async () => {
    const user = userEvent.setup();
    const clickMock = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);

    const printMock = jest.fn();
    const closeMock = jest.fn();
    const focusMock = jest.fn();
    const writeMock = jest.fn();
    const docCloseMock = jest.fn();

    jest.spyOn(window, 'open').mockReturnValue({
      document: { write: writeMock, close: docCloseMock },
      focus: focusMock,
      print: printMock,
      close: closeMock
    } as unknown as Window);

    render(<GovernancaPage />);

    await user.click(screen.getByRole('button', { name: /Exportar CSV/i }));
    expect(createObjectURLMock).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();
    expect(revokeObjectURLMock).toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: /Exportar PDF/i }));
    expect(window.open).toHaveBeenCalled();
    expect(writeMock).toHaveBeenCalled();
    expect(printMock).toHaveBeenCalled();
    expect(closeMock).toHaveBeenCalled();
  });
});
