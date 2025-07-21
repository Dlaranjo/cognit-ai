import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProjectList } from '../components/organisms/ProjectList';
import { useAuth } from '../hooks/useAuth';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { Project } from '../types';

export const ProjectsPage: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const {
    workspaces,
    getUserPermission,
    getProjectsByWorkspace,
    createProject,
  } = useWorkspaces(user?.id);

  const workspace = workspaces.find((w) => w.id === workspaceId);

  if (!workspace) {
    return <div>Workspace not found</div>;
  }

  const userPermission = getUserPermission(workspace.id);
  const projects = getProjectsByWorkspace(workspace.id);

  const handleProjectSelect = (project: Project) => {
    navigate(`/workspaces/${workspaceId}/projects/${project.id}/documents`);
  };

  const handleBack = () => {
    navigate('/workspaces');
  };

  return (
    <ProjectList
      workspace={workspace}
      projects={projects}
      canCreateProject={hasPermission('CREATE_PROJECT', userPermission)}
      onBack={handleBack}
      onProjectSelect={handleProjectSelect}
      onCreateProject={createProject}
    />
  );
};
