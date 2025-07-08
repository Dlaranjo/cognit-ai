import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAutenticacao } from '../../hooks/useAutenticacao';

const PaginaLogin: React.FC = () => {
  const { fazerLogin, carregando, autenticado } = useAutenticacao();
  const navegar = useNavigate();

  const handleLogin = async (): Promise<void> => {
    await fazerLogin();
    navegar('/dashboard', { replace: true });
  };

  useEffect(() => {
    if (autenticado) {
      navegar('/dashboard', { replace: true });
    }
  }, [autenticado, navegar]);

  return (
    <div className="login-page" style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>🤖 Cognit Studio</h1>
      <p>Agregador de LLMs</p>
      <button onClick={handleLogin} disabled={carregando} style={{ marginTop: '1rem' }}>
        {carregando ? 'Entrando...' : 'Entrar com Google (Mock)'}
      </button>
    </div>
  );
};

export default PaginaLogin; 