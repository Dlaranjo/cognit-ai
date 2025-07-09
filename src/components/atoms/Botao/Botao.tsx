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
  densidade = 'normal',
  formato = 'retangular',
  carregando = false,
  desabilitado = false,
  larguraCompleta = false,
  iconeEsquerda,
  iconeDireita,
  somenteIcone = false,
  aoClicar,
  tipo = 'button',
  className = '',
  id,
  tooltip,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ref,
}) => {
  // Construir classes CSS
  const classNames = [
    styles.botao,
    styles[`botao--${variante}`],
    styles[`botao--${tamanho}`],
    styles[`botao--${densidade}`],
    styles[`botao--${formato}`],
    larguraCompleta && styles['botao--largura-completa'],
    carregando && styles['botao--carregando'],
    somenteIcone && styles['botao--somente-icone'],
    (iconeEsquerda || iconeDireita) && styles['botao--com-icone'],
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

  // Conteúdo do botão
  const conteudoBotao = (
    <>
      {carregando && (
        <span className={styles.spinner} aria-hidden="true" />
      )}
      {iconeEsquerda && !carregando && (
        <span className={`${styles.icone} ${styles['icone--esquerda']}`} aria-hidden="true">
          {iconeEsquerda}
        </span>
      )}
      {children && (
        <span className={styles.texto}>
          {children}
        </span>
      )}
      {iconeDireita && !carregando && (
        <span className={`${styles.icone} ${styles['icone--direita']}`} aria-hidden="true">
          {iconeDireita}
        </span>
      )}
    </>
  );
  
  const botaoElement = (
    <button
      ref={ref}
      id={id}
      type={tipo}
      className={classNames}
      disabled={desabilitado || carregando}
      onClick={handleClick}
      aria-label={ariaLabel || (somenteIcone ? tooltip : undefined)}
      aria-describedby={ariaDescribedBy}
      aria-disabled={desabilitado || carregando}
      title={somenteIcone ? tooltip : undefined}
    >
      {conteudoBotao}
    </button>
  );
  
  return botaoElement;
};

// Componente com React.memo para otimização
export default React.memo(Botao); 