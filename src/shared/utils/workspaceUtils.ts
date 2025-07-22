import type {
  WorkspaceMember,
  WorkspacePermissions,
  WorkspaceRole,
  Document,
} from '../../types';

export const workspaceUtils = {
  // Permission and Validation Utilities
  hasPermission: (member: WorkspaceMember, permission: keyof WorkspacePermissions): boolean => {
    return member.permissions[permission] || member.role === 'owner';
  },

  validateWorkspaceName: (name: string): { valid: boolean; error?: string } => {
    if (!name || name.trim().length === 0) {
      return { valid: false, error: 'Nome é obrigatório' };
    }

    if (name.length < 3) {
      return { valid: false, error: 'Nome deve ter pelo menos 3 caracteres' };
    }

    if (name.length > 50) {
      return { valid: false, error: 'Nome deve ter no máximo 50 caracteres' };
    }

    const invalidChars = /[<>:"/\\|?*@#]/;
    if (invalidChars.test(name)) {
      return { valid: false, error: 'Nome contém caracteres inválidos' };
    }

    return { valid: true };
  },

  // File and Storage Utilities
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  getStorageUsagePercentage: (used: number, limit: number): number => {
    if (limit === 0) {
      if (used === 0) return NaN;
      return Infinity;
    }
    return Math.min((used / limit) * 100, 100);
  },

  isImageDocument: (document: Document): boolean => {
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    return imageTypes.includes(document.mimeType);
  },

  isPdfDocument: (document: Document): boolean => {
    return document.mimeType === 'application/pdf';
  },

  getFileIcon: (document: Document): string => {
    const { mimeType } = document;

    // Images
    if (mimeType.startsWith('image/')) return '🖼️';

    // Documents
    if (mimeType === 'application/pdf') return '📄';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return '📊';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📑';

    // Code files
    if (mimeType === 'text/javascript' || mimeType === 'application/javascript') return '🔧';
    if (mimeType === 'text/html') return '🌐';
    if (mimeType === 'text/css') return '🎨';
    if (mimeType.includes('json')) return '⚙️';

    // Text files
    if (mimeType.startsWith('text/')) return '📄';

    // Archives
    if (mimeType.includes('zip') || mimeType.includes('archive')) return '🗜️';

    // Default
    return '📎';
  },

  // UI and Display Utilities
  generateTagColor: (tag: string): string => {
    const colors = [
      '#3B82F6', // blue
      '#10B981', // green
      '#F59E0B', // yellow
      '#EF4444', // red
      '#8B5CF6', // purple
      '#EC4899', // pink
      '#6366F1', // indigo
      '#6B7280', // gray
    ];

    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  },

  filterByRole: (members: WorkspaceMember[], role: WorkspaceRole): WorkspaceMember[] => {
    return members.filter(member => member.role === role);
  },

  // Date and Time Utilities
  formatLastActive: (date?: string): string => {
    if (!date) return 'Never';

    const lastActive = new Date(date);
    const now = new Date();
    const diffInMs = now.getTime() - lastActive.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes} min atrás`;
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    if (diffInDays < 7) return `${diffInDays}d atrás`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} sem atrás`;
    
    return lastActive.toLocaleDateString('pt-BR');
  },

  // Role and Permission Utilities
  getRoleDisplayName: (role: WorkspaceRole): string => {
    const roleNames: Record<WorkspaceRole, string> = {
      owner: 'Proprietário',
      editor: 'Editor',
      viewer: 'Visualizador',
    };
    return roleNames[role] || role;
  },

  getRoleColor: (role: WorkspaceRole): string => {
    const roleColors: Record<WorkspaceRole, string> = {
      owner: 'bg-red-100 text-red-800',
      editor: 'bg-blue-100 text-blue-800',
      viewer: 'bg-gray-100 text-gray-800',
    };
    return roleColors[role] || 'bg-gray-100 text-gray-800';
  },

  canManageRole: (currentUserRole: WorkspaceRole, targetRole: WorkspaceRole): boolean => {
    const roleHierarchy: Record<WorkspaceRole, number> = {
      viewer: 1,
      editor: 2,
      owner: 3,
    };

    return roleHierarchy[currentUserRole] > roleHierarchy[targetRole];
  },

  // Search and Filter Utilities
  searchMembers: (members: WorkspaceMember[], query: string): WorkspaceMember[] => {
    if (!query.trim()) return members;

    const searchTerm = query.toLowerCase();
    return members.filter(
      member =>
        member.user.name.toLowerCase().includes(searchTerm) ||
        member.user.email.toLowerCase().includes(searchTerm) ||
        member.role.toLowerCase().includes(searchTerm)
    );
  },

  sortMembersByRole: (members: WorkspaceMember[]): WorkspaceMember[] => {
    const roleOrder: Record<WorkspaceRole, number> = {
      owner: 0,
      editor: 1,
      viewer: 2,
    };

    return [...members].sort((a, b) => {
      const roleComparison = roleOrder[a.role] - roleOrder[b.role];
      if (roleComparison !== 0) return roleComparison;
      
      // If roles are the same, sort by name
      return a.user.name.localeCompare(b.user.name, 'pt-BR');
    });
  },
};