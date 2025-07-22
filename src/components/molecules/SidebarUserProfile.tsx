import React, { useState } from 'react';
import { LogOut, Settings, ChevronUp } from 'lucide-react';
import { Avatar } from '../atoms/Avatar';
import { useAuth } from '../../hooks/useAuth';
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
  const { logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    if (isExpanded) {
      setShowDropdown(!showDropdown);
    }
  };

  return (
    <div className={`${isExpanded ? 'px-4' : 'px-2'} py-4 border-t border-gray-200 transition-all duration-300 ${className} relative`}>
      <div
        className={`flex items-center ${isExpanded ? 'space-x-3' : 'justify-center'} transition-all duration-300 ${isExpanded ? 'cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2' : ''} group/profile`}
        onClick={toggleDropdown}
      >
        <Avatar
          src={user.avatar}
          name={user.name}
          size="sm"
          className="flex-shrink-0"
        />

        {isExpanded && (
          <>
            <div className="flex-1 min-w-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.role}</p>
            </div>
            <ChevronUp
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 opacity-0 group-hover:opacity-100 ${showDropdown ? 'rotate-180' : ''}`}
            />
          </>
        )}

        {/* Tooltip for collapsed state */}
        {!isExpanded && (
          <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover/profile:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50
                          before:content-[''] before:absolute before:right-full before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-transparent before:border-r-gray-900
                          max-w-[calc(100vw-5rem)] overflow-hidden">
            <div className="font-medium">{user.name}</div>
            <div className="text-xs text-gray-300 mt-1">{user.role}</div>
          </div>
        )}
      </div>

      {/* Dropdown Menu */}
      {isExpanded && showDropdown && (
        <div className="absolute bottom-full left-4 right-4 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
          <button
            onClick={() => {
              setShowDropdown(false);
              // TODO: Implementar configurações
            }}
            className="w-full flex items-center space-x-3 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Configurações</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      )}
    </div>
  );
};
