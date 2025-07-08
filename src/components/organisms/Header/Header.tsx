import React, { useState, useRef, useCallback } from 'react';
import { Botao } from '../../atoms/Botao';
import { Input } from '../../atoms/Input';
import { Avatar } from '../../atoms/Avatar';
import { Badge } from '../../atoms/Badge';
import { Tooltip } from '../../atoms/Tooltip';
import { 
  PropriedadesHeader
} from './Header.types';
import styles from './Header.module.css';

export const Header: React.FC<PropriedadesHeader> = ({
  titulo,
  subtitulo,
  navegacao = [],
  usuario,
  busca,
  notificacoes,
  acoes = [],
  variante = 'padrao',
  fixo = false,
  transparente = false,
  sombra = true,
  altura = 'media',
  tema = 'claro',
  responsivo = true,
  className = '',
  style = {},
  id,
  htmlProps = {},
  aoClicarItem,
  aoFazerBusca,
  aoClicarNotificacao,
  aoClicarAcao,
  sidebarColapsada,
  aoAlternarSidebarMobile
}) => {
  const [dropdownAberto, setDropdownAberto] = useState<string | null>(null);
  const [buscarValor, setBuscarValor] = useState(busca?.valor || '');
  const [notificacoesAbertas, setNotificacoesAbertas] = useState(false);

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

  const toggleDropdown = useCallback((id: string) => {
    setDropdownAberto(prev => prev === id ? null : id);
  }, []);

  const renderNavegacao = () => {
    if (!navegacao.length) return null;

    return (
      <nav className={styles.navegacao}>
        {navegacao.map((item) => (
          <button
            key={item.id}
            className={`${styles.itemNavegacao} ${item.ativo ? styles.ativo : ''}`}
            onClick={() => aoClicarItem?.(item)}
            >
            {item.icone && <span className={styles.icone}>{item.icone}</span>}
            <span>{item.rotulo}</span>
            {item.badge && (
              <Badge
                texto={item.badge.texto}
                variante={item.badge.variante as any}
                tamanho="pequeno"
              />
              )}
          </button>
        ))}
      </nav>
    );
  };

  const renderBusca = () => {
    if (!busca) return null;

    return (
      <div className={styles.busca}>
        <Input
          tipo="search"
          placeholder={busca.placeholder}
          valor={buscarValor}
          aoMudar={handleBusca}
          tamanho="medio"
          iconeEsquerda="🔍"
        />
      </div>
    );
  };

  const renderNotificacoes = () => {
    if (!notificacoes) return null;

    return (
      <div className={styles.notificacoes}>
        <Tooltip conteudo="Notificações" posicao="baixo">
          <button
            className={styles.botaoNotificacoes}
            onClick={() => setNotificacoesAbertas(!notificacoesAbertas)}
          >
            🔔
            {notificacoes.contador > 0 && (
              <Badge
                texto={notificacoes.contador.toString()}
                variante="perigo"
                tamanho="pequeno"
                className={styles.badgeNotificacao}
              />
            )}
          </button>
        </Tooltip>

        {notificacoesAbertas && (
          <div className={styles.dropdownNotificacoes}>
            <div className={styles.headerDropdown}>
              <h4>Notificações</h4>
              <button onClick={() => setNotificacoesAbertas(false)}>✕</button>
            </div>
            <div className={styles.listaNotificacoes}>
              {notificacoes.itens.map((item) => (
                <button
                  key={item.id}
                  className={styles.itemNotificacao}
                  onClick={() => aoClicarNotificacao?.(item)}
                >
                  <div className={styles.conteudoNotificacao}>
                    <h5>{item.titulo}</h5>
                    <p>{item.descricao}</p>
                    <small>{item.timestamp.toLocaleString()}</small>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderUsuario = () => {
    if (!usuario) return null;

    return (
      <div className={styles.usuario}>
        <button
          className={styles.perfilUsuario}
          onClick={() => toggleDropdown('usuario')}
        >
          <Avatar
            nome={usuario.nome}
            src={usuario.avatar}
            tamanho="pequeno"
          />
          <span className={styles.nomeUsuario}>{usuario.nome}</span>
          <span className={styles.setaDropdown}>▼</span>
        </button>

        {dropdownAberto === 'usuario' && (
          <div className={styles.dropdownUsuario}>
            <div className={styles.infoUsuario}>
              <Avatar
                nome={usuario.nome}
                src={usuario.avatar}
                tamanho="medio"
              />
              <div>
                <h4>{usuario.nome}</h4>
                <p>{usuario.email}</p>
              </div>
            </div>
            <div className={styles.acoesUsuario}>
              <button>Perfil</button>
              <button>Configurações</button>
              <button>Sair</button>
            </div>
        </div>
        )}
      </div>
    );
  };

  const renderAcoes = () => {
    if (!acoes.length) return null;

    return (
      <div className={styles.acoes}>
        {acoes.map((acao) => {
          if (acao.tipo === 'dropdown') {
            return (
              <div key={acao.id} className={styles.acaoDropdown}>
                <Tooltip conteudo={acao.tooltip || acao.rotulo} posicao="baixo">
                  <button
                    className={styles.botaoAcao}
                    onClick={() => toggleDropdown(acao.id)}
                  >
                    {acao.icone && <span>{acao.icone}</span>}
                    <span>{acao.rotulo}</span>
                    <span className={styles.setaDropdown}>▼</span>
                  </button>
                </Tooltip>

                {dropdownAberto === acao.id && acao.dropdown && (
                  <div className={styles.dropdown}>
                    {acao.dropdown.map((item) => (
        <button
                        key={item.id}
                        className={styles.itemDropdown}
                        onClick={() => aoClicarAcao?.(acao)}
        >
                        {item.icone && <span>{item.icone}</span>}
                        <span>{item.rotulo}</span>
        </button>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Tooltip key={acao.id} conteudo={acao.tooltip || acao.rotulo} posicao="baixo">
              <Botao
                variante={acao.variante === 'primaria' ? 'primario' : 'fantasma'}
                tamanho="pequeno"
                aoClicar={() => aoClicarAcao?.(acao)}
              >
                {acao.icone && <span>{acao.icone}</span>}
                {acao.rotulo}
              </Botao>
            </Tooltip>
          );
        })}
      </div>
    );
  };

  // Construir classes CSS
  const classesHeader = [
    styles.header,
    styles[`variante--${variante}`],
    styles[`altura--${altura}`],
    styles[`tema--${tema}`],
    fixo ? styles.fixo : '',
    transparente ? styles.transparente : '',
    sombra ? styles.sombra : '',
    responsivo ? styles.responsivo : '',
    sidebarColapsada ? styles.sidebarColapsada : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <header
      id={id}
      className={classesHeader}
      style={style}
      {...htmlProps}
    >
      <div className={styles.container}>
        <div className={styles.ladoEsquerdo}>
          <Botao
            variante="fantasma"
            className={styles.botaoMenuMobile}
            aoClicar={aoAlternarSidebarMobile}
            aria-label="Abrir menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </Botao>
          {titulo && <h1 className={styles.titulo}>{titulo}</h1>}
          {subtitulo && <h2 className={styles.subtitulo}>{subtitulo}</h2>}
          {renderNavegacao()}
        </div>
        
        <div className={styles.ladoDireito}>
          {renderBusca()}
          {renderAcoes()}
          {renderNotificacoes()}
          {renderUsuario()}
        </div>
      </div>
    </header>
  );
};

export default Header; 