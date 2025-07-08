import React from 'react';

export interface PropriedadesCardUsuario {
  /** Informações do usuário */
  usuario: DadosUsuario;
  
  /** Variante do card */
  variante?: 'compacto' | 'expandido' | 'minimal';
  
  /** Se deve mostrar o status online */
  mostrarStatus?: boolean;
  
  /** Se deve mostrar informações adicionais */
  mostrarDetalhes?: boolean;
  
  /** Ações disponíveis para o usuário */
  acoes?: AcaoUsuario[];
  
  /** Se o card é clicável */
  clicavel?: boolean;
  
  /** Se o card está selecionado */
  selecionado?: boolean;
  
  /** Função chamada ao clicar no card */
  aoClicar?: () => void;
  
  /** Função chamada ao clicar em uma ação */
  aoClicarAcao?: (acao: AcaoUsuario) => void;
  
  /** Classes CSS adicionais */
  className?: string;
  
  /** ID do elemento */
  id?: string;
}

export interface DadosUsuario {
  /** ID único do usuário */
  id: string;
  
  /** Nome completo */
  nome: string;
  
  /** Nome de usuário/apelido */
  nomeUsuario?: string;
  
  /** Email */
  email?: string;
  
  /** URL da foto do perfil */
  fotoPerfil?: string;
  
  /** Cargo/função */
  cargo?: string;
  
  /** Empresa/organização */
  empresa?: string;
  
  /** Status online */
  statusOnline?: StatusOnline;
  
  /** Última vez visto */
  ultimaVezVisto?: Date;
  
  /** Localização */
  localizacao?: string;
  
  /** Biografia/descrição */
  biografia?: string;
  
  /** Cor personalizada */
  corPersonalizada?: string;
  
  /** Badges/emblemas */
  badges?: Badge[];
  
  /** Estatísticas */
  estatisticas?: EstatisticasUsuario;
}

export type StatusOnline = 
  | 'online'
  | 'ausente'
  | 'ocupado'
  | 'invisivel'
  | 'offline';

export interface Badge {
  /** ID único do badge */
  id: string;
  
  /** Rótulo do badge */
  rotulo: string;
  
  /** Cor do badge */
  cor: string;
  
  /** Ícone do badge */
  icone?: React.ReactNode;
  
  /** Tooltip do badge */
  tooltip?: string;
}

export interface EstatisticasUsuario {
  /** Número de mensagens enviadas */
  mensagensEnviadas?: number;
  
  /** Número de conversas */
  conversas?: number;
  
  /** Tempo total online */
  tempoOnline?: number;
  
  /** Data de cadastro */
  dataCadastro?: Date;
  
  /** Último acesso */
  ultimoAcesso?: Date;
}

export interface AcaoUsuario {
  /** ID único da ação */
  id: string;
  
  /** Rótulo da ação */
  rotulo: string;
  
  /** Ícone da ação */
  icone?: React.ReactNode;
  
  /** Tipo da ação */
  tipo: 'mensagem' | 'perfil' | 'bloquear' | 'remover' | 'editar' | 'configuracoes' | 'personalizada';
  
  /** Se a ação está desabilitada */
  desabilitada?: boolean;
  
  /** Tooltip da ação */
  tooltip?: string;
  
  /** Cor da ação */
  cor?: 'primaria' | 'secundaria' | 'perigo' | 'sucesso' | 'aviso';
}

export interface ConfiguracaoCardUsuario {
  /** Tamanho do avatar */
  tamanhoAvatar: 'pequeno' | 'medio' | 'grande';
  
  /** Se deve mostrar badges */
  mostrarBadges: boolean;
  
  /** Número máximo de badges visíveis */
  maxBadges: number;
  
  /** Se deve mostrar estatísticas */
  mostrarEstatisticas: boolean;
  
  /** Animação de hover */
  animacaoHover: boolean;
} 