import { ReactNode } from 'react';

export type VarianteBotao = 'primario' | 'secundario' | 'perigo' | 'fantasma';
export type TamanhoBotao = 'pequeno' | 'medio' | 'grande';

export interface PropriedadesBotao {
  /** Texto ou conteúdo do botão */
  children: ReactNode;
  
  /** Variante visual do botão */
  variante?: VarianteBotao;
  
  /** Tamanho do botão */
  tamanho?: TamanhoBotao;
  
  /** Se o botão está em estado de carregamento */
  carregando?: boolean;
  
  /** Se o botão está desabilitado */
  desabilitado?: boolean;
  
  /** Se o botão deve ocupar toda a largura disponível */
  larguraCompleta?: boolean;
  
  /** Função chamada ao clicar no botão */
  aoClicar?: () => void;
  
  /** Tipo do botão HTML */
  tipo?: 'button' | 'submit' | 'reset';
  
  /** Classes CSS adicionais */
  className?: string;
  
  /** ID do elemento */
  id?: string;
  
  /** Atributos de acessibilidade */
  'aria-label'?: string;
  'aria-describedby'?: string;
} 