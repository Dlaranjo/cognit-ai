import { apiClient } from './axiosConfig';
import type {
  Workspace,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  WorkspaceAnalytics,
} from '../types';

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

  // Analytics
  getAnalytics: async (
    workspaceId: string,
    period?: 'week' | 'month' | 'quarter' | 'year'
  ): Promise<WorkspaceAnalytics> => {
    const params = period ? `?period=${period}` : '';
    const response = await apiClient.get(`/workspaces/${workspaceId}/analytics${params}`);
    return response.data;
  },

  // Tags
  getTags: async (workspaceId: string): Promise<string[]> => {
    const response = await apiClient.get(`/workspaces/${workspaceId}/tags`);
    return response.data;
  },

  // Export/Import
  exportWorkspace: async (
    workspaceId: string,
    format: 'json' | 'csv'
  ): Promise<{ downloadUrl: string; expiresAt: string }> => {
    const response = await apiClient.post(`/workspaces/${workspaceId}/export`, { format });
    return response.data;
  },

  // Search across workspace
  search: async (
    workspaceId: string,
    query: string,
    options?: {
      type?: 'documents' | 'projects' | 'all';
      limit?: number;
      offset?: number;
    }
  ): Promise<{
    documents: unknown[];
    projects: unknown[];
    total: number;
    hasMore: boolean;
    searchTime: number;
  }> => {
    const params = new URLSearchParams({ query });
    if (options?.type) params.append('type', options.type);
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());

    const response = await apiClient.get(`/workspaces/${workspaceId}/search?${params}`);
    return response.data;
  },

  // Workspace Settings
  updateSettings: async (
    workspaceId: string,
    settings: Partial<Workspace['settings']>
  ): Promise<Workspace> => {
    const response = await apiClient.put(`/workspaces/${workspaceId}/settings`, settings);
    return response.data;
  },

  // Workspace Usage
  getUsage: async (workspaceId: string): Promise<{
    storageUsed: number;
    storageLimit: number;
    documentCount: number;
    memberCount: number;
    projectCount: number;
  }> => {
    const response = await apiClient.get(`/workspaces/${workspaceId}/usage`);
    return response.data;
  },

  // Projects
  getProjects: async (
    workspaceId: string,
    status?: string,
    limit?: number,
    offset?: number
  ): Promise<{
    projects: Array<{
      id: string;
      name: string;
      workspaceId: string;
      status: string;
      documentCount: number;
      collaborators: string[];
    }>;
    total: number;
    hasMore: boolean;
  }> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (limit !== undefined) params.append('limit', limit.toString());
    if (offset !== undefined && offset > 0) params.append('offset', offset.toString());

    const queryString = params.toString();
    const url = `/workspaces/${workspaceId}/projects${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get(url);
    return response.data;
  },
};