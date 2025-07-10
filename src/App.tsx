import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/globals.css';
import PaginaLogin from './pages/Login/Login';
import PaginaChat from './pages/Chat/Chat';
import TesteAtoms from './pages/TesteAtoms';
import TesteMolecules from './pages/TesteMolecules';
import TesteOrganisms from './pages/TesteOrganisms';
import RotaProtegida from './components/organisms/RotaProtegida/RotaProtegida';
import { useAutenticacao } from './hooks/useAutenticacao';
import { StagewiseToolbar } from '@stagewise/toolbar-react';
import ReactPlugin from '@stagewise-plugins/react';

// Componente auxiliar para decidir rota inicial
const RedirecionarRaiz: React.FC = () => {
  const { autenticado } = useAutenticacao();
  return <Navigate to={autenticado ? '/chat' : '/login'} replace />;
};

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<RedirecionarRaiz />} />
      <Route path="/login" element={<PaginaLogin />} />
      <Route path="/teste/atoms" element={<TesteAtoms />} />
      <Route path="/teste/molecules" element={<TesteMolecules />} />
      <Route path="/teste/organisms" element={<TesteOrganisms />} />
      <Route
        path="/chat"
        element={
          <RotaProtegida>
            <PaginaChat />
          </RotaProtegida>
        }
      />
      {/* Redirect geral */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <StagewiseToolbar 
      config={{
        plugins: [ReactPlugin],
      }}
    />
  </BrowserRouter>
);

export default App;
