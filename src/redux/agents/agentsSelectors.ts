import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';
// Types are imported where needed in function signatures

// Base selectors
export const selectAgentsState = (state: RootState) => state.agents;

export const selectAgents = createSelector(
  [selectAgentsState],
  (agentsState) => agentsState.agents
);

export const selectSelectedAgent = createSelector(
  [selectAgentsState],
  (agentsState) => agentsState.selectedAgent
);

export const selectCurrentConversation = createSelector(
  [selectAgentsState],
  (agentsState) => agentsState.currentConversation
);

export const selectConversations = createSelector(
  [selectAgentsState],
  (agentsState) => agentsState.conversations
);

export const selectTasks = createSelector(
  [selectAgentsState],
  (agentsState) => agentsState.tasks
);

export const selectActiveActions = createSelector(
  [selectAgentsState],
  (agentsState) => agentsState.activeActions
);

export const selectIsLoading = createSelector(
  [selectAgentsState],
  (agentsState) => agentsState.isLoading
);

export const selectIsProcessing = createSelector(
  [selectAgentsState],
  (agentsState) => agentsState.isProcessing
);

export const selectError = createSelector(
  [selectAgentsState],
  (agentsState) => agentsState.error
);

export const selectFilters = createSelector(
  [selectAgentsState],
  (agentsState) => agentsState.filters
);

export const selectUsage = createSelector(
  [selectAgentsState],
  (agentsState) => agentsState.usage
);

// Computed selectors
export const selectAgentsByCategory = createSelector(
  [selectAgents, selectFilters],
  (agents, filters) => {
    if (!filters.category) return agents;
    return agents.filter((agent) => agent.category === filters.category);
  }
);

export const selectActiveAgents = createSelector([selectAgents], (agents) =>
  agents.filter((agent) => agent.isActive)
);

export const selectAgentById = createSelector(
  [selectAgents, (_: RootState, agentId: string) => agentId],
  (agents, agentId) => agents.find((agent) => agent.id === agentId) || null
);

export const selectTasksByStatus = createSelector(
  [selectTasks, (_: RootState, status: string) => status],
  (tasks, status) => tasks.filter((task) => task.status === status)
);

export const selectPendingTasks = createSelector([selectTasks], (tasks) =>
  tasks.filter((task) => task.status === 'pending')
);

export const selectProcessingTasks = createSelector([selectTasks], (tasks) =>
  tasks.filter((task) => task.status === 'processing')
);

export const selectCompletedTasks = createSelector([selectTasks], (tasks) =>
  tasks.filter((task) => task.status === 'completed')
);

export const selectFailedTasks = createSelector([selectTasks], (tasks) =>
  tasks.filter((task) => task.status === 'failed')
);

export const selectRecentTasks = createSelector([selectTasks], (tasks) => {
  return [...tasks]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 10);
});

export const selectTasksByAgent = createSelector(
  [selectTasks, (_: RootState, agentId: string) => agentId],
  (tasks, agentId) => tasks.filter((task) => task.agentId === agentId)
);

export const selectConversationsByAgent = createSelector(
  [selectConversations, (_: RootState, agentId: string) => agentId],
  (conversations, agentId) =>
    conversations.filter((conv) => conv.agentId === agentId)
);

export const selectActiveConversations = createSelector(
  [selectConversations],
  (conversations) => conversations.filter((conv) => conv.status === 'active')
);

export const selectRecentConversations = createSelector(
  [selectConversations],
  (conversations) => {
    return [...conversations]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, 5);
  }
);

export const selectProcessingActions = createSelector(
  [selectActiveActions],
  (actions) => actions.filter((action) => action.status === 'processing')
);

export const selectCompletedActions = createSelector(
  [selectActiveActions],
  (actions) => actions.filter((action) => action.status === 'completed')
);

export const selectFailedActions = createSelector(
  [selectActiveActions],
  (actions) => actions.filter((action) => action.status === 'failed')
);

// Statistics selectors
export const selectTaskSuccessRate = createSelector([selectUsage], (usage) => {
  if (usage.totalTasks === 0) return 0;
  return (usage.completedTasks / usage.totalTasks) * 100;
});

export const selectTaskFailureRate = createSelector([selectUsage], (usage) => {
  if (usage.totalTasks === 0) return 0;
  return (usage.failedTasks / usage.totalTasks) * 100;
});

export const selectAgentUsageStats = createSelector(
  [selectAgents, selectTasks],
  (agents, tasks) => {
    return agents.map((agent) => {
      const agentTasks = tasks.filter((task) => task.agentId === agent.id);
      const completedTasks = agentTasks.filter(
        (task) => task.status === 'completed'
      ).length;
      const totalTasks = agentTasks.length;

      return {
        ...agent,
        usage: {
          ...agent.usage,
          totalRequests: totalTasks,
          successRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
        },
      };
    });
  }
);

export const selectCurrentConversationMessages = createSelector(
  [selectCurrentConversation],
  (conversation) => conversation?.messages || []
);

export const selectHasActiveWorkflows = createSelector(
  [selectProcessingTasks, selectProcessingActions],
  (processingTasks, processingActions) => {
    return processingTasks.length > 0 || processingActions.length > 0;
  }
);

export const selectFilteredTasks = createSelector(
  [selectTasks, selectFilters],
  (tasks, filters) => {
    let filteredTasks = tasks;

    if (filters.status) {
      filteredTasks = filteredTasks.filter(
        (task) => task.status === filters.status
      );
    }

    if (filters.workspaceId) {
      filteredTasks = filteredTasks.filter(
        (task) => task.workspaceId === filters.workspaceId
      );
    }

    return filteredTasks;
  }
);

export const selectFilteredConversations = createSelector(
  [selectConversations, selectFilters],
  (conversations, filters) => {
    let filteredConversations = conversations;

    if (filters.status) {
      filteredConversations = filteredConversations.filter(
        (conv) => conv.status === filters.status
      );
    }

    if (filters.workspaceId) {
      filteredConversations = filteredConversations.filter(
        (conv) => conv.workspaceId === filters.workspaceId
      );
    }

    return filteredConversations;
  }
);
