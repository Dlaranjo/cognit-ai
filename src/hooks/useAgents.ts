import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import {
  fetchAgents,
  startConversation,
  sendMessage,
  createTask,
  fetchTasks,
  fetchConversationHistory,
  fetchConversations,
  cancelTask,
  retryTask,
  fetchAgentUsage,
  provideFeedback,
} from '../redux/agents/agentsActions';
import {
  selectAgent,
  setCurrentConversation,
  addMessage,
  updateTaskProgress,
  updateActionProgress,
  addAction,
  removeAction,
  setFilters,
  clearError,
} from '../redux/agents/agentsReducer';
import {
  selectAgents,
  selectSelectedAgent,
  selectCurrentConversation,
  selectConversations,
  selectTasks,
  selectActiveActions,
  selectIsLoading,
  selectIsProcessing,
  selectError,
  selectFilters,
  selectUsage,
  selectAgentsByCategory,
  selectActiveAgents,
  selectAgentById,
  selectTasksByStatus,
  selectRecentTasks,
  selectCurrentConversationMessages,
  selectHasActiveWorkflows,
} from '../redux/agents/agentsSelectors';
import type { AgentConversation } from '../redux/agents/agentsTypes';

export const useAgents = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const agents = useAppSelector(selectAgents);
  const selectedAgent = useAppSelector(selectSelectedAgent);
  const currentConversation = useAppSelector(selectCurrentConversation);
  const conversations = useAppSelector(selectConversations);
  const tasks = useAppSelector(selectTasks);
  const activeActions = useAppSelector(selectActiveActions);
  const isLoading = useAppSelector(selectIsLoading);
  const isProcessing = useAppSelector(selectIsProcessing);
  const error = useAppSelector(selectError);
  const filters = useAppSelector(selectFilters);
  const usage = useAppSelector(selectUsage);
  const activeAgents = useAppSelector(selectActiveAgents);
  const recentTasks = useAppSelector(selectRecentTasks);
  const currentMessages = useAppSelector(selectCurrentConversationMessages);
  const hasActiveWorkflows = useAppSelector(selectHasActiveWorkflows);

  // Actions
  const loadAgents = useCallback(() => {
    dispatch(fetchAgents());
  }, [dispatch]);

  const selectAgentById = useCallback(
    (agentId: string) => {
      const agent = agents.find((a) => a.id === agentId);
      if (agent) {
        dispatch(selectAgent(agent));
      }
    },
    [dispatch, agents]
  );

  const clearSelectedAgent = useCallback(() => {
    dispatch(selectAgent(null));
  }, [dispatch]);

  const startNewConversation = useCallback(
    async (agentId: string, workspaceId: string, title?: string) => {
      const result = await dispatch(
        startConversation({ agentId, workspaceId, title })
      );
      return result;
    },
    [dispatch]
  );

  const sendAgentMessage = useCallback(
    async (
      conversationId: string,
      content: string,
      attachments?: string[],
      parameters?: Record<string, unknown>
    ) => {
      const result = await dispatch(
        sendMessage({
          conversationId,
          content,
          attachments,
          parameters,
        })
      );
      return result;
    },
    [dispatch]
  );

  const createAgentTask = useCallback(
    async (
      agentId: string,
      workspaceId: string,
      prompt: string,
      documentIds?: string[],
      parameters?: Record<string, unknown>,
      priority: 'low' | 'medium' | 'high' = 'medium'
    ) => {
      const result = await dispatch(
        createTask({
          agentId,
          workspaceId,
          prompt,
          documentIds,
          parameters,
          priority,
        })
      );
      return result;
    },
    [dispatch]
  );

  const loadTasks = useCallback(
    (
      workspaceId: string,
      filters?: {
        agentId?: string;
        status?: string;
        limit?: number;
        offset?: number;
      }
    ) => {
      dispatch(fetchTasks({ workspaceId, filters }));
    },
    [dispatch]
  );

  const loadConversations = useCallback(
    (
      workspaceId: string,
      filters?: {
        agentId?: string;
        status?: string;
        limit?: number;
        offset?: number;
      }
    ) => {
      dispatch(fetchConversations({ workspaceId, filters }));
    },
    [dispatch]
  );

  const loadConversationHistory = useCallback(
    (conversationId: string) => {
      dispatch(fetchConversationHistory(conversationId));
    },
    [dispatch]
  );

  const cancelAgentTask = useCallback(
    (taskId: string) => {
      dispatch(cancelTask(taskId));
    },
    [dispatch]
  );

  const retryAgentTask = useCallback(
    (taskId: string) => {
      dispatch(retryTask(taskId));
    },
    [dispatch]
  );

  const loadUsageStats = useCallback(
    (workspaceId: string, timeRange: '7d' | '30d' | '90d' | '1y' = '30d') => {
      dispatch(fetchAgentUsage({ workspaceId, timeRange }));
    },
    [dispatch]
  );

  const submitFeedback = useCallback(
    (messageId: string, rating: 1 | 2 | 3 | 4 | 5, feedback?: string) => {
      dispatch(provideFeedback({ messageId, rating, feedback }));
    },
    [dispatch]
  );

  const updateFilters = useCallback(
    (newFilters: Partial<typeof filters>) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  const clearAgentsError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const setCurrentConversationState = useCallback(
    (conversation: AgentConversation | null) => {
      dispatch(setCurrentConversation(conversation));
    },
    [dispatch]
  );

  // Initialize agents on mount
  useEffect(() => {
    if (agents.length === 0) {
      loadAgents();
    }
  }, [agents.length, loadAgents]);

  return {
    // State
    agents,
    selectedAgent,
    currentConversation,
    conversations,
    tasks,
    activeActions,
    isLoading,
    isProcessing,
    error,
    filters,
    usage,
    activeAgents,
    recentTasks,
    currentMessages,
    hasActiveWorkflows,

    // Actions
    loadAgents,
    selectAgentById,
    clearSelectedAgent,
    startNewConversation,
    sendAgentMessage,
    createAgentTask,
    loadTasks,
    loadConversations,
    loadConversationHistory,
    cancelAgentTask,
    retryAgentTask,
    loadUsageStats,
    submitFeedback,
    updateFilters,
    clearAgentsError,
    setCurrentConversationState,
  };
};

// Specialized hooks for specific agent categories
export const useAgentsByCategory = (category: string) => {
  return useAppSelector((state) => selectAgentsByCategory(state, category));
};

export const useAgentById = (agentId: string) => {
  return useAppSelector((state) => selectAgentById(state, agentId));
};

export const useTasksByStatus = (status: string) => {
  return useAppSelector((state) => selectTasksByStatus(state, status));
};

// Hook for real-time task updates
export const useTaskProgress = (taskId: string) => {
  const dispatch = useAppDispatch();
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  useEffect(() => {
    if (!taskId) return;

    // Create SSE connection for real-time updates
    const source = new EventSource(`/api/agents/tasks/${taskId}/progress`);

    source.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'progress') {
        dispatch(updateTaskProgress({ taskId, progress: data.progress }));
      } else if (data.type === 'action_progress') {
        dispatch(
          updateActionProgress({
            actionId: data.actionId,
            progress: data.progress,
          })
        );
      }
    };

    source.onerror = (error) => {
      console.error('Task progress SSE error:', error);
      source.close();
    };

    setEventSource(source);

    return () => {
      source.close();
    };
  }, [taskId, dispatch]);

  return eventSource;
};

// Hook for real-time conversation updates
export const useConversationStream = (conversationId: string) => {
  const dispatch = useAppDispatch();
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  useEffect(() => {
    if (!conversationId) return;

    const source = new EventSource(
      `/api/agents/conversations/${conversationId}/stream`
    );

    source.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'message') {
        dispatch(addMessage(data.message));
      } else if (data.type === 'action_start') {
        dispatch(addAction(data.action));
      } else if (data.type === 'action_complete') {
        dispatch(removeAction(data.actionId));
      }
    };

    source.onerror = (error) => {
      console.error('Conversation stream SSE error:', error);
      source.close();
    };

    setEventSource(source);

    return () => {
      source.close();
    };
  }, [conversationId, dispatch]);

  return eventSource;
};
