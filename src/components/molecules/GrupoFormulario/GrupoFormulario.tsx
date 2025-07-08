import React, { useState, useRef } from 'react';
import { Tooltip } from '../../atoms/Tooltip/Tooltip';
import { 
  PropriedadesGrupoFormulario, 
  AcaoGrupo
} from './GrupoFormulario.types';
import styles from './GrupoFormulario.module.css';

/**
 * Componente GrupoFormulario - Molecule
 * 
 * Agrupa campos de formulário com funcionalidades avançadas como
 * colapso, validação, progresso e diferentes layouts.
 */
export const GrupoFormulario: React.FC<PropriedadesGrupoFormulario> = ({
  titulo,
  descricao,
  children,
  layout = 'vertical',
  colunas = 2,
  espacamento = 'medio',
  colapsavel = false,
  inicialmenteColapsado = false,
  desabilitado = false,
  variante = 'padrao',
  icone,
  acoes = [],
  estadoValidacao,
  mostrarProgresso = false,
  aoAlternarColapso,
  aoClicarAcao,
  className,
  id
}) => {
  const [colapsado, setColapsado] = useState(inicialmenteColapsado);
  const [aparecendo, setAparecendo] = useState(false);
  const conteudoRef = useRef<HTMLDivElement>(null);
  
  // Manipular colapso
  const alternarColapso = () => {
    const novoEstado = !colapsado;
    setColapsado(novoEstado);
    
    if (!novoEstado) {
      setAparecendo(true);
      setTimeout(() => setAparecendo(false), 300);
    }
    
    aoAlternarColapso?.(novoEstado);
  };
  
  // Manipular clique em ação
  const handleAcaoClick = (acao: AcaoGrupo) => {
    if (acao.desabilitada) return;
    
    // Ações padrão
    switch (acao.tipo) {
      case 'expandir':
        setColapsado(false);
        aoAlternarColapso?.(false);
        break;
      case 'colapsar':
        setColapsado(true);
        aoAlternarColapso?.(true);
        break;
      default:
        aoClicarAcao?.(acao);
        break;
    }
  };
  
  // Renderizar ações
  const renderizarAcoes = () => {
    if (acoes.length === 0) return null;
    
    return (
      <div className={styles.acoes}>
        {acoes.map((acao) => (
          <Tooltip
            key={acao.id}
            conteudo={acao.tooltip || acao.rotulo}
            posicao="cima"
          >
            <button
              className={`${styles.acao} ${
                acao.variante ? styles[`acao--${acao.variante}`] : ''
              }`}
              onClick={() => handleAcaoClick(acao)}
              disabled={acao.desabilitada}
              aria-label={acao.rotulo}
            >
              {acao.icone || getIconeAcao(acao.tipo)}
            </button>
          </Tooltip>
        ))}
      </div>
    );
  };
  
  // Obter ícone padrão para tipo de ação
  const getIconeAcao = (tipo: AcaoGrupo['tipo']) => {
    switch (tipo) {
      case 'limpar': return '🧹';
      case 'resetar': return '🔄';
      case 'validar': return '✅';
      case 'salvar': return '💾';
      case 'expandir': return '📂';
      case 'colapsar': return '📁';
      default: return '⚙️';
    }
  };
  
  // Renderizar progresso
  const renderizarProgresso = () => {
    if (!mostrarProgresso || !estadoValidacao) return null;
    
    const progresso = estadoValidacao.progresso || 0;
    const { camposValidos, totalCampos } = estadoValidacao;
    
    return (
      <div className={styles['progresso-container']}>
        <div className={styles['barra-progresso']}>
          <div 
            className={`${styles['barra-progresso-preenchimento']} ${
              progresso === 100 ? styles['barra-progresso-preenchimento--completo'] : ''
            }`}
            style={{ width: `${progresso}%` }}
          />
        </div>
        <span className={styles['texto-progresso']}>
          {camposValidos}/{totalCampos} ({progresso.toFixed(0)}%)
        </span>
      </div>
    );
  };
  
  // Renderizar contador
  const renderizarContador = () => {
    if (!estadoValidacao) return null;
    
    const { camposValidos, totalCampos } = estadoValidacao;
    const completo = camposValidos === totalCampos;
    
    return (
      <div className={`${styles.contador} ${
        completo ? styles['contador--completo'] : styles['contador--incompleto']
      }`}>
        <span className={styles['contador-numero']}>
          {camposValidos}
        </span>
        <span>/</span>
        <span className={styles['contador-numero']}>
          {totalCampos}
        </span>
        <span>campos</span>
      </div>
    );
  };
  
  // Renderizar erros
  const renderizarErros = () => {
    if (!estadoValidacao?.erros || estadoValidacao.erros.length === 0) {
      return null;
    }
    
    return (
      <div className={styles['erros-grupo']}>
        {estadoValidacao.erros.map((erro, index) => (
          <div key={index} className={styles['erro-item']}>
            <span className={styles['erro-icone']}>⚠️</span>
            <span>{erro}</span>
          </div>
        ))}
      </div>
    );
  };
  
  // Renderizar cabeçalho
  const renderizarCabecalho = () => {
    if (!titulo && !colapsavel && acoes.length === 0) return null;
    
    return (
      <div 
        className={`${styles.cabecalho} ${
          colapsavel ? styles['cabecalho--clicavel'] : ''
        }`}
        onClick={colapsavel ? alternarColapso : undefined}
      >
        <div className={styles['info-titulo']}>
          {icone && (
            <span className={styles['icone-grupo']}>
              {icone}
            </span>
          )}
          
          {titulo && (
            <div className={styles['titulo-container']}>
              <h3 className={styles.titulo}>{titulo}</h3>
              {descricao && (
                <p className={styles.descricao}>{descricao}</p>
              )}
            </div>
          )}
          
          {renderizarContador()}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          {renderizarAcoes()}
          
          {colapsavel && (
            <span className={`${styles['indicador-colapso']} ${
              !colapsado ? styles['indicador-colapso--expandido'] : ''
            }`}>
              ▼
            </span>
          )}
        </div>
      </div>
    );
  };
  
  // Classes CSS
  const classesGrupo = [
    styles.grupo,
    styles[`grupo--${variante}`],
    desabilitado ? styles['grupo--desabilitado'] : '',
    estadoValidacao?.valido === false ? styles['grupo--erro'] : '',
    estadoValidacao?.valido === true ? styles['grupo--sucesso'] : '',
    estadoValidacao?.validando ? styles['grupo--validando'] : '',
    aparecendo ? styles['grupo--aparecendo'] : '',
    className
  ].filter(Boolean).join(' ');
  
  const classesCampos = [
    styles.campos,
    styles[`campos--${layout}`],
    styles[`campos--espacamento-${espacamento}`]
  ].filter(Boolean).join(' ');
  
  const classesConteudo = [
    styles.conteudo,
    colapsado ? styles['conteudo--colapsado'] : styles['conteudo--expandido']
  ].filter(Boolean).join(' ');
  
  // Estilos inline para grid
  const estilosGrid = layout === 'grid' ? {
    '--colunas': colunas
  } as React.CSSProperties : {};
  
  return (
    <div className={classesGrupo} id={id}>
      {renderizarCabecalho()}
      
      {mostrarProgresso && renderizarProgresso()}
      
      <div 
        ref={conteudoRef}
        className={classesConteudo}
        style={estilosGrid}
      >
        <div className={classesCampos}>
          {children}
        </div>
        
        {renderizarErros()}
      </div>
    </div>
  );
};

// Componente com React.memo para otimização
export default React.memo(GrupoFormulario); 