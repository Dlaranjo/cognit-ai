import React from 'react';
import { PropriedadesBotao } from './Botao.types';
import styles from './Botao.module.css';

/**
 * Componente Botão - Elemento básico de interação
 * 
 * @param props - Propriedades do componente
 * @returns Elemento JSX do botão
 */
export const Botao: React.FC<PropriedadesBotao> = ({
  children,
  variante = 'primario',
  tamanho = 'medio',
  carregando = false,
  desabilitado = false,
  larguraCompleta = false,
  aoClicar,
  tipo = 'button',
  className = '',
  id,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}) => {
  // Construir classes CSS
  const classNames = [
    styles.botao,
    styles[`botao--${variante}`],
    styles[`botao--${tamanho}`],
    larguraCompleta && styles['botao--largura-completa'],
    carregando && styles['botao--carregando'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Handler de clique
  const handleClick = () => {
    if (!carregando && !desabilitado && aoClicar) {
      aoClicar();
    }
  };

  return (
    <button
      id={id}
      type={tipo}
      className={classNames}
      disabled={desabilitado || carregando}
      onClick={handleClick}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-disabled={desabilitado || carregando}
    >
      {carregando && (
        <span className={styles.spinner} aria-hidden="true" />
      )}
      {children}
    </button>
  );
};

export default Botao; 