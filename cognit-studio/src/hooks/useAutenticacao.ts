import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginMockado } from '../shared/mocks/auth.mock';
import { Usuario } from '../shared/types/usuario.types';
import { loginUsuario, logoutUsuario } from '../redux/auth/authSlice';
import { seletorAuth, seletorUsuarioAtual } from '../redux/auth/authSelectors';
import { DespachoApp } from '../redux/store';

export interface RetornoUseAutenticacao {
  usuario: Usuario | null;
  autenticado: boolean;
  carregando: boolean;
  fazerLogin: () => Promise<void>;
  fazerLogout: () => void;
}

/**
 * Hook customizado para controle de autenticação mockada.
 */
export const useAutenticacao = (): RetornoUseAutenticacao => {
  const dispatch = useDispatch<DespachoApp>();
  const usuario = useSelector(seletorUsuarioAtual);
  const { autenticado } = useSelector(seletorAuth);

  const [carregando, setCarregando] = useState<boolean>(false);

  const fazerLogin = useCallback(async (): Promise<void> => {
    setCarregando(true);
    try {
      const usuarioRetornado = await loginMockado();
      dispatch(loginUsuario(usuarioRetornado));
    } finally {
      setCarregando(false);
    }
  }, [dispatch]);

  const fazerLogout = useCallback((): void => {
    dispatch(logoutUsuario());
  }, [dispatch]);

  return {
    usuario,
    autenticado,
    carregando,
    fazerLogin,
    fazerLogout,
  };
};
