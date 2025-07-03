export type TamanhoAvatar = 'pequeno' | 'medio' | 'grande';

export interface PropriedadesAvatar {
  nome: string;
  src?: string;
  tamanho?: TamanhoAvatar;
  classeExtra?: string;
}
