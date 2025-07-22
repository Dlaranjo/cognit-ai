import { useLocation } from 'react-router-dom';
import { Search, Database, Bot, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
  badge?: string;
  gradient?: boolean;
  path: string;
}

export const useNavigation = () => {
  const location = useLocation();

  const navigationItems: NavigationItem[] = [
    {
      id: 'studio',
      label: 'Cognit Studio',
      icon: Sparkles,
      description: 'Hub de IA',
      path: '/studio',
    },
    {
      id: 'workspaces',
      label: 'Knowledge Base',
      icon: Database,
      description: 'Base de dados',
      path: '/workspaces',
    },
    {
      id: 'search',
      label: 'Search Documents',
      icon: Search,
      description: 'Buscar arquivos',
      path: '/search',
    },
    {
      id: 'agents',
      label: 'AI Agents',
      icon: Bot,
      description: 'Assistentes IA',
      path: '/agents',
    },
  ];

  const isActive = (path: string): boolean => {
    if (path === '/studio') {
      return location.pathname === '/' || location.pathname === '/studio';
    }
    return location.pathname.startsWith(path);
  };

  const getCurrentView = (): string => {
    const currentPath = location.pathname;
    if (currentPath === '/' || currentPath.startsWith('/studio')) return 'studio';
    if (currentPath.startsWith('/workspaces')) return 'workspaces';
    if (currentPath.startsWith('/search')) return 'search';
    if (currentPath.startsWith('/agents')) return 'agents';
    return 'studio';
  };

  return {
    navigationItems,
    isActive,
    getCurrentView,
    currentPath: location.pathname,
  };
};
