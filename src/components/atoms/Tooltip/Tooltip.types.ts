export interface PropriedadesTooltip {
  /** Conteúdo do tooltip */
  conteudo: React.ReactNode;
  
  /** Elemento filho que ativa o tooltip */
  children: React.ReactNode;
  
  /** Posição do tooltip em relação ao elemento */
  posicao?: 'cima' | 'baixo' | 'esquerda' | 'direita' | 'auto';
  
  /** Como o tooltip é ativado */
  trigger?: 'hover' | 'click' | 'focus' | 'manual';
  
  /** Se o tooltip está visível (para controle manual) */
  visivel?: boolean;
  
  /** Se o tooltip está desabilitado */
  desabilitado?: boolean;
  
  /** Delay para mostrar o tooltip (em ms) */
  delayMostrar?: number;
  
  /** Delay para esconder o tooltip (em ms) */
  delayEsconder?: number;
  
  /** Se o tooltip deve ter uma seta */
  comSeta?: boolean;
  
  /** Tamanho máximo do tooltip */
  tamanhoMaximo?: 'pequeno' | 'medio' | 'grande';
  
  /** Se o tooltip pode ser clicado/interativo */
  interativo?: boolean;
  
  /** Função chamada quando tooltip é mostrado */
  aoMostrar?: () => void;
  
  /** Função chamada quando tooltip é escondido */
  aoEsconder?: () => void;
  
  /** Classe CSS adicional */
  className?: string;
  
  /** ID único para acessibilidade */
  id?: string;
}

export interface EstadoTooltip {
  /** Se o tooltip está visível */
  visivel: boolean;
  
  /** Posição calculada do tooltip */
  posicaoCalculada: {
    top: number;
    left: number;
    posicao: 'cima' | 'baixo' | 'esquerda' | 'direita';
  } | null;
}

export interface ConfiguracaoTooltip {
  /** Offset padrão do tooltip */
  offset: number;
  
  /** Tempo de delay padrão */
  delayPadrao: number;
  
  /** Larguras máximas por tamanho */
  larguras: {
    pequeno: string;
    medio: string;
    grande: string;
  };
} 