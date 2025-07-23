import {
  selectWorkflows,
  selectActiveWorkflow,
  selectSelectedNode,
  selectWorkflowById,
  selectActiveWorkflowNodes,
  selectFilteredWorkflows,
  selectWorkflowStats,
  selectWorkflowValidation,
  selectCanExecuteWorkflow,
} from '../workflowsSelectors';
import type { RootState } from '../../../types';
import type { WorkflowsState } from '../workflowsTypes';

// Mock state factory
const createMockState = (workflowsState: Partial<WorkflowsState> = {}): RootState => ({
  auth: {
    user: null,
    token: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
  },
  chat: {
    currentConversation: null,
    messages: [],
    isTyping: false,
    selectedProvider: 'openai',
    selectedModel: 'gpt-4',
    isLoading: false,
    error: null,
  },
  conversations: {
    conversations: [],
    favorites: [],
    searchQuery: '',
    isLoading: false,
    error: null,
  },
  workspaces: {
    workspaces: [],
    currentWorkspace: null,
    projects: [],
    documents: [],
    members: [],
    permissions: [],
    isLoading: false,
    error: null,
  },
  ui: {
    modals: {},
    notifications: [],
    theme: 'light',
    sidebarCollapsed: false,
    loading: {},
  },
  agents: {
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
  },
  workflows: {
    workflows: [],
    activeWorkflow: null,
    selectedNode: null,
    templates: [],
    executions: [],
    n8nState: {
      isConnected: false,
    },
    isLoading: false,
    isExecuting: false,
    error: null,
    filters: {},
    ...workflowsState,
  },
});

describe('workflowsSelectors', () => {
  describe('selectWorkflows', () => {
    it('should return workflows array', () => {
      const mockWorkflows = [
        {
          id: 'workflow-1',
          name: 'Test Workflow',
          description: 'Description',
          nodes: [],
          connections: [],
          isActive: true,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
      ];

      const state = createMockState({ workflows: mockWorkflows });
      const result = selectWorkflows(state);

      expect(result).toEqual(mockWorkflows);
    });
  });

  describe('selectActiveWorkflow', () => {
    it('should return active workflow', () => {
      const mockWorkflow = {
        id: 'workflow-1',
        name: 'Active Workflow',
        description: 'Description',
        nodes: [],
        connections: [],
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      const state = createMockState({ activeWorkflow: mockWorkflow });
      const result = selectActiveWorkflow(state);

      expect(result).toEqual(mockWorkflow);
    });

    it('should return null when no active workflow', () => {
      const state = createMockState();
      const result = selectActiveWorkflow(state);

      expect(result).toBeNull();
    });
  });

  describe('selectSelectedNode', () => {
    it('should return selected node', () => {
      const mockNode = {
        id: 'node-1',
        type: 'trigger' as const,
        title: 'Test Node',
        description: 'Description',
        icon: 'Mail' as const,
        color: 'blue',
        position: { x: 0, y: 0 },
        connected: false,
      };

      const state = createMockState({ selectedNode: mockNode });
      const result = selectSelectedNode(state);

      expect(result).toEqual(mockNode);
    });
  });

  describe('selectWorkflowById', () => {
    it('should return workflow by id', () => {
      const mockWorkflows = [
        {
          id: 'workflow-1',
          name: 'Workflow 1',
          description: 'Description',
          nodes: [],
          connections: [],
          isActive: true,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
        {
          id: 'workflow-2',
          name: 'Workflow 2',
          description: 'Description',
          nodes: [],
          connections: [],
          isActive: false,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
      ];

      const state = createMockState({ workflows: mockWorkflows });
      const result = selectWorkflowById(state, 'workflow-2');

      expect(result).toEqual(mockWorkflows[1]);
    });

    it('should return undefined for non-existent id', () => {
      const state = createMockState({ workflows: [] });
      const result = selectWorkflowById(state, 'non-existent');

      expect(result).toBeUndefined();
    });
  });

  describe('selectActiveWorkflowNodes', () => {
    it('should return nodes from active workflow', () => {
      const mockNodes = [
        {
          id: 'node-1',
          type: 'trigger' as const,
          title: 'Test Node',
          description: 'Description',
          icon: 'Mail' as const,
          color: 'blue',
          position: { x: 0, y: 0 },
          connected: false,
        },
      ];

      const mockWorkflow = {
        id: 'workflow-1',
        name: 'Test Workflow',
        description: 'Description',
        nodes: mockNodes,
        connections: [],
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      const state = createMockState({ activeWorkflow: mockWorkflow });
      const result = selectActiveWorkflowNodes(state);

      expect(result).toEqual(mockNodes);
    });

    it('should return empty array when no active workflow', () => {
      const state = createMockState();
      const result = selectActiveWorkflowNodes(state);

      expect(result).toEqual([]);
    });
  });

  describe('selectFilteredWorkflows', () => {
    it('should filter workflows by status', () => {
      const mockWorkflows = [
        {
          id: 'workflow-1',
          name: 'Active Workflow',
          description: 'Description',
          nodes: [],
          connections: [],
          isActive: true,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
        {
          id: 'workflow-2',
          name: 'Inactive Workflow',
          description: 'Description',
          nodes: [],
          connections: [],
          isActive: false,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
      ];

      const state = createMockState({
        workflows: mockWorkflows,
        filters: { status: 'active' },
      });

      const result = selectFilteredWorkflows(state);

      expect(result).toHaveLength(1);
      expect(result[0].isActive).toBe(true);
    });
  });

  describe('selectWorkflowStats', () => {
    it('should calculate workflow statistics', () => {
      const mockWorkflows = [
        {
          id: 'workflow-1',
          name: 'Active Workflow',
          description: 'Description',
          nodes: [],
          connections: [],
          isActive: true,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
        {
          id: 'workflow-2',
          name: 'Inactive Workflow',
          description: 'Description',
          nodes: [],
          connections: [],
          isActive: false,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
      ];

      const mockExecutions = [
        {
          id: 'exec-1',
          workflowId: 'workflow-1',
          status: 'completed' as const,
          startedAt: '2023-01-01T00:00:00Z',
          logs: [],
        },
        {
          id: 'exec-2',
          workflowId: 'workflow-1',
          status: 'failed' as const,
          startedAt: '2023-01-01T00:00:00Z',
          logs: [],
        },
      ];

      const state = createMockState({
        workflows: mockWorkflows,
        executions: mockExecutions,
      });

      const result = selectWorkflowStats(state);

      expect(result.totalWorkflows).toBe(2);
      expect(result.activeWorkflows).toBe(1);
      expect(result.inactiveWorkflows).toBe(1);
      expect(result.totalExecutions).toBe(2);
      expect(result.successfulExecutions).toBe(1);
      expect(result.failedExecutions).toBe(1);
      expect(result.successRate).toBe(50);
    });
  });

  describe('selectWorkflowValidation', () => {
    it('should validate workflow with trigger node', () => {
      const mockWorkflow = {
        id: 'workflow-1',
        name: 'Valid Workflow',
        description: 'Description',
        nodes: [
          {
            id: 'node-1',
            type: 'trigger' as const,
            title: 'Email Trigger',
            description: 'Description',
            icon: 'Mail' as const,
            color: 'blue',
            position: { x: 0, y: 0 },
            connected: false,
          },
        ],
        connections: [],
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      const state = createMockState({ activeWorkflow: mockWorkflow });
      const result = selectWorkflowValidation(state);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should invalidate workflow without trigger node', () => {
      const mockWorkflow = {
        id: 'workflow-1',
        name: 'Invalid Workflow',
        description: 'Description',
        nodes: [
          {
            id: 'node-1',
            type: 'action' as const,
            title: 'Action Node',
            description: 'Description',
            icon: 'FileText' as const,
            color: 'blue',
            position: { x: 0, y: 0 },
            connected: false,
          },
        ],
        connections: [],
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      const state = createMockState({ activeWorkflow: mockWorkflow });
      const result = selectWorkflowValidation(state);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Workflow must have at least one trigger node');
    });
  });

  describe('selectCanExecuteWorkflow', () => {
    it('should return true when workflow can be executed', () => {
      const mockWorkflow = {
        id: 'workflow-1',
        name: 'Executable Workflow',
        description: 'Description',
        nodes: [
          {
            id: 'node-1',
            type: 'trigger' as const,
            title: 'Trigger',
            description: 'Description',
            icon: 'Mail' as const,
            color: 'blue',
            position: { x: 0, y: 0 },
            connected: false,
          },
        ],
        connections: [],
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      };

      const state = createMockState({
        activeWorkflow: mockWorkflow,
        isExecuting: false,
        n8nState: { isConnected: true },
      });

      const result = selectCanExecuteWorkflow(state);

      expect(result).toBe(true);
    });

    it('should return false when no active workflow', () => {
      const state = createMockState({
        isExecuting: false,
        n8nState: { isConnected: true },
      });

      const result = selectCanExecuteWorkflow(state);

      expect(result).toBe(false);
    });
  });
});
