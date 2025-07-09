import { useState } from 'react';
import { User } from '../types';

// Mock user - in real app this would come from authentication service
const mockUser: User = {
  id: '1',
  name: 'Ricardo Almeida',
  email: 'ricardo@cognit.com',
  avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=1',
  role: 'ADMIN' // Change to 'USER' to test different permissions
};

export const useAuth = () => {
  const [user] = useState<User>(mockUser);

  const hasPermission = (action: string, workspacePermission?: 'OWNER' | 'EDITOR' | 'VIEWER') => {
    switch (action) {
      case 'CREATE_WORKSPACE':
        return user.role === 'ADMIN';
      case 'CREATE_PROJECT':
        return workspacePermission === 'OWNER';
      case 'ADD_DOCUMENT':
        return workspacePermission === 'OWNER' || workspacePermission === 'EDITOR';
      case 'VIEW_PROJECTS':
        return workspacePermission === 'OWNER' || workspacePermission === 'EDITOR';
      default:
        return false;
    }
  };

  return { user, hasPermission };
};