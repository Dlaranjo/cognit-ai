import React from 'react';

export interface PropriedadesContainer {
  /** Conteúdo do container */
  children?: React.ReactNode;
  
  /** Tipo de container */
  tipo?: 'fluido' | 'fixo' | 'responsivo' | 'centrado';
  
  /** Tamanho máximo do container */
  tamanhoMaximo?: 'pequeno' | 'medio' | 'grande' | 'extra-grande' | 'total';
  
  /** Padding interno */
  padding?: 'nenhum' | 'pequeno' | 'medio' | 'grande' | 'extra-grande';
  
  /** Margin externo */
  margin?: 'nenhum' | 'pequeno' | 'medio' | 'grande' | 'extra-grande' | 'auto';
  
  /** Se deve ter scroll interno */
  scroll?: boolean;
  
  /** Direção do scroll */
  direcaoScroll?: 'vertical' | 'horizontal' | 'ambos';
  
  /** Altura do container */
  altura?: 'auto' | 'total' | 'viewport' | 'conteudo' | string;
  
  /** Largura do container */
  largura?: 'auto' | 'total' | 'conteudo' | string;
  
  /** Se deve centralizar conteúdo */
  centralizar?: boolean;
  
  /** Alinhamento horizontal */
  alinhamentoHorizontal?: 'esquerda' | 'centro' | 'direita' | 'justificado';
  
  /** Alinhamento vertical */
  alinhamentoVertical?: 'topo' | 'centro' | 'fundo' | 'baseline';
  
  /** Cor de fundo */
  corFundo?: string;
  
  /** Se deve ter borda */
  borda?: boolean;
  
  /** Cor da borda */
  corBorda?: string;
  
  /** Estilo da borda */
  estiloBorda?: 'solida' | 'tracejada' | 'pontilhada';
  
  /** Raio da borda (border-radius) */
  raioBorda?: 'nenhum' | 'pequeno' | 'medio' | 'grande' | 'circular';
  
  /** Sombra */
  sombra?: 'nenhuma' | 'pequena' | 'media' | 'grande' | 'extra-grande';
  
  /** Elevação (z-index) */
  elevacao?: number;
  
  /** Se deve ter backdrop blur */
  backdropBlur?: boolean;
  
  /** Opacidade do container */
  opacidade?: number;
  
  /** Tema do container */
  tema?: 'claro' | 'escuro' | 'transparente' | 'auto';
  
  /** Se está carregando */
  carregando?: boolean;
  
  /** Componente de loading customizado */
  componenteLoading?: React.ReactNode;
  
  /** Se deve mostrar skeleton */
  skeleton?: boolean;
  
  /** Número de linhas do skeleton */
  linhasSkeleton?: number;
  
  /** Classes CSS adicionais */
  className?: string;
  
  /** Estilos inline */
  style?: React.CSSProperties;
  
  /** ID do elemento */
  id?: string;
  
  /** Atributos HTML adicionais */
  htmlProps?: React.HTMLAttributes<HTMLDivElement>;
  
  /** Função chamada ao clicar */
  aoClicar?: (evento: React.MouseEvent<HTMLDivElement>) => void;
  
  /** Função chamada ao fazer scroll */
  aoFazerScroll?: (evento: React.UIEvent<HTMLDivElement>) => void;
  
  /** Função chamada ao redimensionar */
  aoRedimensionar?: (dimensoes: DimensoesContainer) => void;
}

export interface DimensoesContainer {
  /** Largura atual */
  largura: number;
  
  /** Altura atual */
  altura: number;
  
  /** Posição de scroll horizontal */
  scrollX: number;
  
  /** Posição de scroll vertical */
  scrollY: number;
  
  /** Largura do conteúdo */
  larguraConteudo: number;
  
  /** Altura do conteúdo */
  alturaConteudo: number;
}

export interface ConfiguracaoContainer {
  /** Breakpoints responsivos */
  breakpoints: {
    pequeno: number;
    medio: number;
    grande: number;
    extraGrande: number;
  };
  
  /** Tamanhos máximos */
  tamanhosMaximos: {
    pequeno: string;
    medio: string;
    grande: string;
    extraGrande: string;
  };
  
  /** Valores de padding */
  valoresPadding: {
    pequeno: string;
    medio: string;
    grande: string;
    extraGrande: string;
  };
  
  /** Valores de margin */
  valoresMargin: {
    pequeno: string;
    medio: string;
    grande: string;
    extraGrande: string;
  };
  
  /** Valores de sombra */
  valoresSombra: {
    pequena: string;
    media: string;
    grande: string;
    extraGrande: string;
  };
  
  /** Valores de border-radius */
  valoresRaioBorda: {
    pequeno: string;
    medio: string;
    grande: string;
    circular: string;
  };
}

export interface EstadoContainer {
  /** Se está visível */
  visivel: boolean;
  
  /** Se está carregando */
  carregando: boolean;
  
  /** Dimensões atuais */
  dimensoes: DimensoesContainer;
  
  /** Se está em tela cheia */
  telaCheia: boolean;
  
  /** Se está redimensionando */
  redimensionando: boolean;
  
  /** Último evento de scroll */
  ultimoScroll: {
    x: number;
    y: number;
    timestamp: number;
  };
}

export interface ContextoContainer {
  /** Estado atual */
  estado: EstadoContainer;
  
  /** Configuração */
  configuracao: ConfiguracaoContainer;
  
  /** Função para atualizar estado */
  atualizarEstado: (novoEstado: Partial<EstadoContainer>) => void;
  
  /** Função para alternar tela cheia */
  alternarTelaCheia: () => void;
  
  /** Função para fazer scroll para elemento */
  scrollParaElemento: (elemento: HTMLElement, comportamento?: ScrollBehavior) => void;
  
  /** Função para fazer scroll para posição */
  scrollParaPosicao: (x: number, y: number, comportamento?: ScrollBehavior) => void;
  
  /** Função para obter dimensões */
  obterDimensoes: () => DimensoesContainer;
}

export interface AcessibilidadeContainer {
  /** Papel ARIA */
  role?: string;
  
  /** Rótulo ARIA */
  ariaLabel?: string;
  
  /** Descrição ARIA */
  ariaDescribedBy?: string;
  
  /** Se deve ser anunciado por leitores de tela */
  ariaLive?: 'off' | 'polite' | 'assertive';
  
  /** Região ARIA */
  ariaRegion?: string;
  
  /** Se é um landmark */
  landmark?: boolean;
  
  /** Navegação por teclado */
  navegacaoTeclado?: boolean;
  
  /** Foco automático */
  focoAutomatico?: boolean;
}

export interface AnimacaoContainer {
  /** Tipo de animação de entrada */
  animacaoEntrada?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomIn' | 'nenhuma';
  
  /** Tipo de animação de saída */
  animacaoSaida?: 'fadeOut' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'zoomOut' | 'nenhuma';
  
  /** Duração da animação (ms) */
  duracao?: number;
  
  /** Delay da animação (ms) */
  delay?: number;
  
  /** Easing da animação */
  easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear';
  
  /** Se deve repetir animação */
  repetir?: boolean;
  
  /** Número de repetições */
  repeticoes?: number;
  
  /** Se deve alternar direção */
  alternarDirecao?: boolean;
}

export interface ResponsividadeContainer {
  /** Configurações por breakpoint */
  breakpoints?: {
    pequeno?: Partial<PropriedadesContainer>;
    medio?: Partial<PropriedadesContainer>;
    grande?: Partial<PropriedadesContainer>;
    extraGrande?: Partial<PropriedadesContainer>;
  };
  
  /** Se deve adaptar automaticamente */
  adaptacaoAutomatica?: boolean;
  
  /** Estratégia de redimensionamento */
  estrategiaRedimensionamento?: 'proporcional' | 'fixo' | 'fluido';
  
  /** Orientação suportada */
  orientacao?: 'retrato' | 'paisagem' | 'ambas';
} 