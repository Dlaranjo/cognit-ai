import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { carregarConversas, selecionarConversa } from '../../../redux/chat/chatSlice';
import { EstadoRaiz, DespachoApp } from '../../../redux/store';
import styles from './Sidebar.module.css';
import { PropriedadesSidebar } from './Sidebar.types';

const Sidebar: React.FC<PropriedadesSidebar> = ({ quandoSelecionar }) => {
  const dispatch = useDispatch<DespachoApp>();
  const conversas = useSelector((estado: EstadoRaiz) => estado.chat.conversas);
  const conversaSelecionadaId = useSelector((estado: EstadoRaiz) => estado.chat.conversaSelecionadaId);

  useEffect(() => {
    if (conversas.length === 0) {
      dispatch(carregarConversas());
    }
  }, [conversas.length, dispatch]);

  const handleSelecionar = (id: string): void => {
    dispatch(selecionarConversa(id));
    quandoSelecionar();
  };

  return (
    <nav className={styles.sidebarNav} aria-label="Conversas">
      {conversas.map((conversa) => (
        <button
          key={conversa.id}
          className={
            conversa.id === conversaSelecionadaId ? `${styles.item} ${styles['item--ativo']}` : styles.item
          }
          onClick={() => handleSelecionar(conversa.id)}
        >
          <span className={styles.titulo}>{conversa.titulo}</span>
          <span className={styles.hora}>
            {format(new Date(conversa.criadaEm), "dd/MM/yyyy HH:mm", { locale: ptBR })}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default React.memo(Sidebar);
