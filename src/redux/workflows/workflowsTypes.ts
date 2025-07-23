// Node-specific property types for better type safety
export interface TriggerNodeProperties {
  emailAddress?: string;
  webhookUrl?: string;
  schedule?: string;
  conditions?: string[];
}

export interface ActionNodeProperties {
  taskTitle?: string;
  projectId?: string;
  emailRecipients?: string[];
  webhookUrl?: string;
  template?: string;
}

export interface ConditionNodeProperties {
  condition: string;
  operator?: 'and' | 'or';
  rules?: Array<{
    field: string;
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
    value: string;
  }>;
}

export interface DataNodeProperties {
  dataSource?: string;
  query?: string;
  transformations?: string[];
}

export type NodeProperties =
  | TriggerNodeProperties
  | ActionNodeProperties
  | ConditionNodeProperties
  | DataNodeProperties;

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'data';
  title: string;
  description: string;
  icon: 'Mail' | 'Zap' | 'FileText' | 'MessageSquare' | 'Bot' | 'MoreHorizontal'; // Specific icon names
  color: string;
  position: { x: number; y: number };
  connected: boolean;
  properties?: NodeProperties;
  enabled?: boolean;
}

export interface WorkflowConnection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourcePort?: string;
  targetPort?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  workspaceId?: string;
  tags?: string[];
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: Omit<WorkflowNode, 'id'>[];
  connections: Omit<WorkflowConnection, 'id' | 'sourceNodeId' | 'targetNodeId'>[];
  preview?: string;
}

export interface N8nState {
  isConnected: boolean;
  connectionUrl?: string;
  lastSync?: string;
  error?: string;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: string;
  completedAt?: string;
  error?: string;
  logs: WorkflowExecutionLog[];
}

export interface WorkflowExecutionLog {
  id: string;
  nodeId: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  data?: Record<string, string | number | boolean | null>;
}

export interface WorkflowsState {
  workflows: Workflow[];
  activeWorkflow: Workflow | null;
  selectedNode: WorkflowNode | null;
  templates: WorkflowTemplate[];
  executions: WorkflowExecution[];
  n8nState: N8nState;
  isLoading: boolean;
  isExecuting: boolean;
  error: string | null;
  filters: {
    category?: string;
    status?: string;
    workspaceId?: string;
  };
}

// Action Types
export const WORKFLOWS_ACTION_TYPES = {
  // Workflows
  FETCH_WORKFLOWS: 'workflows/fetchWorkflows',
  CREATE_WORKFLOW: 'workflows/createWorkflow',
  UPDATE_WORKFLOW: 'workflows/updateWorkflow',
  DELETE_WORKFLOW: 'workflows/deleteWorkflow',
  DUPLICATE_WORKFLOW: 'workflows/duplicateWorkflow',
  
  // Workflow State
  SET_ACTIVE_WORKFLOW: 'workflows/setActiveWorkflow',
  SET_SELECTED_NODE: 'workflows/setSelectedNode',
  
  // Nodes
  ADD_NODE: 'workflows/addNode',
  UPDATE_NODE: 'workflows/updateNode',
  DELETE_NODE: 'workflows/deleteNode',
  MOVE_NODE: 'workflows/moveNode',
  
  // Connections
  ADD_CONNECTION: 'workflows/addConnection',
  DELETE_CONNECTION: 'workflows/deleteConnection',
  
  // Templates
  FETCH_TEMPLATES: 'workflows/fetchTemplates',
  CREATE_FROM_TEMPLATE: 'workflows/createFromTemplate',
  
  // Execution
  EXECUTE_WORKFLOW: 'workflows/executeWorkflow',
  STOP_WORKFLOW: 'workflows/stopWorkflow',
  FETCH_EXECUTIONS: 'workflows/fetchExecutions',
  
  // N8n Integration
  CONNECT_N8N: 'workflows/connectN8n',
  DISCONNECT_N8N: 'workflows/disconnectN8n',
  SYNC_WITH_N8N: 'workflows/syncWithN8n',
  
  // UI
  SET_FILTERS: 'workflows/setFilters',
  CLEAR_ERROR: 'workflows/clearError',
  RESET_STATE: 'workflows/resetState',
} as const;

export type WorkflowsActionType = 
  (typeof WORKFLOWS_ACTION_TYPES)[keyof typeof WORKFLOWS_ACTION_TYPES];
