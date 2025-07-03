import { Usuario } from '../types/usuario.types';

/**
 * Simula uma chamada de login via SSO Google.
 * Retorna um usuário mockado após 1 s.
 */
export const loginMockado = (): Promise<Usuario> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: '1',
        nome: 'Usuário Mock',
        email: 'usuario@mock.com',
        avatarUrl: 'https://i.pravatar.cc/150?img=3',
      });
    }, 1000);
  });
};
