export type VarianteBotao = 'primario' | 'secundario' | 'perigo';
export type TamanhoBotao = 'pequeno' | 'medio' | 'grande';

export interface PropriedadesBotao {
  titulo: string;
  aoClicar?: (evento: React.MouseEvent<HTMLButtonElement>) => void;
  carregando?: boolean;
  desabilitado?: boolean;
  variante?: VarianteBotao;
  tamanho?: TamanhoBotao;
  tipo?: 'button' | 'submit' | 'reset';
}
