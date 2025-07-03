import React, { useState, useMemo } from 'react';
import classNames from 'classnames';
import styles from './Avatar.module.css';
import { PropriedadesAvatar } from './Avatar.types';

const Avatar: React.FC<PropriedadesAvatar> = ({ nome, src, tamanho = 'medio', classeExtra }) => {
  const [imgErro, setImgErro] = useState<boolean>(false);

  const iniciais = useMemo(() => {
    const partes = nome.trim().split(' ');
    const primeiras = partes.slice(0, 2).map((p) => p.charAt(0).toUpperCase());
    return primeiras.join('');
  }, [nome]);

  const mostrarFallback = imgErro || !src;

  const classeAvatar = classNames(styles.avatar, styles[`avatar--${tamanho}`], classeExtra);

  return (
    <div className={classeAvatar} aria-label={nome} title={nome} role="img">
      {mostrarFallback ? (
        <span aria-hidden="true">{iniciais}</span>
      ) : (
        <img
          src={src}
          alt={nome}
          loading="lazy"
          onError={() => setImgErro(true)}
        />
      )}
    </div>
  );
};

export default React.memo(Avatar);
