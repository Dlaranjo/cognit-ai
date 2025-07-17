import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchConversations, fetchConversation, deleteConversation } from './conversationsActions';
import type { ConversationsState, ConversationFilters } from './conversationsTypes';

const initialState: ConversationsState = {
  conversations: [],
  favoriteConversations: [],
  searchQuery: '',
  isLoading: false,
  hasMore: true,
  filters: {},
};

const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setFilters: (state, action: PayloadAction<ConversationFilters>) => {
      state.filters = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload;
      const index = state.favoriteConversations.indexOf(conversationId);
      if (index > -1) {
        state.favoriteConversations.splice(index, 1);
      } else {
        state.favoriteConversations.push(conversationId);
      }
    },
    clearFilters: (state) => {
      state.filters = {};
      state.searchQuery = '';
    },
  },
  extraReducers: (builder) => {
    // Fetch Conversations
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state) => {
        state.isLoading = false;
      });

    // Fetch Single Conversation
    builder
      .addCase(fetchConversation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        const existingIndex = state.conversations.findIndex(c => c.id === action.payload.id);
        if (existingIndex > -1) {
          state.conversations[existingIndex] = action.payload;
        } else {
          state.conversations.unshift(action.payload);
        }
      })
      .addCase(fetchConversation.rejected, (state) => {
        state.isLoading = false;
      });

    // Delete Conversation
    builder
      .addCase(deleteConversation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = state.conversations.filter(c => c.id !== action.payload);
        state.favoriteConversations = state.favoriteConversations.filter(id => id !== action.payload);
      })
      .addCase(deleteConversation.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  setSearchQuery,
  setFilters,
  toggleFavorite,
  clearFilters,
} = conversationsSlice.actions;

export const conversationsReducer = conversationsSlice.reducer;
