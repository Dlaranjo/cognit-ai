import { ReactNode } from 'react';

export type VarianteBotao = 'primario' | 'secundario' | 'perigo' | 'fantasma' | 'sucesso' | 'aviso' | 'info';
export type TamanhoBotao = 'pequeno' | 'medio' | 'grande';
export type DensidadeBotao = 'compact' | 'normal' | 'comfortable';
export type FormatoBotao = 'retangular' | 'circular' | 'pill';

export interface PropriedadesBotao {
  /** Texto ou conteúdo do botão */
  children?: ReactNode;
  
  /** Variante visual do botão */
  variante?: VarianteBotao;
  
  /** Tamanho do botão */
  tamanho?: TamanhoBotao;
  
  /** Densidade do botão */
  densidade?: DensidadeBotao;
  
  /** Formato do botão */
  formato?: FormatoBotao;
  
  /** Se o botão está em estado de carregamento */
  carregando?: boolean;
  
  /** Se o botão está desabilitado */
  desabilitado?: boolean;
  
  /** Se o botão deve ocupar toda a largura disponível */
  larguraCompleta?: boolean;
  
  /** Ícone à esquerda do texto */
  iconeEsquerda?: ReactNode;
  
  /** Ícone à direita do texto */
  iconeDireita?: ReactNode;
  
  /** Usar apenas ícone (sem texto) */
  somenteIcone?: boolean;
  
  /** Função chamada ao clicar no botão */
  aoClicar?: () => void;
  
  /** Tipo do botão HTML */
  tipo?: 'button' | 'submit' | 'reset';
  
  /** Classes CSS adicionais */
  className?: string;
  
  /** ID do elemento */
  id?: string;
  
  /** Tooltip para botões somente ícone */
  tooltip?: string;
  
  /** Atributos de acessibilidade */
  'aria-label'?: string;
  'aria-describedby'?: string;
  
  /** Referência para o elemento button */
  ref?: React.RefObject<HTMLButtonElement>;
} 