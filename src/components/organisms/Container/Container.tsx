import React, { useState, useEffect, useRef, useCallback } from 'react';
import Spinner from '../../atoms/Spinner/Spinner';
import { 
  PropriedadesContainer, 
  DimensoesContainer, 
  EstadoContainer
} from './Container.types';
import styles from './Container.module.css';

export const Container: React.FC<PropriedadesContainer> = ({
  children,
  tipo = 'responsivo',
  tamanhoMaximo = 'grande',
  padding = 'medio',
  margin = 'auto',
  scroll = false,
  direcaoScroll = 'vertical',
  altura = 'auto',
  largura = 'auto',
  centralizar = false,
  alinhamentoHorizontal = 'esquerda',
  alinhamentoVertical = 'topo',
  corFundo,
  borda = false,
  corBorda,
  estiloBorda = 'solida',
  raioBorda = 'nenhum',
  sombra = 'nenhuma',
  elevacao,
  backdropBlur = false,
  opacidade = 1,
  tema = 'claro',
  carregando = false,
  componenteLoading,
  skeleton = false,
  linhasSkeleton = 3,
  className = '',
  style = {},
  id,
  htmlProps = {},
  aoClicar,
  aoFazerScroll,
  aoRedimensionar
}) => {
  const [estado, setEstado] = useState<EstadoContainer>({
    visivel: true,
    carregando,
    dimensoes: {
      largura: 0,
      altura: 0,
      scrollX: 0,
      scrollY: 0,
      larguraConteudo: 0,
      alturaConteudo: 0
    },
    telaCheia: false,
    redimensionando: false,
    ultimoScroll: {
      x: 0,
      y: 0,
      timestamp: 0
    }
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const scrollTimeoutRef = useRef<number | null>(null);

  // Observar redimensionamento
  useEffect(() => {
    if (!containerRef.current) return;

    observerRef.current = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const novasDimensoes: DimensoesContainer = {
          largura: width,
          altura: height,
          scrollX: containerRef.current?.scrollLeft || 0,
          scrollY: containerRef.current?.scrollTop || 0,
          larguraConteudo: containerRef.current?.scrollWidth || 0,
          alturaConteudo: containerRef.current?.scrollHeight || 0
        };

        setEstado(prev => ({
          ...prev,
          dimensoes: novasDimensoes
        }));

        if (aoRedimensionar) {
          aoRedimensionar(novasDimensoes);
        }
      }
    });

    observerRef.current.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [aoRedimensionar]);

  // Sincronizar estado de carregamento
  useEffect(() => {
    setEstado(prev => ({
      ...prev,
      carregando
    }));
  }, [carregando]);

  // Controle de tela cheia
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && estado.telaCheia) {
        setEstado(prev => ({ ...prev, telaCheia: false }));
      }
    };

    if (estado.telaCheia) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [estado.telaCheia]);

  const handleScroll = useCallback((evento: React.UIEvent<HTMLDivElement>) => {
    const target = evento.currentTarget;
    const novoScroll = {
      x: target.scrollLeft,
      y: target.scrollTop,
      timestamp: Date.now()
    };

    setEstado(prev => ({
      ...prev,
      ultimoScroll: novoScroll,
      dimensoes: {
        ...prev.dimensoes,
        scrollX: novoScroll.x,
        scrollY: novoScroll.y
      }
    }));

    // Debounce do callback de scroll
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = window.setTimeout(() => {
      if (aoFazerScroll) {
        aoFazerScroll(evento);
      }
    }, 100);
  }, [aoFazerScroll]);

  const handleClick = useCallback((evento: React.MouseEvent<HTMLDivElement>) => {
    if (aoClicar) {
      aoClicar(evento);
    }
  }, [aoClicar]);

  const renderSkeleton = () => {
    if (!skeleton) return null;

    return (
      <div className={styles['skeleton-container']}>
        {Array.from({ length: linhasSkeleton }, (_, index) => (
          <div
            key={index}
            className={`${styles['skeleton-line']} ${
              styles[`skeleton-line--linha-${(index % 5) + 1}`]
            }`}
          />
        ))}
      </div>
    );
  };

  const renderLoading = () => {
    if (!estado.carregando) return null;

    return (
      <div className={styles['loading-overlay']}>
        <div className={styles['loading-container']}>
          {componenteLoading || <Spinner tamanho="medio" />}
        </div>
      </div>
    );
  };

  const renderConteudo = () => {
    if (skeleton) {
      return renderSkeleton();
    }

    return children;
  };

  // Construir classes CSS
  const classesContainer = [
    styles.container,
    styles[`container--${tipo}`],
    styles[`container--${tamanhoMaximo}`],
    styles[`container--padding-${padding}`],
    styles[`container--margin-${margin}`],
    styles[`container--altura-${altura}`],
    styles[`container--largura-${largura}`],
    centralizar ? styles['container--centralizar'] : '',
    alinhamentoHorizontal !== 'esquerda' ? styles[`container--alinhamento-horizontal-${alinhamentoHorizontal}`] : '',
    alinhamentoVertical !== 'topo' ? styles[`container--alinhamento-vertical-${alinhamentoVertical}`] : '',
    scroll ? styles[`container--scroll${direcaoScroll !== 'vertical' ? `-${direcaoScroll}` : ''}`] : '',
    borda ? styles['container--borda'] : '',
    estiloBorda !== 'solida' ? styles[`container--borda-${estiloBorda}`] : '',
    raioBorda !== 'nenhum' ? styles[`container--raio-borda-${raioBorda}`] : '',
    sombra !== 'nenhuma' ? styles[`container--sombra-${sombra}`] : '',
    backdropBlur ? styles['container--backdrop-blur'] : '',
    tema !== 'claro' ? styles[`container--tema-${tema}`] : '',
    estado.carregando ? styles['container--carregando'] : '',
    skeleton ? styles['container--skeleton'] : '',
    estado.telaCheia ? styles['container--tela-cheia'] : '',
    estado.redimensionando ? styles['container--redimensionando'] : '',
    elevacao ? styles[`container--elevacao-${elevacao}`] : '',
    opacidade !== 1 ? styles[`container--opacidade-${Math.round(opacidade * 100)}`] : '',
    className
  ].filter(Boolean).join(' ');

  // Construir estilos inline
  const estilosInline: React.CSSProperties = {
    ...style,
    ...(corFundo && { backgroundColor: corFundo }),
    ...(corBorda && { borderColor: corBorda }),
    ...(typeof altura === 'string' && !['auto', 'total', 'viewport', 'conteudo'].includes(altura) && { height: altura }),
    ...(typeof largura === 'string' && !['auto', 'total', 'conteudo'].includes(largura) && { width: largura }),
    ...(opacidade !== 1 && { opacity: opacidade }),
    ...(elevacao && { zIndex: elevacao })
  };

  return (
    <div
      ref={containerRef}
      className={classesContainer}
      style={estilosInline}
      id={id}
      onClick={handleClick}
      onScroll={scroll ? handleScroll : undefined}
      tabIndex={aoClicar ? 0 : undefined}
      role={aoClicar ? 'button' : undefined}
      aria-label={htmlProps['aria-label']}
      aria-describedby={htmlProps['aria-describedby']}
      {...htmlProps}
    >
      {renderConteudo()}
      {renderLoading()}
    </div>
  );
};

export default Container; 