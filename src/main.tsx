import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import { createMockServer, shouldUseMockServer } from './api/mockServer';
import App from './App.tsx';
import './index.css';

// Initialize mock server if in development mode
if (shouldUseMockServer()) {
  createMockServer();
  console.log('🎭 Mock server started for development');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);
