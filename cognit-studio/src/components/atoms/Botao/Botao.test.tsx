import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Botao from './Botao';

describe('Componente Botao', () => {
  it('renderiza com título', () => {
    render(<Botao titulo="Clique" />);
    expect(screen.getByRole('button', { name: /clique/i })).toBeInTheDocument();
  });

  it('dispara callback ao clicar', () => {
    const aoClicar = vi.fn();
    render(<Botao titulo="Enviar" aoClicar={aoClicar} />);
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));
    expect(aoClicar).toHaveBeenCalledTimes(1);
  });

  it('mostra spinner quando carregando', () => {
    render(<Botao titulo="Carregando" carregando />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });
});
