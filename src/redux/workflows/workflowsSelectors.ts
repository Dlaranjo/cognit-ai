import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../types';

// Base selector
export const selectWorkflowsState = (state: RootState) => state.workflows;

// Basic selectors
export const selectWorkflows = createSelector(
  [selectWorkflowsState],
  (workflows) => workflows.workflows
);

export const selectActiveWorkflow = createSelector(
  [selectWorkflowsState],
  (workflows) => workflows.activeWorkflow
);

export const selectSelectedNode = createSelector(
  [selectWorkflowsState],
  (workflows) => workflows.selectedNode
);

export const selectTemplates = createSelector(
  [selectWorkflowsState],
  (workflows) => workflows.templates
);

export const selectExecutions = createSelector(
  [selectWorkflowsState],
  (workflows) => workflows.executions
);

export const selectN8nState = createSelector(
  [selectWorkflowsState],
  (workflows) => workflows.n8nState
);

export const selectWorkflowsLoading = createSelector(
  [selectWorkflowsState],
  (workflows) => workflows.isLoading
);

export const selectWorkflowsExecuting = createSelector(
  [selectWorkflowsState],
  (workflows) => workflows.isExecuting
);

export const selectWorkflowsError = createSelector(
  [selectWorkflowsState],
  (workflows) => workflows.error
);

export const selectWorkflowsFilters = createSelector(
  [selectWorkflowsState],
  (workflows) => workflows.filters
);

// Computed selectors
export const selectWorkflowById = createSelector(
  [selectWorkflows, (_, workflowId: string) => workflowId],
  (workflows, workflowId) => workflows.find(w => w.id === workflowId)
);

export const selectActiveWorkflowNodes = createSelector(
  [selectActiveWorkflow],
  (activeWorkflow) => activeWorkflow?.nodes || []
);

export const selectActiveWorkflowConnections = createSelector(
  [selectActiveWorkflow],
  (activeWorkflow) => activeWorkflow?.connections || []
);

export const selectNodeById = createSelector(
  [selectActiveWorkflowNodes, (_, nodeId: string) => nodeId],
  (nodes, nodeId) => nodes.find(node => node.id === nodeId)
);

export const selectFilteredWorkflows = createSelector(
  [selectWorkflows, selectWorkflowsFilters],
  (workflows, filters) => {
    let filtered = workflows;

    if (filters.category) {
      // Filter by category if needed (could be based on tags or other criteria)
      filtered = filtered.filter(workflow => 
        workflow.tags?.includes(filters.category!)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(workflow => {
        if (filters.status === 'active') return workflow.isActive;
        if (filters.status === 'inactive') return !workflow.isActive;
        return true;
      });
    }

    if (filters.workspaceId) {
      filtered = filtered.filter(workflow => 
        workflow.workspaceId === filters.workspaceId
      );
    }

    return filtered;
  }
);

export const selectTemplatesByCategory = createSelector(
  [selectTemplates],
  (templates) => {
    const categorized: Record<string, typeof templates> = {};
    
    templates.forEach(template => {
      if (!categorized[template.category]) {
        categorized[template.category] = [];
      }
      categorized[template.category].push(template);
    });

    return categorized;
  }
);

export const selectRecentExecutions = createSelector(
  [selectExecutions],
  (executions) => executions.slice(0, 10) // Last 10 executions
);

export const selectExecutionsByWorkflow = createSelector(
  [selectExecutions, (_, workflowId: string) => workflowId],
  (executions, workflowId) => 
    executions.filter(execution => execution.workflowId === workflowId)
);

export const selectWorkflowStats = createSelector(
  [selectWorkflows, selectExecutions],
  (workflows, executions) => {
    const totalWorkflows = workflows.length;
    const activeWorkflows = workflows.filter(w => w.isActive).length;
    const totalExecutions = executions.length;
    const successfulExecutions = executions.filter(e => e.status === 'completed').length;
    const failedExecutions = executions.filter(e => e.status === 'failed').length;
    const runningExecutions = executions.filter(e => e.status === 'running').length;

    return {
      totalWorkflows,
      activeWorkflows,
      inactiveWorkflows: totalWorkflows - activeWorkflows,
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      runningExecutions,
      successRate: totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0,
    };
  }
);

export const selectIsN8nConnected = createSelector(
  [selectN8nState],
  (n8nState) => n8nState.isConnected
);

export const selectN8nConnectionError = createSelector(
  [selectN8nState],
  (n8nState) => n8nState.error
);

export const selectCanExecuteWorkflow = createSelector(
  [selectActiveWorkflow, selectWorkflowsExecuting, selectIsN8nConnected],
  (activeWorkflow, isExecuting, isN8nConnected) => {
    return !!(
      activeWorkflow && 
      activeWorkflow.nodes.length > 0 && 
      !isExecuting &&
      isN8nConnected
    );
  }
);

export const selectWorkflowValidation = createSelector(
  [selectActiveWorkflow],
  (activeWorkflow) => {
    if (!activeWorkflow) {
      return { isValid: false, errors: ['No workflow selected'] };
    }

    const errors: string[] = [];

    if (activeWorkflow.nodes.length === 0) {
      errors.push('Workflow must have at least one node');
    }

    const triggerNodes = activeWorkflow.nodes.filter(node => node.type === 'trigger');
    if (triggerNodes.length === 0) {
      errors.push('Workflow must have at least one trigger node');
    }

    // Check for disconnected nodes
    const connectedNodeIds = new Set<string>();
    activeWorkflow.connections.forEach(conn => {
      connectedNodeIds.add(conn.sourceNodeId);
      connectedNodeIds.add(conn.targetNodeId);
    });

    const disconnectedNodes = activeWorkflow.nodes.filter(
      node => node.type !== 'trigger' && !connectedNodeIds.has(node.id)
    );

    if (disconnectedNodes.length > 0) {
      errors.push(`${disconnectedNodes.length} node(s) are not connected`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
);
