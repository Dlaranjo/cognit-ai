import { ReactNode } from 'react';

export type TipoInput = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
export type TamanhoInput = 'pequeno' | 'medio' | 'grande';
export type EstadoInput = 'normal' | 'loading' | 'error' | 'success' | 'warning';
export type DensidadeInput = 'compact' | 'normal' | 'comfortable';

export interface PropriedadesInput {
  /** Valor do input */
  valor?: string;
  
  /** Função chamada quando o valor muda */
  aoMudar?: (valor: string) => void;
  
  /** Tipo do input */
  tipo?: TipoInput;
  
  /** Tamanho do input */
  tamanho?: TamanhoInput;
  
  /** Estado visual do input */
  estado?: EstadoInput;
  
  /** Densidade do input */
  densidade?: DensidadeInput;
  
  /** Texto placeholder */
  placeholder?: string;
  
  /** Label do input */
  label?: string;
  
  /** Mensagem de erro */
  erro?: string;
  
  /** Mensagem de ajuda */
  ajuda?: string;
  
  /** Mensagem de sucesso */
  sucesso?: string;
  
  /** Mensagem de aviso */
  aviso?: string;
  
  /** Se o input é obrigatório */
  obrigatorio?: boolean;
  
  /** Se o input está desabilitado */
  desabilitado?: boolean;
  
  /** Se o input é somente leitura */
  somenteEscrita?: boolean;
  
  /** Ícone à esquerda */
  iconeEsquerda?: ReactNode;
  
  /** Ícone à direita */
  iconeDireita?: ReactNode;
  
  /** Função chamada ao pressionar Enter */
  aoApertarEnter?: () => void;
  
  /** Função chamada ao focar */
  aoFocar?: () => void;
  
  /** Função chamada ao desfocar */
  aoDesfocar?: () => void;
  
  /** Classes CSS adicionais */
  className?: string;
  
  /** ID do elemento */
  id?: string;
  
  /** Nome do input para formulários */
  nome?: string;
  
  /** Atributos de acessibilidade */
  'aria-label'?: string;
  'aria-describedby'?: string;
  
  /** Função de validação customizada */
  validador?: (valor: string) => string | null;
  
  /** Valor máximo de caracteres */
  maxCaracteres?: number;
  
  /** Mostrar contador de caracteres */
  mostrarContador?: boolean;
  
  /** Referência para o elemento input */
  ref?: React.RefObject<HTMLInputElement>;
} 