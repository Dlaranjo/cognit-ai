import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sendMessage, uploadFile } from './chatActions';
import type { ChatState } from './chatTypes';
import type { Message, Conversation } from '../../api/chatApi';

const initialState: ChatState = {
  currentConversation: null,
  messages: [],
  isTyping: false,
  selectedProvider: 'openai',
  selectedModel: 'gpt-4-turbo',
  streamingMessage: null,
  isLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentConversation: (state, action: PayloadAction<Conversation | null>) => {
      state.currentConversation = action.payload;
      state.messages = action.payload?.messages || [];
    },
    setSelectedProvider: (state, action: PayloadAction<string>) => {
      state.selectedProvider = action.payload;
    },
    setSelectedModel: (state, action: PayloadAction<string>) => {
      state.selectedModel = action.payload;
    },
    setIsTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    setStreamingMessage: (state, action: PayloadAction<string | null>) => {
      state.streamingMessage = action.payload;
    },
    clearStreamingMessage: (state) => {
      state.streamingMessage = null;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
      state.currentConversation = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Send Message
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.isTyping = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isTyping = false;
        state.messages.push(action.payload);
        state.error = null;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isTyping = false;
        state.error = action.payload || 'Failed to send message';
      });

    // Upload File
    builder
      .addCase(uploadFile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to upload file';
      });
  },
});

export const {
  setCurrentConversation,
  setSelectedProvider,
  setSelectedModel,
  setIsTyping,
  setStreamingMessage,
  clearStreamingMessage,
  addMessage,
  clearMessages,
  clearError,
} = chatSlice.actions;

export const chatReducer = chatSlice.reducer;
