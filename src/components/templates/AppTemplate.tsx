import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../organisms/Sidebar';
import { Header } from '../organisms/Header';
import { useAuth } from '../../hooks/useAuth';

export const AppTemplate: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getViewFromPath = (pathname: string) => {
    if (pathname.startsWith('/studio')) return 'studio';
    if (pathname.startsWith('/agents')) return 'agents';
    return 'studio';
  };

  const getHeaderTitle = (pathname: string) => {
    if (pathname.startsWith('/studio')) return 'Studio';
    if (pathname.startsWith('/agents')) return 'Workflows';
    return 'COGNIT';
  };

  const getHeaderSubtitle = (pathname: string) => {
    if (pathname.startsWith('/studio'))
      return 'Converse com os melhores modelos de IA';
    if (pathname.startsWith('/agents'))
      return 'AI-powered assistants for your tasks';
    return '';
  };

  const currentView = getViewFromPath(location.pathname);
  const showHeader = currentView !== 'studio';

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen flex bg-white">
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

        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
