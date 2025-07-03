export interface PropriedadesInput {
  valor: string;
  placeholder?: string;
  tipo?: 'text' | 'email' | 'password';
  erro?: string;
  aoMudar: (novoValor: string) => void;
  desabilitado?: boolean;
}
