import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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
} from './workspacesActions';
import type { WorkspacesState } from './workspacesTypes';
import type { Workspace } from '../../api/workspaceApi';

const initialState: WorkspacesState = {
  workspaces: [],
  currentWorkspace: null,
  projects: [],
  documents: [],
  members: [],
  permissions: [],
  isLoading: false,
  error: null,
};

const workspacesSlice = createSlice({
  name: 'workspaces',
  initialState,
  reducers: {
    setCurrentWorkspace: (state, action: PayloadAction<Workspace | null>) => {
      state.currentWorkspace = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearDocuments: (state) => {
      state.documents = [];
    },
    clearProjects: (state) => {
      state.projects = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch Workspaces
    builder
      .addCase(fetchWorkspaces.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workspaces = action.payload;
      })
      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch workspaces';
      });

    // Create Workspace
    builder
      .addCase(createWorkspace.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workspaces.push(action.payload);
      })
      .addCase(createWorkspace.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create workspace';
      });

    // Delete Workspace
    builder
      .addCase(deleteWorkspace.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteWorkspace.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workspaces = state.workspaces.filter(
          (w) => w.id !== action.payload
        );
        if (state.currentWorkspace?.id === action.payload) {
          state.currentWorkspace = null;
        }
      })
      .addCase(deleteWorkspace.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete workspace';
      });

    // Fetch Projects
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch projects';
      });

    // Create Project
    builder
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create project';
      });

    // Fetch Documents
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch documents';
      });

    // Upload Document
    builder
      .addCase(uploadDocument.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents.push(action.payload);
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to upload document';
      });

    // Fetch Members
    builder
      .addCase(fetchWorkspaceMembers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWorkspaceMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.members = action.payload;
      })
      .addCase(fetchWorkspaceMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch members';
      });

    // Update Members
    builder
      .addCase(updateWorkspaceMembers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateWorkspaceMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update members array with new data
        action.payload.forEach((updatedMember) => {
          const index = state.members.findIndex(
            (member) => member.id === updatedMember.id
          );
          if (index !== -1) {
            state.members[index] = updatedMember;
          }
        });
      })
      .addCase(updateWorkspaceMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update members';
      });
  },
});

export const {
  setCurrentWorkspace,
  clearError,
  clearDocuments,
  clearProjects,
} = workspacesSlice.actions;

export const workspacesReducer = workspacesSlice.reducer;
