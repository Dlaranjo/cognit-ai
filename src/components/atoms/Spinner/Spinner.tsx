import React from 'react';
import { PropriedadesSpinner } from './Spinner.types';
import styles from './Spinner.module.css';

/**
 * Componente Spinner - Indicador de carregamento
 * 
 * @param props - Propriedades do componente
 * @returns Elemento JSX do spinner
 */
export const Spinner: React.FC<PropriedadesSpinner> = ({
  tamanho = 'medio',
  variante = 'primario',
  velocidade = 'normal',
  textoAcessibilidade = 'Carregando...',
  mostrarTexto = false,
  textoCarregamento = 'Carregando...',
  className,
  id
}) => {
  // Classes CSS dinâmicas
  const spinnerClasses = [
    styles.spinner,
    styles[`spinner--${tamanho}`],
    styles[`spinner--${variante}`],
    styles[`spinner--${velocidade}`],
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={spinnerClasses}
      role="status"
      aria-live="polite"
      aria-label={textoAcessibilidade}
      id={id}
    >
      {/* Círculo do spinner */}
      <div className={styles['spinner-circle']} />
      
      {/* Texto de carregamento */}
      {mostrarTexto && (
        <span className={styles.texto}>
          {textoCarregamento}
        </span>
      )}
      
      {/* Texto para leitores de tela */}
      <span className={styles['sr-only']}>
        {textoAcessibilidade}
      </span>
    </div>
  );
};

/**
 * Componente SpinnerPontos - Variante com pontos saltitantes
 */
export const SpinnerPontos: React.FC<PropriedadesSpinner> = ({
  tamanho = 'medio',
  variante = 'primario',
  velocidade = 'normal',
  textoAcessibilidade = 'Carregando...',
  mostrarTexto = false,
  textoCarregamento = 'Carregando...',
  className,
  id
}) => {
  const spinnerClasses = [
    styles.spinner,
    styles['spinner--pontos'],
    styles[`spinner--${tamanho}`],
    styles[`spinner--${variante}`],
    styles[`spinner--${velocidade}`],
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={spinnerClasses}
      role="status"
      aria-live="polite"
      aria-label={textoAcessibilidade}
      id={id}
    >
      {/* Três pontos */}
      <div className={styles.ponto} />
      <div className={styles.ponto} />
      <div className={styles.ponto} />
      
      {/* Texto de carregamento */}
      {mostrarTexto && (
        <span className={styles.texto}>
          {textoCarregamento}
        </span>
      )}
      
      {/* Texto para leitores de tela */}
      <span className={styles['sr-only']}>
        {textoAcessibilidade}
      </span>
    </div>
  );
};

/**
 * Componente SpinnerPulso - Variante com pulso
 */
export const SpinnerPulso: React.FC<PropriedadesSpinner> = ({
  tamanho = 'medio',
  variante = 'primario',
  velocidade = 'normal',
  textoAcessibilidade = 'Carregando...',
  mostrarTexto = false,
  textoCarregamento = 'Carregando...',
  className,
  id
}) => {
  const spinnerClasses = [
    styles.spinner,
    styles['spinner--pulso'],
    styles[`spinner--${tamanho}`],
    styles[`spinner--${variante}`],
    styles[`spinner--${velocidade}`],
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={spinnerClasses}
      role="status"
      aria-live="polite"
      aria-label={textoAcessibilidade}
      id={id}
    >
      {/* Círculo pulsante */}
      <div className={styles['spinner-circle']} />
      
      {/* Texto de carregamento */}
      {mostrarTexto && (
        <span className={styles.texto}>
          {textoCarregamento}
        </span>
      )}
      
      {/* Texto para leitores de tela */}
      <span className={styles['sr-only']}>
        {textoAcessibilidade}
      </span>
    </div>
  );
};

Spinner.displayName = 'Spinner';
SpinnerPontos.displayName = 'SpinnerPontos';
SpinnerPulso.displayName = 'SpinnerPulso';

export default Spinner; 