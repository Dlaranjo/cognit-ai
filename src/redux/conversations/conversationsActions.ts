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
      const conversations = await chatApi.getConversations();
      return conversations;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversations');
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
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversation');
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
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete conversation');
    }
  }
);
