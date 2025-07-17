import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Search, Database, Bot, Sparkles, Zap } from 'lucide-react';
import { User } from '../../types';

interface SidebarProps {
  currentUser: User;
  currentView?: string;
  onViewChange?: (view: 'studio' | 'workspaces' | 'projects' | 'documents' | 'search' | 'agents') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentUser }) => {
  const location = useLocation();
  
  const navigationItems = [
    { 
      id: 'studio', 
      label: 'Cognit Studio', 
      icon: Sparkles, 
      description: 'Agregador de LLMs',
      badge: 'Novo',
      gradient: true,
      path: '/studio'
    },
    { 
      id: 'workspaces', 
      label: 'Knowledge Base', 
      icon: Database, 
      description: 'Manage portfolios', 
      path: '/workspaces' 
    },
    { 
      id: 'search', 
      label: 'Search Documents', 
      icon: Search, 
      description: 'Search knowledge base', 
      path: '/search' 
    },
    { 
      id: 'agents', 
      label: 'AI Agents', 
      icon: Bot, 
      description: 'AI-powered assistants', 
      path: '/agents' 
    },
  ];

  const isActive = (path: string) => {
    if (path === '/studio') {
      return location.pathname === '/' || location.pathname === '/studio';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <svg width="32" height="19" viewBox="0 0 474 175" xmlns="http://www.w3.org/2000/svg">
              <g transform="translate(-131 -563)">
                <g>
                  <g>
                    <text fill="#FF4400" fontFamily="Sundry,Sundry_MSFontService,sans-serif" fontWeight="400" fontSize="96" transform="matrix(0.999702 0 0 0.994943 140.089 687)">Cognit</text>
                    <path d="M503.45 629.884 503.832 629.884 511.558 655.829 495.724 655.829ZM545.737 617.102 545.737 683.872 561 683.872 561 617.102ZM494.007 617.102 471.21 683.872 487.426 683.872 491.718 669.565 515.565 669.565 519.857 683.872 536.072 683.872 513.275 617.102ZM452.699 579.057 586.021 579.057 586.021 712.379 452.699 712.379Z" fill="#FF4400" fillRule="evenodd" transform="matrix(1.00478 0 0 1 -0.124693 3.84206)"/>
                  </g>
                </g>
              </g>
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">COGNIT</h1>
            <p className="text-sm text-gray-500">Knowledge Base</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive: navIsActive }) => `w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors relative ${
              navIsActive || isActive(item.path)
                ? item.gradient
                  ? 'bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 border border-orange-200'
                  : 'bg-orange-50 text-orange-700 border border-orange-200'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <item.icon className={`w-5 h-5 ${item.gradient && (isActive(item.path)) ? 'text-orange-600' : ''}`} />
            <div className="flex-1">
              <div className="font-medium flex items-center space-x-2">
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    item.gradient 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                      : 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500">{item.description}</div>
            </div>
            {item.gradient && (
              <Zap className={`w-4 h-4 ${isActive(item.path) ? 'text-orange-500' : 'text-orange-400'}`} />
            )}
          </NavLink>
        ))}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <img
            src={currentUser.avatar || `https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1`}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{currentUser.name}</p>
            <p className="text-xs text-gray-500 truncate">{currentUser.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};