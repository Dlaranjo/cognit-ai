import type { Workspace, Project, Document, WorkspaceMember } from '../../api/workspaceApi';

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
