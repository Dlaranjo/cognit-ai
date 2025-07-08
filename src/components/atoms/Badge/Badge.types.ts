export interface PropriedadesBadge {
  /** Texto a ser exibido no badge */
  texto: string;
  
  /** Variante visual do badge */
  variante?: 'primario' | 'secundario' | 'sucesso' | 'aviso' | 'perigo' | 'info' | 'neutro';
  
  /** Tamanho do badge */
  tamanho?: 'pequeno' | 'medio' | 'grande';
  
  /** Formato do badge */
  formato?: 'retangular' | 'redondo' | 'circular';
  
  /** Se o badge deve ter bordas */
  bordas?: boolean;
  
  /** Se o badge deve ter apenas o contorno */
  contorno?: boolean;
  
  /** Se o badge deve piscar/pulsar */
  pulsar?: boolean;
  
  /** Ícone opcional no badge */
  icone?: React.ReactNode;
  
  /** Posição do ícone */
  posicaoIcone?: 'esquerda' | 'direita';
  
  /** Cor personalizada de fundo */
  corFundo?: string;
  
  /** Cor personalizada do texto */
  corTexto?: string;
  
  /** Se o badge pode ser removido */
  removivel?: boolean;
  
  /** Callback para quando o badge é removido */
  aoRemover?: () => void;
  
  /** Callback para quando o badge é clicado */
  aoClicar?: () => void;
  
  /** Se o badge está desabilitado */
  desabilitado?: boolean;
  
  /** Tooltip opcional */
  tooltip?: string;
  
  /** Máximo de caracteres antes de truncar */
  maxCaracteres?: number;
  
  /** Classes CSS adicionais */
  className?: string;
  
  /** Estilos inline */
  style?: React.CSSProperties;
  
  /** ID do elemento */
  id?: string;
  
  /** Propriedades HTML adicionais */
  htmlProps?: React.HTMLAttributes<HTMLSpanElement>;
}

export interface EstadoBadge {
  /** Se o badge está visível */
  visivel: boolean;
  
  /** Se o badge está sendo removido */
  removendo: boolean;
  
  /** Se o badge está sendo hover */
  hover: boolean;
  
  /** Se o badge está focado */
  focado: boolean;
}

export interface ConfiguracaoBadge {
  /** Configurações de animação */
  animacao?: {
    /** Duração da animação de entrada */
    duracaoEntrada?: number;
    
    /** Duração da animação de saída */
    duracaoSaida?: number;
    
    /** Tipo de easing */
    easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  };
  
  /** Configurações de truncamento */
  truncamento?: {
    /** Sufixo para texto truncado */
    sufixo?: string;
    
    /** Se deve mostrar tooltip com texto completo */
    mostrarTooltip?: boolean;
  };
  
  /** Configurações de acessibilidade */
  acessibilidade?: {
    /** Label para leitores de tela */
    ariaLabel?: string;
    
    /** Descrição para leitores de tela */
    ariaDescribedBy?: string;
    
    /** Role do elemento */
    role?: string;
  };
} 