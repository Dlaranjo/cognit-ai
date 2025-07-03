export type AutorMensagem = 'usuario' | 'assistente';

export interface Mensagem {
  id: string;
  conteudo: string;
  autor: AutorMensagem;
  timestamp: string; // ISO
}

export interface Conversa {
  id: string;
  titulo: string;
  mensagens: Mensagem[];
  criadaEm: string; // ISO
}
