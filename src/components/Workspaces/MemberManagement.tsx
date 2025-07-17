import React, { useState } from 'react';
import { Plus, X, Crown, Edit, Eye, Trash2, Check } from 'lucide-react';
import { Workspace, User } from '../../types';

interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'OWNER' | 'EDITOR' | 'VIEWER';
  joinedAt: string;
}

interface MemberManagementProps {
  workspace: Workspace;
  currentUser: User;
  onClose: () => void;
  onUpdateMembers: (workspaceId: string, members: Member[]) => Promise<void>;
}

// Mock users database - in real app this would come from API
const mockUsers = [
  { id: '2', name: 'Ana Silva', email: 'ana@cognit.com', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1' },
  { id: '3', name: 'Carlos Santos', email: 'carlos@cognit.com', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1' },
  { id: '4', name: 'Maria Costa', email: 'maria@cognit.com', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1' },
  { id: '5', name: 'João Oliveira', email: 'joao@cognit.com', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1' },
  { id: '6', name: 'Lucia Ferreira', email: 'lucia@cognit.com', avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1' }
];

export const MemberManagement: React.FC<MemberManagementProps> = ({
  workspace,
  currentUser,
  onClose,
  onUpdateMembers
}) => {
  // Convert workspace permissions to members with user details
  const initialMembers: Member[] = workspace.permissions.map(permission => {
    const user = mockUsers.find(u => u.id === permission.userId) || {
      id: permission.userId,
      name: permission.userId === currentUser.id ? currentUser.name : 'Unknown User',
      email: permission.userId === currentUser.id ? currentUser.email : 'unknown@email.com',
      avatar: permission.userId === currentUser.id ? currentUser.avatar : undefined
    };
    
    return {
      ...user,
      role: permission.role,
      joinedAt: workspace.createdAt
    };
  });

  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [showAddMember, setShowAddMember] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<'OWNER' | 'EDITOR' | 'VIEWER'>('VIEWER');
  const [isLoading, setIsLoading] = useState(false);

  const currentUserPermission = workspace.permissions.find(p => p.userId === currentUser.id)?.role;
  
  // Permission checks based on new rules
  const isAdmin = currentUser.role === 'ADMIN';
  const isOwner = currentUserPermission === 'OWNER';

  // Only Owners and Admins can manage members
  const canManageMembers = isAdmin || isOwner;
  
  // Only Owners and Admins can add/remove Owners
  const canManageOwners = isAdmin || isOwner;
  
  // Owners can add Editors and Viewers, but Editors and Viewers cannot add anyone
  const canAddMembers = isAdmin || isOwner;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'OWNER': return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'EDITOR': return <Edit className="w-4 h-4 text-orange-600" />;
      case 'VIEWER': return <Eye className="w-4 h-4 text-gray-600" />;
      default: return null;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'OWNER': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'EDITOR': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'VIEWER': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAvailableRoles = () => {
    if (isAdmin) {
      // Admins can assign any role
      return [
        { value: 'VIEWER', label: 'Viewer' },
        { value: 'EDITOR', label: 'Editor' },
        { value: 'OWNER', label: 'Owner' }
      ];
    } else if (isOwner) {
      // Owners can assign any role
      return [
        { value: 'VIEWER', label: 'Viewer' },
        { value: 'EDITOR', label: 'Editor' },
        { value: 'OWNER', label: 'Owner' }
      ];
    } else {
      // Editors and Viewers cannot add members
      return [];
    }
  };

  const canChangeRole = (_targetMember: Member) => {
    // Admins can change any role
    if (isAdmin) return true;
    
    // Owners can change any role
    if (isOwner) return true;
    
    // Editors and Viewers cannot change roles
    return false;
  };

  const canRemoveMember = (targetMember: Member) => {
    // Cannot remove yourself
    if (targetMember.id === currentUser.id) return false;
    
    // Only Admins and Owners can remove members
    if (!canManageMembers) return false;
    
    // To remove an Owner, you must be Admin or Owner
    if (targetMember.role === 'OWNER') {
      return canManageOwners;
    }
    
    // Owners can remove Editors and Viewers
    if (isOwner) return true;
    
    // Admins can remove anyone
    if (isAdmin) return true;
    
    return false;
  };

  const handleAddMember = async () => {
    if (!searchEmail.trim() || !canAddMembers) return;

    // Check if trying to add Owner without proper permissions
    if (selectedRole === 'OWNER' && !canManageOwners) {
      alert('Only Admins and Owners can add new Owners.');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call to find user by email
    setTimeout(() => {
      const existingUser = mockUsers.find(u => u.email.toLowerCase() === searchEmail.toLowerCase());
      
      if (!existingUser) {
        alert('User not found. Please check the email address.');
        setIsLoading(false);
        return;
      }

      if (members.some(m => m.id === existingUser.id)) {
        alert('User is already a member of this workspace.');
        setIsLoading(false);
        return;
      }

      const newMember: Member = {
        ...existingUser,
        role: selectedRole,
        joinedAt: new Date().toISOString().split('T')[0]
      };

      setMembers(prev => [...prev, newMember]);
      setSearchEmail('');
      setSelectedRole('VIEWER');
      setShowAddMember(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleRemoveMember = (memberId: string) => {
    const memberToRemove = members.find(m => m.id === memberId);
    if (!memberToRemove) return;

    if (!canRemoveMember(memberToRemove)) {
      if (memberToRemove.id === currentUser.id) {
        alert('You cannot remove yourself from the workspace.');
      } else if (memberToRemove.role === 'OWNER' && !canManageOwners) {
        alert('Only Admins and Owners can remove other Owners.');
      } else {
        alert('You do not have permission to remove this member.');
      }
      return;
    }

    const ownerCount = members.filter(m => m.role === 'OWNER').length;
    
    if (memberToRemove.role === 'OWNER' && ownerCount === 1) {
      alert('Cannot remove the last owner. Please assign another owner first.');
      return;
    }

    setMembers(prev => prev.filter(m => m.id !== memberId));
  };

  const handleRoleChange = (memberId: string, newRole: 'OWNER' | 'EDITOR' | 'VIEWER') => {
    const targetMember = members.find(m => m.id === memberId);
    if (!targetMember) return;

    if (!canChangeRole(targetMember)) {
      if (newRole === 'OWNER' && !canManageOwners) {
        alert('Only Admins and Owners can assign Owner role.');
      } else {
        alert('You do not have permission to change this member\'s role.');
      }
      return;
    }

    // Special check for demoting yourself as the last owner
    if (memberId === currentUser.id && targetMember.role === 'OWNER' && newRole !== 'OWNER') {
      const ownerCount = members.filter(m => m.role === 'OWNER').length;
      if (ownerCount === 1) {
        alert('Cannot change your role as you are the only owner. Please assign another owner first.');
        return;
      }
    }

    setMembers(prev => prev.map(m => 
      m.id === memberId ? { ...m, role: newRole } : m
    ));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onUpdateMembers(workspace.id, members);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const availableUsers = mockUsers.filter(user => 
    !members.some(member => member.id === user.id) &&
    user.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  const availableRoles = getAvailableRoles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {canManageMembers ? 'Manage Members' : 'View Members'}
              </h2>
              <p className="text-sm text-gray-600">{workspace.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Permission Notice */}
        {!canManageMembers && (
          <div className="px-6 py-4 bg-amber-50 border-b border-amber-200">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-amber-600" />
              <div>
                <p className="text-amber-800 font-medium">View Only Access</p>
                <p className="text-amber-700 text-sm">You can view members but cannot make changes. Only Owners and Admins can manage members.</p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Add Member Section - Only show for users who can add members */}
          {canAddMembers && (
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              {!showAddMember ? (
                <button
                  onClick={() => setShowAddMember(true)}
                  className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Member</span>
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 relative">
                      <input
                        type="email"
                        placeholder="Enter email address..."
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      {/* Email suggestions */}
                      {searchEmail && availableUsers.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                          {availableUsers.slice(0, 5).map(user => (
                            <button
                              key={user.id}
                              onClick={() => setSearchEmail(user.email)}
                              className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
                            >
                              <img
                                src={user.avatar || `https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1`}
                                alt={user.name}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as 'OWNER' | 'EDITOR' | 'VIEWER')}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      {availableRoles.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAddMember}
                      disabled={!searchEmail.trim() || isLoading || availableRoles.length === 0}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      <span>Add</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowAddMember(false);
                        setSearchEmail('');
                        setSelectedRole('VIEWER');
                      }}
                      className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Members List */}
          <div className="px-6 py-4">
            <div className="space-y-3">
              {members.map(member => (
                <div key={member.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <img
                      src={member.avatar || `https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1`}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900">{member.name}</p>
                        {member.id === currentUser.id && (
                          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">You</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{member.email}</p>
                      <p className="text-xs text-gray-400">Joined {new Date(member.joinedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {/* Role Display/Selector - Only show selector if user can change roles */}
                    {canChangeRole(member) ? (
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value as 'OWNER' | 'EDITOR' | 'VIEWER')}
                        className={`px-3 py-1 text-sm border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${getRoleColor(member.role)}`}
                      >
                        {availableRoles.map(role => (
                          <option key={role.value} value={role.value}>{role.label}</option>
                        ))}
                      </select>
                    ) : (
                      <div className={`px-3 py-1 text-sm border rounded-lg flex items-center space-x-1 ${getRoleColor(member.role)}`}>
                        {getRoleIcon(member.role)}
                        <span>{member.role}</span>
                      </div>
                    )}
                    
                    {/* Remove Button - Only show if user can remove this member */}
                    {canRemoveMember(member) && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-1 text-red-400 hover:text-red-600 transition-colors"
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {members.length} member{members.length !== 1 ? 's' : ''}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {canManageMembers ? 'Cancel' : 'Close'}
              </button>
              {canManageMembers && (
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>Save Changes</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};