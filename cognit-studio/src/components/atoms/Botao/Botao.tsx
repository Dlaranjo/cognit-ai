import React from 'react';
import classNames from 'classnames';
import styles from './Botao.module.css';
import { PropriedadesBotao } from './Botao.types';

/**
 * Componente de botão atômico reutilizável.
 */
const Botao: React.FC<PropriedadesBotao> = ({
  titulo,
  aoClicar,
  carregando = false,
  desabilitado = false,
  variante = 'primario',
  tamanho = 'medio',
  tipo = 'button',
}) => {
  const classe = classNames(
    styles.botao,
    styles[`botao--${variante}`],
    styles[`botao--${tamanho}`]
  );

  return (
    <button
      type={tipo}
      className={classe}
      onClick={aoClicar}
      disabled={desabilitado || carregando}
      aria-busy={carregando}
    >
      {carregando && <span className={styles.botao__spinner} aria-hidden="true" />} {titulo}
    </button>
  );
};

export default React.memo(Botao);
