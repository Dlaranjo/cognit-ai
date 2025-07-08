export type TamanhoAvatar = 'pequeno' | 'medio' | 'grande' | 'extra-grande';
export type FormatoAvatar = 'circular' | 'quadrado';

export interface PropriedadesAvatar {
  /** URL da imagem do avatar */
  src?: string;
  
  /** Texto alternativo para a imagem */
  alt?: string;
  
  /** Nome da pessoa (usado para gerar iniciais se não houver imagem) */
  nome?: string;
  
  /** Tamanho do avatar */
  tamanho?: TamanhoAvatar;
  
  /** Formato do avatar */
  formato?: FormatoAvatar;
  
  /** Cor de fundo personalizada para avatares com iniciais */
  corFundo?: string;
  
  /** Cor do texto para avatares com iniciais */
  corTexto?: string;
  
  /** Se o avatar deve mostrar um indicador de status online */
  statusOnline?: boolean;
  
  /** Função chamada ao clicar no avatar */
  aoClicar?: () => void;
  
  /** Se o avatar é clicável */
  clicavel?: boolean;
  
  /** Classes CSS adicionais */
  className?: string;
  
  /** ID do elemento */
  id?: string;
  
  /** Atributos de acessibilidade */
  'aria-label'?: string;
} 