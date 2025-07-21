import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import {
  fetchWorkspaces,
  createWorkspace,
  deleteWorkspace,
  fetchProjects,
  createProject,
  fetchDocuments,
  uploadDocument,
  fetchWorkspaceMembers,
  updateWorkspaceMembers,
} from '../redux/workspaces/workspacesActions';
import {
  setCurrentWorkspace,
  clearError,
  clearDocuments,
  clearProjects,
} from '../redux/workspaces/workspacesReducer';
import {
  selectWorkspaces,
  selectCurrentWorkspace,
  selectProjects,
  selectDocuments,
  selectWorkspaceMembers,
  selectWorkspacesLoading,
  selectWorkspacesError,
  selectWorkspaceById,
  selectProjectById,
  selectProjectsByWorkspace,
  selectDocumentsByProject,
  selectWorkspacePermissions,
  selectCanEditWorkspace,
  selectCanManageWorkspace,
} from '../redux/workspaces/workspacesSelectors';
import type { Workspace, Project, WorkspaceMember } from '../api/workspaceApi';
import type { RootState } from '../types';

export const useWorkspaces = (userId?: string) => {
  const dispatch = useAppDispatch();

  // Selectors
  const workspaces = useAppSelector(selectWorkspaces);
  const currentWorkspace = useAppSelector(selectCurrentWorkspace);
  const projects = useAppSelector(selectProjects);
  const documents = useAppSelector(selectDocuments);
  const members = useAppSelector(selectWorkspaceMembers);
  const isLoading = useAppSelector(selectWorkspacesLoading);
  const error = useAppSelector(selectWorkspacesError);

  // Actions
  const loadWorkspaces = useCallback(() => {
    return dispatch(fetchWorkspaces());
  }, [dispatch]);

  const addWorkspace = useCallback(
    (workspaceData: Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>) => {
      return dispatch(createWorkspace(workspaceData));
    },
    [dispatch]
  );

  const removeWorkspace = useCallback(
    (workspaceId: string) => {
      return dispatch(deleteWorkspace(workspaceId));
    },
    [dispatch]
  );

  const setWorkspace = useCallback(
    (workspace: Workspace | null) => {
      dispatch(setCurrentWorkspace(workspace));
    },
    [dispatch]
  );

  const loadProjects = useCallback(
    (workspaceId: string) => {
      return dispatch(fetchProjects(workspaceId));
    },
    [dispatch]
  );

  const addProject = useCallback(
    (
      workspaceId: string,
      projectData: Omit<
        Project,
        'id' | 'workspaceId' | 'createdAt' | 'updatedAt'
      >
    ) => {
      return dispatch(createProject({ workspaceId, projectData }));
    },
    [dispatch]
  );

  const loadDocuments = useCallback(
    (projectId: string) => {
      return dispatch(fetchDocuments(projectId));
    },
    [dispatch]
  );

  const addDocument = useCallback(
    (projectId: string, file: File) => {
      return dispatch(uploadDocument({ projectId, file }));
    },
    [dispatch]
  );

  const loadMembers = useCallback(
    (workspaceId: string) => {
      return dispatch(fetchWorkspaceMembers(workspaceId));
    },
    [dispatch]
  );

  const updateMembers = useCallback(
    (workspaceId: string, members: WorkspaceMember[]) => {
      return dispatch(updateWorkspaceMembers({ workspaceId, members }));
    },
    [dispatch]
  );

  const clearWorkspacesError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const resetDocuments = useCallback(() => {
    dispatch(clearDocuments());
  }, [dispatch]);

  const resetProjects = useCallback(() => {
    dispatch(clearProjects());
  }, [dispatch]);

  // Selector functions with parameters - these return selector functions, not hook calls
  const getWorkspaceById = useCallback((workspaceId: string) => {
    return (state: RootState) => selectWorkspaceById(state, workspaceId);
  }, []);

  const getProjectById = useCallback((projectId: string) => {
    return (state: RootState) => selectProjectById(state, projectId);
  }, []);

  const getProjectsByWorkspace = useCallback(() => {
    return (state: RootState) => selectProjectsByWorkspace(state);
  }, []);

  const getDocumentsByProject = useCallback((projectId: string) => {
    return (state: RootState) => selectDocumentsByProject(state, projectId);
  }, []);

  const getUserPermission = useCallback(() => {
    if (!userId) return () => 'viewer';
    return (state: RootState) => selectWorkspacePermissions(state, userId);
  }, [userId]);

  const canEdit = useCallback(() => {
    return (state: RootState) => selectCanEditWorkspace(state);
  }, []);

  const canManage = useCallback(() => {
    return (state: RootState) => selectCanManageWorkspace(state);
  }, []);

  return {
    // State
    workspaces,
    currentWorkspace,
    projects,
    documents,
    members,
    isLoading,
    error,

    // Actions
    loadWorkspaces,
    createWorkspace: addWorkspace,
    removeWorkspace,
    setWorkspace,
    loadProjects,
    createProject: addProject,
    loadDocuments,
    addDocument,
    loadMembers,
    updateMembers,
    clearWorkspacesError,
    resetDocuments,
    resetProjects,

    // Selectors
    getWorkspaceById,
    getProjectById,
    getProjectsByWorkspace,
    getDocumentsByProject,
    getUserPermission,
    canEdit,
    canManage,
  };
};
