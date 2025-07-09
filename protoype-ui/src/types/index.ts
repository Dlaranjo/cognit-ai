export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'ADMIN' | 'USER';
}

export interface WorkspacePermission {
  userId: string;
  role: 'OWNER' | 'EDITOR' | 'VIEWER';
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  createdBy: string;
  permissions: WorkspacePermission[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;
  createdAt: string;
  createdBy: string;
  documentsCount: number;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  projectId: string;
  uploadedAt: string;
  uploadedBy: string;
  processed: boolean;
}

export interface AppState {
  currentUser: User;
  selectedWorkspace: Workspace | null;
  selectedProject: Project | null;
  view: 'studio' | 'workspaces' | 'projects' | 'documents' | 'search' | 'agents';
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  capabilities: string[];
  examples: string[];
}

export interface Message {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string;
  agentId?: string;
  attachments?: any[];
  actions?: ActionResult[];
}

export interface ActionResult {
  id: string;
  type: 'file' | 'analysis' | 'summary';
  title: string;
  description: string;
  downloadUrl?: string;
  previewUrl?: string;
  status: 'completed' | 'processing' | 'failed';
}

// Studio Types
export interface StudioMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  model?: string;
  tokens?: number;
  regenerating?: boolean;
}

export interface StudioConversation {
  id: string;
  title: string;
  model: string;
  messages: StudioMessage[];
  createdAt: string;
  updatedAt: string;
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