import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Workspace, User } from '../../types';
import { WorkspaceCard } from './WorkspaceCard';
import { CreateWorkspaceModal } from './CreateWorkspaceModal';
import { MemberManagement } from './MemberManagement';

interface WorkspaceListProps {
  workspaces: Workspace[];
  currentUser: User;
  canCreateWorkspace: boolean;
  getUserPermission: (workspaceId: string) => 'OWNER' | 'EDITOR' | 'VIEWER' | null;
  onWorkspaceSelect: (workspace: Workspace) => void;
  onCreateWorkspace: (name: string, description?: string) => Promise<Workspace>;
  onUpdateWorkspaceMembers: (workspaceId: string, members: any[]) => Promise<void>;
}

export const WorkspaceList: React.FC<WorkspaceListProps> = ({
  workspaces,
  currentUser,
  canCreateWorkspace,
  getUserPermission,
  onWorkspaceSelect,
  onCreateWorkspace,
  onUpdateWorkspaceMembers
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedWorkspaceForMembers, setSelectedWorkspaceForMembers] = useState<Workspace | null>(null);

  const filteredWorkspaces = workspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workspace.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search portfolios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
        
        {canCreateWorkspace && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="ml-4 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Portfolio</span>
          </button>
        )}
      </div>

      {/* Workspaces Grid */}
      {filteredWorkspaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkspaces.map(workspace => (
            <WorkspaceCard
              key={workspace.id}
              workspace={workspace}
              userPermission={getUserPermission(workspace.id)}
              currentUser={currentUser}
              onSelect={onWorkspaceSelect}
              onManageMembers={setSelectedWorkspaceForMembers}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No portfolios found' : 'No portfolios available'}
          </h3>
          <p className="text-gray-500">
            {searchTerm 
              ? 'Try adjusting your search criteria'
              : canCreateWorkspace 
                ? 'Create your first portfolio to get started'
                : 'Contact an admin to create portfolios'
            }
          </p>
        </div>
      )}

      {/* Create Workspace Modal */}
      {showCreateModal && (
        <CreateWorkspaceModal
          onClose={() => setShowCreateModal(false)}
          onCreate={async (name, description) => {
            await onCreateWorkspace(name, description);
            setShowCreateModal(false);
          }}
        />
      )}

      {/* Member Management Modal */}
      {selectedWorkspaceForMembers && (
        <MemberManagement
          workspace={selectedWorkspaceForMembers}
          currentUser={currentUser}
          onClose={() => setSelectedWorkspaceForMembers(null)}
          onUpdateMembers={onUpdateWorkspaceMembers}
        />
      )}
    </div>
  );
};