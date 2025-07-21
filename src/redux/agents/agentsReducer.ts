import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchAgents,
  startConversation,
  sendMessage,
  createTask,
  getTask,
  fetchTasks,
  fetchConversationHistory,
  fetchConversations,
  cancelTask,
  retryTask,
  fetchAgentUsage,
} from './agentsActions';
import type {
  AgentsState,
  Agent,
  AgentConversation,
  AgentMessage,
  AgentAction,
} from './agentsTypes';

const initialState: AgentsState = {
  agents: [],
  selectedAgent: null,
  currentConversation: null,
  conversations: [],
  tasks: [],
  activeActions: [],
  isLoading: false,
  isProcessing: false,
  error: null,
  filters: {
    category: null,
    status: null,
    workspaceId: null,
  },
  usage: {
    totalTasks: 0,
    completedTasks: 0,
    failedTasks: 0,
    totalFileSize: 0,
  },
};

const agentsSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    selectAgent: (state, action: PayloadAction<Agent | null>) => {
      state.selectedAgent = action.payload;
    },

    setCurrentConversation: (
      state,
      action: PayloadAction<AgentConversation | null>
    ) => {
      state.currentConversation = action.payload;
    },

    addMessage: (state, action: PayloadAction<AgentMessage>) => {
      if (state.currentConversation) {
        state.currentConversation.messages.push(action.payload);
        state.currentConversation.updatedAt = new Date().toISOString();
      }
    },

    updateTaskProgress: (
      state,
      action: PayloadAction<{ taskId: string; progress: number }>
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.progress = action.payload.progress;
        task.updatedAt = new Date().toISOString();
        if (action.payload.progress === 100) {
          task.status = 'completed';
          task.completedAt = new Date().toISOString();
        }
      }
    },

    updateActionProgress: (
      state,
      action: PayloadAction<{ actionId: string; progress: number }>
    ) => {
      const action_item = state.activeActions.find(
        (a) => a.id === action.payload.actionId
      );
      if (action_item) {
        action_item.progress = action.payload.progress;
        if (action.payload.progress === 100) {
          action_item.status = 'completed';
          action_item.completedAt = new Date().toISOString();
        }
      }
    },

    addAction: (state, action: PayloadAction<AgentAction>) => {
      state.activeActions.push(action.payload);
    },

    removeAction: (state, action: PayloadAction<string>) => {
      state.activeActions = state.activeActions.filter(
        (a) => a.id !== action.payload
      );
    },

    setFilters: (
      state,
      action: PayloadAction<Partial<AgentsState['filters']>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    clearError: (state) => {
      state.error = null;
    },

    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },

    resetState: () => initialState,
  },

  extraReducers: (builder) => {
    // Fetch Agents
    builder
      .addCase(fetchAgents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.agents = action.payload;
      })
      .addCase(fetchAgents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Start Conversation
    builder
      .addCase(startConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentConversation = action.payload;
        state.conversations.unshift(action.payload);
      })
      .addCase(startConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Send Message
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isProcessing = false;
        if (state.currentConversation) {
          state.currentConversation.messages.push(action.payload.message);
          state.currentConversation.updatedAt = new Date().toISOString();

          // Add any actions that were created
          if (action.payload.actions) {
            state.activeActions.push(...action.payload.actions);
          }
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload as string;
      });

    // Create Task
    builder
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks.unshift(action.payload);
        state.usage.totalTasks += 1;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get Task
    builder.addCase(getTask.fulfilled, (state, action) => {
      const existingTaskIndex = state.tasks.findIndex(
        (t) => t.id === action.payload.id
      );
      if (existingTaskIndex >= 0) {
        state.tasks[existingTaskIndex] = action.payload;
      } else {
        state.tasks.push(action.payload);
      }

      // Update usage stats
      if (action.payload.status === 'completed') {
        state.usage.completedTasks += 1;
      } else if (action.payload.status === 'failed') {
        state.usage.failedTasks += 1;
      }
    });

    // Fetch Tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload.tasks;
        state.usage = { ...state.usage, ...action.payload.usage };
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Conversation History
    builder.addCase(fetchConversationHistory.fulfilled, (state, action) => {
      state.currentConversation = action.payload;
    });

    // Fetch Conversations
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Cancel Task
    builder.addCase(cancelTask.fulfilled, (state, action) => {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.status = 'failed';
        task.error = 'Task cancelled by user';
        task.updatedAt = new Date().toISOString();
      }
    });

    // Retry Task
    builder.addCase(retryTask.fulfilled, (state, action) => {
      const existingTaskIndex = state.tasks.findIndex(
        (t) => t.id === action.payload.id
      );
      if (existingTaskIndex >= 0) {
        state.tasks[existingTaskIndex] = action.payload;
      }
    });

    // Fetch Agent Usage
    builder.addCase(fetchAgentUsage.fulfilled, (state, action) => {
      state.usage = action.payload;
    });
  },
});

export const {
  selectAgent,
  setCurrentConversation,
  addMessage,
  updateTaskProgress,
  updateActionProgress,
  addAction,
  removeAction,
  setFilters,
  clearError,
  setProcessing,
  resetState,
} = agentsSlice.actions;

export default agentsSlice.reducer;
