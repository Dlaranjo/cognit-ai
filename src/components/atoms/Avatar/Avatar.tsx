import React, { useState } from 'react';
import { PropriedadesAvatar } from './Avatar.types';
import styles from './Avatar.module.css';

/**
 * Componente Avatar - Representação visual de usuário
 * 
 * @param props - Propriedades do componente
 * @returns Elemento JSX do avatar
 */
export const Avatar: React.FC<PropriedadesAvatar> = ({
  src,
  alt,
  nome,
  tamanho = 'medio',
  formato = 'circular',
  corFundo,
  corTexto,
  statusOnline = false,
  aoClicar,
  clicavel = false,
  className = '',
  id,
  'aria-label': ariaLabel,
}) => {
  // const [imagemCarregada, setImagemCarregada] = useState(false);
  const [erroImagem, setErroImagem] = useState(false);

  // Gerar iniciais do nome
  const obterIniciais = (nomeCompleto: string): string => {
    if (!nomeCompleto) return '?';
    
    const palavras = nomeCompleto.trim().split(' ');
    if (palavras.length === 1) {
      return palavras[0].charAt(0).toUpperCase();
    }
    
    return (palavras[0].charAt(0) + palavras[palavras.length - 1].charAt(0)).toUpperCase();
  };

  // Gerar cor baseada no nome
  const obterCorPorNome = (nomeCompleto: string): string => {
    if (!nomeCompleto) return 'cinza';
    
    const cores = ['azul', 'verde', 'roxo', 'rosa', 'amarelo', 'vermelho', 'cinza'];
    const indice = nomeCompleto.charCodeAt(0) % cores.length;
    return cores[indice];
  };

  // Construir classes CSS
  const avatarClasses = [
    styles.avatar,
    styles[`avatar--${tamanho}`],
    styles[`avatar--${formato}`],
    (clicavel || aoClicar) && styles['avatar--clicavel'],
    !src && styles['avatar--sem-imagem'],
    corFundo && corTexto && styles['avatar--cor-personalizada'],
    !corFundo && !corTexto && nome && styles[`avatar--cor-${obterCorPorNome(nome)}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Construir estilos personalizados
  const estilosPersonalizados = corFundo && corTexto ? {
    '--cor-fundo-personalizada': corFundo,
    '--cor-texto-personalizada': corTexto,
  } as React.CSSProperties : {};

  // Handler de clique
  const handleClick = () => {
    if ((clicavel || aoClicar) && aoClicar) {
      aoClicar();
    }
  };

  // Handler de erro da imagem
  const handleImageError = () => {
    setErroImagem(true);
  };

  // Handler de carregamento da imagem
  const handleImageLoad = () => {
            // setImagemCarregada(true);
  };

  // Determinar se deve mostrar imagem ou iniciais
  const mostrarImagem = src && !erroImagem;
  const iniciais = obterIniciais(nome || '');

  return (
    <div
      id={id}
      className={avatarClasses}
      style={estilosPersonalizados}
      onClick={handleClick}
      role={clicavel || aoClicar ? 'button' : undefined}
      tabIndex={clicavel || aoClicar ? 0 : undefined}
      aria-label={ariaLabel || (nome ? `Avatar de ${nome}` : 'Avatar')}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && (clicavel || aoClicar)) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {mostrarImagem ? (
        <img
          src={src}
          alt={alt || `Avatar de ${nome || 'usuário'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      ) : (
        <span className={styles.iniciais}>
          {iniciais}
        </span>
      )}
      
      {statusOnline && (
        <div 
          className={styles['status-indicator']}
          aria-label="Online"
        />
      )}
    </div>
  );
};

export default Avatar; 