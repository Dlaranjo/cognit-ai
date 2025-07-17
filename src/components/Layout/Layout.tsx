import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '../../hooks/useAuth';

export const Layout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getViewFromPath = (pathname: string) => {
    if (pathname.startsWith('/studio')) return 'studio';
    if (pathname.startsWith('/workspaces')) return 'workspaces';
    if (pathname.startsWith('/search')) return 'search';
    if (pathname.startsWith('/agents')) return 'agents';
    return 'studio';
  };

  const getHeaderTitle = (pathname: string) => {
    if (pathname.startsWith('/studio')) return 'Cognit Studio';
    if (pathname === '/workspaces') return 'Knowledge Base';
    if (pathname.includes('/projects') && !pathname.includes('/documents')) return 'Projects';
    if (pathname.includes('/documents')) return 'Documents';
    if (pathname.startsWith('/search')) return 'Search';
    if (pathname.startsWith('/agents')) return 'AI Agents';
    return 'COGNIT';
  };

  const getHeaderSubtitle = (pathname: string) => {
    if (pathname.startsWith('/studio')) return 'Converse com os melhores modelos de IA';
    if (pathname === '/workspaces') return 'Manage your knowledge portfolios';
    if (pathname.startsWith('/search')) return 'Search across your knowledge base';
    if (pathname.startsWith('/agents')) return 'AI-powered assistants for your tasks';
    return '';
  };

  const currentView = getViewFromPath(location.pathname);
  const showHeader = currentView !== 'studio';

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar
        currentUser={user}
        currentView={currentView}
        onViewChange={() => {}} // Will be handled by router navigation
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {showHeader && (
          <Header
            title={getHeaderTitle(location.pathname)}
            subtitle={getHeaderSubtitle(location.pathname)}
          />
        )}
        
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};