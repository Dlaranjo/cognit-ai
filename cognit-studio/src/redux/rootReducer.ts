import { combineReducers } from '@reduxjs/toolkit';

/**
 * Root reducer que combinará todos os slices da aplicação.
 * Inicialmente vazio – módulos serão adicionados conforme implementados.
 */
const rootReducer = combineReducers({
  // auth: authReducer,
  // chat: chatReducer,
  // ui: uiReducer,
});

export default rootReducer;

export type EstadoRaiz = ReturnType<typeof rootReducer>;
