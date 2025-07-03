import { AutorMensagem } from '../../../shared/types/chat.types';

export interface PropriedadesBolhaMensagem {
  conteudoMarkdown: string;
  autor: AutorMensagem;
  timestampISO: string;
  aoCurtir?: () => void;
  aoDescurtir?: () => void;
  aoCopiar?: () => void;
}
