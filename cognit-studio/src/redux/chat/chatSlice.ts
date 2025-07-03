import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuid } from 'uuid';
import { conversasMock } from '../../shared/mocks/chat.mock';
import { Conversa, Mensagem } from '../../shared/types/chat.types';
import { EstadoChat } from './chatTypes';

// Thunk para carregar conversas mockadas
export const carregarConversas = createAsyncThunk<Conversa[]>(
  'chat/carregarConversas',
  async () => {
    await new Promise((r) => setTimeout(r, 500));
    return conversasMock;
  }
);

// Thunk para enviar mensagem (simulação)
export const enviarMensagem = createAsyncThunk<Mensagem, { conteudo: string }>(
  'chat/enviarMensagem',
  async ({ conteudo }) => {
    const msg: Mensagem = {
      id: uuid(),
      conteudo,
      autor: 'usuario',
      timestamp: new Date().toISOString(),
    };
    await new Promise((r) => setTimeout(r, 300));
    return msg;
  }
);

const estadoInicial: EstadoChat = {
  conversas: [],
  conversaSelecionadaId: null,
  carregando: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState: estadoInicial,
  reducers: {
    criarConversa: {
      reducer: (state, action: PayloadAction<Conversa>) => {
        state.conversas.push(action.payload);
        state.conversaSelecionadaId = action.payload.id;
      },
      prepare: (titulo: string) => {
        const novaConversa: Conversa = {
          id: uuid(),
          titulo,
          criadaEm: new Date().toISOString(),
          mensagens: [],
        };
        return { payload: novaConversa };
      },
    },
    selecionarConversa: (state, action: PayloadAction<string>) => {
      state.conversaSelecionadaId = action.payload;
    },
    adicionarMensagem: (state, action: PayloadAction<{ conversaId: string; mensagem: Mensagem }>) => {
      const { conversaId, mensagem } = action.payload;
      const conversa = state.conversas.find((c) => c.id === conversaId);
      if (conversa) {
        conversa.mensagens.push(mensagem);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(carregarConversas.pending, (state) => {
        state.carregando = true;
      })
      .addCase(carregarConversas.fulfilled, (state, action) => {
        state.conversas = action.payload;
        state.carregando = false;
      })
      .addCase(enviarMensagem.fulfilled, (state, action) => {
        if (state.conversaSelecionadaId) {
          const conversa = state.conversas.find((c) => c.id === state.conversaSelecionadaId);
          conversa?.mensagens.push(action.payload);
        }
      });
  },
});

export const { criarConversa, selecionarConversa, adicionarMensagem } = chatSlice.actions;
export default chatSlice.reducer;
