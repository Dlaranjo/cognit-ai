import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Botao from './Botao';

describe('Componente Botao', () => {
  it('renderiza com children', () => {
    render(<Botao>Clique</Botao>);
    expect(screen.getByRole('button', { name: /clique/i })).toBeInTheDocument();
  });

  it('dispara callback ao clicar', () => {
    const aoClicar = vi.fn();
    render(<Botao aoClicar={aoClicar}>Enviar</Botao>);
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));
    expect(aoClicar).toHaveBeenCalledTimes(1);
  });

  it('mostra spinner quando carregando', () => {
    render(<Botao carregando>Carregando</Botao>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });
}); 