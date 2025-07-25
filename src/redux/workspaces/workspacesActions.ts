import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  workspaceApi,
  type Workspace,
  type Project,
  type Document,
  type WorkspaceMember,
} from '../../api/workspaceApi';

// Workspace actions
export const fetchWorkspaces = createAsyncThunk<
  Workspace[],
  void,
  { rejectValue: string }
>('workspaces/fetchWorkspaces', async (_, { rejectWithValue }) => {
  try {
    const workspaces = await workspaceApi.getWorkspaces();
    return workspaces;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch workspaces';
    return rejectWithValue(errorMessage);
  }
});

export const createWorkspace = createAsyncThunk<
  Workspace,
  Omit<Workspace, 'id' | 'createdAt' | 'updatedAt'>,
  { rejectValue: string }
>('workspaces/createWorkspace', async (workspaceData, { rejectWithValue }) => {
  try {
    const workspace = await workspaceApi.createWorkspace(workspaceData);
    return workspace;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to create workspace';
    return rejectWithValue(errorMessage);
  }
});

export const deleteWorkspace = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('workspaces/deleteWorkspace', async (workspaceId, { rejectWithValue }) => {
  try {
    await workspaceApi.deleteWorkspace(workspaceId);
    return workspaceId;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to delete workspace';
    return rejectWithValue(errorMessage);
  }
});

// Project actions
export const fetchProjects = createAsyncThunk<
  Project[],
  string,
  { rejectValue: string }
>('workspaces/fetchProjects', async (workspaceId, { rejectWithValue }) => {
  try {
    const projects = await workspaceApi.getProjects(workspaceId);
    return projects;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch projects';
    return rejectWithValue(errorMessage);
  }
});

export const createProject = createAsyncThunk<
  Project,
  {
    workspaceId: string;
    projectData: Omit<
      Project,
      'id' | 'workspaceId' | 'createdAt' | 'updatedAt'
    >;
  },
  { rejectValue: string }
>(
  'workspaces/createProject',
  async ({ workspaceId, projectData }, { rejectWithValue }) => {
    try {
      const project = await workspaceApi.createProject(
        workspaceId,
        projectData
      );
      return project;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to create project';
      return rejectWithValue(errorMessage);
    }
  }
);

// Document actions
export const fetchDocuments = createAsyncThunk<
  Document[],
  string,
  { rejectValue: string }
>('workspaces/fetchDocuments', async (projectId, { rejectWithValue }) => {
  try {
    const documents = await workspaceApi.getDocuments(projectId);
    return documents;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch documents';
    return rejectWithValue(errorMessage);
  }
});

export const uploadDocument = createAsyncThunk<
  Document,
  { projectId: string; file: File },
  { rejectValue: string }
>(
  'workspaces/uploadDocument',
  async ({ projectId, file }, { rejectWithValue }) => {
    try {
      const document = await workspaceApi.uploadDocument(projectId, file);
      return document;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to upload document';
      return rejectWithValue(errorMessage);
    }
  }
);

// Member actions
export const fetchWorkspaceMembers = createAsyncThunk<
  WorkspaceMember[],
  string,
  { rejectValue: string }
>('workspaces/fetchMembers', async (workspaceId, { rejectWithValue }) => {
  try {
    const members = await workspaceApi.getWorkspaceMembers(workspaceId);
    return members;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch members';
    return rejectWithValue(errorMessage);
  }
});

export const updateWorkspaceMembers = createAsyncThunk<
  WorkspaceMember[],
  { workspaceId: string; members: WorkspaceMember[] },
  { rejectValue: string }
>(
  'workspaces/updateMembers',
  async ({ workspaceId, members }, { rejectWithValue }) => {
    try {
      const updatedMembers: WorkspaceMember[] = [];

      for (const member of members) {
        if (member.id) {
          const updatedMember = await workspaceApi.updateMember(
            workspaceId,
            member.id,
            {
              role: member.role,
              permissions: member.permissions,
            }
          );
          updatedMembers.push(updatedMember);
        }
      }

      return updatedMembers;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update members';
      return rejectWithValue(errorMessage);
    }
  }
);
