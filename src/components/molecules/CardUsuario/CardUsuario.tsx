import React, { useCallback } from 'react';
import { Avatar } from '../../atoms/Avatar/Avatar';
import { Tooltip } from '../../atoms/Tooltip/Tooltip';
import { 
  PropriedadesCardUsuario, 
  AcaoUsuario, 
  StatusOnline,
  Badge 
} from './CardUsuario.types';
import styles from './CardUsuario.module.css';

/**
 * Componente CardUsuario - Molecule
 * 
 * Exibe informações de um usuário em formato de card com diferentes variantes,
 * suporte a ações, badges, estatísticas e status online.
 */
export const CardUsuario: React.FC<PropriedadesCardUsuario> = ({
  usuario,
  variante = 'compacto',
  mostrarStatus = true,
  mostrarDetalhes = true,
  acoes = [],
  clicavel = false,
  selecionado = false,
  aoClicar,
  aoClicarAcao,
  className,
  id
}) => {

  const nomeExibicao = usuario.nomeCompleto || usuario.nomeUsuario;
  const emailExibicao = usuario.email;

  // Formatação de tempo relativo
  const formatarTempoRelativo = useCallback((data: Date): string => {
    const agora = new Date();
    const diferenca = agora.getTime() - data.getTime();
    const minutos = Math.floor(diferenca / 60000);
    const horas = Math.floor(diferenca / 3600000);
    const dias = Math.floor(diferenca / 86400000);

    if (minutos < 1) return 'Agora';
    if (minutos < 60) return `${minutos} min atrás`;
    if (horas < 24) return `${horas}h atrás`;
    if (dias < 7) return `${dias}d atrás`;
    
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  }, []);

  // Formatação de número
  const formatarNumero = useCallback((numero: number): string => {
    if (numero < 1000) return numero.toString();
    if (numero < 1000000) return `${(numero / 1000).toFixed(1)}K`;
    return `${(numero / 1000000).toFixed(1)}M`;
  }, []);

  // Manipulação de clique em ação
  const manipularCliqueAcao = useCallback((acao: AcaoUsuario, evento: React.MouseEvent) => {
    evento.stopPropagation();
    if (acao.desabilitada) return;
    
    aoClicarAcao?.(acao);
  }, [aoClicarAcao]);

  // Renderização do indicador de status
  const renderizarStatusIndicador = (status: StatusOnline) => {
    const classesStatus = {
      online: styles['status-indicator--online'],
      ausente: styles['status-indicator--ausente'],
      ocupado: styles['status-indicator--ocupado'],
      invisivel: styles['status-indicator--invisivel'],
      offline: styles['status-indicator--offline']
    };

    const titulosStatus = {
      online: 'Online',
      ausente: 'Ausente',
      ocupado: 'Ocupado',
      invisivel: 'Invisível',
      offline: 'Offline'
    };

    return (
      <div 
        className={`${styles['status-indicator']} ${classesStatus[status]}`}
        title={titulosStatus[status]}
        aria-label={`Status: ${titulosStatus[status]}`}
      />
    );
  };

  // Renderização de badges
  const renderizarBadges = (badges: Badge[]) => {
    if (!badges || badges.length === 0) return null;

    const badgesVisiveis = badges.slice(0, 3);
    const badgesRestantes = badges.length - badgesVisiveis.length;

    return (
      <div className={styles.badges}>
        {badgesVisiveis.map((badge) => (
          <Tooltip 
            key={badge.id}
            conteudo={badge.tooltip || badge.rotulo}
            posicao="cima"
          >
            <span 
              className={styles.badge}
              style={{ backgroundColor: badge.cor }}
            >
              {badge.icone && (
                <span className={styles['badge-icone']}>
                  {badge.icone}
                </span>
              )}
              {badge.rotulo}
            </span>
          </Tooltip>
        ))}
        {badgesRestantes > 0 && (
          <span 
            className={styles.badge}
            style={{ backgroundColor: 'var(--theme-text-muted)' }}
          >
            +{badgesRestantes}
          </span>
        )}
      </div>
    );
  };

  // Renderização de estatísticas
  const renderizarEstatisticas = () => {
    if (!usuario.estatisticas || variante === 'compacto' || variante === 'minimal') {
      return null;
    }

    const estatisticas = [
      {
        valor: usuario.estatisticas.mensagensEnviadas,
        rotulo: 'Mensagens',
        mostrar: usuario.estatisticas.mensagensEnviadas !== undefined
      },
      {
        valor: usuario.estatisticas.conversas,
        rotulo: 'Conversas',
        mostrar: usuario.estatisticas.conversas !== undefined
      },
      {
        valor: usuario.estatisticas.tempoOnline,
        rotulo: 'Horas Online',
        mostrar: usuario.estatisticas.tempoOnline !== undefined,
        formatador: (valor: number) => Math.floor(valor / 3600).toString()
      }
    ];

    const estatisticasVisiveis = estatisticas.filter(stat => stat.mostrar);

    if (estatisticasVisiveis.length === 0) return null;

    return (
      <div className={styles.estatisticas}>
        {estatisticasVisiveis.map((stat, index) => (
          <div key={index} className={styles.estatistica}>
            <div className={styles['estatistica-valor']}>
              {stat.formatador 
                ? stat.formatador(stat.valor!) 
                : formatarNumero(stat.valor!)
              }
            </div>
            <div className={styles['estatistica-rotulo']}>
              {stat.rotulo}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Renderização de ações
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
                acao.cor ? styles[`acao--${acao.cor}`] : ''
              }`}
              onClick={(evento) => manipularCliqueAcao(acao, evento)}
              disabled={acao.desabilitada}
              aria-label={acao.rotulo}
            >
              {acao.icone || getIconePadrao(acao.tipo)}
            </button>
          </Tooltip>
        ))}
      </div>
    );
  };

  // Ícones padrão para ações
  const getIconePadrao = (tipoAcao: string): string => {
    const icones = {
      mensagem: '💬',
      perfil: '👤',
      bloquear: '🚫',
      remover: '🗑️',
      editar: '✏️',
      configuracoes: '⚙️',
      personalizada: '•'
    };
    return icones[tipoAcao as keyof typeof icones] || '•';
  };

  // Renderização de metadata
  const renderizarMetadata = () => {
    if (variante === 'compacto' || variante === 'minimal') return null;

    const itensMetadata = [];

    if (usuario.localizacao) {
      itensMetadata.push({
        icone: '📍',
        texto: usuario.localizacao
      });
    }

    if (usuario.estatisticas?.dataCadastro) {
      itensMetadata.push({
        icone: '📅',
        texto: `Desde ${usuario.estatisticas.dataCadastro.toLocaleDateString('pt-BR', { 
          month: 'short', 
          year: 'numeric' 
        })}`
      });
    }

    if (itensMetadata.length === 0) return null;

    return (
      <div className={styles.metadata}>
        {itensMetadata.map((item, index) => (
          <div key={index} className={styles['metadata-item']}>
            <span>{item.icone}</span>
            <span>{item.texto}</span>
          </div>
        ))}
      </div>
    );
  };

  // Classes CSS
  const classesCard = [
    styles.card,
    styles[`card--${variante}`],
    clicavel ? styles['card--clicavel'] : '',
    selecionado ? styles['card--selecionado'] : '',
    className
  ].filter(Boolean).join(' ');

  // Determinação do tamanho do avatar baseado na variante
  const tamanhoAvatar = variante === 'expandido' ? 'grande' : 
                       variante === 'minimal' ? 'pequeno' : 'medio';

  return (
    <div 
      className={classesCard}
      id={id}
      onClick={clicavel ? aoClicar : undefined}
      role={clicavel ? 'button' : 'article'}
      tabIndex={clicavel ? 0 : undefined}
      aria-label={clicavel ? `Selecionar usuário ${usuario.nome}` : undefined}
    >
      <div className={styles['secao-principal']}>
        {/* Avatar com status */}
        <div className={styles['avatar-container']}>
          <Avatar
            nome={nomeExibicao}
            src={usuario.avatarUrl}
            tamanho={variante === 'expandido' ? 'grande' : 'medio'}
            corFundo={usuario.corPersonalizada}
            statusOnline={mostrarStatus}
            clicavel={false}
          />
          {mostrarStatus && renderizarStatusIndicador(usuario.statusOnline)}
        </div>

        {/* Informações do usuário */}
        <div className={styles.informacoes}>
          <div className={styles['nome-titulo']}>
            <h3 className={styles.nome}>{nomeExibicao}</h3>
            <span className={styles.email}>{emailExibicao}</span>
          </div>

          {mostrarDetalhes && variante === 'expandido' && (
            <div className={styles['cargo-empresa']}>
              {usuario.cargo && (
                <div className={styles.cargo}>{usuario.cargo}</div>
              )}
              {usuario.empresa && (
                <div className={styles.empresa}>{usuario.empresa}</div>
              )}
            </div>
          )}

          {mostrarDetalhes && usuario.biografia && variante === 'expandido' && (
            <p className={styles.biografia}>{usuario.biografia}</p>
          )}

          {mostrarDetalhes && usuario.badges && (
            renderizarBadges(usuario.badges)
          )}

          {usuario.ultimaVezVisto && !mostrarStatus && (
            <div className={styles['ultima-vez-visto']}>
              Visto {formatarTempoRelativo(usuario.ultimaVezVisto)}
            </div>
          )}

          {renderizarMetadata()}
        </div>

        {/* Ações */}
        {renderizarAcoes()}
      </div>

      {/* Estatísticas */}
      {renderizarEstatisticas()}
    </div>
  );
};

// Componente com React.memo para otimização
export default React.memo(CardUsuario); 