import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DespachoApp } from '../redux/store';
import {
  adicionarMensagem,
  criarConversa,
  enviarMensagem as thunkEnviarMensagem,
  selecionarConversa,
} from '../redux/chat/chatSlice';
import {
  seletorConversaAtiva,
  seletorMensagensConversa,
} from '../redux/chat/chatSelectors';
import { simularStreaming } from '../shared/mocks/streaming.mock';
import { Mensagem } from '../shared/types/chat.types';
import { v4 as uuid } from 'uuid';

export const useChat = () => {
  const dispatch = useDispatch<DespachoApp>();
  const conversaAtiva = useSelector(seletorConversaAtiva);
  const mensagens = useSelector(seletorMensagensConversa);

  const [input, setInput] = useState<string>('');
  const [carregando, setCarregando] = useState<boolean>(false);

  const criarNovaConversa = useCallback(
    (titulo: string) => {
      dispatch(criarConversa(titulo));
    },
    [dispatch]
  );

  const enviarMensagem = useCallback(async () => {
    const conteudo = input.trim();
    if (!conteudo || !conversaAtiva) return;
    setCarregando(true);
    setInput('');

    // Adiciona mensagem do usuário
    await dispatch(thunkEnviarMensagem({ conteudo }));

    // Simula streaming de resposta
    let conteudoAssistente = '';
    await simularStreaming(conteudo, (chunk) => {
      conteudoAssistente += chunk;
      const msg: Mensagem = {
        id: uuid(),
        conteudo: conteudoAssistente,
        autor: 'assistente',
        timestamp: new Date().toISOString(),
      };
      dispatch(
        adicionarMensagem({ conversaId: conversaAtiva.id, mensagem: msg })
      );
    });
    setCarregando(false);
  }, [input, conversaAtiva, dispatch]);

  return {
    mensagens,
    input,
    setInput,
    carregando,
    enviarMensagem,
    criarNovaConversa,
    selecionarConversa: (id: string) => dispatch(selecionarConversa(id)),
  };
};
