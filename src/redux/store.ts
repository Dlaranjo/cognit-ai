import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

/**
 * Configura e exporta a store Redux principal da aplicação.
 * Usa Redux DevTools somente em ambiente de desenvolvimento.
 */
export const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.MODE !== 'production',
});

// Tipos auxiliares para uso com TypeScript
export type EstadoRaiz = ReturnType<typeof store.getState>;
export type DespachoApp = typeof store.dispatch; 