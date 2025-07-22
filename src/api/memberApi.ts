import { apiClient } from './axiosConfig';
import type {
  WorkspaceMember,
  InviteMemberRequest,
  UpdateMemberRequest,
  WorkspaceRole,
} from '../types';

export const memberApi = {
  // Member Management
  getWorkspaceMembers: async (workspaceId: string): Promise<WorkspaceMember[]> => {
    const response = await apiClient.get(`/workspaces/${workspaceId}/members`);
    return response.data;
  },

  inviteMember: async (
    workspaceId: string,
    request: InviteMemberRequest
  ): Promise<WorkspaceMember> => {
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

  resendInvitation: async (workspaceId: string, memberId: string): Promise<void> => {
    await apiClient.post(`/workspaces/${workspaceId}/members/${memberId}/resend-invitation`);
  },

  cancelInvitation: async (workspaceId: string, memberId: string): Promise<void> => {
    await apiClient.delete(`/workspaces/${workspaceId}/members/${memberId}/invitation`);
  },

  // Member Permissions
  updateMemberRole: async (
    workspaceId: string,
    memberId: string,
    role: WorkspaceRole
  ): Promise<WorkspaceMember> => {
    const response = await apiClient.put(`/workspaces/${workspaceId}/members/${memberId}/role`, {
      role,
    });
    return response.data;
  },

  getMemberPermissions: async (workspaceId: string, memberId: string): Promise<string[]> => {
    const response = await apiClient.get(`/workspaces/${workspaceId}/members/${memberId}/permissions`);
    return response.data;
  },

  // Member Activity
  getMemberActivity: async (
    workspaceId: string,
    memberId: string,
    options?: { limit?: number; dateRange?: { from: string; to: string } }
  ): Promise<{
    activities: Array<{
      id: string;
      type: string;
      description: string;
      timestamp: string;
      metadata?: Record<string, unknown>;
    }>;
    total: number;
  }> => {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.dateRange) {
      params.append('from', options.dateRange.from);
      params.append('to', options.dateRange.to);
    }

    const response = await apiClient.get(
      `/workspaces/${workspaceId}/members/${memberId}/activity?${params}`
    );
    return response.data;
  },

  // Bulk Member Operations
  bulkInviteMembers: async (
    workspaceId: string,
    invitations: Array<{ email: string; role: WorkspaceRole; message?: string }>
  ): Promise<{
    successful: WorkspaceMember[];
    failed: Array<{ email: string; error: string }>;
  }> => {
    const response = await apiClient.post(`/workspaces/${workspaceId}/members/bulk-invite`, {
      invitations,
    });
    return response.data;
  },

  bulkUpdateMemberRoles: async (
    workspaceId: string,
    updates: Array<{ memberId: string; role: WorkspaceRole }>
  ): Promise<{
    successful: WorkspaceMember[];
    failed: Array<{ memberId: string; error: string }>;
  }> => {
    const response = await apiClient.put(`/workspaces/${workspaceId}/members/bulk-update`, {
      updates,
    });
    return response.data;
  },
};