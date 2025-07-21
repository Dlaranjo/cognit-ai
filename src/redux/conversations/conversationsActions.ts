import { createAsyncThunk } from '@reduxjs/toolkit';
import { chatApi, type Conversation } from '../../api/chatApi';

export const fetchConversations = createAsyncThunk<
  Conversation[],
  void,
  { rejectValue: string }
>(
  'conversations/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatApi.getConversations();
      return response.conversations || [];
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch conversations';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchConversation = createAsyncThunk<
  Conversation,
  string,
  { rejectValue: string }
>(
  'conversations/fetchConversation',
  async (id, { rejectWithValue }) => {
    try {
      const conversation = await chatApi.getConversation(id);
      return conversation;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch conversation';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteConversation = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'conversations/deleteConversation',
  async (id, { rejectWithValue }) => {
    try {
      await chatApi.deleteConversation(id);
      return id;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete conversation';
      return rejectWithValue(errorMessage);
    }
  }
);
