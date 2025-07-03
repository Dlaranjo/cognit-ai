import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/globals.css';
import PaginaLogin from './pages/Login/Login';
import PaginaDashboard from './pages/Dashboard/Dashboard';
import RotaProtegida from './components/organisms/RotaProtegida/RotaProtegida';
import { useAutenticacao } from './hooks/useAutenticacao';

// Componente auxiliar para decidir rota inicial
const RedirecionarRaiz: React.FC = () => {
  const { autenticado } = useAutenticacao();
  return <Navigate to={autenticado ? '/dashboard' : '/login'} replace />;
};

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<RedirecionarRaiz />} />
      <Route path="/login" element={<PaginaLogin />} />
      <Route
        path="/dashboard"
        element={
          <RotaProtegida>
            <PaginaDashboard />
          </RotaProtegida>
        }
      />
      {/* Redirect geral */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;
