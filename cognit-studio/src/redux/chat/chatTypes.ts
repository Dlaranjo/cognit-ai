import { Conversa } from '../../shared/types/chat.types';

export interface EstadoChat {
  conversas: Conversa[];
  conversaSelecionadaId: string | null;
  carregando: boolean;
}
