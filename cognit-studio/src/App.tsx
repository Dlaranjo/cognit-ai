import React from 'react';
import './styles/globals.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>🤖 Cognit Studio</h1>
        <p>Agregador de LLMs - Em desenvolvimento</p>
      </header>
      
      <main className="app-main">
        <div className="status-card">
          <h2>✅ Setup Concluído</h2>
          <ul>
            <li>React + TypeScript configurado</li>
            <li>Estrutura Atomic Design criada</li>
            <li>Redux Toolkit instalado</li>
            <li>ESLint + Prettier configurados</li>
          </ul>
        </div>
        
        <div className="next-steps">
          <h3>🎯 Próximos Passos:</h3>
          <ol>
            <li>Implementar Redux store</li>
            <li>Criar componentes atoms</li>
            <li>Configurar React Router</li>
            <li>Adicionar autenticação mockada</li>
          </ol>
        </div>
      </main>
    </div>
  );
};

export default App;
