// Global types and interfaces

// Re-export API types
export type { User, LoginCredentials, AuthResponse } from '../api/authApi';
export type { Message, Conversation, SendMessageRequest } from '../api/chatApi';
export type {
  Workspace,
  Project,
  Document,
  WorkspaceMember,
} from '../api/workspaceApi';
export type {
  Agent,
  AgentTask,
  AgentConversation,
  AgentMessage,
  AgentAction,
  AgentsState,
} from '../redux/agents/agentsTypes';

// UI Component Props
export interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'search';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
}

// Redux State Types
export interface RootState {
  auth: AuthState;
  chat: ChatState;
  conversations: ConversationsState;
  workspaces: WorkspacesState;
  ui: UIState;
  agents: AgentsState;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface ChatState {
  currentConversation: Conversation | null;
  messages: Message[];
  isTyping: boolean;
  selectedProvider: string;
  selectedModel: string;
  streamingMessage: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface ConversationsState {
  conversations: Conversation[];
  favoriteConversations: string[];
  searchQuery: string;
  isLoading: boolean;
  hasMore: boolean;
  filters: ConversationFilters;
}

export interface ConversationFilters {
  provider?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  hasFiles?: boolean;
}

export interface WorkspacesState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  projects: Project[];
  documents: Document[];
  members: WorkspaceMember[];
  permissions: WorkspacePermission[];
  isLoading: boolean;
  error: string | null;
}

export interface WorkspacePermission {
  workspaceId: string;
  userId: string;
  role: 'owner' | 'editor' | 'viewer';
  permissions: string[];
}

export interface UIState {
  modals: {
    [key: string]: {
      isOpen: boolean;
      data?: unknown;
    };
  };
  notifications: Notification[];
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  loading: {
    [key: string]: boolean;
  };
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  timestamp: string;
}

// Legacy types for compatibility - kept for backward compatibility
export interface LegacyAgent {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  color: string;
  capabilities: string[];
  examples: string[];
}

export interface LLMModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  contextWindow: number;
  pricing: {
    input: number;
    output: number;
  };
  capabilities: string[];
  color: string;
}
