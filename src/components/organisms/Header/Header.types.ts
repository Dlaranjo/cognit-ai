import React from 'react';

export interface PropriedadesHeader {
  /** Título da aplicação */
  titulo?: string;
  
  /** Subtítulo da aplicação */
  subtitulo?: string;
  
  /** Logo da aplicação */
  logo?: React.ReactNode;
  
  /** Usuário logado */
  usuario?: DadosUsuarioHeader;
  
  /** Items de navegação */
  navegacao?: ItemNavegacao[];
  
  /** Ações do header */
  acoes?: AcaoHeader[];
  
  /** Configuração de busca */
  busca?: ConfiguracaoBusca;
  
  /** Configuração de notificações */
  notificacoes?: ConfiguracaoNotificacoes;
  
  /** Se deve mostrar busca */
  mostrarBusca?: boolean;
  
  /** Placeholder da busca */
  placeholderBusca?: string;
  
  /** Valor atual da busca */
  valorBusca?: string;
  
  /** Função chamada ao buscar */
  aoBuscar?: (termo: string) => void;
  
  /** Se deve mostrar notificações */
  mostrarNotificacoes?: boolean;
  
  /** Número de notificações não lidas */
  notificacoesNaoLidas?: number;
  
  /** Função chamada ao clicar em notificações */
  aoClicarNotificacoes?: () => void;
  
  /** Variante do header */
  variante?: 'padrao' | 'transparente' | 'elevado' | 'compacto';
  
  /** Se está fixo no topo */
  fixo?: boolean;
  
  /** Se é transparente */
  transparente?: boolean;
  
  /** Se deve mostrar sombra */
  sombra?: boolean;
  
  /** Altura do header */
  altura?: 'pequena' | 'media' | 'grande';
  
  /** Tema do header */
  tema?: 'claro' | 'escuro' | 'auto';
  
  /** Se é responsivo */
  responsivo?: boolean;
  
  /** Função chamada ao clicar no logo/título */
  aoClicarLogo?: () => void;
  
  /** Função chamada ao fazer logout */
  aoFazerLogout?: () => void;
  
  /** Função chamada ao clicar no perfil */
  aoClicarPerfil?: () => void;
  
  /** Função chamada ao clicar em item de navegação */
  aoClicarItem?: (item: ItemNavegacao) => void;
  
  /** Função chamada ao fazer busca */
  aoFazerBusca?: (termo: string) => void;
  
  /** Função chamada ao clicar em notificação */
  aoClicarNotificacao?: (notificacao: NotificacaoHeader) => void;
  
  /** Função chamada ao clicar em ação */
  aoClicarAcao?: (acao: AcaoHeader) => void;
  
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
  
  /** Se a sidebar principal está colapsada (para ajustar layout do header) */
  sidebarColapsada?: boolean;

  /** Função para alternar a visibilidade da sidebar em modo mobile */
  aoAlternarSidebarMobile?: () => void;
}

export interface DadosUsuarioHeader {
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
  
  /** Cor personalizada */
  corPersonalizada?: string;
}

export interface ItemNavegacao {
  /** ID único do item */
  id: string;
  
  /** Rótulo do item */
  rotulo: string;
  
  /** URL de destino */
  href?: string;
  
  /** Ícone do item */
  icone?: React.ReactNode;
  
  /** Se está ativo */
  ativo?: boolean;
  
  /** Se está desabilitado */
  desabilitado?: boolean;
  
  /** Badge/contador */
  badge?: BadgeInfo;
  
  /** Cor do badge */
  corBadge?: string;
  
  /** Subitems (dropdown) */
  subitems?: SubItemNavegacao[];
  
  /** Função chamada ao clicar */
  aoClicar?: () => void;
  
  /** Se abre em nova aba */
  novaAba?: boolean;
}

export interface SubItemNavegacao {
  /** ID único do subitem */
  id: string;
  
  /** Rótulo do subitem */
  rotulo: string;
  
  /** URL de destino */
  href?: string;
  
  /** Ícone do subitem */
  icone?: React.ReactNode;
  
  /** Se está ativo */
  ativo?: boolean;
  
  /** Se está desabilitado */
  desabilitado?: boolean;
  
  /** Função chamada ao clicar */
  aoClicar?: () => void;
  
  /** Tipo do item */
  tipo?: 'normal' | 'separador' | 'titulo';
}

export interface AcaoHeader {
  /** ID único da ação */
  id: string;
  
  /** Rótulo da ação */
  rotulo: string;
  
  /** Ícone da ação */
  icone?: React.ReactNode;
  
  /** Tipo da ação */
  tipo: 'botao' | 'link' | 'dropdown' | 'toggle' | 'personalizada';
  
  /** Variante visual */
  variante?: 'primaria' | 'secundaria' | 'fantasma' | 'perigo';
  
  /** Se está desabilitada */
  desabilitada?: boolean;
  
  /** Se está ativa (para toggles) */
  ativa?: boolean;
  
  /** Badge/contador */
  badge?: number;
  
  /** Cor do badge */
  corBadge?: string;
  
  /** Tooltip */
  tooltip?: string;
  
  /** URL (para links) */
  href?: string;
  
  /** Items do dropdown */
  dropdown?: ItemDropdown[];
  
  /** Função chamada ao clicar */
  aoClicar?: () => void;
  
  /** Se deve mostrar apenas o ícone */
  apenasIcone?: boolean;
}

export interface ItemDropdown {
  /** ID único do item */
  id: string;
  
  /** Rótulo do item */
  rotulo: string;
  
  /** Ícone do item */
  icone?: React.ReactNode;
  
  /** Tipo do item */
  tipo?: 'normal' | 'separador' | 'titulo' | 'perigo';
  
  /** Se está desabilitado */
  desabilitado?: boolean;
  
  /** URL de destino */
  href?: string;
  
  /** Função chamada ao clicar */
  aoClicar?: () => void;
  
  /** Atalho de teclado */
  atalho?: string;
}

export interface ConfiguracaoHeader {
  /** Altura do header */
  altura: number;
  
  /** Breakpoint para layout mobile */
  breakpointMobile: number;
  
  /** Animação de scroll */
  animacaoScroll: boolean;
  
  /** Auto-ocultar no scroll */
  autoOcultarScroll: boolean;
  
  /** Busca em tempo real */
  buscaTempoReal: boolean;
  
  /** Delay da busca (ms) */
  delayBusca: number;
}

export interface EstadoHeader {
  /** Se o menu mobile está aberto */
  menuMobileAberto: boolean;
  
  /** Se está no topo da página */
  noTopo: boolean;
  
  /** Se está oculto pelo scroll */
  oculto: boolean;
  
  /** Dropdown ativo */
  dropdownAtivo?: string;
  
  /** Se está em modo busca */
  modoBusca: boolean;
}

export interface NotificacaoHeader {
  /** ID da notificação */
  id: string;
  
  /** Título da notificação */
  titulo: string;
  
  /** Descrição da notificação */
  descricao?: string;
  
  /** Tipo da notificação */
  tipo: 'info' | 'sucesso' | 'aviso' | 'erro';
  
  /** Se foi lida */
  lida: boolean;
  
  /** Timestamp */
  timestamp: Date;
  
  /** Ícone da notificação */
  icone?: React.ReactNode;
  
  /** URL de destino */
  href?: string;
  
  /** Função chamada ao clicar */
  aoClicar?: () => void;
}

export interface ConfiguracaoBusca {
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

export interface ConfiguracaoNotificacoes {
  /** Contador de notificações */
  contador: number;
  
  /** Lista de notificações */
  itens: NotificacaoHeader[];
  
  /** Se está carregando */
  carregando?: boolean;
  
  /** Função chamada ao clicar no ícone */
  aoClicar?: () => void;
}

export interface BadgeInfo {
  /** Texto do badge */
  texto: string;
  
  /** Variante do badge */
  variante: 'primario' | 'secundario' | 'sucesso' | 'aviso' | 'perigo' | 'info';
  
  /** Tamanho do badge */
  tamanho?: 'pequeno' | 'medio' | 'grande';
} 