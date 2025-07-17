import React from 'react';
import { Users, Calendar, FolderOpen, Settings } from 'lucide-react';
import { Workspace, User } from '../../types';

interface WorkspaceCardProps {
  workspace: Workspace;
  userPermission: 'OWNER' | 'EDITOR' | 'VIEWER' | null;
  currentUser: User;
  onSelect: (workspace: Workspace) => void;
  onManageMembers?: (workspace: Workspace) => void;
}

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({ 
  workspace, 
  userPermission, 
  currentUser,
  onSelect,
  onManageMembers
}) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'OWNER': return 'bg-green-100 text-green-800';
      case 'EDITOR': return 'bg-orange-100 text-orange-800';
      case 'VIEWER': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Only Owners and Admins can manage members
  const canManageMembers = currentUser.role === 'ADMIN' || userPermission === 'OWNER';

  const handleManageMembers = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onManageMembers) {
      onManageMembers(workspace);
    }
  };

  return (
    <div 
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group hover:border-orange-300 relative"
      onClick={() => onSelect(workspace)}
    >
      {/* Settings button - visible for all users but only functional for owners/admins */}
      {onManageMembers && (
        <button
          onClick={handleManageMembers}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ${
            canManageMembers 
              ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100' 
              : 'text-gray-300 cursor-default'
          }`}
          title={canManageMembers ? "Manage members" : "View members (read-only)"}
        >
          <Settings className="w-4 h-4" />
        </button>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
              {workspace.name}
            </h3>
            {userPermission && (
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(userPermission)}`}>
                {userPermission}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {workspace.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {workspace.description}
        </p>
      )}
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{workspace.permissions.length} members</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(workspace.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};