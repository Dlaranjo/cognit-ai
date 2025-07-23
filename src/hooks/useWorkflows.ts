import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import {
  fetchWorkflows,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  fetchTemplates,
  executeWorkflow,
  fetchExecutions,
} from '../redux/workflows/workflowsActions';
import {
  setActiveWorkflow,
  setSelectedNode,
  addNode,
  updateNode,
  deleteNode,
  moveNode,
  addConnection,
  deleteConnection,
  setN8nState,
  setFilters,
  clearError,
} from '../redux/workflows/workflowsReducer';
import {
  selectWorkflows,
  selectActiveWorkflow,
  selectSelectedNode,
  selectTemplates,
  selectExecutions,
  selectN8nState,
  selectWorkflowsLoading,
  selectWorkflowsExecuting,
  selectWorkflowsError,
  selectWorkflowsFilters,
  selectFilteredWorkflows,
  selectActiveWorkflowNodes,
  selectActiveWorkflowConnections,
  selectWorkflowStats,
  selectCanExecuteWorkflow,
  selectWorkflowValidation,
} from '../redux/workflows/workflowsSelectors';
import type { 
  Workflow, 
  WorkflowNode, 
  WorkflowConnection, 
  WorkflowTemplate,
  N8nState 
} from '../redux/workflows/workflowsTypes';

export const useWorkflows = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const workflows = useAppSelector(selectWorkflows);
  const activeWorkflow = useAppSelector(selectActiveWorkflow);
  const selectedNode = useAppSelector(selectSelectedNode);
  const templates = useAppSelector(selectTemplates);
  const executions = useAppSelector(selectExecutions);
  const n8nState = useAppSelector(selectN8nState);
  const isLoading = useAppSelector(selectWorkflowsLoading);
  const isExecuting = useAppSelector(selectWorkflowsExecuting);
  const error = useAppSelector(selectWorkflowsError);
  const filters = useAppSelector(selectWorkflowsFilters);
  const filteredWorkflows = useAppSelector(selectFilteredWorkflows);
  const activeWorkflowNodes = useAppSelector(selectActiveWorkflowNodes);
  const activeWorkflowConnections = useAppSelector(selectActiveWorkflowConnections);
  const workflowStats = useAppSelector(selectWorkflowStats);
  const canExecuteWorkflow = useAppSelector(selectCanExecuteWorkflow);
  const workflowValidation = useAppSelector(selectWorkflowValidation);

  // Actions
  const loadWorkflows = useCallback(() => {
    return dispatch(fetchWorkflows());
  }, [dispatch]);

  const createNewWorkflow = useCallback(
    (workflowData: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>) => {
      return dispatch(createWorkflow(workflowData));
    },
    [dispatch]
  );

  const updateExistingWorkflow = useCallback(
    (id: string, updates: Partial<Workflow>) => {
      return dispatch(updateWorkflow({ id, updates }));
    },
    [dispatch]
  );

  const removeWorkflow = useCallback(
    (id: string) => {
      return dispatch(deleteWorkflow(id));
    },
    [dispatch]
  );

  const loadTemplates = useCallback(() => {
    return dispatch(fetchTemplates());
  }, [dispatch]);

  const runWorkflow = useCallback(
    (workflowId: string) => {
      return dispatch(executeWorkflow(workflowId));
    },
    [dispatch]
  );

  const loadExecutions = useCallback(
    (workflowId: string) => {
      return dispatch(fetchExecutions(workflowId));
    },
    [dispatch]
  );

  // Workflow State Management
  const selectWorkflow = useCallback(
    (workflow: Workflow | null) => {
      dispatch(setActiveWorkflow(workflow));
    },
    [dispatch]
  );

  const selectNode = useCallback(
    (node: WorkflowNode | null) => {
      dispatch(setSelectedNode(node));
    },
    [dispatch]
  );

  // Node Management
  const createNode = useCallback(
    (node: WorkflowNode) => {
      dispatch(addNode(node));
    },
    [dispatch]
  );

  const modifyNode = useCallback(
    (nodeId: string, updates: Partial<WorkflowNode>) => {
      dispatch(updateNode({ nodeId, updates }));
    },
    [dispatch]
  );

  const removeNode = useCallback(
    (nodeId: string) => {
      dispatch(deleteNode(nodeId));
    },
    [dispatch]
  );

  const repositionNode = useCallback(
    (nodeId: string, position: { x: number; y: number }) => {
      dispatch(moveNode({ nodeId, position }));
    },
    [dispatch]
  );

  // Connection Management
  const createConnection = useCallback(
    (connection: WorkflowConnection) => {
      dispatch(addConnection(connection));
    },
    [dispatch]
  );

  const removeConnection = useCallback(
    (connectionId: string) => {
      dispatch(deleteConnection(connectionId));
    },
    [dispatch]
  );

  // N8n Integration
  const updateN8nState = useCallback(
    (updates: Partial<N8nState>) => {
      dispatch(setN8nState(updates));
    },
    [dispatch]
  );

  // Utility Functions
  const createWorkflowFromTemplate = useCallback(
    (template: WorkflowTemplate, name: string, description?: string) => {
      const newWorkflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'> = {
        name,
        description: description || template.description,
        nodes: template.nodes.map((node, index) => ({
          ...node,
          id: `node-${Date.now()}-${index}`,
        })),
        connections: template.connections.map((conn, index) => ({
          ...conn,
          id: `connection-${Date.now()}-${index}`,
          sourceNodeId: `node-${Date.now()}-0`, // This would need proper mapping
          targetNodeId: `node-${Date.now()}-1`, // This would need proper mapping
        })),
        isActive: false,
        tags: [template.category],
      };

      return dispatch(createWorkflow(newWorkflow));
    },
    [dispatch]
  );

  const duplicateWorkflow = useCallback(
    (workflow: Workflow, newName?: string) => {
      const duplicatedWorkflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'> = {
        ...workflow,
        name: newName || `${workflow.name} (Copy)`,
        isActive: false,
        nodes: workflow.nodes.map(node => ({
          ...node,
          id: `${node.id}-copy-${Date.now()}`,
        })),
        connections: workflow.connections.map(conn => ({
          ...conn,
          id: `${conn.id}-copy-${Date.now()}`,
          sourceNodeId: `${conn.sourceNodeId}-copy-${Date.now()}`,
          targetNodeId: `${conn.targetNodeId}-copy-${Date.now()}`,
        })),
      };

      return dispatch(createWorkflow(duplicatedWorkflow));
    },
    [dispatch]
  );

  // Filters and UI
  const updateFilters = useCallback(
    (newFilters: Partial<typeof filters>) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  const clearWorkflowError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    workflows,
    activeWorkflow,
    selectedNode,
    templates,
    executions,
    n8nState,
    isLoading,
    isExecuting,
    error,
    filters,
    filteredWorkflows,
    activeWorkflowNodes,
    activeWorkflowConnections,
    workflowStats,
    canExecuteWorkflow,
    workflowValidation,

    // Actions
    loadWorkflows,
    createNewWorkflow,
    updateExistingWorkflow,
    removeWorkflow,
    loadTemplates,
    runWorkflow,
    loadExecutions,

    // Workflow State
    selectWorkflow,
    selectNode,

    // Node Management
    createNode,
    modifyNode,
    removeNode,
    repositionNode,

    // Connection Management
    createConnection,
    removeConnection,

    // N8n Integration
    updateN8nState,

    // Utilities
    createWorkflowFromTemplate,
    duplicateWorkflow,
    updateFilters,
    clearWorkflowError,
  };
};
