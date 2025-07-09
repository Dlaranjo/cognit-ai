import { useState, useEffect } from 'react';
import { Workspace, Project, Document } from '../types';

// Mock data - in real app this would come from API
const mockWorkspaces: Workspace[] = [
  {
    id: '1',
    name: 'AI Research Hub',
    description: 'Central workspace for AI research documentation and resources',
    createdAt: '2024-01-15',
    createdBy: '1',
    permissions: [
      { userId: '1', role: 'OWNER' },
      { userId: '2', role: 'EDITOR' },
      { userId: '3', role: 'VIEWER' }
    ]
  },
  {
    id: '2',
    name: 'Product Documentation',
    description: 'Product specs, user guides, and technical documentation',
    createdAt: '2024-01-20',
    createdBy: '1',
    permissions: [
      { userId: '1', role: 'OWNER' },
      { userId: '4', role: 'EDITOR' }
    ]
  },
  {
    id: '3',
    name: 'Marketing Resources',
    description: 'Brand guidelines, marketing materials, and campaign data',
    createdAt: '2024-02-01',
    createdBy: '2',
    permissions: [
      { userId: '2', role: 'OWNER' },
      { userId: '1', role: 'EDITOR' }
    ]
  }
];

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Machine Learning Models',
    description: 'Documentation for ML models and algorithms',
    workspaceId: '1',
    createdAt: '2024-01-16',
    createdBy: '1',
    documentsCount: 24
  },
  {
    id: '2',
    name: 'Data Processing Pipeline',
    description: 'ETL processes and data transformation documentation',
    workspaceId: '1',
    createdAt: '2024-01-18',
    createdBy: '1',
    documentsCount: 12
  },
  {
    id: '3',
    name: 'API Documentation',
    description: 'REST API endpoints and integration guides',
    workspaceId: '2',
    createdAt: '2024-01-22',
    createdBy: '1',
    documentsCount: 8
  }
];

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Neural Networks Overview.pdf',
    type: 'PDF',
    size: 2485760,
    projectId: '1',
    uploadedAt: '2024-01-17',
    uploadedBy: '1',
    processed: true
  },
  {
    id: '2',
    name: 'Training Dataset Analysis.xlsx',
    type: 'Excel',
    size: 1024000,
    projectId: '1',
    uploadedAt: '2024-01-18',
    uploadedBy: '2',
    processed: true
  },
  {
    id: '3',
    name: 'Model Performance Metrics.docx',
    type: 'Word',
    size: 512000,
    projectId: '1',
    uploadedAt: '2024-01-19',
    uploadedBy: '1',
    processed: false
  }
];

export const useWorkspaces = (userId: string) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    // Filter workspaces based on user permissions
    const userWorkspaces = mockWorkspaces.filter(workspace =>
      workspace.permissions.some(permission => permission.userId === userId)
    );
    setWorkspaces(userWorkspaces);
    setProjects(mockProjects);
    setDocuments(mockDocuments);
  }, [userId]);

  const getUserPermission = (workspaceId: string): 'OWNER' | 'EDITOR' | 'VIEWER' | null => {
    const workspace = workspaces.find(w => w.id === workspaceId);
    const permission = workspace?.permissions.find(p => p.userId === userId);
    return permission?.role || null;
  };

  const getProjectsByWorkspace = (workspaceId: string) => {
    return projects.filter(project => project.workspaceId === workspaceId);
  };

  const getDocumentsByProject = (projectId: string) => {
    return documents.filter(document => document.projectId === projectId);
  };

  const createWorkspace = async (name: string, description?: string) => {
    const newWorkspace: Workspace = {
      id: Date.now().toString(),
      name,
      description,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: userId,
      permissions: [{ userId, role: 'OWNER' }]
    };
    setWorkspaces(prev => [...prev, newWorkspace]);
    return newWorkspace;
  };

  const createProject = async (workspaceId: string, name: string, description?: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      description,
      workspaceId,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: userId,
      documentsCount: 0
    };
    setProjects(prev => [...prev, newProject]);
    return newProject;
  };

  const updateWorkspaceMembers = async (workspaceId: string, members: any[]) => {
    // Convert members back to permissions format
    const permissions = members.map(member => ({
      userId: member.id,
      role: member.role
    }));

    setWorkspaces(prev => prev.map(workspace => 
      workspace.id === workspaceId 
        ? { ...workspace, permissions }
        : workspace
    ));
  };

  return {
    workspaces,
    projects,
    documents,
    getUserPermission,
    getProjectsByWorkspace,
    getDocumentsByProject,
    createWorkspace,
    createProject,
    updateWorkspaceMembers
  };
};