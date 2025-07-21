import { createAsyncThunk } from '@reduxjs/toolkit';
import { agentsApi } from '../../api/agentsApi';
// Types are imported where needed in function signatures

// Fetch all available agents
export const fetchAgents = createAsyncThunk(
  'agents/fetchAgents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await agentsApi.getAgents();
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Start a new conversation with an agent
export const startConversation = createAsyncThunk(
  'agents/startConversation',
  async (
    {
      agentId,
      workspaceId,
      title,
    }: { agentId: string; workspaceId: string; title?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await agentsApi.startConversation({
        agentId,
        workspaceId,
        title: title || `New conversation with ${agentId}`,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Send a message to an agent
export const sendMessage = createAsyncThunk(
  'agents/sendMessage',
  async (
    {
      conversationId,
      content,
      attachments,
      parameters,
    }: {
      conversationId: string;
      content: string;
      attachments?: string[];
      parameters?: Record<string, unknown>;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await agentsApi.sendMessage({
        conversationId,
        content,
        attachments,
        parameters,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Create a new agent task
export const createTask = createAsyncThunk(
  'agents/createTask',
  async (
    {
      agentId,
      workspaceId,
      prompt,
      documentIds,
      parameters,
      priority = 'medium',
    }: {
      agentId: string;
      workspaceId: string;
      prompt: string;
      documentIds?: string[];
      parameters?: Record<string, unknown>;
      priority?: 'low' | 'medium' | 'high';
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await agentsApi.createTask({
        agentId,
        workspaceId,
        prompt,
        documentIds,
        parameters,
        priority,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Get task details and status
export const getTask = createAsyncThunk(
  'agents/getTask',
  async (taskId: string, { rejectWithValue }) => {
    try {
      const response = await agentsApi.getTask(taskId);
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Get all tasks for a workspace
export const fetchTasks = createAsyncThunk(
  'agents/fetchTasks',
  async (
    {
      workspaceId,
      filters,
    }: {
      workspaceId: string;
      filters?: {
        agentId?: string;
        status?: string;
        limit?: number;
        offset?: number;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await agentsApi.getTasks(workspaceId, filters);
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Get conversation history
export const fetchConversationHistory = createAsyncThunk(
  'agents/fetchConversationHistory',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response = await agentsApi.getConversation(conversationId);
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Get all conversations for a workspace
export const fetchConversations = createAsyncThunk(
  'agents/fetchConversations',
  async (
    {
      workspaceId,
      filters,
    }: {
      workspaceId: string;
      filters?: {
        agentId?: string;
        status?: string;
        limit?: number;
        offset?: number;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await agentsApi.getConversations(workspaceId, filters);
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Cancel a running task
export const cancelTask = createAsyncThunk(
  'agents/cancelTask',
  async (taskId: string, { rejectWithValue }) => {
    try {
      const response = await agentsApi.cancelTask(taskId);
      return { taskId, ...response.data };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Retry a failed task
export const retryTask = createAsyncThunk(
  'agents/retryTask',
  async (taskId: string, { rejectWithValue }) => {
    try {
      const response = await agentsApi.retryTask(taskId);
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Download generated file
export const downloadFile = createAsyncThunk(
  'agents/downloadFile',
  async (
    { taskId, fileId }: { taskId: string; fileId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await agentsApi.downloadFile(taskId, fileId);
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Get agent usage statistics
export const fetchAgentUsage = createAsyncThunk(
  'agents/fetchAgentUsage',
  async (
    {
      workspaceId,
      timeRange = '30d',
    }: {
      workspaceId: string;
      timeRange?: '7d' | '30d' | '90d' | '1y';
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await agentsApi.getUsageStats(workspaceId, timeRange);
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Provide feedback on agent response
export const provideFeedback = createAsyncThunk(
  'agents/provideFeedback',
  async (
    {
      messageId,
      rating,
      feedback,
    }: {
      messageId: string;
      rating: 1 | 2 | 3 | 4 | 5;
      feedback?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await agentsApi.provideFeedback({
        messageId,
        rating,
        feedback,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
