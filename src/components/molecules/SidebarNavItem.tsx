import React from 'react';
import { NavLink } from 'react-router-dom';
import { Zap } from 'lucide-react';
import type { NavigationItem } from '../../hooks/useNavigation';

interface SidebarNavItemProps {
  item: NavigationItem;
  isExpanded: boolean;
  isActive: (path: string) => boolean;
  className?: string;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  item,
  isExpanded,
  isActive,
  className = '',
}) => {
  return (
    <NavLink
      to={item.path}
      className={({ isActive: navIsActive }) =>
        `w-full flex items-center ${isExpanded ? 'space-x-3 px-3' : 'justify-center px-2'} py-2.5 rounded-lg text-left transition-all duration-300 relative group/item ${
          navIsActive || isActive(item.path)
            ? item.gradient
              ? 'bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 border border-orange-200'
              : 'bg-orange-50 text-orange-700 border border-orange-200'
            : 'text-gray-700 hover:bg-gray-100'
        } ${className}`
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
  );
};
