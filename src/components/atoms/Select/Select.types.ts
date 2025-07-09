import { ReactNode } from 'react';

export type TamanhoSelect = 'pequeno' | 'medio' | 'grande';
export type EstadoSelect = 'normal' | 'loading' | 'error' | 'success' | 'warning';
export type DensidadeSelect = 'compact' | 'normal' | 'comfortable';

export interface OpcaoSelect {
  /** Valor da opção */
  valor: string | number;
  
  /** Texto exibido da opção */
  rotulo: string;
  
  /** Descrição adicional da opção */
  descricao?: string;
  
  /** Ícone da opção */
  icone?: ReactNode;
  
  /** Se a opção está desabilitada */
  desabilitada?: boolean;
  
  /** Grupo da opção (para agrupamento) */
  grupo?: string;
  
  /** Dados adicionais da opção */
  dados?: Record<string, any>;
}

export interface GrupoOpcoes {
  /** Nome do grupo */
  nome: string;
  
  /** Opções do grupo */
  opcoes: OpcaoSelect[];
  
  /** Se o grupo está desabilitado */
  desabilitado?: boolean;
}

export interface PropriedadesSelect {
  /** Valor selecionado */
  valor?: string | number | null;
  
  /** Função chamada quando o valor muda */
  aoMudar?: (valor: string | number | null) => void;
  
  /** Opções do select */
  opcoes?: OpcaoSelect[];
  
  /** Grupos de opções */
  grupos?: GrupoOpcoes[];
  
  /** Tamanho do select */
  tamanho?: TamanhoSelect;
  
  /** Estado visual do select */
  estado?: EstadoSelect;
  
  /** Densidade do select */
  densidade?: DensidadeSelect;
  
  /** Placeholder */
  placeholder?: string;
  
  /** Label do select */
  label?: string;
  
  /** Mensagem de erro */
  erro?: string;
  
  /** Mensagem de ajuda */
  ajuda?: string;
  
  /** Mensagem de sucesso */
  sucesso?: string;
  
  /** Mensagem de aviso */
  aviso?: string;
  
  /** Se o select é obrigatório */
  obrigatório?: boolean;
  
  /** Se o select está desabilitado */
  desabilitado?: boolean;
  
  /** Se permite busca */
  buscavel?: boolean;
  
  /** Placeholder da busca */
  placeholderBusca?: string;
  
  /** Função de busca personalizada */
  funcaoBusca?: (termo: string, opcoes: OpcaoSelect[]) => OpcaoSelect[];
  
  /** Se permite limpar seleção */
  limpavel?: boolean;
  
  /** Se permite seleção múltipla */
  multiplo?: boolean;
  
  /** Valores selecionados (para seleção múltipla) */
  valoresMultiplos?: (string | number)[];
  
  /** Função chamada quando valores múltiplos mudam */
  aoMudarMultiplos?: (valores: (string | number)[]) => void;
  
  /** Máximo de itens selecionáveis */
  maxSelecionados?: number;
  
  /** Texto quando não há opções */
  textoVazio?: string;
  
  /** Texto quando não há resultados de busca */
  textoSemResultados?: string;
  
  /** Texto de carregamento */
  textoCarregando?: string;
  
  /** Se está carregando opções */
  carregandoOpcoes?: boolean;
  
  /** Função chamada ao focar */
  aoFocar?: () => void;
  
  /** Função chamada ao desfocar */
  aoDesfocar?: () => void;
  
  /** Função chamada ao abrir dropdown */
  aoAbrir?: () => void;
  
  /** Função chamada ao fechar dropdown */
  aoFechar?: () => void;
  
  /** Classes CSS adicionais */
  className?: string;
  
  /** ID do elemento */
  id?: string;
  
  /** Nome do select para formulários */
  nome?: string;
  
  /** Atributos de acessibilidade */
  'aria-label'?: string;
  'aria-describedby'?: string;
  
  /** Referência para o elemento */
  ref?: React.RefObject<HTMLDivElement>;
  
  /** Renderização customizada de opção */
  renderizarOpcao?: (opcao: OpcaoSelect, selecionada: boolean) => ReactNode;
  
  /** Renderização customizada de valor selecionado */
  renderizarValorSelecionado?: (opcao: OpcaoSelect) => ReactNode;
  
  /** Posição do dropdown */
  posicaoDropdown?: 'auto' | 'top' | 'bottom';
  
  /** Largura do dropdown */
  larguraDropdown?: 'auto' | 'match' | number;
}