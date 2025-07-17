import { apiClient, uploadFile } from './axiosConfig';

// Enums para roles e permissions
export type WorkspaceRole = 'owner' | 'editor' | 'viewer';
export type DocumentStatus = 'processing' | 'ready' | 'error' | 'archived';
export type ProjectStatus = 'active' | 'archived' | 'completed';

// Interfaces principais
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

// Interfaces para requests
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

// Interfaces para analytics
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

// API Methods
export const workspaceApi = {
  // Workspace CRUD
  getWorkspaces: async (): Promise<Workspace[]> => {
    const response = await apiClient.get('/workspaces');
    return response.data;
  },

  getWorkspace: async (id: string): Promise<Workspace> => {
    const response = await apiClient.get(`/workspaces/${id}`);
    return response.data;
  },

  createWorkspace: async (request: CreateWorkspaceRequest): Promise<Workspace> => {
    const response = await apiClient.post('/workspaces', request);
    return response.data;
  },

  updateWorkspace: async (id: string, request: UpdateWorkspaceRequest): Promise<Workspace> => {
    const response = await apiClient.put(`/workspaces/${id}`, request);
    return response.data;
  },

  deleteWorkspace: async (id: string): Promise<void> => {
    await apiClient.delete(`/workspaces/${id}`);
  },

  archiveWorkspace: async (id: string): Promise<Workspace> => {
    const response = await apiClient.post(`/workspaces/${id}/archive`);
    return response.data;
  },

  restoreWorkspace: async (id: string): Promise<Workspace> => {
    const response = await apiClient.post(`/workspaces/${id}/restore`);
    return response.data;
  },

  // Member Management
  getWorkspaceMembers: async (workspaceId: string): Promise<WorkspaceMember[]> => {
    const response = await apiClient.get(`/workspaces/${workspaceId}/members`);
    return response.data;
  },

  inviteMember: async (workspaceId: string, request: InviteMemberRequest): Promise<WorkspaceMember> => {
    const response = await apiClient.post(`/workspaces/${workspaceId}/members/invite`, request);
    return response.data;
  },

  updateMember: async (
    workspaceId: string, 
    memberId: string, 
    request: UpdateMemberRequest
  ): Promise<WorkspaceMember> => {
    const response = await apiClient.put(`/workspaces/${workspaceId}/members/${memberId}`, request);
    return response.data;
  },

  removeMember: async (workspaceId: string, memberId: string): Promise<void> => {
    await apiClient.delete(`/workspaces/${workspaceId}/members/${memberId}`);
  },

  resendInvitation: async (workspaceId: string, email: string): Promise<{ message: string }> => {
    const response = await apiClient.post(`/workspaces/${workspaceId}/members/resend-invite`, { email });
    return response.data;
  },

  cancelInvitation: async (workspaceId: string, invitationId: string): Promise<void> => {
    await apiClient.delete(`/workspaces/${workspaceId}/invitations/${invitationId}`);
  },

  // Projects
  getProjects: async (
    workspaceId: string, 
    status?: ProjectStatus,
    limit?: number,
    offset?: number
  ): Promise<{ projects: Project[]; total: number; hasMore: boolean }> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());

    const response = await apiClient.get(`/workspaces/${workspaceId}/projects?${params}`);
    return response.data;
  },

  getProject: async (projectId: string): Promise<Project> => {
    const response = await apiClient.get(`/projects/${projectId}`);
    return response.data;
  },

  createProject: async (workspaceId: string, request: CreateProjectRequest): Promise<Project> => {
    const response = await apiClient.post(`/workspaces/${workspaceId}/projects`, request);
    return response.data;
  },

  updateProject: async (projectId: string, request: UpdateProjectRequest): Promise<Project> => {
    const response = await apiClient.put(`/projects/${projectId}`, request);
    return response.data;
  },

  deleteProject: async (projectId: string): Promise<void> => {
    await apiClient.delete(`/projects/${projectId}`);
  },

  archiveProject: async (projectId: string): Promise<Project> => {
    const response = await apiClient.post(`/projects/${projectId}/archive`);
    return response.data;
  },

  duplicateProject: async (projectId: string, name: string): Promise<Project> => {
    const response = await apiClient.post(`/projects/${projectId}/duplicate`, { name });
    return response.data;
  },

  // Documents
  getDocuments: async (
    projectId: string,
    status?: DocumentStatus,
    limit?: number,
    offset?: number
  ): Promise<{ documents: Document[]; total: number; hasMore: boolean }> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());

    const response = await apiClient.get(`/projects/${projectId}/documents?${params}`);
    return response.data;
  },

  getDocument: async (documentId: string): Promise<Document> => {
    const response = await apiClient.get(`/documents/${documentId}`);
    return response.data;
  },

  uploadDocument: async (
    projectId: string, 
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<Document> => {
    const response = await uploadFile(`/projects/${projectId}/documents`, file, onProgress);
    return response.data;
  },

  uploadMultipleDocuments: async (
    projectId: string,
    files: File[],
    onProgress?: (fileIndex: number, progress: number) => void
  ): Promise<Document[]> => {
    const uploads = files.map(async (file, index) => {
      return uploadFile(`/projects/${projectId}/documents`, file, (progress) => {
        onProgress?.(index, progress);
      });
    });

    const responses = await Promise.all(uploads);
    return responses.map(response => response.data);
  },

  updateDocument: async (documentId: string, data: {
    name?: string;
    tags?: string[];
  }): Promise<Document> => {
    const response = await apiClient.put(`/documents/${documentId}`, data);
    return response.data;
  },

  deleteDocument: async (documentId: string): Promise<void> => {
    await apiClient.delete(`/documents/${documentId}`);
  },

  archiveDocument: async (documentId: string): Promise<Document> => {
    const response = await apiClient.post(`/documents/${documentId}/archive`);
    return response.data;
  },

  moveDocument: async (documentId: string, targetProjectId: string): Promise<Document> => {
    const response = await apiClient.post(`/documents/${documentId}/move`, { targetProjectId });
    return response.data;
  },

  downloadDocument: async (documentId: string): Promise<Blob> => {
    const response = await apiClient.get(`/documents/${documentId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Document Versions
  getDocumentVersions: async (documentId: string): Promise<DocumentVersion[]> => {
    const response = await apiClient.get(`/documents/${documentId}/versions`);
    return response.data;
  },

  uploadDocumentVersion: async (
    documentId: string,
    file: File,
    changes?: string,
    onProgress?: (progress: number) => void
  ): Promise<DocumentVersion> => {
    const formData = new FormData();
    formData.append('file', file);
    if (changes) formData.append('changes', changes);

    const response = await uploadFile(`/documents/${documentId}/versions`, file, onProgress);
    return response.data;
  },

  // Bulk Operations
  bulkDocumentOperation: async (request: BulkDocumentRequest): Promise<{ 
    success: number; 
    failed: number; 
    errors: Array<{ documentId: string; error: string }> 
  }> => {
    const response = await apiClient.post('/documents/bulk', request);
    return response.data;
  },

  // Search
  search: async (workspaceId: string, request: SearchRequest): Promise<SearchResult> => {
    const response = await apiClient.post(`/workspaces/${workspaceId}/search`, request);
    return response.data;
  },

  searchDocuments: async (workspaceId: string, query: string, filters?: SearchFilters): Promise<Document[]> => {
    const response = await apiClient.post(`/workspaces/${workspaceId}/search/documents`, {
      query,
      filters
    });
    return response.data;
  },

  // Analytics
  getAnalytics: async (
    workspaceId: string,
    period: 'week' | 'month' | 'quarter' | 'year' = 'month'
  ): Promise<WorkspaceAnalytics> => {
    const response = await apiClient.get(`/workspaces/${workspaceId}/analytics?period=${period}`);
    return response.data;
  },

  // Tags
  getTags: async (workspaceId: string, type: 'projects' | 'documents' = 'documents'): Promise<string[]> => {
    const response = await apiClient.get(`/workspaces/${workspaceId}/tags?type=${type}`);
    return response.data;
  },

  // Export/Import
  exportWorkspace: async (
    workspaceId: string,
    format: 'json' | 'csv' = 'json',
    includeDocuments: boolean = false
  ): Promise<Blob> => {
    const response = await apiClient.get(
      `/workspaces/${workspaceId}/export?format=${format}&includeDocuments=${includeDocuments}`,
      { responseType: 'blob' }
    );
    return response.data;
  },

  exportProject: async (
    projectId: string,
    format: 'json' | 'csv' | 'zip' = 'json'
  ): Promise<Blob> => {
    const response = await apiClient.get(
      `/projects/${projectId}/export?format=${format}`,
      { responseType: 'blob' }
    );
    return response.data;
  },

  // AI Analysis
  analyzeDocument: async (documentId: string): Promise<{
    summary: string;
    keywords: string[];
    sentiment?: 'positive' | 'negative' | 'neutral';
    entities?: Array<{ name: string; type: string; confidence: number }>;
  }> => {
    const response = await apiClient.post(`/documents/${documentId}/analyze`);
    return response.data;
  },

  generateDocumentSummary: async (documentId: string, length: 'short' | 'medium' | 'long' = 'medium'): Promise<{
    summary: string;
    keyPoints: string[];
  }> => {
    const response = await apiClient.post(`/documents/${documentId}/summarize`, { length });
    return response.data;
  },
};

// Utilitários
export const workspaceUtils = {
  // Verificar permissões
  hasPermission: (member: WorkspaceMember, permission: keyof WorkspacePermissions): boolean => {
    return member.permissions[permission] || member.role === 'owner';
  },

  // Calcular uso de storage
  formatFileSize: (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  },

  // Calcular percentual de uso
  getStorageUsagePercentage: (used: number, limit: number): number => {
    return Math.round((used / limit) * 100);
  },

  // Validar nome de workspace
  validateWorkspaceName: (name: string): { valid: boolean; error?: string } => {
    if (!name || name.trim().length === 0) {
      return { valid: false, error: 'Nome é obrigatório' };
    }
    if (name.length < 3) {
      return { valid: false, error: 'Nome deve ter pelo menos 3 caracteres' };
    }
    if (name.length > 50) {
      return { valid: false, error: 'Nome deve ter no máximo 50 caracteres' };
    }
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(name)) {
      return { valid: false, error: 'Nome contém caracteres inválidos' };
    }
    return { valid: true };
  },

  // Gerar cor para projeto/tag
  generateTagColor: (tag: string): string => {
    const colors = [
      '#FF6B35', '#48BB78', '#4299E1', '#9F7AEA', 
      '#ECC94B', '#F56565', '#38B2AC', '#ED8936'
    ];
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  },

  // Filtrar por permissão
  filterByRole: (members: WorkspaceMember[], role: WorkspaceRole): WorkspaceMember[] => {
    return members.filter(member => member.role === role);
  },

  // Verificar se documento é imagem
  isImageDocument: (document: Document): boolean => {
    return document.mimeType.startsWith('image/');
  },

  // Verificar se documento é PDF
  isPdfDocument: (document: Document): boolean => {
    return document.mimeType === 'application/pdf';
  },

  // Obter ícone por tipo de arquivo
  getFileIcon: (document: Document): string => {
    if (document.mimeType.startsWith('image/')) return '🖼️';
    if (document.mimeType === 'application/pdf') return '📄';
    if (document.mimeType.includes('word')) return '📝';
    if (document.mimeType.includes('excel')) return '📊';
    if (document.mimeType.includes('powerpoint')) return '📋';
    if (document.mimeType.startsWith('text/')) return '📃';
    return '📁';
  },
};

export default workspaceApi;
