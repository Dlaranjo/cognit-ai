import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import type { NavigationItem } from '../../hooks/useNavigation';

interface SidebarNavItemProps {
  item: NavigationItem;
  isExpanded: boolean;
  isActive: (path: string) => boolean;
  className?: string;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = React.memo(({
  item,
  isExpanded,
  isActive,
  className = '',
}) => {
  const isItemActive = useMemo(() => isActive(item.path), [isActive, item.path]);
  return (
    <NavLink
      to={item.path}
      className={({ isActive: navIsActive }) =>
        `w-full flex items-center ${isExpanded ? 'space-x-3 px-3' : 'justify-center px-2'} py-2.5 rounded-lg text-left transition-colors duration-200 relative group/item h-10 ${
          navIsActive || isItemActive
            ? 'bg-orange-50 text-orange-700 border border-orange-200'
            : 'text-gray-700 hover:bg-gray-100'
        } ${className}`
      }
    >
      <item.icon className="w-5 h-5 flex-shrink-0" />

      {isExpanded && (
        <div className="flex-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-75 flex items-center h-5">
          <span className="font-medium truncate leading-none">{item.label}</span>
        </div>
      )}
      
      {/* Tooltip */}
      <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50
                      before:content-[''] before:absolute before:right-full before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-transparent before:border-r-gray-900
                      max-w-[calc(100vw-5rem)] overflow-hidden">
        <div className="font-medium">{item.description}</div>
        <div className="text-xs text-gray-300 mt-1">{item.fullDescription}</div>
      </div>
    </NavLink>
  );
});
