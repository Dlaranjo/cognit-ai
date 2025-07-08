export interface PropriedadesSpinner {
  /** Tamanho do spinner */
  tamanho?: 'pequeno' | 'medio' | 'grande' | 'extra-grande';
  
  /** Variante visual do spinner */
  variante?: 'primario' | 'secundario' | 'branco' | 'atual';
  
  /** Velocidade da animação */
  velocidade?: 'lenta' | 'normal' | 'rapida';
  
  /** Texto para leitores de tela */
  textoAcessibilidade?: string;
  
  /** Se deve mostrar texto de carregamento */
  mostrarTexto?: boolean;
  
  /** Texto personalizado de carregamento */
  textoCarregamento?: string;
  
  /** Classe CSS adicional */
  className?: string;
  
  /** ID único para o spinner */
  id?: string;
}

export interface VariantesSpinner {
  /** Cores disponíveis para o spinner */
  cores: {
    primario: string;
    secundario: string;
    branco: string;
    atual: string;
  };
  
  /** Tamanhos disponíveis */
  tamanhos: {
    pequeno: string;
    medio: string;
    grande: string;
    'extra-grande': string;
  };
  
  /** Velocidades de animação */
  velocidades: {
    lenta: string;
    normal: string;
    rapida: string;
  };
} 