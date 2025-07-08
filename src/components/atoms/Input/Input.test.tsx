import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from './Input';

describe('Componente Input', () => {
  it('renderiza valor e placeholder', () => {
    render(<Input valor="" placeholder="Digite" aoMudar={() => {}} />);
    const input = screen.getByPlaceholderText(/digite/i) as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('');
  });

  it('chama aoMudar quando digita', () => {
    const aoMudar = vi.fn();
    render(<Input valor="" placeholder="Nome" aoMudar={aoMudar} />);
    const input = screen.getByPlaceholderText(/nome/i);
    fireEvent.change(input, { target: { value: 'Teste' } });
    expect(aoMudar).toHaveBeenCalledWith('Teste');
  });

  it('exibe mensagem de erro', () => {
    render(<Input valor="" placeholder="Email" aoMudar={() => {}} erro="Campo obrigatório" />);
    expect(screen.getByText(/campo obrigatório/i)).toBeInTheDocument();
  });
}); 