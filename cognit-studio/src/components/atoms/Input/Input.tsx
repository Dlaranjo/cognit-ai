import React, { ChangeEvent } from 'react';
import classNames from 'classnames';
import styles from './Input.module.css';
import { PropriedadesInput } from './Input.types';

/**
 * Componente de input controlado com validação simples.
 */
const Input: React.FC<PropriedadesInput> = ({
  valor,
  placeholder,
  tipo = 'text',
  erro,
  aoMudar,
  desabilitado = false,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    aoMudar(e.target.value);
  };

  const classeInput = classNames(styles.input, {
    [styles['input--erro']]: Boolean(erro),
  });

  return (
    <div className={styles['input-container']}>
      <input
        className={classeInput}
        type={tipo}
        value={valor}
        placeholder={placeholder}
        onChange={handleChange}
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? `${placeholder}-erro` : undefined}
        disabled={desabilitado}
      />
      {erro && (
        <span id={`${placeholder}-erro`} className={styles['mensagem-erro']} role="alert">
          {erro}
        </span>
      )}
    </div>
  );
};

export default React.memo(Input);
