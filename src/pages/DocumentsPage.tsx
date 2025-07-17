import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DocumentList } from '../components/Documents/DocumentList';
import { useAuth } from '../hooks/useAuth';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { Project } from '../types';

export const DocumentsPage: React.FC = () => {
  const { workspaceId, projectId } = useParams<{ workspaceId: string; projectId: string }>();
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const {
    workspaces,
    getUserPermission,
    getDocumentsByProject
  } = useWorkspaces(user?.id);

  const workspace = workspaces.find(w => w.id === workspaceId);
  const projects = workspace ? workspace.projects || [] : [];
  const project = projects.find((p: Project) => p.id === projectId);

  if (!workspace || !project) {
    return <div>Project not found</div>;
  }

  const workspacePermission = getUserPermission(workspace.id);
  const documents = getDocumentsByProject(project.id);

  const handleBack = () => {
    navigate(`/workspaces/${workspaceId}/projects`);
  };

  return (
    <DocumentList
      project={project}
      documents={documents}
      canAddDocuments={hasPermission('ADD_DOCUMENT', workspacePermission)}
      onBack={handleBack}
    />
  );
};