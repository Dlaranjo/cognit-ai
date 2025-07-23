// Global types and interfaces

// Re-export API types
export type { User, LoginCredentials, AuthResponse } from '../api/authApi';
export type { Message, Conversation, SendMessageRequest } from '../api/chatApi';
export type {
  Agent,
  AgentTask,
  AgentConversation,
  AgentMessage,
  AgentAction,
  AgentsState,
} from '../redux/agents/agentsTypes';

// Workspace Types
export type WorkspaceRole = 'owner' | 'editor' | 'viewer';
export type DocumentStatus = 'processing' | 'ready' | 'error' | 'archived';
export type ProjectStatus = 'active' | 'archived' | 'completed';

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  settings: WorkspaceSettings;
  stats: WorkspaceStats;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
  memberCount: number;
  projectCount: number;
  documentCount: number;
  subscription?: WorkspaceSubscription;
}

export interface WorkspaceSettings {
  isPublic: boolean;
  allowInvites: boolean;
  defaultRole: WorkspaceRole;
  documentRetentionDays?: number;
  allowedDomains: string[];
  features: WorkspaceFeatures;
}

export interface WorkspaceFeatures {
  aiAnalysis: boolean;
  documentVersioning: boolean;
  advancedSearch: boolean;
  bulkOperations: boolean;
  apiAccess: boolean;
  ssoIntegration: boolean;
}

export interface WorkspaceStats {
  totalDocuments: number;
  totalSize: number;
  totalMembers: number;
  totalProjects: number;
  documentsThisMonth: number;
  storageUsed: number;
  storageLimit: number;
}

export interface WorkspaceSubscription {
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired';
  validUntil: string;
  features: string[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;
  status: ProjectStatus;
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  documentCount: number;
  collaborators: ProjectCollaborator[];
  settings: ProjectSettings;
}

export interface ProjectSettings {
  isPublic: boolean;
  allowComments: boolean;
  autoArchive: boolean;
  notificationSettings: {
    onNewDocument: boolean;
    onDocumentUpdate: boolean;
    onComments: boolean;
  };
}

export interface ProjectCollaborator {
  userId: string;
  role: 'owner' | 'editor' | 'viewer';
  addedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export interface Document {
  id: string;
  name: string;
  originalName: string;
  type: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  projectId: string;
  uploadedBy: string;
  status: DocumentStatus;
  version: number;
  versions: DocumentVersion[];
  tags: string[];
  metadata: DocumentMetadata;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  lastAccessedAt?: string;
  accessCount: number;
}

export interface DocumentVersion {
  id: string;
  version: number;
  url: string;
  size: number;
  uploadedBy: string;
  createdAt: string;
  changes?: string;
}

export interface DocumentMetadata {
  extractedText?: string;
  pageCount?: number;
  language?: string;
  keywords: string[];
  aiSummary?: string;
  processingTime?: number;
  ocrConfidence?: number;
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  workspaceId: string;
  role: WorkspaceRole;
  permissions: WorkspacePermissions;
  invitedBy?: string;
  joinedAt: string;
  lastActiveAt?: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    isActive: boolean;
  };
}

export interface WorkspacePermissions {
  canCreateProjects: boolean;
  canInviteMembers: boolean;
  canManageSettings: boolean;
  canDeleteDocuments: boolean;
  canViewAnalytics: boolean;
  canExportData: boolean;
}

// Request/Response Types
export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
  settings?: Partial<WorkspaceSettings>;
}

export interface UpdateWorkspaceRequest {
  name?: string;
  description?: string;
  settings?: Partial<WorkspaceSettings>;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  tags?: string[];
  settings?: Partial<ProjectSettings>;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  tags?: string[];
  settings?: Partial<ProjectSettings>;
}

export interface InviteMemberRequest {
  email: string;
  role: WorkspaceRole;
  message?: string;
}

export interface UpdateMemberRequest {
  role?: WorkspaceRole;
  permissions?: Partial<WorkspacePermissions>;
}

export interface BulkDocumentRequest {
  documentIds: string[];
  action: 'delete' | 'archive' | 'move' | 'tag';
  targetProjectId?: string;
  tags?: string[];
}

export interface SearchRequest {
  query: string;
  type?: 'documents' | 'projects' | 'all';
  filters?: SearchFilters;
  limit?: number;
  offset?: number;
}

export interface SearchFilters {
  projectIds?: string[];
  documentTypes?: string[];
  dateRange?: {
    from: string;
    to: string;
  };
  tags?: string[];
  status?: DocumentStatus[];
  uploadedBy?: string[];
}

export interface SearchResult {
  documents: Document[];
  projects: Project[];
  total: number;
  hasMore: boolean;
  searchTime: number;
}

// Analytics Types
export interface WorkspaceAnalytics {
  overview: AnalyticsOverview;
  usage: UsageAnalytics;
  members: MemberAnalytics;
  documents: DocumentAnalytics;
  timeline: TimelineAnalytics[];
}

export interface AnalyticsOverview {
  totalDocuments: number;
  totalSize: number;
  totalMembers: number;
  activeMembers: number;
  documentsThisWeek: number;
  growthRate: number;
}

export interface UsageAnalytics {
  storageUsed: number;
  storageLimit: number;
  documentsByType: Record<string, number>;
  uploadTrends: Array<{ date: string; count: number; size: number }>;
  mostActiveProjects: Array<{ projectId: string; name: string; activity: number }>;
}

export interface MemberAnalytics {
  byRole: Record<WorkspaceRole, number>;
  activeUsers: Array<{
    userId: string;
    name: string;
    documentsUploaded: number;
    lastActive: string;
  }>;
  invitationStats: {
    sent: number;
    accepted: number;
    pending: number;
  };
}

export interface DocumentAnalytics {
  byStatus: Record<DocumentStatus, number>;
  byType: Record<string, number>;
  averageSize: number;
  totalDownloads: number;
  mostAccessed: Array<{
    documentId: string;
    name: string;
    accessCount: number;
  }>;
}

export interface TimelineAnalytics {
  date: string;
  documentsUploaded: number;
  membersJoined: number;
  projectsCreated: number;
  storageUsed: number;
}

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
  priceCategory: 'low' | 'medium' | 'high';
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
}
