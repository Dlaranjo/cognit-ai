import React, { useState, useId, useEffect } from 'react';
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
  estado = 'normal',
  densidade = 'normal',
  placeholder,
  label,
  erro,
  ajuda,
  sucesso,
  aviso,
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
  validador,
  maxCaracteres,
  mostrarContador = false,
  ref,
}) => {
  const [valorInterno, setValorInterno] = useState(valor);
  const [mensagemValidacao, setMensagemValidacao] = useState<string | null>(null);
  const [validando, setValidando] = useState(false);
  const inputId = useId();
  const finalId = id || inputId;
  
  // IDs para mensagens
  const ajudaId = `${finalId}-ajuda`;
  const erroId = `${finalId}-erro`;
  const sucessoId = `${finalId}-sucesso`;
  const avisoId = `${finalId}-aviso`;
  const contadorId = `${finalId}-contador`;
  
  // Atualizar valor interno quando valor externo muda
  useEffect(() => {
    setValorInterno(valor);
  }, [valor]);
  
  // Determinar estado atual baseado em prioridade
  const estadoAtual = (() => {
    if (estado === 'loading' || validando) return 'loading';
    if (erro || mensagemValidacao) return 'error';
    if (sucesso) return 'success';
    if (aviso) return 'warning';
    return 'normal';
  })();
  
  // Construir aria-describedby
  const descricoes = [
    ariaDescribedBy,
    ajuda && ajudaId,
    erro && erroId,
    sucesso && sucessoId,
    aviso && avisoId,
    mostrarContador && contadorId,
  ].filter(Boolean).join(' ');

  // Construir classes CSS do input
  const inputClasses = [
    styles.input,
    styles[`input--${tamanho}`],
    styles[`input--${densidade}`],
    styles[`input--${estadoAtual}`],
    iconeEsquerda && styles['input--com-icone-esquerda'],
    (iconeDireita || estadoAtual === 'loading') && styles['input--com-icone-direita'],
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
    
    // Verificar limite de caracteres
    if (maxCaracteres && novoValor.length > maxCaracteres) {
      return;
    }
    
    setValorInterno(novoValor);
    
    if (aoMudar) {
      aoMudar(novoValor);
    }
    
    // Validação em tempo real
    if (validador) {
      setValidando(true);
      setTimeout(() => {
        const mensagem = validador(novoValor);
        setMensagemValidacao(mensagem);
        setValidando(false);
      }, 300);
    }
  };

  // Handler de tecla pressionada
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && aoApertarEnter) {
      aoApertarEnter();
    }
  };
  
  // Renderizar ícone baseado no estado
  const renderizarIconeEstado = () => {
    if (estadoAtual === 'loading') {
      return (
        <span className={`${styles.icone} ${styles['icone--direita']} ${styles['icone--estado']}`}>
          <span className={styles.spinner} />
        </span>
      );
    }
    
    if (estadoAtual === 'error') {
      return (
        <span className={`${styles.icone} ${styles['icone--direita']} ${styles['icone--estado']} ${styles['icone--erro']}`}>
          ⚠️
        </span>
      );
    }
    
    if (estadoAtual === 'success') {
      return (
        <span className={`${styles.icone} ${styles['icone--direita']} ${styles['icone--estado']} ${styles['icone--sucesso']}`}>
          ✓
        </span>
      );
    }
    
    if (estadoAtual === 'warning') {
      return (
        <span className={`${styles.icone} ${styles['icone--direita']} ${styles['icone--estado']} ${styles['icone--aviso']}`}>
          ⚠️
        </span>
      );
    }
    
    return null;
  };
  
  // Renderizar contador de caracteres
  const renderizarContador = () => {
    if (!mostrarContador && !maxCaracteres) return null;
    
    const atual = valorInterno.length;
    const limite = maxCaracteres || 0;
    const porcentagem = limite > 0 ? (atual / limite) * 100 : 0;
    
    return (
      <div 
        id={contadorId}
        className={`${styles.contador} ${
          porcentagem >= 90 ? styles['contador--limite-proximo'] : ''
        } ${
          porcentagem > 100 ? styles['contador--limite-excedido'] : ''
        }`}
      >
        {atual}{maxCaracteres && `/${maxCaracteres}`}
      </div>
    );
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
          ref={ref}
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
          maxLength={maxCaracteres}
          className={inputClasses}
          aria-label={ariaLabel}
          aria-describedby={descricoes || undefined}
          aria-invalid={estadoAtual === 'error'}
        />
        
        {iconeDireita && estadoAtual === 'normal' && (
          <span className={`${styles.icone} ${styles['icone--direita']}`}>
            {iconeDireita}
          </span>
        )}
        
        {renderizarIconeEstado()}
      </div>
      
      {/* Mensagem de erro (prioridade máxima) */}
      {(erro || mensagemValidacao) && (
        <span 
          id={erroId}
          className={`${styles.mensagem} ${styles['mensagem--erro']}`}
          role="alert"
        >
          {erro || mensagemValidacao}
        </span>
      )}
      
      {/* Mensagem de sucesso */}
      {sucesso && !erro && !mensagemValidacao && (
        <span 
          id={sucessoId}
          className={`${styles.mensagem} ${styles['mensagem--sucesso']}`}
        >
          {sucesso}
        </span>
      )}
      
      {/* Mensagem de aviso */}
      {aviso && !erro && !mensagemValidacao && !sucesso && (
        <span 
          id={avisoId}
          className={`${styles.mensagem} ${styles['mensagem--aviso']}`}
        >
          {aviso}
        </span>
      )}
      
      {/* Mensagem de ajuda */}
      {ajuda && !erro && !mensagemValidacao && !sucesso && !aviso && (
        <span 
          id={ajudaId}
          className={`${styles.mensagem} ${styles['mensagem--ajuda']}`}
        >
          {ajuda}
        </span>
      )}
      
      {/* Contador de caracteres */}
      {renderizarContador()}
    </div>
  );
};

// Componente com React.memo para otimização
export default React.memo(Input); 