import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Avatar from './Avatar';

describe('Componente Avatar', () => {
  it('exibe iniciais quando não há imagem', () => {
    render(<Avatar nome="Maria Silva" />);
    expect(screen.getByText('MS')).toBeInTheDocument();
  });

  it('renderiza elemento <img> quando src fornecido', () => {
    render(<Avatar nome="João Teste" src="https://via.placeholder.com/32" />);
    const imagens = screen.getAllByRole('img');
    expect(imagens.some((el) => el.tagName === 'IMG')).toBe(true);
  });
});
