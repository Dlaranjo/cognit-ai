import React from 'react';

export interface PropriedadesGrupoFormulario {
  /** Título do grupo */
  titulo?: string;
  
  /** Descrição do grupo */
  descricao?: string;
  
  /** Filhos (campos do formulário) */
  children: React.ReactNode;
  
  /** Layout do grupo */
  layout?: LayoutGrupo;
  
  /** Número de colunas no grid */
  colunas?: number;
  
  /** Gap entre os campos */
  espacamento?: 'pequeno' | 'medio' | 'grande';
  
  /** Se o grupo é colapsável */
  colapsavel?: boolean;
  
  /** Se o grupo inicia colapsado */
  inicialmenteColapsado?: boolean;
  
  /** Se o grupo está desabilitado */
  desabilitado?: boolean;
  
  /** Variante visual do grupo */
  variante?: 'padrao' | 'destaque' | 'sutil' | 'cartao';
  
  /** Ícone do grupo */
  icone?: React.ReactNode;
  
  /** Ações do grupo */
  acoes?: AcaoGrupo[];
  
  /** Estado de validação do grupo */
  estadoValidacao?: EstadoValidacaoGrupo;
  
  /** Se deve mostrar progresso de preenchimento */
  mostrarProgresso?: boolean;
  
  /** Função chamada quando o grupo é expandido/colapsado */
  aoAlternarColapso?: (colapsado: boolean) => void;
  
  /** Função chamada quando uma ação é clicada */
  aoClicarAcao?: (acao: AcaoGrupo) => void;
  
  /** Classes CSS adicionais */
  className?: string;
  
  /** ID do elemento */
  id?: string;
}

export type LayoutGrupo = 
  | 'vertical'
  | 'horizontal'
  | 'grid'
  | 'flex'
  | 'inline';

export interface AcaoGrupo {
  /** ID único da ação */
  id: string;
  
  /** Rótulo da ação */
  rotulo: string;
  
  /** Ícone da ação */
  icone?: React.ReactNode;
  
  /** Tipo da ação */
  tipo: 'limpar' | 'resetar' | 'validar' | 'salvar' | 'expandir' | 'colapsar' | 'personalizada';
  
  /** Se a ação está desabilitada */
  desabilitada?: boolean;
  
  /** Tooltip da ação */
  tooltip?: string;
  
  /** Variante da ação */
  variante?: 'primaria' | 'secundaria' | 'perigo' | 'sucesso';
}

export interface EstadoValidacaoGrupo {
  /** Se o grupo é válido */
  valido: boolean;
  
  /** Número de campos válidos */
  camposValidos: number;
  
  /** Número total de campos */
  totalCampos: number;
  
  /** Mensagens de erro do grupo */
  erros: string[];
  
  /** Se está validando */
  validando?: boolean;
  
  /** Progresso de preenchimento (0-100) */
  progresso?: number;
}

export interface ConfiguracaoGrupoFormulario {
  /** Animação de colapso */
  animacaoColapso: boolean;
  
  /** Duração da animação (ms) */
  duracaoAnimacao: number;
  
  /** Auto-colapsar grupos vazios */
  autoColapsarVazios: boolean;
  
  /** Validação automática */
  validacaoAutomatica: boolean;
  
  /** Mostrar contador de campos */
  mostrarContador: boolean;
}

export interface CampoGrupo {
  /** ID do campo */
  id: string;
  
  /** Nome do campo */
  nome: string;
  
  /** Se é obrigatório */
  obrigatorio: boolean;
  
  /** Se está preenchido */
  preenchido: boolean;
  
  /** Se é válido */
  valido: boolean;
  
  /** Mensagem de erro */
  erro?: string;
}

export interface AnaliseGrupo {
  /** Campos analisados */
  campos: CampoGrupo[];
  
  /** Estatísticas do grupo */
  estatisticas: EstatisticasGrupo;
  
  /** Sugestões de melhoria */
  sugestoes: string[];
}

export interface EstatisticasGrupo {
  /** Total de campos */
  totalCampos: number;
  
  /** Campos obrigatórios */
  camposObrigatorios: number;
  
  /** Campos preenchidos */
  camposPreenchidos: number;
  
  /** Campos válidos */
  camposValidos: number;
  
  /** Progresso de preenchimento (%) */
  progressoPreenchimento: number;
  
  /** Progresso de validação (%) */
  progressoValidacao: number;
} 