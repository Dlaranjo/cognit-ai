import { EstadoRaiz } from '../store';
import { Conversa } from '../../shared/types/chat.types';

export const seletorChat = (estado: EstadoRaiz) => estado.chat;
export const seletorConversaAtiva = (estado: EstadoRaiz) => {
  const chat = seletorChat(estado);
  return chat.conversas.find((c: Conversa) => c.id === chat.conversaSelecionadaId) || null;
};
export const seletorMensagensConversa = (estado: EstadoRaiz) => {
  const conversa = seletorConversaAtiva(estado);
  return conversa?.mensagens ?? [];
}; 