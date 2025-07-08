import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PropriedadesTooltip } from './Tooltip.types';
import styles from './Tooltip.module.css';

/**
 * Componente Tooltip - Dica contextual
 * 
 * @param props - Propriedades do componente
 * @returns Elemento JSX do tooltip
 */
export const Tooltip: React.FC<PropriedadesTooltip> = ({
  conteudo,
  children,
  posicao = 'cima',
  trigger = 'hover',
  visivel: visivelControlado,
  delayMostrar = 500,
  delayEsconder = 200,
  comSeta = true,
  tamanhoMaximo = 'medio',
  interativo = false,
  aoMostrar,
  aoEsconder,
  className,
  id
}) => {
  const [visivelInterno, setVisivelInterno] = useState(false);
  const [posicaoCalculada, setPosicaoCalculada] = useState<'cima' | 'baixo' | 'esquerda' | 'direita'>(posicao === 'auto' ? 'cima' : posicao);
  
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutMostrar = useRef<number | undefined>(undefined);
  const timeoutEsconder = useRef<number | undefined>(undefined);
  
  // Controle de visibilidade
  const visivel = visivelControlado !== undefined ? visivelControlado : visivelInterno;
  
  // ID único para acessibilidade
  const tooltipId = id || `tooltip-${Math.random().toString(36).substr(2, 9)}`;
  
  // Calcular posição automática
  const calcularPosicao = useCallback(() => {
    if (posicao !== 'auto' || !wrapperRef.current || !tooltipRef.current) {
      return;
    }
    
    const wrapper = wrapperRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    // Verificar espaço disponível em cada direção
    const espacoCima = wrapper.top;
    const espacoBaixo = viewport.height - wrapper.bottom;
    const espacoEsquerda = wrapper.left;
    const espacoDireita = viewport.width - wrapper.right;
    
    // Escolher a posição com mais espaço
    const espacos = [
      { posicao: 'cima' as const, espaco: espacoCima },
      { posicao: 'baixo' as const, espaco: espacoBaixo },
      { posicao: 'esquerda' as const, espaco: espacoEsquerda },
      { posicao: 'direita' as const, espaco: espacoDireita }
    ];
    
    const melhorPosicao = espacos.reduce((melhor, atual) => 
      atual.espaco > melhor.espaco ? atual : melhor
    );
    
    setPosicaoCalculada(melhorPosicao.posicao);
  }, [posicao]);
  
  // Mostrar tooltip
  const mostrarTooltip = useCallback(() => {
    if (timeoutEsconder.current) {
      clearTimeout(timeoutEsconder.current);
    }
    
    timeoutMostrar.current = setTimeout(() => {
      calcularPosicao();
      setVisivelInterno(true);
      aoMostrar?.();
    }, delayMostrar);
  }, [delayMostrar, calcularPosicao, aoMostrar]);
  
  // Esconder tooltip
  const esconderTooltip = useCallback(() => {
    if (timeoutMostrar.current) {
      clearTimeout(timeoutMostrar.current);
    }
    
    timeoutEsconder.current = setTimeout(() => {
      setVisivelInterno(false);
      aoEsconder?.();
    }, delayEsconder);
  }, [delayEsconder, aoEsconder]);
  
  // Manipuladores de eventos
  const handleMouseEnter = useCallback(() => {
    if (trigger === 'hover') {
      mostrarTooltip();
    }
  }, [trigger, mostrarTooltip]);
  
  const handleMouseLeave = useCallback(() => {
    if (trigger === 'hover' && !interativo) {
      esconderTooltip();
    }
  }, [trigger, interativo, esconderTooltip]);
  
  const handleFocus = useCallback(() => {
    if (trigger === 'focus' || trigger === 'hover') {
      mostrarTooltip();
    }
  }, [trigger, mostrarTooltip]);
  
  const handleBlur = useCallback(() => {
    if (trigger === 'focus' || trigger === 'hover') {
      esconderTooltip();
    }
  }, [trigger, esconderTooltip]);
  
  const handleClick = useCallback(() => {
    if (trigger === 'click') {
      if (visivel) {
        esconderTooltip();
      } else {
        mostrarTooltip();
      }
    }
  }, [trigger, visivel, mostrarTooltip, esconderTooltip]);
  
  // Manipulador de teclado para acessibilidade
  const handleKeyDown = useCallback((evento: React.KeyboardEvent) => {
    if (evento.key === 'Escape' && visivel) {
      esconderTooltip();
    }
  }, [visivel, esconderTooltip]);
  
  // Cleanup dos timeouts
  useEffect(() => {
    return () => {
      if (timeoutMostrar.current) {
        clearTimeout(timeoutMostrar.current);
      }
      if (timeoutEsconder.current) {
        clearTimeout(timeoutEsconder.current);
      }
    };
  }, []);
  
  // Classes CSS dinâmicas
  const tooltipClasses = [
    styles.tooltip,
    styles[`tooltip--${posicaoCalculada}`],
    styles[`tooltip--${tamanhoMaximo}`],
    visivel && styles['tooltip--visivel'],
    interativo && styles['tooltip--interativo'],
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {/* Elemento filho que ativa o tooltip */}
      {React.cloneElement(children as React.ReactElement, {
        'aria-describedby': tooltipId
      } as any)}
      
      {/* Tooltip */}
      <div
        ref={tooltipRef}
        id={tooltipId}
        className={tooltipClasses}
        role="tooltip"
        aria-hidden={!visivel}
        onMouseEnter={interativo ? () => {
          if (timeoutEsconder.current) {
            clearTimeout(timeoutEsconder.current);
          }
        } : undefined}
        onMouseLeave={interativo ? esconderTooltip : undefined}
      >
        {conteudo}
        
        {/* Seta */}
        {comSeta && <div className={styles.seta} />}
      </div>
    </div>
  );
};

Tooltip.displayName = 'Tooltip';

export default Tooltip; 