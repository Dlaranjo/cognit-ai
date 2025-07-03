export interface PropriedadesEntradaMensagem {
  valor: string;
  aoMudar: (novoValor: string) => void;
  aoEnviar: () => void;
  carregando?: boolean;
}
