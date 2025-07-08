import React, { useState, useCallback } from 'react';
import { PropriedadesSwitch } from './Switch.types';
import styles from './Switch.module.css';

/**
 * Componente Switch - Controle de alternância booleana
 * 
 * @param props - Propriedades do componente
 * @returns Elemento JSX do switch
 */
export const Switch: React.FC<PropriedadesSwitch> = ({
  ativo,
  aoAlterar,
  tamanho = 'medio',
  desabilitado = false,
  rotulo,
  descricao,
  id,
  nome,
  className
}) => {
  const [focado, setFocado] = useState(false);
  
  // ID único para acessibilidade
  const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;
  
  // Manipulador de clique
  const handleClick = useCallback(() => {
    if (!desabilitado) {
      aoAlterar(!ativo);
    }
  }, [ativo, aoAlterar, desabilitado]);
  
  // Manipulador de teclado
  const handleKeyDown = useCallback((evento: React.KeyboardEvent) => {
    if (evento.key === ' ' || evento.key === 'Enter') {
      evento.preventDefault();
      handleClick();
    }
  }, [handleClick]);
  
  // Classes CSS dinâmicas
  const switchClasses = [
    styles.switch,
    styles[`switch--${tamanho}`],
    desabilitado && styles['switch--desabilitado'],
    className
  ].filter(Boolean).join(' ');
  
  const trackClasses = [
    styles.track,
    ativo && styles['track--ativo'],
    focado && styles['track--focado']
  ].filter(Boolean).join(' ');
  
  const thumbClasses = [
    styles.thumb,
    ativo && styles['thumb--ativo']
  ].filter(Boolean).join(' ');
  
  return (
    <div className={switchClasses}>
      <div
        className={trackClasses}
        role="switch"
        aria-checked={ativo}
        aria-disabled={desabilitado}
        aria-labelledby={rotulo ? `${switchId}-label` : undefined}
        aria-describedby={descricao ? `${switchId}-desc` : undefined}
        tabIndex={desabilitado ? -1 : 0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocado(true)}
        onBlur={() => setFocado(false)}
      >
        <div className={thumbClasses} />
        
        {/* Input oculto para formulários */}
        <input
          type="checkbox"
          className={styles.input}
          checked={ativo}
          disabled={desabilitado}
          name={nome}
          id={switchId}
          onChange={() => {}} // Controlado pelo onClick
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>
      
      {/* Rótulo */}
      {rotulo && (
        <label
          id={`${switchId}-label`}
          htmlFor={switchId}
          className={styles.rotulo}
        >
          {rotulo}
        </label>
      )}
      
      {/* Descrição */}
      {descricao && (
        <div
          id={`${switchId}-desc`}
          className={styles.descricao}
        >
          {descricao}
        </div>
      )}
    </div>
  );
};

Switch.displayName = 'Switch';

export default Switch; 