import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Search, Database, Bot, Sparkles, Zap } from 'lucide-react';
import { User } from '../../types';

interface SidebarProps {
  currentUser: User;
  currentView?: string;
  onViewChange?: (
    view:
      | 'studio'
      | 'workspaces'
      | 'projects'
      | 'documents'
      | 'search'
      | 'agents'
  ) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentUser }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      id: 'studio',
      label: 'Cognit Studio',
      icon: Sparkles,
      description: 'Agregador de LLMs',
      badge: 'Novo',
      gradient: true,
      path: '/studio',
    },
    {
      id: 'workspaces',
      label: 'Knowledge Base',
      icon: Database,
      description: 'Manage portfolios',
      path: '/workspaces',
    },
    {
      id: 'search',
      label: 'Search Documents',
      icon: Search,
      description: 'Search knowledge base',
      path: '/search',
    },
    {
      id: 'agents',
      label: 'AI Agents',
      icon: Bot,
      description: 'AI-powered assistants',
      path: '/agents',
    },
  ];

  const isActive = (path: string) => {
    if (path === '/studio') {
      return location.pathname === '/' || location.pathname === '/studio';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div 
      className={`${isExpanded ? 'w-64' : 'w-16'} bg-gray-50 border-r border-gray-200 flex flex-col h-full transition-all duration-300 ease-in-out group`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Header */}
      <div className={`${isExpanded ? 'p-6' : 'p-4'} border-b border-gray-200 transition-all duration-300`}>
        <div className={`flex items-center ${isExpanded ? 'space-x-3' : 'justify-center'} transition-all duration-300`}>
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
          </div>
          {isExpanded && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
              <h1 className="text-lg font-semibold text-gray-900">COGNIT</h1>
              <p className="text-sm text-gray-500">Knowledge Base</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className={`flex-1 ${isExpanded ? 'p-4' : 'p-2'} space-y-2 transition-all duration-300`}>
        {navigationItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive: navIsActive }) =>
              `w-full flex items-center ${isExpanded ? 'space-x-3 px-3' : 'justify-center px-2'} py-2.5 rounded-lg text-left transition-all duration-300 relative group/item ${
                navIsActive || isActive(item.path)
                  ? item.gradient
                    ? 'bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 border border-orange-200'
                    : 'bg-orange-50 text-orange-700 border border-orange-200'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <item.icon
              className={`w-5 h-5 flex-shrink-0 ${item.gradient && isActive(item.path) ? 'text-orange-600' : ''}`}
            />
            
            {isExpanded && (
              <div className="flex-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                <div className="font-medium flex items-center space-x-2">
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        item.gradient
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                          : 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            )}
            
            {/* Tooltip for collapsed state */}
            {!isExpanded && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {item.label}
                {item.badge && <span className="ml-1 text-orange-300">({item.badge})</span>}
              </div>
            )}
            
            {item.gradient && (
              <Zap
                className={`w-4 h-4 flex-shrink-0 ${isActive(item.path) ? 'text-orange-500' : 'text-orange-400'} ${!isExpanded ? 'hidden' : ''}`}
              />
            )}
          </NavLink>
        ))}
      </div>

      {/* User Profile */}
      <div className={`${isExpanded ? 'p-4' : 'p-2'} border-t border-gray-200 transition-all duration-300`}>
        <div className={`flex items-center ${isExpanded ? 'space-x-3' : 'justify-center'} transition-all duration-300`}>
          <img
            src={
              currentUser.avatar ||
              `https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1`
            }
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
          {isExpanded && (
            <div className="flex-1 min-w-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{currentUser.role}</p>
            </div>
          )}
          
          {/* Expand indicator */}
          {!isExpanded && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              {currentUser.name} ({currentUser.role})
            </div>
          )}
        </div>
      </div>
    </div>
  );
};