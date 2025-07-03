import React from 'react';
import { useAutenticacao } from '../../hooks/useAutenticacao';
import Layout from '../../components/organisms/Layout/Layout';

const PaginaDashboard: React.FC = () => {
  const { usuario } = useAutenticacao();

  return (
    <Layout>
      <div className="dashboard-page" style={{ padding: '2rem' }}>
        <h1>Bem-vindo ao Cognit Studio</h1>
        {usuario && <p>Olá, {usuario.nome}!</p>}
      </div>
    </Layout>
  );
};

export default PaginaDashboard;
