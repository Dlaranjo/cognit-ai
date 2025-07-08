export interface Usuario {
  id: string;
  nome: string;
  email: string;
  avatarUrl?: string;
}

export interface CredenciaisLogin {
  email: string;
  senha: string;
} 