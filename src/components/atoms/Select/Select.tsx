import React, { useState, useRef, useEffect, useCallback, useId } from 'react';
import { Icon } from '../Icon';
import { Input } from '../Input';
import { PropriedadesSelect, OpcaoSelect, GrupoOpcoes } from './Select.types';
import styles from './Select.module.css';

/**
 * Componente Select - Seletor dropdown avançado
 * 
 * @param props - Propriedades do componente
 * @returns Elemento JSX do select
 */
export const Select: React.FC<PropriedadesSelect> = ({
  valor,
  aoMudar,
  opcoes = [],
  grupos = [],
  tamanho = 'medio',
  estado = 'normal',
  densidade = 'normal',
  placeholder = 'Selecione uma opção',
  label,
  erro,
  ajuda,
  sucesso,
  aviso,
  obrigatório = false,
  desabilitado = false,
  buscavel = false,
  placeholderBusca = 'Buscar...',
  funcaoBusca,
  limpavel = false,
  multiplo = false,
  valoresMultiplos = [],
  aoMudarMultiplos,
  maxSelecionados,
  textoVazio = 'Nenhuma opção disponível',
  textoSemResultados = 'Nenhum resultado encontrado',
  textoCarregando = 'Carregando...',
  carregandoOpcoes = false,
  aoFocar,
  aoDesfocar,
  aoAbrir,
  aoFechar,
  className = '',
  id,
  nome,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ref,
  renderizarOpcao,
  renderizarValorSelecionado,
  posicaoDropdown = 'auto',
  larguraDropdown = 'match',
}) => {
  const [aberto, setAberto] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [opcaoFocada, setOpcaoFocada] = useState<number>(-1);
  const [posicaoCalculada, setPosicaoCalculada] = useState<'top' | 'bottom'>('bottom');
  
  const selectId = useId();
  const finalId = id || selectId;
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputBuscaRef = useRef<HTMLInputElement>(null);
  
  // Combinar opções simples e grupos
  const todasOpcoes = [...opcoes, ...grupos.flatMap(grupo => grupo.opcoes)];
  
  // Filtrar opções baseado na busca
  const opcoesFiltradas = termoBusca && buscavel
    ? funcaoBusca
      ? funcaoBusca(termoBusca, todasOpcoes)
      : todasOpcoes.filter(opcao => 
          opcao.rotulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
          opcao.descricao?.toLowerCase().includes(termoBusca.toLowerCase())
        )
    : todasOpcoes;
  
  // Encontrar opção selecionada
  const opcaoSelecionada = todasOpcoes.find(opcao => opcao.valor === valor);
  
  // Encontrar opções selecionadas (múltiplo)
  const opcoesSelecionadas = multiplo 
    ? todasOpcoes.filter(opcao => valoresMultiplos.includes(opcao.valor))
    : [];
  
  // Calcular posição do dropdown
  const calcularPosicao = useCallback(() => {
    if (!containerRef.current || posicaoDropdown !== 'auto') {
      setPosicaoCalculada(posicaoDropdown === 'top' ? 'top' : 'bottom');
      return;
    }
    
    const rect = containerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    
    setPosicaoCalculada(spaceBelow < 200 && spaceAbove > 200 ? 'top' : 'bottom');
  }, [posicaoDropdown]);
  
  // Abrir dropdown
  const abrirDropdown = useCallback(() => {
    if (desabilitado || carregandoOpcoes) return;
    
    setAberto(true);
    setOpcaoFocada(-1);
    calcularPosicao();
    aoAbrir?.();
    
    // Focar no campo de busca se disponível
    if (buscavel) {
      setTimeout(() => inputBuscaRef.current?.focus(), 100);
    }
  }, [desabilitado, carregandoOpcoes, calcularPosicao, aoAbrir, buscavel]);
  
  // Fechar dropdown
  const fecharDropdown = useCallback(() => {
    setAberto(false);
    setTermoBusca('');
    setOpcaoFocada(-1);
    aoFechar?.();
  }, [aoFechar]);
  
  // Selecionar opção
  const selecionarOpcao = useCallback((opcao: OpcaoSelect) => {
    if (opcao.desabilitada) return;
    
    if (multiplo) {
      const novosValores = valoresMultiplos.includes(opcao.valor)
        ? valoresMultiplos.filter(v => v !== opcao.valor)
        : [...valoresMultiplos, opcao.valor];
      
      // Verificar limite máximo
      if (maxSelecionados && novosValores.length > maxSelecionados) {
        return;
      }
      
      aoMudarMultiplos?.(novosValores);
    } else {
      aoMudar?.(opcao.valor);
      fecharDropdown();
    }
  }, [multiplo, valoresMultiplos, maxSelecionados, aoMudarMultiplos, aoMudar, fecharDropdown]);
  
  // Limpar seleção
  const limparSelecao = useCallback(() => {
    if (multiplo) {
      aoMudarMultiplos?.([]);
    } else {
      aoMudar?.(null);
    }
  }, [multiplo, aoMudarMultiplos, aoMudar]);
  
  // Navegação por teclado
  const navegarTeclado = useCallback((event: React.KeyboardEvent) => {
    if (!aberto) {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
        event.preventDefault();
        abrirDropdown();
      }
      return;
    }
    
    const opcoes = opcoesFiltradas.filter(opcao => !opcao.desabilitada);
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setOpcaoFocada(prev => Math.min(prev + 1, opcoes.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setOpcaoFocada(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        event.preventDefault();
        if (opcaoFocada >= 0 && opcoes[opcaoFocada]) {
          selecionarOpcao(opcoes[opcaoFocada]);
        }
        break;
      case 'Escape':
        event.preventDefault();
        fecharDropdown();
        break;
    }
  }, [aberto, opcoesFiltradas, opcaoFocada, abrirDropdown, selecionarOpcao, fecharDropdown]);
  
  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        fecharDropdown();
      }
    };
    
    if (aberto) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('scroll', calcularPosicao);
      window.addEventListener('resize', calcularPosicao);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', calcularPosicao);
      window.removeEventListener('resize', calcularPosicao);
    };
  }, [aberto, fecharDropdown, calcularPosicao]);
  
  // Determinar estado atual
  const estadoAtual = (() => {
    if (estado === 'loading' || carregandoOpcoes) return 'loading';
    if (erro) return 'error';
    if (sucesso) return 'success';
    if (aviso) return 'warning';
    return 'normal';
  })();
  
  // Classes CSS
  const classesContainer = [
    styles.container,
    className,
  ].filter(Boolean).join(' ');
  
  const classesSelect = [
    styles.select,
    styles[`select--${tamanho}`],
    styles[`select--${densidade}`],
    styles[`select--${estadoAtual}`],
    aberto && styles['select--aberto'],
    desabilitado && styles['select--desabilitado'],
  ].filter(Boolean).join(' ');
  
  const classesDropdown = [
    styles.dropdown,
    styles[`dropdown--${posicaoCalculada}`],
    aberto && styles['dropdown--aberto'],
  ].filter(Boolean).join(' ');
  
  // Renderizar valor selecionado
  const renderizarValor = () => {
    if (multiplo && opcoesSelecionadas.length > 0) {
      if (opcoesSelecionadas.length === 1) {
        const opcao = opcoesSelecionadas[0];
        return renderizarValorSelecionado ? renderizarValorSelecionado(opcao) : opcao.rotulo;
      }
      return `${opcoesSelecionadas.length} itens selecionados`;
    }
    
    if (opcaoSelecionada) {
      return renderizarValorSelecionado 
        ? renderizarValorSelecionado(opcaoSelecionada) 
        : opcaoSelecionada.rotulo;
    }
    
    return placeholder;
  };
  
  // Renderizar opção no dropdown
  const renderizarOpcaoDropdown = (opcao: OpcaoSelect, index: number) => {
    const selecionada = multiplo 
      ? valoresMultiplos.includes(opcao.valor)
      : opcao.valor === valor;
    const focada = index === opcaoFocada;
    
    const classesOpcao = [
      styles.opcao,
      selecionada && styles['opcao--selecionada'],
      focada && styles['opcao--focada'],
      opcao.desabilitada && styles['opcao--desabilitada'],
    ].filter(Boolean).join(' ');
    
    return (
      <div
        key={opcao.valor}
        className={classesOpcao}
        onClick={() => selecionarOpcao(opcao)}
        role=\"option\"
        aria-selected={selecionada}
        aria-disabled={opcao.desabilitada}
      >
        {renderizarOpcao ? renderizarOpcao(opcao, selecionada) : (
          <div className={styles['opcao-conteudo']}>
            {opcao.icone && (
              <span className={styles['opcao-icone']}>
                {opcao.icone}
              </span>
            )}
            <div className={styles['opcao-texto']}>
              <span className={styles['opcao-rotulo']}>{opcao.rotulo}</span>
              {opcao.descricao && (
                <span className={styles['opcao-descricao']}>{opcao.descricao}</span>
              )}
            </div>
            {multiplo && selecionada && (
              <Icon tipo=\"check\" tamanho=\"sm\" className={styles['opcao-check']} />
            )}
          </div>
        )}
      </div>
    );
  };
  
  // Renderizar conteúdo do dropdown
  const renderizarConteudoDropdown = () => {
    if (carregandoOpcoes) {
      return (
        <div className={styles.estado}>
          <Icon tipo=\"loading\" tamanho=\"sm\" girando />
          <span>{textoCarregando}</span>
        </div>
      );
    }
    
    if (opcoesFiltradas.length === 0) {
      return (
        <div className={styles.estado}>
          <Icon tipo=\"search\" tamanho=\"sm\" />
          <span>{termoBusca ? textoSemResultados : textoVazio}</span>
        </div>
      );
    }
    
    return (
      <div className={styles.opcoes}>
        {opcoesFiltradas.map((opcao, index) => renderizarOpcaoDropdown(opcao, index))}
      </div>
    );
  };
  
  return (
    <div className={classesContainer}>
      {label && (
        <label htmlFor={finalId} className={styles.label}>
          {label}
          {obrigatório && <span className={styles.obrigatorio}>*</span>}
        </label>
      )}
      
      <div
        ref={containerRef}
        className={classesSelect}
        onClick={abrirDropdown}
        onKeyDown={navegarTeclado}
        tabIndex={desabilitado ? -1 : 0}
        role=\"combobox\"
        aria-expanded={aberto}
        aria-haspopup=\"listbox\"
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        id={finalId}
      >
        <div className={styles.valor}>
          {renderizarValor()}
        </div>
        
        <div className={styles.acoes}>
          {(limpavel && (opcaoSelecionada || opcoesSelecionadas.length > 0)) && (
            <button
              type=\"button\"
              className={styles.limpar}
              onClick={(e) => {
                e.stopPropagation();
                limparSelecao();
              }}
              aria-label=\"Limpar seleção\"
            >
              <Icon tipo=\"x\" tamanho=\"sm\" />
            </button>
          )}
          
          {estadoAtual === 'loading' ? (
            <Icon tipo=\"loading\" tamanho=\"sm\" girando />
          ) : (
            <Icon 
              tipo={aberto ? 'chevron-up' : 'chevron-down'} 
              tamanho=\"sm\" 
              className={styles.chevron}
            />
          )}
        </div>
      </div>
      
      {aberto && (
        <div
          ref={dropdownRef}
          className={classesDropdown}
          role=\"listbox\"
          aria-multiselectable={multiplo}
        >
          {buscavel && (
            <div className={styles.busca}>
              <Input
                ref={inputBuscaRef}
                valor={termoBusca}
                aoMudar={setTermoBusca}
                placeholder={placeholderBusca}
                tamanho=\"pequeno\"
                iconeEsquerda={<Icon tipo=\"search\" tamanho=\"sm\" />}
              />
            </div>
          )}
          
          {renderizarConteudoDropdown()}
        </div>
      )}
      
      {/* Mensagens de estado */}
      {erro && (
        <div className={`${styles.mensagem} ${styles['mensagem--erro']}`}>
          <Icon tipo=\"error\" tamanho=\"sm\" />
          <span>{erro}</span>
        </div>
      )}
      
      {sucesso && !erro && (
        <div className={`${styles.mensagem} ${styles['mensagem--sucesso']}`}>
          <Icon tipo=\"success\" tamanho=\"sm\" />
          <span>{sucesso}</span>
        </div>
      )}
      
      {aviso && !erro && !sucesso && (
        <div className={`${styles.mensagem} ${styles['mensagem--aviso']}`}>
          <Icon tipo=\"warning\" tamanho=\"sm\" />
          <span>{aviso}</span>
        </div>
      )}
      
      {ajuda && !erro && !sucesso && !aviso && (
        <div className={`${styles.mensagem} ${styles['mensagem--ajuda']}`}>
          <Icon tipo=\"info\" tamanho=\"sm\" />
          <span>{ajuda}</span>
        </div>
      )}
    </div>
  );
};

// Componente com React.memo para otimização
export default React.memo(Select);