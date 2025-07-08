import React, { useState, useId } from 'react';
import { PropriedadesInput } from './Input.types';
import styles from './Input.module.css';

/**
 * Componente Input - Campo de entrada de dados
 * 
 * @param props - Propriedades do componente
 * @returns Elemento JSX do input
 */
export const Input: React.FC<PropriedadesInput> = ({
  valor = '',
  aoMudar,
  tipo = 'text',
  tamanho = 'medio',
  placeholder,
  label,
  erro,
  ajuda,
  obrigatorio = false,
  desabilitado = false,
  somenteEscrita = false,
  iconeEsquerda,
  iconeDireita,
  aoApertarEnter,
  aoFocar,
  aoDesfocar,
  className = '',
  id,
  nome,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}) => {
  const [valorInterno, setValorInterno] = useState(valor);
  const inputId = useId();
  const finalId = id || inputId;
  
  // IDs para mensagens de ajuda e erro
  const ajudaId = `${finalId}-ajuda`;
  const erroId = `${finalId}-erro`;
  
  // Construir aria-describedby
  const descricoes = [
    ariaDescribedBy,
    ajuda && ajudaId,
    erro && erroId,
  ].filter(Boolean).join(' ');

  // Construir classes CSS do input
  const inputClasses = [
    styles.input,
    styles[`input--${tamanho}`],
    erro && styles['input--erro'],
    iconeEsquerda && styles['input--com-icone-esquerda'],
    iconeDireita && styles['input--com-icone-direita'],
  ]
    .filter(Boolean)
    .join(' ');

  // Construir classes CSS do container
  const containerClasses = [
    styles.container,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Handler de mudança
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const novoValor = event.target.value;
    setValorInterno(novoValor);
    
    if (aoMudar) {
      aoMudar(novoValor);
    }
  };

  // Handler de tecla pressionada
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && aoApertarEnter) {
      aoApertarEnter();
    }
  };

  return (
    <div className={containerClasses}>
      {label && (
        <label 
          htmlFor={finalId}
          className={`${styles.label} ${obrigatorio ? styles['label--obrigatorio'] : ''}`}
        >
          {label}
        </label>
      )}
      
      <div className={styles['input-wrapper']}>
        {iconeEsquerda && (
          <span className={`${styles.icone} ${styles['icone--esquerda']}`}>
            {iconeEsquerda}
          </span>
        )}
        
        <input
          id={finalId}
          name={nome}
          type={tipo}
          value={valorInterno}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={aoFocar}
          onBlur={aoDesfocar}
          placeholder={placeholder}
          disabled={desabilitado}
          readOnly={somenteEscrita}
          required={obrigatorio}
          className={inputClasses}
          aria-label={ariaLabel}
          aria-describedby={descricoes || undefined}
          aria-invalid={!!erro}
        />
        
        {iconeDireita && (
          <span className={`${styles.icone} ${styles['icone--direita']}`}>
            {iconeDireita}
          </span>
        )}
      </div>
      
      {erro && (
        <span 
          id={erroId}
          className={`${styles.mensagem} ${styles['mensagem--erro']}`}
          role="alert"
        >
          {erro}
        </span>
      )}
      
      {ajuda && !erro && (
        <span 
          id={ajudaId}
          className={`${styles.mensagem} ${styles['mensagem--ajuda']}`}
        >
          {ajuda}
        </span>
      )}
    </div>
  );
};

export default Input; 