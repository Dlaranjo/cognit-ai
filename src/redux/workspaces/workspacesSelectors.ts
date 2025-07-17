import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../types';

// Base selectors
export const selectWorkspacesState = (state: RootState) => state.workspaces;

// Memoized selectors
export const selectWorkspaces = createSelector(
  [selectWorkspacesState],
  (workspaces) => workspaces.workspaces
);

export const selectCurrentWorkspace = createSelector(
  [selectWorkspacesState],
  (workspaces) => workspaces.currentWorkspace
);

export const selectProjects = createSelector(
  [selectWorkspacesState],
  (workspaces) => workspaces.projects
);

export const selectDocuments = createSelector(
  [selectWorkspacesState],
  (workspaces) => workspaces.documents
);

export const selectWorkspaceMembers = createSelector(
  [selectWorkspacesState],
  (workspaces) => workspaces.members
);

export const selectWorkspacesLoading = createSelector(
  [selectWorkspacesState],
  (workspaces) => workspaces.isLoading
);

export const selectWorkspacesError = createSelector(
  [selectWorkspacesState],
  (workspaces) => workspaces.error
);

// Complex selectors
export const selectWorkspaceById = createSelector(
  [selectWorkspaces, (state: RootState, workspaceId: string) => workspaceId],
  (workspaces, workspaceId) => workspaces.find(w => w.id === workspaceId)
);

export const selectProjectById = createSelector(
  [selectProjects, (state: RootState, projectId: string) => projectId],
  (projects, projectId) => projects.find(p => p.id === projectId)
);

export const selectDocumentById = createSelector(
  [selectDocuments, (state: RootState, documentId: string) => documentId],
  (documents, documentId) => documents.find(d => d.id === documentId)
);

export const selectProjectsByWorkspace = createSelector(
  [selectProjects, selectCurrentWorkspace],
  (projects, currentWorkspace) => 
    currentWorkspace ? projects.filter(p => p.workspaceId === currentWorkspace.id) : []
);

export const selectDocumentsByProject = createSelector(
  [selectDocuments, (state: RootState, projectId: string) => projectId],
  (documents, projectId) => documents.filter(d => d.projectId === projectId)
);

export const selectWorkspacePermissions = createSelector(
  [selectWorkspaceMembers, (state: RootState, userId: string) => userId],
  (members, userId) => {
    const member = members.find(m => m.userId === userId);
    return member?.role || 'viewer';
  }
);

export const selectCanEditWorkspace = createSelector(
  [selectWorkspacePermissions],
  (role) => role === 'owner' || role === 'editor'
);

export const selectCanManageWorkspace = createSelector(
  [selectWorkspacePermissions],
  (role) => role === 'owner'
);
