import React from 'react';

export interface PropriedadesCampoFormulario {
  /** Nome do campo (usado para formulários) */
  nome: string;
  
  /** Valor atual do campo */
  valor: string;
  
  /** Função chamada quando o valor muda */
  aoMudar: (valor: string) => void;
  
  /** Tipo do input */
  tipo?: TipoInput;
  
  /** Rótulo do campo */
  rotulo: string;
  
  /** Texto de ajuda/descrição */
  ajuda?: string;
  
  /** Placeholder do input */
  placeholder?: string;
  
  /** Se o campo é obrigatório */
  obrigatorio?: boolean;
  
  /** Se o campo está desabilitado */
  desabilitado?: boolean;
  
  /** Tamanho do campo */
  tamanho?: 'pequeno' | 'medio' | 'grande';
  
  /** Regras de validação */
  validacao?: RegrasValidacao;
  
  /** Estado de validação atual */
  estadoValidacao?: EstadoValidacao;
  
  /** Ícone à esquerda */
  iconeEsquerda?: React.ReactNode;
  
  /** Ícone à direita */
  iconeDireita?: React.ReactNode;
  
  /** Ação no ícone direita (ex: mostrar/ocultar senha) */
  aoClicarIconeDireita?: () => void;
  
  /** Função chamada ao pressionar Enter */
  aoApertarEnter?: () => void;
  
  /** Função chamada ao focar */
  aoFocar?: () => void;
  
  /** Função chamada ao desfocar */
  aoDesfocar?: () => void;
  
  /** Função de validação customizada */
  validadorCustomizado?: (valor: string) => string | null;
  
  /** Se deve validar em tempo real */
  validacaoTempoReal?: boolean;
  
  /** Máximo de caracteres */
  maxCaracteres?: number;
  
  /** Se deve mostrar contador de caracteres */
  mostrarContador?: boolean;
  
  /** Classe CSS adicional */
  className?: string;
  
  /** ID do elemento */
  id?: string;
  
  /** Atributos de acessibilidade */
  'aria-label'?: string;
  'aria-describedby'?: string;
}

export type TipoInput = 
  | 'text'
  | 'email'
  | 'password'
  | 'tel'
  | 'url'
  | 'search'
  | 'number'
  | 'date'
  | 'time'
  | 'datetime-local';

export interface RegrasValidacao {
  /** Comprimento mínimo */
  minimo?: number;
  
  /** Comprimento máximo */
  maximo?: number;
  
  /** Padrão regex */
  padrao?: RegExp;
  
  /** Mensagem de erro para padrão */
  mensagemPadrao?: string;
  
  /** Se deve validar email */
  email?: boolean;
  
  /** Se deve validar URL */
  url?: boolean;
  
  /** Se deve validar número */
  numero?: boolean;
  
  /** Valor mínimo (para números) */
  valorMinimo?: number;
  
  /** Valor máximo (para números) */
  valorMaximo?: number;
  
  /** Lista de valores permitidos */
  valoresPermitidos?: string[];
  
  /** Função de validação customizada */
  customizada?: (valor: string) => string | null;
}

export interface EstadoValidacao {
  /** Se é válido */
  valido: boolean;
  
  /** Mensagem de erro */
  mensagem?: string;
  
  /** Tipo de validação que falhou */
  tipoErro?: TipoErroValidacao;
  
  /** Se está sendo validado */
  validando?: boolean;
}

export type TipoErroValidacao = 
  | 'obrigatorio'
  | 'minimo'
  | 'maximo'
  | 'padrao'
  | 'email'
  | 'url'
  | 'numero'
  | 'valorMinimo'
  | 'valorMaximo'
  | 'valorNaoPermitido'
  | 'customizado';

export interface ConfiguracaoCampoFormulario {
  /** Validação em tempo real */
  validacaoTempoReal: boolean;
  
  /** Delay para validação em tempo real (ms) */
  delayValidacao: number;
  
  /** Mostrar indicador de carregamento durante validação */
  mostrarCarregandoValidacao: boolean;
  
  /** Animação de foco */
  animacaoFoco: boolean;
  
  /** Auto-completar */
  autoCompletar: boolean;
}

export interface HistoricoValidacao {
  /** Timestamp da validação */
  timestamp: Date;
  
  /** Valor que foi validado */
  valor: string;
  
  /** Resultado da validação */
  resultado: EstadoValidacao;
  
  /** Tempo que levou para validar (ms) */
  tempoValidacao?: number;
} 