import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchWorkflows,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  fetchTemplates,
  executeWorkflow,
  fetchExecutions,
} from './workflowsActions';
import type {
  WorkflowsState,
  Workflow,
  WorkflowNode,
  WorkflowConnection,
  N8nState
} from './workflowsTypes';

// Example workflow with nodes
const exampleWorkflow: Workflow = {
  id: 'example-workflow-1',
  name: 'Email to Task Workflow',
  description: 'Automatically processes incoming emails and creates tasks',
  nodes: [
    {
      id: 'trigger-1',
      type: 'trigger',
      title: 'Webhook Trigger',
      description: 'Recebe dados via HTTP',
      icon: 'MoreHorizontal', // Using available icon
      color: 'from-green-500 to-emerald-600',
      position: { x: 100, y: 200 },
      connected: true
    },
    {
      id: 'condition-1',
      type: 'condition',
      title: 'IF Condition',
      description: 'Verifica se email contém "urgente"',
      icon: 'Zap',
      color: 'from-yellow-500 to-orange-600',
      position: { x: 350, y: 200 },
      connected: true
    },
    {
      id: 'action-1',
      type: 'action',
      title: 'Send Email',
      description: 'Envia notificação por email',
      icon: 'Mail',
      color: 'from-blue-500 to-indigo-600',
      position: { x: 600, y: 150 },
      connected: true
    },
    {
      id: 'action-2',
      type: 'action',
      title: 'Create Task',
      description: 'Cria tarefa no projeto',
      icon: 'FileText',
      color: 'from-purple-500 to-pink-600',
      position: { x: 600, y: 250 },
      connected: false
    }
  ],
  connections: [
    {
      id: 'conn-1',
      sourceNodeId: 'trigger-1',
      targetNodeId: 'condition-1'
    },
    {
      id: 'conn-2',
      sourceNodeId: 'condition-1',
      targetNodeId: 'action-1'
    }
  ],
  isActive: false,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

const initialState: WorkflowsState = {
  workflows: [exampleWorkflow],
  activeWorkflow: exampleWorkflow,
  selectedNode: null,
  templates: [],
  executions: [],
  n8nState: {
    isConnected: false,
    connectionUrl: undefined,
    lastSync: undefined,
    error: undefined,
  },
  isLoading: false,
  isExecuting: false,
  error: null,
  filters: {},
};

const workflowsSlice = createSlice({
  name: 'workflows',
  initialState,
  reducers: {
    // Workflow State Management
    setActiveWorkflow: (state, action: PayloadAction<Workflow | null>) => {
      state.activeWorkflow = action.payload;
      state.selectedNode = null; // Clear selected node when switching workflows
    },

    setSelectedNode: (state, action: PayloadAction<WorkflowNode | null>) => {
      state.selectedNode = action.payload;
    },

    // Node Management
    addNode: (state, action: PayloadAction<WorkflowNode>) => {
      if (state.activeWorkflow) {
        state.activeWorkflow.nodes.push(action.payload);
        state.activeWorkflow.updatedAt = new Date().toISOString();
      }
    },

    updateNode: (state, action: PayloadAction<{ nodeId: string; updates: Partial<WorkflowNode> }>) => {
      if (state.activeWorkflow) {
        const nodeIndex = state.activeWorkflow.nodes.findIndex(node => node.id === action.payload.nodeId);
        if (nodeIndex >= 0) {
          state.activeWorkflow.nodes[nodeIndex] = {
            ...state.activeWorkflow.nodes[nodeIndex],
            ...action.payload.updates,
          };
          state.activeWorkflow.updatedAt = new Date().toISOString();
        }
      }
      
      // Update selected node if it's the one being updated
      if (state.selectedNode && state.selectedNode.id === action.payload.nodeId) {
        state.selectedNode = {
          ...state.selectedNode,
          ...action.payload.updates,
        };
      }
    },

    deleteNode: (state, action: PayloadAction<string>) => {
      if (state.activeWorkflow) {
        state.activeWorkflow.nodes = state.activeWorkflow.nodes.filter(
          node => node.id !== action.payload
        );
        // Remove connections involving this node
        state.activeWorkflow.connections = state.activeWorkflow.connections.filter(
          connection => 
            connection.sourceNodeId !== action.payload && 
            connection.targetNodeId !== action.payload
        );
        state.activeWorkflow.updatedAt = new Date().toISOString();
      }
      
      // Clear selected node if it was deleted
      if (state.selectedNode && state.selectedNode.id === action.payload) {
        state.selectedNode = null;
      }
    },

    moveNode: (state, action: PayloadAction<{ nodeId: string; position: { x: number; y: number } }>) => {
      if (state.activeWorkflow) {
        const nodeIndex = state.activeWorkflow.nodes.findIndex(node => node.id === action.payload.nodeId);
        if (nodeIndex >= 0) {
          state.activeWorkflow.nodes[nodeIndex].position = action.payload.position;
          state.activeWorkflow.updatedAt = new Date().toISOString();
        }
      }
    },

    // Connection Management
    addConnection: (state, action: PayloadAction<WorkflowConnection>) => {
      if (state.activeWorkflow) {
        state.activeWorkflow.connections.push(action.payload);
        state.activeWorkflow.updatedAt = new Date().toISOString();
      }
    },

    deleteConnection: (state, action: PayloadAction<string>) => {
      if (state.activeWorkflow) {
        state.activeWorkflow.connections = state.activeWorkflow.connections.filter(
          connection => connection.id !== action.payload
        );
        state.activeWorkflow.updatedAt = new Date().toISOString();
      }
    },

    // N8n Integration
    setN8nState: (state, action: PayloadAction<Partial<N8nState>>) => {
      state.n8nState = {
        ...state.n8nState,
        ...action.payload,
      };
    },

    // Filters and UI
    setFilters: (state, action: PayloadAction<Partial<WorkflowsState['filters']>>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },

    clearError: (state) => {
      state.error = null;
      state.n8nState.error = undefined;
    },

    resetState: () => initialState,
  },

  extraReducers: (builder) => {
    // Fetch Workflows
    builder.addCase(fetchWorkflows.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchWorkflows.fulfilled, (state, action) => {
      state.isLoading = false;
      state.workflows = action.payload;
    });
    builder.addCase(fetchWorkflows.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch workflows';
    });

    // Create Workflow
    builder.addCase(createWorkflow.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createWorkflow.fulfilled, (state, action) => {
      state.isLoading = false;
      state.workflows.push(action.payload);
      state.activeWorkflow = action.payload;
    });
    builder.addCase(createWorkflow.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to create workflow';
    });

    // Update Workflow
    builder.addCase(updateWorkflow.fulfilled, (state, action) => {
      const index = state.workflows.findIndex(w => w.id === action.payload.id);
      if (index >= 0) {
        state.workflows[index] = action.payload;
      }
      if (state.activeWorkflow && state.activeWorkflow.id === action.payload.id) {
        state.activeWorkflow = action.payload;
      }
    });

    // Delete Workflow
    builder.addCase(deleteWorkflow.fulfilled, (state, action) => {
      state.workflows = state.workflows.filter(w => w.id !== action.payload);
      if (state.activeWorkflow && state.activeWorkflow.id === action.payload) {
        state.activeWorkflow = null;
        state.selectedNode = null;
      }
    });

    // Fetch Templates
    builder.addCase(fetchTemplates.fulfilled, (state, action) => {
      state.templates = action.payload;
    });

    // Execute Workflow
    builder.addCase(executeWorkflow.pending, (state) => {
      state.isExecuting = true;
      state.error = null;
    });
    builder.addCase(executeWorkflow.fulfilled, (state, action) => {
      state.isExecuting = false;
      state.executions.unshift(action.payload);
    });
    builder.addCase(executeWorkflow.rejected, (state, action) => {
      state.isExecuting = false;
      state.error = action.payload || 'Failed to execute workflow';
    });

    // Fetch Executions
    builder.addCase(fetchExecutions.fulfilled, (state, action) => {
      state.executions = action.payload;
    });
  },
});

export const {
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
  resetState,
} = workflowsSlice.actions;

export default workflowsSlice.reducer;
