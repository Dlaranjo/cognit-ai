import React, { useState } from 'react';
import { LoginScreen } from './components/Auth/LoginScreen';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { StudioInterface } from './components/Studio/StudioInterface';
import { WorkspaceList } from './components/Workspaces/WorkspaceList';
import { ProjectList } from './components/Projects/ProjectList';
import { DocumentList } from './components/Documents/DocumentList';
import { SearchInterface } from './components/Search/SearchInterface';
import { AgentInterface } from './components/Agents/AgentInterface';
import { useAuth } from './hooks/useAuth';
import { useWorkspaces } from './hooks/useWorkspaces';
import { AppState } from './types';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { user, hasPermission } = useAuth();
  const { 
    workspaces, 
    getUserPermission, 
    getProjectsByWorkspace,
    getDocumentsByProject,
    createWorkspace,
    createProject,
    updateWorkspaceMembers
  } = useWorkspaces(user.id);

  const [appState, setAppState] = useState<AppState>({
    currentUser: user,
    selectedWorkspace: null,
    selectedProject: null,
    view: 'studio'
  });

  const handleLogin = async (email: string, password: string) => {
    // Simulate login API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setIsAuthenticated(true);
        resolve();
      }, 1500);
    });
  };

  const handleViewChange = (view: 'studio' | 'workspaces' | 'projects' | 'documents' | 'search' | 'agents') => {
    setAppState(prev => ({
      ...prev,
      view,
      selectedWorkspace: view === 'workspaces' ? null : prev.selectedWorkspace,
      selectedProject: view === 'workspaces' || view === 'projects' ? null : prev.selectedProject
    }));
  };

  const handleWorkspaceSelect = (workspace: any) => {
    const userPermission = getUserPermission(workspace.id);
    
    // Viewers can only search, not access project management
    if (userPermission === 'VIEWER') {
      setAppState(prev => ({
        ...prev,
        selectedWorkspace: workspace,
        view: 'search'
      }));
    } else {
      setAppState(prev => ({
        ...prev,
        selectedWorkspace: workspace,
        view: 'projects'
      }));
    }
  };

  const handleProjectSelect = (project: any) => {
    setAppState(prev => ({
      ...prev,
      selectedProject: project,
      view: 'documents'
    }));
  };

  const renderContent = () => {
    switch (appState.view) {
      case 'studio':
        return <StudioInterface />;
        
      case 'workspaces':
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
      
      case 'projects':
        if (!appState.selectedWorkspace) return null;
        const userPermission = getUserPermission(appState.selectedWorkspace.id);
        return (
          <ProjectList
            workspace={appState.selectedWorkspace}
            projects={getProjectsByWorkspace(appState.selectedWorkspace.id)}
            canCreateProject={hasPermission('CREATE_PROJECT', userPermission)}
            onBack={() => handleViewChange('workspaces')}
            onProjectSelect={handleProjectSelect}
            onCreateProject={createProject}
          />
        );
      
      case 'documents':
        if (!appState.selectedProject || !appState.selectedWorkspace) return null;
        const workspacePermission = getUserPermission(appState.selectedWorkspace.id);
        return (
          <DocumentList
            project={appState.selectedProject}
            documents={getDocumentsByProject(appState.selectedProject.id)}
            canAddDocuments={hasPermission('ADD_DOCUMENT', workspacePermission)}
            onBack={() => handleViewChange('projects')}
          />
        );
      
      case 'search':
        return <SearchInterface />;
      
      case 'agents':
        return <AgentInterface />;
      
      default:
        return null;
    }
  };

  const getHeaderTitle = () => {
    switch (appState.view) {
      case 'studio': return 'Cognit Studio';
      case 'workspaces': return 'Knowledge Base';
      case 'projects': return 'Projects';
      case 'documents': return 'Documents';
      case 'search': return 'Search';
      case 'agents': return 'AI Agents';
      default: return 'COGNIT';
    }
  };

  const getHeaderSubtitle = () => {
    switch (appState.view) {
      case 'studio': return 'Converse com os melhores modelos de IA';
      case 'workspaces': return 'Manage your knowledge portfolios';
      case 'projects': return appState.selectedWorkspace?.name;
      case 'documents': return appState.selectedProject?.name;
      case 'search': return 'Search across your knowledge base';
      case 'agents': return 'AI-powered assistants for your tasks';
      default: return '';
    }
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar
        currentUser={user}
        currentView={appState.view}
        onViewChange={handleViewChange}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {appState.view !== 'studio' && (
          <Header
            title={getHeaderTitle()}
            subtitle={getHeaderSubtitle()}
          />
        )}
        
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;