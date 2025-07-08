import React from 'react';

export interface PropriedadesSidebar {
  /** Items de navegação */
  items?: ItemSidebar[];
  
  /** Navegação principal */
  navegacao?: ItemSidebar[];
  
  /** Grupos de navegação */
  grupos?: GrupoSidebar[];
  
  /** Dados do usuário */
  usuario?: DadosUsuarioSidebar;
  
  /** Configuração de busca */
  busca?: ConfiguracaoBuscaSidebar;
  
  /** Se está colapsada */
  colapsada?: boolean;
  
  /** Se é colapsável */
  colapsavel?: boolean;
  
  /** Se inicia colapsada */
  inicialmenteColapsado?: boolean;
  
  /** Função chamada ao colapsar/expandir */
  aoColapsar?: (colapsada: boolean) => void;
  
  /** Posição da sidebar */
  posicao?: 'esquerda' | 'direita';
  
  /** Variante visual */
  variante?: 'padrao' | 'compacta' | 'flutuante' | 'transparente';
  
  /** Largura da sidebar */
  largura?: 'pequena' | 'media' | 'grande' | number;
  
  /** Largura da sidebar quando colapsada */
  larguraColapsada?: number;
  
  /** Se está fixo */
  fixo?: boolean;
  
  /** Se tem sombra */
  sombra?: boolean;
  
  /** Se deve mostrar toggle de colapso */
  mostrarToggle?: boolean;
  
  /** Se é redimensionável */
  redimensionavel?: boolean;
  
  /** Se é responsivo */
  responsivo?: boolean;
  
  /** Conteúdo do header da sidebar */
  header?: React.ReactNode;
  
  /** Conteúdo do footer da sidebar */
  footer?: React.ReactNode;
  
  /** Se deve mostrar busca */
  mostrarBusca?: boolean;
  
  /** Placeholder da busca */
  placeholderBusca?: string;
  
  /** Função chamada ao buscar */
  aoBuscar?: (termo: string) => void;
  
  /** Função chamada ao clicar em item */
  aoClicarItem?: (item: ItemSidebar) => void;
  
  /** Função chamada ao fazer busca */
  aoFazerBusca?: (termo: string) => void;
  
  /** Função chamada ao redimensionar */
  aoRedimensionar?: (largura: number) => void;
  
  /** Tema da sidebar */
  tema?: 'claro' | 'escuro' | 'auto';
  
  /** Se está carregando */
  carregando?: boolean;
  
  /** Classes CSS adicionais */
  className?: string;
  
  /** Estilos inline */
  style?: React.CSSProperties;
  
  /** ID do elemento */
  id?: string;
  
  /** Propriedades HTML adicionais */
  htmlProps?: React.HTMLAttributes<HTMLElement>;
  
  /** Controla a visibilidade da sidebar no modo mobile */
  mobileAberta?: boolean;
}

export interface ItemSidebar {
  /** ID único do item */
  id: string;
  
  /** Rótulo do item */
  rotulo: string;
  
  /** Ícone do item */
  icone?: React.ReactNode;
  
  /** URL de destino */
  href?: string;
  
  /** Tipo do item */
  tipo?: 'item' | 'grupo' | 'separador' | 'titulo' | 'acao';
  
  /** Se está ativo */
  ativo?: boolean;
  
  /** Se está desabilitado */
  desabilitado?: boolean;
  
  /** Badge/contador */
  badge?: BadgeInfoSidebar;
  
  /** Cor do badge */
  corBadge?: string;
  
  /** Tipo do badge */
  tipoBadge?: 'numero' | 'ponto' | 'novo' | 'beta';
  
  /** Subitems (navegação hierárquica) */
  subitems?: SubItemSidebar[];
  
  /** Subitens (alias para subitems) */
  subItens?: SubItemSidebar[];
  
  /** Se está expandido (para grupos) */
  expandido?: boolean;
  
  /** Nível de indentação */
  nivel?: number;
  
  /** Função chamada ao clicar */
  aoClicar?: () => void;
  
  /** Tooltip (para modo colapsado) */
  tooltip?: string;
  
  /** Se deve abrir em nova aba */
  novaAba?: boolean;
  
  /** Atalho de teclado */
  atalho?: string;
  
  /** Cor personalizada */
  corPersonalizada?: string;
  
  /** Se está visível */
  visivel?: boolean;
  
  /** Permissões necessárias */
  permissoes?: string[];
}

export interface SubItemSidebar {
  /** ID único do subitem */
  id: string;
  
  /** Rótulo do subitem */
  rotulo: string;
  
  /** Ícone do subitem */
  icone?: React.ReactNode;
  
  /** URL de destino */
  href?: string;
  
  /** Se está ativo */
  ativo?: boolean;
  
  /** Se está desabilitado */
  desabilitado?: boolean;
  
  /** Badge/contador */
  badge?: number;
  
  /** Cor do badge */
  corBadge?: string;
  
  /** Função chamada ao clicar */
  aoClicar?: () => void;
  
  /** Tooltip */
  tooltip?: string;
  
  /** Se deve abrir em nova aba */
  novaAba?: boolean;
  
  /** Nível de indentação */
  nivel?: number;
}

export interface GrupoSidebar {
  /** ID único do grupo */
  id: string;
  
  /** Título do grupo */
  titulo: string;
  
  /** Items do grupo */
  items: ItemSidebar[];
  
  /** Se está expandido */
  expandido?: boolean;
  
  /** Se é colapsável */
  colapsavel?: boolean;
  
  /** Ícone do grupo */
  icone?: React.ReactNode;
  
  /** Se está visível */
  visivel?: boolean;
}

export interface ConfiguracaoSidebar {
  /** Largura padrão */
  larguraPadrao: number;
  
  /** Largura mínima */
  larguraMinima: number;
  
  /** Largura máxima */
  larguraMaxima: number;
  
  /** Largura colapsada */
  larguraColapsada: number;
  
  /** Breakpoint para auto-colapso */
  breakpointAutoColapso: number;
  
  /** Animação de transição */
  animacaoTransicao: boolean;
  
  /** Duração da animação (ms) */
  duracaoAnimacao: number;
  
  /** Persistir estado colapsado */
  persistirEstado: boolean;
  
  /** Chave para localStorage */
  chaveLocalStorage: string;
}

export interface EstadoSidebar {
  /** Se está colapsada */
  colapsada: boolean;
  
  /** Largura atual */
  larguraAtual: number;
  
  /** Se está sendo redimensionada */
  redimensionando: boolean;
  
  /** Items expandidos */
  itemsExpandidos: string[];
  
  /** Item ativo */
  itemAtivo?: string;
  
  /** Termo de busca */
  termoBusca: string;
  
  /** Items filtrados */
  itemsFiltrados: ItemSidebar[];
  
  /** Se está em modo busca */
  modoBusca: boolean;
}

export interface ContextoSidebar {
  /** Estado atual */
  estado: EstadoSidebar;
  
  /** Função para atualizar estado */
  atualizarEstado: (novoEstado: Partial<EstadoSidebar>) => void;
  
  /** Função para colapsar/expandir */
  toggleColapso: () => void;
  
  /** Função para expandir/colapsar item */
  toggleItem: (id: string) => void;
  
  /** Função para definir item ativo */
  definirItemAtivo: (id: string) => void;
  
  /** Função para buscar items */
  buscarItems: (termo: string) => void;
  
  /** Função para redimensionar */
  redimensionar: (largura: number) => void;
}

export interface EventoSidebar {
  /** Tipo do evento */
  tipo: 'click' | 'hover' | 'focus' | 'colapso' | 'expansao' | 'redimensionamento';
  
  /** ID do item (se aplicável) */
  itemId?: string;
  
  /** Dados do evento */
  dados?: any;
  
  /** Timestamp */
  timestamp: Date;
}

export interface MetricasSidebar {
  /** Número de clicks */
  clicks: number;
  
  /** Tempo médio de navegação */
  tempoMedioNavegacao: number;
  
  /** Items mais utilizados */
  itemsMaisUtilizados: { id: string; count: number }[];
  
  /** Tempo em modo colapsado */
  tempoColapsado: number;
  
  /** Número de redimensionamentos */
  redimensionamentos: number;
}

export interface AcessibilidadeSidebar {
  /** Rótulo ARIA */
  ariaLabel?: string;
  
  /** Descrição ARIA */
  ariaDescribedBy?: string;
  
  /** Se deve anunciar mudanças */
  anunciarMudancas?: boolean;
  
  /** Atalhos de teclado habilitados */
  atalhosTeclado?: boolean;
  
  /** Foco automático */
  focoAutomatico?: boolean;
  
  /** Navegação por teclado */
  navegacaoTeclado?: boolean;
}

export interface DadosUsuarioSidebar {
  /** ID do usuário */
  id: string;
  
  /** Nome do usuário */
  nome: string;
  
  /** Email do usuário */
  email?: string;
  
  /** Avatar do usuário */
  avatar?: string;
  
  /** Cargo/função */
  cargo?: string;
  
  /** Status online */
  statusOnline?: 'online' | 'ausente' | 'ocupado' | 'offline';
}

export interface ConfiguracaoBuscaSidebar {
  /** Placeholder da busca */
  placeholder?: string;
  
  /** Valor atual da busca */
  valor?: string;
  
  /** Função chamada ao mudar valor */
  aoMudar?: (valor: string) => void;
  
  /** Se está desabilitada */
  desabilitada?: boolean;
  
  /** Se está carregando */
  carregando?: boolean;
}

export interface BadgeInfoSidebar {
  /** Texto do badge */
  texto: string;
  
  /** Variante do badge */
  variante: 'primario' | 'secundario' | 'sucesso' | 'aviso' | 'perigo' | 'info';
  
  /** Tamanho do badge */
  tamanho?: 'pequeno' | 'medio' | 'grande';
} 