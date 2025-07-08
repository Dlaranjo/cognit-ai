export interface PropriedadesSwitch {
  /** Valor booleano do switch */
  ativo: boolean;
  
  /** Função chamada quando o switch é alterado */
  aoAlterar: (ativo: boolean) => void;
  
  /** Tamanho do switch */
  tamanho?: 'pequeno' | 'medio';
  
  /** Se o switch está desabilitado */
  desabilitado?: boolean;
  
  /** Rótulo para acessibilidade */
  rotulo?: string;
  
  /** Descrição adicional para acessibilidade */
  descricao?: string;
  
  /** ID único para o switch */
  id?: string;
  
  /** Nome para formulários */
  nome?: string;
  
  /** Classe CSS adicional */
  className?: string;
}

export interface EstadoSwitch {
  /** Se o switch está focado */
  focado: boolean;
  
  /** Se o switch está sendo pressionado */
  pressionado: boolean;
} 