import React, { useState, useCallback, useRef } from 'react';
import { Spinner } from '../../atoms/Spinner/Spinner';
import { 
  PropriedadesCampoFormulario, 
  EstadoValidacao 
} from './CampoFormulario.types';
import styles from './CampoFormulario.module.css';

/**
 * Componente CampoFormulario - Molecule
 * 
 * Campo de formulário avançado com validação em tempo real,
 * indicadores visuais, contador de caracteres e acessibilidade completa.
 */
export const CampoFormulario: React.FC<PropriedadesCampoFormulario> = ({
  nome,
  valor,
  aoMudar,
  tipo = 'text',
  rotulo,
  ajuda,
  placeholder,
  obrigatorio = false,
  desabilitado = false,
  tamanho = 'medio',
  validacao,
  estadoValidacao,
  iconeEsquerda,
  iconeDireita,
  aoClicarIconeDireita,
  aoApertarEnter,
  aoFocar,
  aoDesfocar,
  validadorCustomizado,
  validacaoTempoReal = false,
  maxCaracteres,
  mostrarContador = false,
  className,
  id,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy
}) => {
  const [focado, setFocado] = useState(false);
  const [validacaoInterna, setValidacaoInterna] = useState<EstadoValidacao | null>(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [animandoErro, setAnimandoErro] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutValidacao = useRef<number | null>(null);
  
  // Estado de validação final (externo ou interno)
  const estadoFinal = estadoValidacao || validacaoInterna;
  
  // Validação de email
  const validarEmail = (email: string): boolean => {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
  };
  
  // Validação de URL
  const validarUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  
  // Calcular força da senha
  const calcularForcaSenha = (senha: string): number => {
    let forca = 0;
    if (senha.length >= 8) forca++;
    if (/[a-z]/.test(senha)) forca++;
    if (/[A-Z]/.test(senha)) forca++;
    if (/[0-9]/.test(senha)) forca++;
    if (/[^A-Za-z0-9]/.test(senha)) forca++;
    return Math.min(forca, 4);
  };
  
  // Executar validação
  const executarValidacao = useCallback((valorParaValidar: string): EstadoValidacao => {
    if (!validacao && !validadorCustomizado && !obrigatorio) {
      return { valido: true };
    }
    
    // Verificar se é obrigatório
    if (obrigatorio && !valorParaValidar.trim()) {
      return {
        valido: false,
        mensagem: 'Este campo é obrigatório',
        tipoErro: 'obrigatorio'
      };
    }
    
    // Se vazio e não obrigatório, é válido
    if (!valorParaValidar.trim() && !obrigatorio) {
      return { valido: true };
    }
    
    // Validações das regras
    if (validacao) {
      // Comprimento mínimo
      if (validacao.minimo && valorParaValidar.length < validacao.minimo) {
        return {
          valido: false,
          mensagem: `Mínimo de ${validacao.minimo} caracteres`,
          tipoErro: 'minimo'
        };
      }
      
      // Comprimento máximo
      if (validacao.maximo && valorParaValidar.length > validacao.maximo) {
        return {
          valido: false,
          mensagem: `Máximo de ${validacao.maximo} caracteres`,
          tipoErro: 'maximo'
        };
      }
      
      // Validação de email
      if (validacao.email && !validarEmail(valorParaValidar)) {
        return {
          valido: false,
          mensagem: 'Email inválido',
          tipoErro: 'email'
        };
      }
      
      // Validação de URL
      if (validacao.url && !validarUrl(valorParaValidar)) {
        return {
          valido: false,
          mensagem: 'URL inválida',
          tipoErro: 'url'
        };
      }
      
      // Validação de número
      if (validacao.numero && isNaN(Number(valorParaValidar))) {
        return {
          valido: false,
          mensagem: 'Deve ser um número válido',
          tipoErro: 'numero'
        };
      }
      
      // Valor mínimo (números)
      if (validacao.valorMinimo && Number(valorParaValidar) < validacao.valorMinimo) {
        return {
          valido: false,
          mensagem: `Valor mínimo: ${validacao.valorMinimo}`,
          tipoErro: 'valorMinimo'
        };
      }
      
      // Valor máximo (números)
      if (validacao.valorMaximo && Number(valorParaValidar) > validacao.valorMaximo) {
        return {
          valido: false,
          mensagem: `Valor máximo: ${validacao.valorMaximo}`,
          tipoErro: 'valorMaximo'
        };
      }
      
      // Padrão regex
      if (validacao.padrao && !validacao.padrao.test(valorParaValidar)) {
        return {
          valido: false,
          mensagem: validacao.mensagemPadrao || 'Formato inválido',
          tipoErro: 'padrao'
        };
      }
      
      // Valores permitidos
      if (validacao.valoresPermitidos && !validacao.valoresPermitidos.includes(valorParaValidar)) {
        return {
          valido: false,
          mensagem: 'Valor não permitido',
          tipoErro: 'valorNaoPermitido'
        };
      }
      
      // Validação customizada das regras
      if (validacao.customizada) {
        const resultado = validacao.customizada(valorParaValidar);
        if (resultado) {
          return {
            valido: false,
            mensagem: resultado,
            tipoErro: 'customizado'
          };
        }
      }
    }
    
    // Validador customizado do componente
    if (validadorCustomizado) {
      const resultado = validadorCustomizado(valorParaValidar);
      if (resultado) {
        return {
          valido: false,
          mensagem: resultado,
          tipoErro: 'customizado'
        };
      }
    }
    
    return { valido: true };
  }, [validacao, validadorCustomizado, obrigatorio]);
  
  // Validação com debounce
  const validarComDebounce = useCallback((valorParaValidar: string) => {
    if (timeoutValidacao.current) {
      clearTimeout(timeoutValidacao.current);
    }
    
    setValidacaoInterna({ valido: true, validando: true });
    
    timeoutValidacao.current = window.setTimeout(() => {
      const resultado = executarValidacao(valorParaValidar);
      setValidacaoInterna(resultado);
      
      // Animação de erro
      if (!resultado.valido) {
        setAnimandoErro(true);
        setTimeout(() => setAnimandoErro(false), 500);
      }
    }, 300);
  }, [executarValidacao]);
  
  // Manipulador de mudança
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const novoValor = event.target.value;
    
    // Verificar limite de caracteres
    if (maxCaracteres && novoValor.length > maxCaracteres) {
      return;
    }
    
    aoMudar(novoValor);
    
    // Validação em tempo real
    if (validacaoTempoReal && (validacao || validadorCustomizado || obrigatorio)) {
      validarComDebounce(novoValor);
    }
  };
  
  // Manipulador de foco
  const handleFocus = () => {
    setFocado(true);
    aoFocar?.();
  };
  
  // Manipulador de desfoco
  const handleBlur = () => {
    setFocado(false);
    aoDesfocar?.();
    
    // Validar ao sair do campo
    if (!validacaoTempoReal && (validacao || validadorCustomizado || obrigatorio)) {
      const resultado = executarValidacao(valor);
      setValidacaoInterna(resultado);
      
      if (!resultado.valido) {
        setAnimandoErro(true);
        setTimeout(() => setAnimandoErro(false), 500);
      }
    }
  };
  
  // Manipulador de tecla
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && aoApertarEnter) {
      aoApertarEnter();
    }
  };
  
  // Toggle mostrar/ocultar senha
  const toggleMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };
  
  // Renderizar indicador de validação
  const renderizarIndicadorValidacao = () => {
    if (!estadoFinal) return null;
    
    if (estadoFinal.validando) {
      return (
        <span className={`${styles['indicador-validacao']} ${styles['indicador-validacao--validando']}`}>
          <Spinner tamanho="pequeno" />
        </span>
      );
    }
    
    if (estadoFinal.valido) {
      return (
        <span className={`${styles['indicador-validacao']} ${styles['indicador-validacao--sucesso']}`}>
          ✓
        </span>
      );
    }
    
    return (
      <span className={`${styles['indicador-validacao']} ${styles['indicador-validacao--erro']}`}>
        ✕
      </span>
    );
  };
  
  // Renderizar contador de caracteres
  const renderizarContador = () => {
    if (!mostrarContador && !maxCaracteres) return null;
    
    const atual = valor.length;
    const limite = maxCaracteres || 0;
    const porcentagem = limite > 0 ? (atual / limite) * 100 : 0;
    
    let classeContador = styles.contador;
    if (porcentagem >= 90) {
      classeContador += ` ${styles['contador--limite-proximo']}`;
    }
    if (porcentagem > 100) {
      classeContador += ` ${styles['contador--limite-excedido']}`;
    }
    
    return (
      <div className={classeContador}>
        <span className={styles['contador-texto']}>
          {mostrarContador && <span>{atual}</span>}
          {maxCaracteres && <span>/ {maxCaracteres}</span>}
        </span>
      </div>
    );
  };
  
  // Renderizar barra de força da senha
  const renderizarBarraForcaSenha = () => {
    if (tipo !== 'password' || !valor) return null;
    
    const forca = calcularForcaSenha(valor);
    
    return (
      <div className={styles['barra-forca']}>
        {[1, 2, 3, 4].map((nivel) => (
          <div
            key={nivel}
            className={`${styles['barra-forca-item']} ${
              nivel <= forca ? styles['barra-forca-item--ativa'] : ''
            } ${
              forca >= 3 && nivel <= forca ? styles['barra-forca-item--forte'] : 
              forca === 2 && nivel <= forca ? styles['barra-forca-item--media'] : ''
            }`}
          />
        ))}
      </div>
    );
  };
  
  // Classes CSS
  const classesCampo = [
    styles.campo,
    className
  ].filter(Boolean).join(' ');
  
  const classesRotulo = [
    styles.rotulo,
    obrigatorio ? styles['rotulo--obrigatorio'] : '',
    focado ? styles['rotulo--focado'] : '',
    estadoFinal?.valido === false ? styles['rotulo--erro'] : '',
    estadoFinal?.valido === true && valor ? styles['rotulo--sucesso'] : ''
  ].filter(Boolean).join(' ');
  
  const classesInput = [
    styles.input,
    styles[`input--${tamanho}`],
    iconeEsquerda ? styles['input--com-icone-esquerda'] : '',
    (iconeDireita || tipo === 'password') ? styles['input--com-icone-direita'] : '',
    estadoFinal?.valido === false ? styles['input--erro'] : '',
    estadoFinal?.valido === true && valor ? styles['input--sucesso'] : '',
    estadoFinal?.validando ? styles['input--validando'] : '',
    animandoErro ? styles['input--erro-animacao'] : ''
  ].filter(Boolean).join(' ');
  
  // Tipo do input (considerando mostrar/ocultar senha)
  const tipoInput = tipo === 'password' && mostrarSenha ? 'text' : tipo;
  
  return (
    <div className={classesCampo}>
      <label htmlFor={id || nome} className={classesRotulo}>
        {rotulo}
      </label>
      
      <div className={styles['input-container']}>
        <div className={styles['input-wrapper']}>
          {iconeEsquerda && (
            <span className={`${styles.icone} ${styles['icone--esquerda']}`}>
              {iconeEsquerda}
            </span>
          )}
          
          <input
            ref={inputRef}
            id={id || nome}
            name={nome}
            type={tipoInput}
            value={valor}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={desabilitado}
            required={obrigatorio}
            maxLength={maxCaracteres}
            className={classesInput}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
            aria-invalid={estadoFinal?.valido === false}
          />
          
          {(iconeDireita || tipo === 'password') && (
            <span 
              className={`${styles.icone} ${styles['icone--direita']}`}
              onClick={tipo === 'password' ? toggleMostrarSenha : aoClicarIconeDireita}
            >
              {tipo === 'password' 
                ? (mostrarSenha ? '👁️' : '👁️‍🗨️')
                : iconeDireita
              }
            </span>
          )}
          
          {renderizarIndicadorValidacao()}
        </div>
      </div>
      
      {estadoFinal?.mensagem && (
        <div className={`${styles.mensagem} ${styles['mensagem--erro']}`}>
          <span className={styles['mensagem-icone']}>⚠️</span>
          {estadoFinal.mensagem}
        </div>
      )}
      
      {ajuda && !estadoFinal?.mensagem && (
        <div className={`${styles.mensagem} ${styles['mensagem--ajuda']}`}>
          <span className={styles['mensagem-icone']}>💡</span>
          {ajuda}
        </div>
      )}
      
      {renderizarContador()}
      {renderizarBarraForcaSenha()}
    </div>
  );
};

// Componente com React.memo para otimização
export default React.memo(CampoFormulario); 