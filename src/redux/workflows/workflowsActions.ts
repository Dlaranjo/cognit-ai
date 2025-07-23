import { createAsyncThunk } from '@reduxjs/toolkit';
import { logger } from '../../shared/utils';
import type {
  Workflow,
  WorkflowTemplate,
  WorkflowExecution
} from './workflowsTypes';

// Mock API - Replace with real API when backend is ready
const mockWorkflowsApi = {
  getWorkflows: async (): Promise<Workflow[]> => {
    logger.mock('Fetching workflows from mock API');
    return [];
  },
  
  createWorkflow: async (workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>): Promise<Workflow> => {
    logger.mock('Creating workflow:', workflow);
    return {
      ...workflow,
      id: `workflow-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },
  
  updateWorkflow: async (id: string, updates: Partial<Workflow>): Promise<Workflow> => {
    logger.mock('Updating workflow:', { id, updates });
    return {
      id,
      name: 'Updated Workflow',
      description: 'Updated description',
      nodes: [],
      connections: [],
      isActive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...updates,
    };
  },
  
  deleteWorkflow: async (id: string): Promise<void> => {
    logger.mock('Deleting workflow:', id);
  },
  
  getTemplates: async (): Promise<WorkflowTemplate[]> => {
    logger.mock('Fetching workflow templates');
    return [
      {
        id: 'email-to-task',
        name: 'Email to Task',
        description: 'Convert emails to tasks automatically',
        category: 'productivity',
        nodes: [
          {
            type: 'trigger',
            title: 'Email Received',
            description: 'When an email is received',
            icon: 'Mail',
            color: 'from-blue-500 to-blue-600',
            position: { x: 200, y: 300 },
            connected: true,
          },
          {
            type: 'condition',
            title: 'Check Priority',
            description: 'If contains "urgent"',
            icon: 'Zap',
            color: 'from-yellow-500 to-orange-500',
            position: { x: 480, y: 300 },
            connected: true,
          },
          {
            type: 'action',
            title: 'Create Task',
            description: 'Create task in project',
            icon: 'FileText',
            color: 'from-green-500 to-green-600',
            position: { x: 760, y: 300 },
            connected: true,
          },
        ],
        connections: [],
      },
    ];
  },
  
  executeWorkflow: async (id: string): Promise<WorkflowExecution> => {
    logger.mock('Executing workflow:', id);
    return {
      id: `execution-${Date.now()}`,
      workflowId: id,
      status: 'running',
      startedAt: new Date().toISOString(),
      logs: [],
    };
  },
  
  getExecutions: async (workflowId: string): Promise<WorkflowExecution[]> => {
    logger.mock('Fetching executions for workflow:', workflowId);
    return [];
  },
};

// Async Actions
export const fetchWorkflows = createAsyncThunk<
  Workflow[],
  void,
  { rejectValue: string }
>('workflows/fetchWorkflows', async (_, { rejectWithValue }) => {
  try {
    return await mockWorkflowsApi.getWorkflows();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch workflows';
    logger.error('Error fetching workflows:', error);
    return rejectWithValue(errorMessage);
  }
});

export const createWorkflow = createAsyncThunk<
  Workflow,
  Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>,
  { rejectValue: string }
>('workflows/createWorkflow', async (workflowData, { rejectWithValue }) => {
  try {
    return await mockWorkflowsApi.createWorkflow(workflowData);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create workflow';
    logger.error('Error creating workflow:', error);
    return rejectWithValue(errorMessage);
  }
});

export const updateWorkflow = createAsyncThunk<
  Workflow,
  { id: string; updates: Partial<Workflow> },
  { rejectValue: string }
>('workflows/updateWorkflow', async ({ id, updates }, { rejectWithValue }) => {
  try {
    return await mockWorkflowsApi.updateWorkflow(id, updates);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update workflow';
    logger.error('Error updating workflow:', error);
    return rejectWithValue(errorMessage);
  }
});

export const deleteWorkflow = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('workflows/deleteWorkflow', async (id, { rejectWithValue }) => {
  try {
    await mockWorkflowsApi.deleteWorkflow(id);
    return id;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete workflow';
    logger.error('Error deleting workflow:', error);
    return rejectWithValue(errorMessage);
  }
});

export const fetchTemplates = createAsyncThunk<
  WorkflowTemplate[],
  void,
  { rejectValue: string }
>('workflows/fetchTemplates', async (_, { rejectWithValue }) => {
  try {
    return await mockWorkflowsApi.getTemplates();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch templates';
    logger.error('Error fetching templates:', error);
    return rejectWithValue(errorMessage);
  }
});

export const executeWorkflow = createAsyncThunk<
  WorkflowExecution,
  string,
  { rejectValue: string }
>('workflows/executeWorkflow', async (workflowId, { rejectWithValue }) => {
  try {
    return await mockWorkflowsApi.executeWorkflow(workflowId);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to execute workflow';
    logger.error('Error executing workflow:', error);
    return rejectWithValue(errorMessage);
  }
});

export const fetchExecutions = createAsyncThunk<
  WorkflowExecution[],
  string,
  { rejectValue: string }
>('workflows/fetchExecutions', async (workflowId, { rejectWithValue }) => {
  try {
    return await mockWorkflowsApi.getExecutions(workflowId);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch executions';
    logger.error('Error fetching executions:', error);
    return rejectWithValue(errorMessage);
  }
});
