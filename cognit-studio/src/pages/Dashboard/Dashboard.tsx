import React from 'react';
import { useAutenticacao } from '../../hooks/useAutenticacao';

const PaginaDashboard: React.FC = () => {
  const { usuario } = useAutenticacao();

  return (
    <div className="dashboard-page" style={{ padding: '2rem' }}>
      <h1>Bem-vindo ao Cognit Studio</h1>
      {usuario && <p>Olá, {usuario.nome}!</p>}
    </div>
  );
};

export default PaginaDashboard;
