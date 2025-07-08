import React from 'react';

export interface PropriedadesBolhaMensagem {
  /** Conteúdo da mensagem (texto ou JSX) */
  conteudo: React.ReactNode;
  /** Tipo da bolha (define o remetente) */
  tipo: 'usuario' | 'assistente' | 'sistema';
  /** Data e hora da mensagem */
  timestamp: Date;
  /** Status da mensagem (para mensagens de usuário) */
  status?: StatusMensagem;
  /** Nome do remetente a ser exibido */
  remetente?: string;
  /** Se a mensagem está sendo "digitada" */
  digitando?: boolean;
  /** Informações do avatar a ser exibido */
  avatar?: {
    nome: string;
    imagem?: string;
    cor?: string;
  };
  
  /** Ações disponíveis para a mensagem */
  acoes?: AcaoMensagem[];
  
  /** Se deve mostrar o timestamp */
  mostrarTimestamp?: boolean;
  
  /** Se deve mostrar o avatar */
  mostrarAvatar?: boolean;
  
  /** Função chamada quando uma ação é clicada */
  aoClicarAcao?: (acao: AcaoMensagem) => void;
  
  /** Função chamada quando a mensagem é clicada */
  aoClicar?: () => void;
  
  /** Classe CSS adicional */
  className?: string;
  
  /** ID único da mensagem */
  id?: string;
}

export type StatusMensagem = 
  | 'enviando'
  | 'enviada'
  | 'entregue'
  | 'lida'
  | 'erro'
  | 'cancelada';

export interface AcaoMensagem {
  /** ID único da ação */
  id: string;
  
  /** Rótulo da ação */
  rotulo: string;
  
  /** Ícone da ação */
  icone?: React.ReactNode;
  
  /** Tipo da ação */
  tipo: 'copiar' | 'editar' | 'excluir' | 'responder' | 'curtir' | 'compartilhar' | 'personalizada';
  
  /** Se a ação está desabilitada */
  desabilitada?: boolean;
  
  /** Tooltip da ação */
  tooltip?: string;
}

export interface ConfiguracaoBolhaMensagem {
  /** Largura máxima da bolha */
  larguraMaxima: string;
  
  /** Animação de entrada */
  animacaoEntrada: boolean;
  
  /** Velocidade do efeito typing (caracteres por segundo) */
  velocidadeTyping: number;
  
  /** Formato de timestamp */
  formatoTimestamp: 'relativo' | 'absoluto' | 'personalizado';
}

export interface EstadoBolhaMensagem {
  /** Se a mensagem está expandida */
  expandida: boolean;
  
  /** Se está mostrando as ações */
  mostrandoAcoes: boolean;
  
  /** Progresso do efeito typing (0-100) */
  progressoTyping: number;
} 