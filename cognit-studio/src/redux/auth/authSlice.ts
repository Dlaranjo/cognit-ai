import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Usuario } from '../../shared/types/usuario.types';
import { EstadoAuth } from './authTypes';

const estadoInicial: EstadoAuth = {
  usuario: null,
  autenticado: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: estadoInicial,
  reducers: {
    loginUsuario: (state, action: PayloadAction<Usuario>) => {
      state.usuario = action.payload;
      state.autenticado = true;
    },
    logoutUsuario: (state) => {
      state.usuario = null;
      state.autenticado = false;
    },
  },
});

export const { loginUsuario, logoutUsuario } = authSlice.actions;
export default authSlice.reducer;
