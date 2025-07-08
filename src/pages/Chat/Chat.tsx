import React, { useEffect, useRef } from 'react';
import Layout from '../../components/organisms/Layout/Layout';
import BolhaMensagem from '../../components/molecules/BolhaMensagem/BolhaMensagem';
import EntradaMensagem from '../../components/molecules/EntradaMensagem/EntradaMensagem';
import { useChat } from '../../hooks/useChat';
import styles from './Chat.module.css';

const PaginaChat: React.FC = () => {
  const {
    mensagens,
    input,
    setInput,
    carregando,
    enviarMensagem,
  } = useChat();

  const listaRef = useRef<HTMLDivElement | null>(null);

  // Scrolla para o fim sempre que nova mensagem chegar
  useEffect(() => {
    const el = listaRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [mensagens.length]);

  return (
    <Layout>
      <div className={styles.chatContainer}>
        {mensagens.length === 0 ? (
          <div className={styles.semConversa}>Selecione ou crie uma conversa para começar.</div>
        ) : (
          <div ref={listaRef} className={styles.listaMensagens}>
            {mensagens.map((msg) => (
              <BolhaMensagem
                key={msg.id}
                conteudo={msg.conteudo}
                tipo={msg.autor === 'usuario' ? 'usuario' : 'assistente'}
                timestamp={new Date(msg.timestamp)}
              />
            ))}
          </div>
        )}

        <EntradaMensagem
          valor={input}
          aoMudar={setInput}
          aoEnviar={enviarMensagem}
          carregando={carregando}
        />
      </div>
    </Layout>
  );
};

export default PaginaChat; 