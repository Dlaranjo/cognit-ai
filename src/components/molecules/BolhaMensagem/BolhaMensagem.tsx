import React, { useState, useEffect, useCallback } from 'react';
import { Avatar } from '../../atoms/Avatar/Avatar';
import { Tooltip } from '../../atoms/Tooltip/Tooltip';
import { 
  PropriedadesBolhaMensagem, 
  AcaoMensagem, 
  StatusMensagem 
} from './BolhaMensagem.types';
import styles from './BolhaMensagem.module.css';

/**
 * Componente BolhaMensagem - Molecule
 * 
 * Exibe mensagens de chat com diferentes tipos (usuário, assistente, sistema),
 * suporte a ações, status, timestamps e efeito de digitação.
 */
export const BolhaMensagem: React.FC<PropriedadesBolhaMensagem> = ({
  conteudo,
  tipo,
  timestamp,
  status,
  remetente, // Adicionando a propriedade remetente
  digitando = false,
  avatar,
  acoes = [],
  mostrarTimestamp = true,
  mostrarAvatar = true,
  aoClicarAcao,
  aoClicar,
  className,
  id
}) => {
  const [conteudoVisivel, setConteudoVisivel] = useState(digitando ? '' : conteudo);
  const [_mostrandoAcoes, _setMostrandoAcoes] = useState(false);

  // Efeito de digitação
  useEffect(() => {
    if (!digitando) {
      setConteudoVisivel(conteudo);
      return;
    }

    let indiceAtual = 0;
    const velocidade = 50; // ms por caractere
    
    const timer = setInterval(() => {
      if (indiceAtual < conteudo.length) {
        setConteudoVisivel(conteudo.slice(0, indiceAtual + 1));
        indiceAtual++;
      } else {
        clearInterval(timer);
      }
    }, velocidade);

    return () => clearInterval(timer);
  }, [conteudo, digitando]);

  // Formatação do timestamp
  const formatarTimestamp = useCallback((data: Date): string => {
    const agora = new Date();
    const diferenca = agora.getTime() - data.getTime();
    const minutos = Math.floor(diferenca / 60000);
    const horas = Math.floor(diferenca / 3600000);
    const dias = Math.floor(diferenca / 86400000);

    if (minutos < 1) return 'Agora';
    if (minutos < 60) return `${minutos}m`;
    if (horas < 24) return `${horas}h`;
    if (dias < 7) return `${dias}d`;
    
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  }, []);

  // Renderização do ícone de status
  const renderizarIconeStatus = (statusMensagem: StatusMensagem) => {
    const classesStatus = {
      enviando: styles['status-icon--enviando'],
      enviada: styles['status-icon--enviada'],
      entregue: styles['status-icon--entregue'],
      lida: styles['status-icon--lida'],
      erro: styles['status-icon--erro'],
      cancelada: styles['status-icon--cancelada']
    };

    return (
      <div 
        className={`${styles['status-icon']} ${classesStatus[statusMensagem]}`}
        title={statusMensagem.charAt(0).toUpperCase() + statusMensagem.slice(1)}
      />
    );
  };

  // Manipulação de clique em ação
  const manipularCliqueAcao = useCallback((acao: AcaoMensagem) => {
    if (acao.desabilitada) return;
    
    // Ações padrão
    if (acao.tipo === 'copiar') {
      navigator.clipboard.writeText(conteudo);
      return;
    }
    
    aoClicarAcao?.(acao);
  }, [conteudo, aoClicarAcao]);

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
                acao.tipo === 'curtir' ? styles['acao--primaria'] : ''
              } ${
                acao.tipo === 'excluir' ? styles['acao--perigo'] : ''
              }`}
              onClick={() => manipularCliqueAcao(acao)}
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
  const getIconePadrao = (tipoAcao: string) => {
    const icones = {
      copiar: '📋',
      editar: '✏️',
      excluir: '🗑️',
      responder: '↩️',
      curtir: '👍',
      compartilhar: '📤',
      personalizada: '⚙️'
    };
    return icones[tipoAcao as keyof typeof icones] || '•';
  };

  // Classes CSS
  const classesContainer = [
    styles.container,
    styles[`container--${tipo}`],
    className
  ].filter(Boolean).join(' ');

  const classesBolha = [
    styles.bolha,
    styles[`bolha--${tipo}`],
    status === 'erro' ? styles['bolha--erro'] : '',
    digitando ? styles['bolha--carregando'] : ''
  ].filter(Boolean).join(' ');

  const classesConteudo = [
    styles.conteudo,
    digitando ? styles['conteudo--digitando'] : ''
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={classesContainer}
      id={id}
      role="article"
      aria-label={`Mensagem de ${tipo}`}
    >
      <div className={styles.wrapper}>
        {/* Avatar */}
        {mostrarAvatar && avatar && tipo !== 'sistema' && (
          <div className={styles.avatar}>
                         <Avatar
               nome={avatar.nome}
               src={avatar.imagem}
               tamanho="pequeno"
               corFundo={avatar.cor}
             />
          </div>
        )}

        {/* Bolha da mensagem */}
        <div 
          className={classesBolha}
          onClick={aoClicar}
          onMouseEnter={() => _setMostrandoAcoes(true)}
          onMouseLeave={() => _setMostrandoAcoes(false)}
        >
          {/* Nome do remetente */}
          {remetente && <div className={styles.remetente}>{remetente}</div>}

          {/* Conteúdo */}
          <div className={classesConteudo}>
            {conteudoVisivel}
          </div>

          {/* Ações */}
          {renderizarAcoes()}

          {/* Metadata */}
          {(mostrarTimestamp || status) && (
            <div className={styles.metadata}>
              {status && (
                <div className={styles.status}>
                  {renderizarIconeStatus(status)}
                </div>
              )}
              
              {mostrarTimestamp && (
                <span className={styles.timestamp}>
                  {formatarTimestamp(timestamp)}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente com React.memo para otimização
export default React.memo(BolhaMensagem); 