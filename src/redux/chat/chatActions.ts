import { createAsyncThunk } from '@reduxjs/toolkit';
import { chatApi, type SendMessageRequest, type Message } from '../../api/chatApi';

export const sendMessage = createAsyncThunk<
  Message,
  SendMessageRequest,
  { rejectValue: string }
>(
  'chat/sendMessage',
  async (request, { rejectWithValue }) => {
    try {
      const response = await chatApi.sendMessage(request);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      return rejectWithValue(errorMessage);
    }
  }
);

export const uploadFile = createAsyncThunk<
  { url: string; id: string },
  File,
  { rejectValue: string }
>(
  'chat/uploadFile',
  async (file, { rejectWithValue }) => {
    try {
      const response = await chatApi.uploadFile(file);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
      return rejectWithValue(errorMessage);
    }
  }
);
