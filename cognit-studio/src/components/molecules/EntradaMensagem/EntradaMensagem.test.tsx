import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import EntradaMensagem from './EntradaMensagem';

describe('EntradaMensagem', () => {
  it('envia mensagem ao pressionar Enter', () => {
    const enviar = vi.fn();
    render(
      <EntradaMensagem valor="Olá" aoMudar={() => {}} aoEnviar={enviar} />
    );
    const textarea = screen.getByPlaceholderText(/digite sua mensagem/i);
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });
    expect(enviar).toHaveBeenCalled();
  });
});
