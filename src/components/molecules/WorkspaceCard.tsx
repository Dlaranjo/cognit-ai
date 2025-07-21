import React from 'react';
import { Workspace, User } from '../../types';
import { Card, Badge, Button, Icon } from '../atoms';

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
  onManageMembers,
}) => {
  const getRoleVariant = (role: string): 'success' | 'warning' | 'neutral' => {
    switch (role) {
      case 'OWNER':
        return 'success';
      case 'EDITOR':
        return 'warning';
      case 'VIEWER':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  // Only Owners and Admins can manage members
  const canManageMembers =
    currentUser.role === 'ADMIN' || userPermission === 'OWNER';

  const handleManageMembers = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onManageMembers) {
      onManageMembers(workspace);
    }
  };

  return (
    <Card 
      onClick={() => onSelect(workspace)}
      className="hover:shadow-md hover:border-orange-300 relative group"
      hover
    >
      {/* Settings button - visible for all users but only functional for owners/admins */}
      {onManageMembers && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleManageMembers}
          className={`absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 ${
            canManageMembers
              ? ''
              : 'text-gray-300 cursor-default'
          }`}
          disabled={!canManageMembers}
        >
          <Icon name="settings" />
        </Button>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
            <Icon name="folder-open" className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
              {workspace.name}
            </h3>
            {userPermission && (
              <Badge variant={getRoleVariant(userPermission)} size="sm">
                {userPermission}
              </Badge>
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
            <Icon name="users" size="sm" />
            <span>{workspace.permissions.length} members</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="calendar" size="sm" />
            <span>{new Date(workspace.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
