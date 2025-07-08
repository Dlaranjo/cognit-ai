import React, { useState, useCallback } from 'react';
import { Tooltip } from '../Tooltip';
import { PropriedadesBadge } from './Badge.types';
import styles from './Badge.module.css';

export const Badge: React.FC<PropriedadesBadge> = ({
  texto,
  variante = 'primario',
  tamanho = 'medio',
  formato = 'redondo',
  bordas = false,
  contorno = false,
  pulsar = false,
  icone,
  posicaoIcone = 'esquerda',
  corFundo,
  corTexto,
  removivel = false,
  aoRemover,
  aoClicar,
  desabilitado = false,
  tooltip,
  maxCaracteres,
  className = '',
  style = {},
  id,
  htmlProps = {}
}) => {
  const [removendo, setRemovendo] = useState(false);

  const handleRemover = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (aoRemover) {
      setRemovendo(true);
      setTimeout(() => {
        aoRemover();
      }, 200);
    }
  }, [aoRemover]);

  const handleClick = useCallback((_e: React.MouseEvent) => {
    if (desabilitado || removendo) return;
    if (aoClicar) {
      aoClicar();
    }
  }, [aoClicar, desabilitado, removendo]);

  const truncarTexto = (texto: string, max: number) => {
    if (texto.length <= max) return texto;
    return texto.substring(0, max - 3) + '...';
  };

  const textoExibido = maxCaracteres && texto.length > maxCaracteres
    ? truncarTexto(texto, maxCaracteres)
    : texto;

  const temTooltip = tooltip || (maxCaracteres && texto.length > maxCaracteres);
  const conteudoTooltip = tooltip || (maxCaracteres && texto.length > maxCaracteres ? texto : '');

  const renderIcone = () => {
    if (!icone) return null;
    
    return (
      <span className={`${styles.icone} ${styles[`icone--${posicaoIcone}`]}`}>
        {icone}
      </span>
    );
  };

  const renderBotaoRemover = () => {
    if (!removivel) return null;
    
    return (
      <button
        className={styles.botaoRemover}
        onClick={handleRemover}
        aria-label="Remover badge"
        type="button"
      >
        ✕
      </button>
    );
  };

  const renderConteudo = () => {
    return (
      <>
        {posicaoIcone === 'esquerda' && renderIcone()}
        <span className={maxCaracteres ? styles.textoTruncado : ''}>
          {textoExibido}
        </span>
        {posicaoIcone === 'direita' && renderIcone()}
        {renderBotaoRemover()}
      </>
    );
  };

  // Construir classes CSS
  const classesBadge = [
    styles.badge,
    styles[`badge--${variante}`],
    styles[`badge--${tamanho}`],
    styles[`badge--${formato}`],
    bordas ? styles['badge--bordas'] : '',
    contorno ? styles['badge--contorno'] : '',
    pulsar ? styles['badge--pulsar'] : '',
    aoClicar ? styles['badge--clicavel'] : '',
    desabilitado ? styles['badge--desabilitado'] : '',
    removivel ? styles['badge--removivel'] : '',
    removendo ? styles['badge--saindo'] : styles['badge--entrando'],
    className
  ].filter(Boolean).join(' ');

  // Construir estilos inline
  const estilosInline: React.CSSProperties = {
    ...style,
    ...(corFundo && { backgroundColor: corFundo }),
    ...(corTexto && { color: corTexto })
  };

  const badge = (
    <span
      className={classesBadge}
      style={estilosInline}
      id={id}
      onClick={aoClicar ? handleClick : undefined}
      role={aoClicar ? 'button' : undefined}
      tabIndex={aoClicar && !desabilitado ? 0 : undefined}
      onKeyDown={aoClicar ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e as any);
        }
      } : undefined}
      aria-label={htmlProps['aria-label']}
      aria-describedby={htmlProps['aria-describedby']}
      {...htmlProps}
    >
      {renderConteudo()}
    </span>
  );

  if (temTooltip) {
    return (
      <Tooltip conteudo={conteudoTooltip} posicao="cima">
        {badge}
      </Tooltip>
    );
  }

  return badge;
};

export default Badge; 