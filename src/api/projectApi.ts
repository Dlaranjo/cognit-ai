import { apiClient } from './axiosConfig';
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectCollaborator,
  WorkspaceRole,
} from '../types';

export const projectApi = {
  // Project CRUD
  getProjects: async (
    workspaceId: string,
    options?: { limit?: number; offset?: number; status?: string }
  ): Promise<{ projects: Project[]; total: number; hasMore: boolean }> => {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());
    if (options?.status) params.append('status', options.status);

    const response = await apiClient.get(`/workspaces/${workspaceId}/projects?${params}`);
    return response.data;
  },

  getProject: async (workspaceId: string, projectId: string): Promise<Project> => {
    const response = await apiClient.get(`/workspaces/${workspaceId}/projects/${projectId}`);
    return response.data;
  },

  createProject: async (workspaceId: string, request: CreateProjectRequest): Promise<Project> => {
    const response = await apiClient.post(`/workspaces/${workspaceId}/projects`, request);
    return response.data;
  },

  updateProject: async (
    workspaceId: string,
    projectId: string,
    request: UpdateProjectRequest
  ): Promise<Project> => {
    const response = await apiClient.put(`/workspaces/${workspaceId}/projects/${projectId}`, request);
    return response.data;
  },

  deleteProject: async (workspaceId: string, projectId: string): Promise<void> => {
    await apiClient.delete(`/workspaces/${workspaceId}/projects/${projectId}`);
  },

  archiveProject: async (workspaceId: string, projectId: string): Promise<Project> => {
    const response = await apiClient.post(`/workspaces/${workspaceId}/projects/${projectId}/archive`);
    return response.data;
  },

  duplicateProject: async (workspaceId: string, projectId: string): Promise<Project> => {
    const response = await apiClient.post(`/workspaces/${workspaceId}/projects/${projectId}/duplicate`);
    return response.data;
  },

  // Project Collaboration
  getProjectCollaborators: async (
    workspaceId: string,
    projectId: string
  ): Promise<ProjectCollaborator[]> => {
    const response = await apiClient.get(`/workspaces/${workspaceId}/projects/${projectId}/collaborators`);
    return response.data;
  },

  addProjectCollaborator: async (
    workspaceId: string,
    projectId: string,
    userId: string,
    role: WorkspaceRole
  ): Promise<ProjectCollaborator> => {
    const response = await apiClient.post(`/workspaces/${workspaceId}/projects/${projectId}/collaborators`, {
      userId,
      role,
    });
    return response.data;
  },

  updateProjectCollaborator: async (
    workspaceId: string,
    projectId: string,
    userId: string,
    role: WorkspaceRole
  ): Promise<ProjectCollaborator> => {
    const response = await apiClient.put(
      `/workspaces/${workspaceId}/projects/${projectId}/collaborators/${userId}`,
      { role }
    );
    return response.data;
  },

  removeProjectCollaborator: async (
    workspaceId: string,
    projectId: string,
    userId: string
  ): Promise<void> => {
    await apiClient.delete(`/workspaces/${workspaceId}/projects/${projectId}/collaborators/${userId}`);
  },
};