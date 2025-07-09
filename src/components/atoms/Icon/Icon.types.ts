export type TamanhoIcon = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type CorIcon = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'inherit';
export type VarianteIcon = 'solid' | 'outline' | 'mini';

// Tipos de ícones disponíveis
export type TipoIcon = 
  // Navegação
  | 'arrow-left' | 'arrow-right' | 'arrow-up' | 'arrow-down'
  | 'chevron-left' | 'chevron-right' | 'chevron-up' | 'chevron-down'
  | 'menu' | 'close' | 'home' | 'back'
  
  // Ações
  | 'edit' | 'delete' | 'copy' | 'share' | 'save' | 'download' | 'upload'
  | 'add' | 'remove' | 'plus' | 'minus' | 'check' | 'x'
  | 'search' | 'filter' | 'sort' | 'refresh' | 'sync'
  
  // Interface
  | 'eye' | 'eye-off' | 'star' | 'star-filled' | 'heart' | 'heart-filled'
  | 'bookmark' | 'bookmark-filled' | 'flag' | 'flag-filled'
  | 'thumbs-up' | 'thumbs-down' | 'like' | 'dislike'
  
  // Comunicação
  | 'send' | 'reply' | 'forward' | 'mail' | 'message' | 'chat'
  | 'phone' | 'video' | 'microphone' | 'microphone-off'
  | 'speaker' | 'speaker-off' | 'volume' | 'volume-off'
  
  // Arquivos e documentos
  | 'file' | 'folder' | 'image' | 'document' | 'pdf' | 'zip'
  | 'attachment' | 'link' | 'external-link' | 'clipboard'
  
  // Usuário e perfil
  | 'user' | 'users' | 'profile' | 'avatar' | 'account' | 'settings'
  | 'login' | 'logout' | 'lock' | 'unlock' | 'key' | 'shield'
  
  // Sistema
  | 'loading' | 'spinner' | 'error' | 'warning' | 'success' | 'info'
  | 'bell' | 'bell-off' | 'calendar' | 'clock' | 'location' | 'globe'
  | 'wifi' | 'bluetooth' | 'battery' | 'power' | 'signal'
  
  // Formatação
  | 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code'
  | 'list' | 'ordered-list' | 'quote' | 'text-align-left' | 'text-align-center' | 'text-align-right'
  
  // Mídia
  | 'play' | 'pause' | 'stop' | 'skip-forward' | 'skip-backward'
  | 'volume-up' | 'volume-down' | 'mute' | 'fullscreen' | 'minimize'
  
  // Ferramentas
  | 'tool' | 'wrench' | 'gear' | 'cog' | 'chart' | 'graph'
  | 'dashboard' | 'analytics' | 'report' | 'export' | 'import'
  
  // Outros
  | 'more' | 'more-horizontal' | 'more-vertical' | 'drag' | 'move'
  | 'resize' | 'zoom-in' | 'zoom-out' | 'fullscreen-exit' | 'expand' | 'collapse';

export interface PropriedadesIcon {
  /** Tipo do ícone */
  tipo: TipoIcon;
  
  /** Tamanho do ícone */
  tamanho?: TamanhoIcon;
  
  /** Cor do ícone */
  cor?: CorIcon;
  
  /** Variante do ícone */
  variante?: VarianteIcon;
  
  /** Rotação do ícone em graus */
  rotacao?: number;
  
  /** Se o ícone está girando (animação) */
  girando?: boolean;
  
  /** Classes CSS adicionais */
  className?: string;
  
  /** Título para acessibilidade */
  titulo?: string;
  
  /** Função chamada ao clicar no ícone */
  aoClicar?: () => void;
  
  /** Se o ícone é clicável */
  clicavel?: boolean;
  
  /** Atributos de acessibilidade */
  'aria-label'?: string;
  'aria-hidden'?: boolean;
  
  /** ID do elemento */
  id?: string;
  
  /** Referência para o elemento */
  ref?: React.RefObject<HTMLElement>;
}