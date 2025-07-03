import React, { useRef, useEffect, KeyboardEvent } from 'react';
import styles from './EntradaMensagem.module.css';
import { PropriedadesEntradaMensagem } from './EntradaMensagem.types';

const EntradaMensagem: React.FC<PropriedadesEntradaMensagem> = ({ valor, aoMudar, aoEnviar, carregando }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-expansão do textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [valor]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (valor.trim()) aoEnviar();
    }
  };

  return (
    <div className={styles['entrada-container']}>
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        value={valor}
        placeholder="Digite sua mensagem..."
        onChange={(e) => aoMudar(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={carregando}
        rows={1}
      />
      <button
        className={styles['botao-enviar']}
        onClick={aoEnviar}
        disabled={!valor.trim() || carregando}
        aria-label="Enviar"
      >
        ➤
      </button>
    </div>
  );
};

export default React.memo(EntradaMensagem);
