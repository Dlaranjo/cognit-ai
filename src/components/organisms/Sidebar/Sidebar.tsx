import React, { useState, useRef, useCallback } from 'react';
import { Input } from '../../atoms/Input';
import { Avatar } from '../../atoms/Avatar';
import { Badge } from '../../atoms/Badge';
import { Tooltip } from '../../atoms/Tooltip';
import { 
  PropriedadesSidebar,
  ItemSidebar
} from './Sidebar.types';
import styles from './Sidebar.module.css';

export const Sidebar: React.FC<PropriedadesSidebar> = ({
  navegacao = [],
  grupos = [],
  usuario,
  busca,
  colapsavel = false,
  inicialmenteColapsado = false,
  largura = 'media',
  posicao = 'esquerda',
  fixo = true,
  sombra = true,
  tema = 'claro',
  responsivo = true,
  redimensionavel = false,
  className = '',
  style = {},
  id,
  htmlProps = {},
  aoClicarItem,
  aoFazerBusca,
  aoColapsar,
  aoRedimensionar,
  mobileAberta = false
}) => {
  const [colapsado, setColapsado] = useState(inicialmenteColapsado);
  const [itemExpandido, setItemExpandido] = useState<string | null>(null);
  const [buscarValor, setBuscarValor] = useState(busca?.valor || '');
  const [larguraAtual, _setLarguraAtual] = useState(300);

  const sidebarRef = useRef<HTMLElement>(null);
  const timeoutBusca = useRef<number | null>(null);

  const handleBusca = useCallback((valor: string) => {
    setBuscarValor(valor);
    
    if (timeoutBusca.current) {
      clearTimeout(timeoutBusca.current);
    }

    timeoutBusca.current = window.setTimeout(() => {
      if (aoFazerBusca) {
        aoFazerBusca(valor);
      }
      if (busca?.aoMudar) {
        busca.aoMudar(valor);
      }
    }, 300);
  }, [aoFazerBusca, busca]);

  const toggleColapso = useCallback(() => {
    const novoColapsado = !colapsado;
    setColapsado(novoColapsado);
    if (aoColapsar) {
      aoColapsar(novoColapsado);
    }
  }, [colapsado, aoColapsar]);

  const toggleItem = useCallback((id: string) => {
    setItemExpandido(prev => prev === id ? null : id);
  }, []);

  const handleClicarItem = useCallback((item: ItemSidebar) => {
    if (item.subitems && item.subitems.length > 0) {
      toggleItem(item.id);
    } else if (aoClicarItem) {
      aoClicarItem(item);
    }
  }, [aoClicarItem, toggleItem]);

  const renderItem = (item: ItemSidebar, nivel = 0) => {
    const temSubItens = item.subitems && item.subitems.length > 0;
    const expandido = itemExpandido === item.id;
    
    return (
      <div key={item.id} className={styles.itemContainer}>
        <Tooltip 
          conteudo={colapsado ? item.rotulo : ''} 
          posicao="direita"
          desabilitado={!colapsado}
        >
          <button
            className={`${styles.item} ${item.ativo ? styles.ativo : ''} ${
              nivel > 0 ? styles.subItem : ''
            }`}
            onClick={() => handleClicarItem(item)}
            style={{ paddingLeft: `${(nivel * 16) + 16}px` }}
          >
            {item.icone && (
              <span className={styles.icone}>{item.icone}</span>
            )}
            
            {!colapsado && (
              <>
                <span className={styles.rotulo}>{item.rotulo}</span>
                
                {item.badge && (
                  <Badge
                    texto={item.badge.texto}
                    variante={item.badge.variante as any}
                    tamanho="pequeno"
                    className={styles.badge}
                  />
                )}
                
                {temSubItens && (
                  <span className={`${styles.seta} ${expandido ? styles.expandido : ''}`}>
                    ▶
                  </span>
                )}
              </>
            )}
          </button>
        </Tooltip>
        
        {temSubItens && expandido && !colapsado && (
          <div className={styles.subItens}>
            {item.subitems!.map(subItem => renderItem(subItem as ItemSidebar, nivel + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderNavegacao = () => {
    if (!navegacao.length) return null;

    return (
      <nav className={styles.navegacao}>
        {navegacao.map(item => renderItem(item))}
      </nav>
    );
  };

  const renderGrupos = () => {
    if (!grupos.length) return null;

    return (
      <div className={styles.grupos}>
        {grupos.map(grupo => (
          <div key={grupo.id} className={styles.grupo}>
            {!colapsado && grupo.titulo && (
              <h3 className={styles.tituloGrupo}>{grupo.titulo}</h3>
            )}
            <div className={styles.itensGrupo}>
              {grupo.items.map((item: ItemSidebar) => renderItem(item))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderBusca = () => {
    if (!busca || colapsado) return null;

    return (
      <div className={styles.busca}>
        <Input
          tipo="search"
          placeholder={busca.placeholder}
          valor={buscarValor}
          aoMudar={handleBusca}
          tamanho="pequeno"
          iconeEsquerda="🔍"
        />
      </div>
    );
  };

  const renderUsuario = () => {
    if (!usuario) return null;

    return (
      <div className={styles.usuario}>
        <Avatar
          nome={usuario.nome}
          src={usuario.avatar}
          tamanho={colapsado ? "pequeno" : "medio"}
        />
        {!colapsado && (
          <div className={styles.infoUsuario}>
            <h4 className={styles.nomeUsuario}>{usuario.nome}</h4>
            <p className={styles.emailUsuario}>{usuario.email}</p>
          </div>
        )}
      </div>
    );
  };

  // Construir classes CSS
  const classesSidebar = [
    styles.sidebar,
    styles[`sidebar--${largura}`],
    styles[`sidebar--${posicao}`],
    colapsado ? styles['sidebar--colapsado'] : '',
    mobileAberta ? styles['sidebar--mobile-aberta'] : '',
    fixo ? styles['sidebar--fixo'] : '',
    sombra ? styles['sidebar--sombra'] : '',
    tema !== 'claro' ? styles[`sidebar--tema-${tema}`] : '',
    responsivo ? styles['sidebar--responsivo'] : '',
    redimensionavel ? styles['sidebar--redimensionavel'] : '',
    className
  ].filter(Boolean).join(' ');

  const estilosInline: React.CSSProperties = {
    ...style,
    ...(redimensionavel && { width: `${larguraAtual}px` })
  };

  return (
    <aside
      ref={sidebarRef}
      className={classesSidebar}
      style={estilosInline}
      id={id}
      {...htmlProps}
    >
      {/* Header da Sidebar */}
      <div className={styles.header}>
        {renderUsuario()}
        
        {colapsavel && (
          <button
            className={styles.botaoColapso}
            onClick={toggleColapso}
            aria-label={colapsado ? 'Expandir sidebar' : 'Colapsar sidebar'}
          >
            {colapsado ? '▶' : '◀'}
          </button>
        )}
      </div>

      {/* Busca */}
      {renderBusca()}

      {/* Navegação */}
      <div className={styles.conteudo}>
        {renderNavegacao()}
        {renderGrupos()}
      </div>

      {/* Redimensionamento */}
      {redimensionavel && !colapsado && (
        <div 
          className={styles.redimensionador}
          onMouseDown={(_e) => {
            // Implementar lógica de redimensionamento se necessário
            if (aoRedimensionar) {
              aoRedimensionar(larguraAtual);
            }
          }}
        />
      )}
    </aside>
  );
};

export default Sidebar; 