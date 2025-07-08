import React from 'react';

export interface PropriedadesEntradaMensagem {
  /** Valor atual do campo */
  valor: string;
  
  /** Função chamada quando o valor muda */
  aoMudar: (novoValor: string) => void;
  
  /** Função chamada ao enviar mensagem */
  aoEnviar: () => void;
  
  /** Placeholder do campo */
  placeholder?: string;
  
  /** Se está carregando/enviando */
  carregando?: boolean;
  
  /** Se está desabilitado */
  desabilitado?: boolean;
  
  /** Número máximo de linhas */
  maxLinhas?: number;
  
  /** Número mínimo de linhas */
  minLinhas?: number;
  
  /** Limite de caracteres */
  maxCaracteres?: number;
  
  /** Se deve mostrar contador de caracteres */
  mostrarContador?: boolean;
  
  /** Se permite envio com Ctrl+Enter */
  envioComCtrl?: boolean;
  
  /** Se permite anexar arquivos */
  permitirAnexos?: boolean;
  
  /** Função chamada ao anexar arquivo */
  aoAnexar?: (arquivos: File[]) => void;
  
  /** Arquivos anexados */
  anexos?: ArquivoAnexo[];
  
  /** Função chamada ao remover anexo */
  aoRemoverAnexo?: (id: string) => void;
  
  /** Sugestões de texto */
  sugestoes?: string[];
  
  /** Função chamada ao selecionar sugestão */
  aoSelecionarSugestao?: (sugestao: string) => void;
  
  /** Se deve focar automaticamente */
  autoFoco?: boolean;
  
  /** Função chamada ao focar */
  aoFocar?: () => void;
  
  /** Função chamada ao desfocar */
  aoDesfocar?: () => void;
  
  /** Classes CSS adicionais */
  className?: string;
  
  /** Estilos inline */
  style?: React.CSSProperties;
  
  /** ID do elemento */
  id?: string;
  
  /** Propriedades HTML adicionais */
  htmlProps?: React.HTMLAttributes<HTMLDivElement>;
}

export interface ArquivoAnexo {
  /** ID único do arquivo */
  id: string;
  
  /** Nome do arquivo */
  nome: string;
  
  /** Tamanho do arquivo em bytes */
  tamanho: number;
  
  /** Tipo MIME do arquivo */
  tipo: string;
  
  /** URL ou data URI do arquivo */
  url?: string;
  
  /** Se está sendo enviado */
  enviando?: boolean;
  
  /** Erro no envio */
  erro?: string;
}

export interface EstadoEntradaMensagem {
  /** Se está focado */
  focado: boolean;
  
  /** Altura atual do textarea */
  altura: number;
  
  /** Posição do cursor */
  posicaoCursor: number;
  
  /** Texto selecionado */
  textoSelecionado: string;
  
  /** Se está arrastando arquivo */
  arrastando: boolean;
  
  /** Sugestão ativa */
  sugestaoAtiva?: number;
} 