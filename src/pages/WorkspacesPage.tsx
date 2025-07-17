import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkspaceList } from '../components/Workspaces/WorkspaceList';
import { useAuth } from '../hooks/useAuth';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { Workspace } from '../types';

export const WorkspacesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const {
    workspaces,
    getUserPermission,
    createWorkspace,
    updateWorkspaceMembers
  } = useWorkspaces(user?.id);

  const handleWorkspaceSelect = (workspace: Workspace) => {
    const userPermission = getUserPermission(workspace.id);
    
    // Viewers can only search, not access project management
    if (userPermission === 'VIEWER') {
      navigate(`/search?workspace=${workspace.id}`);
    } else {
      navigate(`/workspaces/${workspace.id}/projects`);
    }
  };

  return (
    <WorkspaceList
      workspaces={workspaces}
      currentUser={user}
      canCreateWorkspace={hasPermission('CREATE_WORKSPACE')}
      getUserPermission={getUserPermission}
      onWorkspaceSelect={handleWorkspaceSelect}
      onCreateWorkspace={createWorkspace}
      onUpdateWorkspaceMembers={updateWorkspaceMembers}
    />
  );
};