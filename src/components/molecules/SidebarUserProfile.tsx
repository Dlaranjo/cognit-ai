import React from 'react';
import { Avatar } from '../atoms/Avatar';
import type { User } from '../../types';

interface SidebarUserProfileProps {
  user: User;
  isExpanded: boolean;
  className?: string;
}

export const SidebarUserProfile: React.FC<SidebarUserProfileProps> = ({
  user,
  isExpanded,
  className = '',
}) => {
  return (
    <div className={`${isExpanded ? 'p-4' : 'p-2'} border-t border-gray-200 transition-all duration-300 ${className}`}>
      <div className={`flex items-center ${isExpanded ? 'space-x-3' : 'justify-center'} transition-all duration-300`}>
        <Avatar
          src={user.avatar}
          name={user.name}
          size="sm"
          className="flex-shrink-0"
        />
        {isExpanded && (
          <div className="flex-1 min-w-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.role}</p>
          </div>
        )}
        
        {/* Tooltip for collapsed state */}
        {!isExpanded && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            {user.name} ({user.role})
          </div>
        )}
      </div>
    </div>
  );
};
