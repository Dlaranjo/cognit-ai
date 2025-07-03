import React, { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAutenticacao } from '../../../hooks/useAutenticacao';

export interface PropriedadesRotaProtegida {
  children: ReactElement;
}

/**
 * Componente que restringe acesso às rotas para usuários autenticados.
 * Redireciona para /login quando não autenticado.
 */
const RotaProtegida: React.FC<PropriedadesRotaProtegida> = ({ children }) => {
  const { autenticado, carregando } = useAutenticacao();

  if (carregando) {
    return <div>Carregando...</div>;
  }

  return autenticado ? children : <Navigate to="/login" replace />;
};

export default React.memo(RotaProtegida);
