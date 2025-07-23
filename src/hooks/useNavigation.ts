import { useLocation } from 'react-router-dom';
import { Bot, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
  fullDescription?: string;
  badge?: string;
  gradient?: boolean;
  path: string;
}

export const useNavigation = () => {
  const location = useLocation();

  const navigationItems: NavigationItem[] = [
    {
      id: 'studio',
      label: 'Studio',
      icon: Sparkles,
      description: 'Cognit Studio',
      fullDescription: 'Assistente de IA para o dia-a-dia',
      path: '/studio',
    },
    {
      id: 'agents',
      label: 'Workflows',
      icon: Bot,
      description: 'AI Workflows',
      fullDescription: 'Automações de processos com IA',
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
