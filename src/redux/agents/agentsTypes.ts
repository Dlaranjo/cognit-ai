export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  capabilities: string[];
  examples: string[];
  category: 'presentation' | 'analysis' | 'data' | 'code' | 'content';
  isActive: boolean;
  usage: {
    totalRequests: number;
    successRate: number;
    avgResponseTime: number;
  };
}

export interface AgentTask {
  id: string;
  agentId: string;
  workspaceId: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high';
  input: {
    prompt: string;
    documentIds?: string[];
    parameters?: Record<string, unknown>;
  };
  output?: {
    files: AgentOutputFile[];
    summary: string;
    insights?: string[];
  };
  progress: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  error?: string;
}

export interface AgentOutputFile {
  id: string;
  name: string;
  type: 'presentation' | 'document' | 'spreadsheet' | 'analysis' | 'code';
  format: string;
  size: number;
  downloadUrl: string;
  previewUrl?: string;
  description: string;
}

export interface AgentConversation {
  id: string;
  agentId: string;
  workspaceId: string;
  title: string;
  messages: AgentMessage[];
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface AgentMessage {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string;
  agentId?: string;
  attachments?: string[];
  actions?: AgentAction[];
  metadata?: Record<string, unknown>;
}

export interface AgentAction {
  id: string;
  type: 'file_creation' | 'analysis' | 'data_processing' | 'code_generation';
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: AgentOutputFile;
  progress: number;
  startedAt: string;
  completedAt?: string;
  error?: string;
}

export interface AgentsState {
  agents: Agent[];
  selectedAgent: Agent | null;
  currentConversation: AgentConversation | null;
  conversations: AgentConversation[];
  tasks: AgentTask[];
  activeActions: AgentAction[];
  isLoading: boolean;
  isProcessing: boolean;
  error: string | null;
  filters: {
    category: string | null;
    status: string | null;
    workspaceId: string | null;
  };
  usage: {
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
    totalFileSize: number;
  };
}

// Action Types
export const AGENTS_ACTION_TYPES = {
  // Agent Management
  FETCH_AGENTS_START: 'agents/fetchAgentsStart',
  FETCH_AGENTS_SUCCESS: 'agents/fetchAgentsSuccess',
  FETCH_AGENTS_FAILURE: 'agents/fetchAgentsFailure',
  SELECT_AGENT: 'agents/selectAgent',

  // Conversations
  START_CONVERSATION: 'agents/startConversation',
  SEND_MESSAGE: 'agents/sendMessage',
  RECEIVE_MESSAGE: 'agents/receiveMessage',
  LOAD_CONVERSATION_HISTORY: 'agents/loadConversationHistory',

  // Tasks
  CREATE_TASK_START: 'agents/createTaskStart',
  CREATE_TASK_SUCCESS: 'agents/createTaskSuccess',
  CREATE_TASK_FAILURE: 'agents/createTaskFailure',
  UPDATE_TASK_PROGRESS: 'agents/updateTaskProgress',
  COMPLETE_TASK: 'agents/completeTask',

  // Actions
  START_ACTION: 'agents/startAction',
  UPDATE_ACTION_PROGRESS: 'agents/updateActionProgress',
  COMPLETE_ACTION: 'agents/completeAction',
  FAIL_ACTION: 'agents/failAction',

  // Filters & UI
  SET_FILTERS: 'agents/setFilters',
  CLEAR_ERROR: 'agents/clearError',
  RESET_STATE: 'agents/resetState',
} as const;

export type AgentsActionType =
  (typeof AGENTS_ACTION_TYPES)[keyof typeof AGENTS_ACTION_TYPES];
