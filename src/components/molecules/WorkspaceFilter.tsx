import React, { useState } from 'react';
import { Check, ChevronDown, Database, X } from 'lucide-react';
import { Workspace } from '../../types';

interface WorkspaceFilterProps {
  workspaces: Workspace[];
  selectedWorkspaces: string[];
  onSelectionChange: (workspaceIds: string[]) => void;
  getUserPermission: (
    workspaceId: string
  ) => 'OWNER' | 'EDITOR' | 'VIEWER' | null;
}

export const WorkspaceFilter: React.FC<WorkspaceFilterProps> = ({
  workspaces,
  selectedWorkspaces,
  onSelectionChange,
  getUserPermission,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleWorkspace = (workspaceId: string) => {
    if (selectedWorkspaces.includes(workspaceId)) {
      onSelectionChange(selectedWorkspaces.filter((id) => id !== workspaceId));
    } else {
      onSelectionChange([...selectedWorkspaces, workspaceId]);
    }
  };

  const selectAll = () => {
    onSelectionChange(workspaces.map((w) => w.id));
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  const getWorkspaceIcon = (workspaceId: string) => {
    const permission = getUserPermission(workspaceId);
    switch (permission) {
      case 'OWNER':
        return '👑';
      case 'EDITOR':
        return '✏️';
      case 'VIEWER':
        return '👁️';
      default:
        return '📁';
    }
  };

  const getPermissionColor = (workspaceId: string) => {
    const permission = getUserPermission(workspaceId);
    switch (permission) {
      case 'OWNER':
        return 'text-green-600';
      case 'EDITOR':
        return 'text-orange-600';
      case 'VIEWER':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <Database className="w-4 h-4" />
        <span>
          {selectedWorkspaces.length === 0
            ? 'All Portfolios'
            : selectedWorkspaces.length === workspaces.length
              ? 'All Portfolios'
              : `${selectedWorkspaces.length} Portfolio${selectedWorkspaces.length !== 1 ? 's' : ''}`}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl border border-gray-200 shadow-lg z-20 max-h-96 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Search Context</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Select which portfolios to include in your search
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={selectAll}
                  className="text-xs px-2 py-1 bg-orange-50 text-orange-600 rounded hover:bg-orange-100 transition-colors"
                >
                  Select All
                </button>
                <button
                  onClick={clearAll}
                  className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded hover:bg-gray-100 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {workspaces.map((workspace) => {
                const isSelected = selectedWorkspaces.includes(workspace.id);
                const permission = getUserPermission(workspace.id);

                return (
                  <div
                    key={workspace.id}
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => toggleWorkspace(workspace.id)}
                  >
                    <div className="flex-shrink-0">
                      {isSelected ? (
                        <div className="w-4 h-4 bg-orange-600 rounded flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 border border-gray-300 rounded" />
                      )}
                    </div>

                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <span className="text-lg">
                        {getWorkspaceIcon(workspace.id)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {workspace.name}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span
                            className={`font-medium ${getPermissionColor(workspace.id)}`}
                          >
                            {permission}
                          </span>
                          <span>•</span>
                          <span>{workspace.permissions.length} members</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
