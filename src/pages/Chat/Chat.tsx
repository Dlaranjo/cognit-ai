import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { useAutenticacao } from '../../hooks/useAutenticacao';
import BolhaMensagem from '../../components/molecules/BolhaMensagem/BolhaMensagem';
import styles from './Chat.module.css';

const PaginaChat: React.FC = () => {
  const {
    mensagens,
    input,
    setInput,
    carregando,
    enviarMensagem,
    criarNovaConversa,
  } = useChat();

  const { usuario, fazerLogout } = useAutenticacao();
  const [conversas] = useState([
    { id: '1', titulo: 'Análise de Dados', preview: 'Como posso analisar...', ativa: true },
    { id: '2', titulo: 'Desenvolvimento Web', preview: 'Preciso de ajuda com...', ativa: false },
    { id: '3', titulo: 'Machine Learning', preview: 'Explique algoritmos...', ativa: false },
  ]);

  const messagesRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-scroll para última mensagem
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [mensagens.length]);

  // Auto-resize do textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleEnviarMensagem = async () => {
    if (!input.trim() || carregando) return;
    await enviarMensagem();
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviarMensagem();
    }
  };

  const handleNovaConversa = () => {
    criarNovaConversa('Nova Conversa');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const sugestoes = [
    {
      titulo: 'Análise de Dados',
      texto: 'Como posso analisar grandes volumes de dados de forma eficiente?'
    },
    {
      titulo: 'Desenvolvimento',
      texto: 'Quais são as melhores práticas para desenvolvimento React?'
    },
    {
      titulo: 'Machine Learning',
      texto: 'Explique os conceitos básicos de machine learning'
    },
    {
      titulo: 'Produtividade',
      texto: 'Como posso otimizar meu fluxo de trabalho diário?'
    }
  ];

  return (
    <div className={styles.chatContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        {/* Header da Sidebar */}
        <div className={styles.sidebarHeader}>
          <div className={styles.brandContainer}>
            <div className={styles.brandIcon} />
            <span className={styles.brandName}>Cognit Studio</span>
          </div>
          
          <button 
            className={styles.novaConversaButton}
            onClick={handleNovaConversa}
            aria-label="Criar nova conversa"
          >
            <div className={styles.plusIcon} />
            Nova Conversa
          </button>
        </div>

        {/* Lista de Conversas */}
        <div className={styles.conversasList}>
          {conversas.map((conversa) => (
            <div 
              key={conversa.id}
              className={`${styles.conversaItem} ${conversa.ativa ? styles.ativa : ''}`}
            >
              <div className={styles.conversaIcon} />
              <div className={styles.conversaInfo}>
                <div className={styles.conversaTitulo}>{conversa.titulo}</div>
                <div className={styles.conversaPreview}>{conversa.preview}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Seção do Usuário */}
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {usuario?.nome?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className={styles.userDetails}>
              <div className={styles.userName}>{usuario?.nome || 'Usuário'}</div>
              <div className={styles.userEmail}>{usuario?.email || 'usuario@email.com'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Área Principal */}
      <div className={styles.mainArea}>
        {/* Header do Chat */}
        <div className={styles.chatHeader}>
          <h1 className={styles.chatTitle}>
            {mensagens.length > 0 ? 'Conversa Ativa' : 'Bem-vindo ao Cognit Studio'}
          </h1>
          <div className={styles.modelSelector}>
            <div className={styles.modelIcon} />
            Claude 3.5 Sonnet
          </div>
        </div>

        {/* Área de Mensagens */}
        <div ref={messagesRef} className={styles.messagesArea}>
          {mensagens.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon} />
              <h2 className={styles.emptyTitle}>Como posso ajudar você hoje?</h2>
              <p className={styles.emptySubtitle}>
                Escolha uma das sugestões abaixo ou digite sua própria pergunta para começar uma conversa.
              </p>
              
              <div className={styles.suggestionsGrid}>
                {sugestoes.map((sugestao, index) => (
                  <div 
                    key={index}
                    className={styles.suggestionCard}
                    onClick={() => handleSuggestionClick(sugestao.texto)}
                  >
                    <div className={styles.suggestionTitle}>{sugestao.titulo}</div>
                    <div className={styles.suggestionText}>{sugestao.texto}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            mensagens.map((mensagem) => (
              <BolhaMensagem
                key={mensagem.id}
                conteudo={mensagem.conteudo}
                tipo={mensagem.autor === 'usuario' ? 'usuario' : 'assistente'}
                timestamp={new Date(mensagem.timestamp)}
              />
            ))
          )}
        </div>

        {/* Área de Input */}
        <div className={styles.inputArea}>
          <div className={styles.inputContainer}>
            <div className={styles.inputWrapper}>
              <textarea
                ref={textareaRef}
                className={styles.messageInput}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                disabled={carregando}
                rows={1}
              />
              
              <div className={styles.inputActions}>
                <button 
                  className={styles.attachButton}
                  aria-label="Anexar arquivo"
                >
                  <div className={styles.attachIcon} />
                </button>
                
                <button 
                  className={styles.sendButton}
                  onClick={handleEnviarMensagem}
                  disabled={!input.trim() || carregando}
                  aria-label={carregando ? 'Enviando...' : 'Enviar mensagem'}
                >
                  {carregando ? (
                    <div className={styles.loadingSpinner} />
                  ) : (
                    <div className={styles.sendIcon} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaChat;