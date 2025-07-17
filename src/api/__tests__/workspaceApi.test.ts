import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { workspaceApi, workspaceUtils } from '../workspaceApi';
import { createMockServer } from '../mockServer';
import type { Server } from 'miragejs';
import type { WorkspaceMember } from '../workspaceApi';

describe('workspaceApi', () => {
  let server: Server;

  beforeEach(() => {
    server = createMockServer() as Server;
    vi.clearAllMocks();
  });

  afterEach(() => {
    server.shutdown();
  });

  describe('getWorkspaces', () => {
    it('should get workspaces list', async () => {
      const result = await workspaceApi.getWorkspaces();

      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          ownerId: expect.any(String),
          settings: expect.objectContaining({
            isPublic: expect.any(Boolean),
            allowInvites: expect.any(Boolean),
            defaultRole: expect.any(String),
          }),
          stats: expect.objectContaining({
            totalDocuments: expect.any(Number),
            totalMembers: expect.any(Number),
            storageUsed: expect.any(Number),
          }),
          createdAt: expect.any(String),
          isArchived: expect.any(Boolean),
        }),
      ]));
    });
  });

  describe('getWorkspace', () => {
    it('should get specific workspace', async () => {
      const result = await workspaceApi.getWorkspace('1');

      expect(result).toEqual(expect.objectContaining({
        id: '1',
        name: expect.any(String),
        ownerId: expect.any(String),
        settings: expect.any(Object),
        stats: expect.any(Object),
      }));
    });

    it('should handle non-existent workspace', async () => {
      await expect(workspaceApi.getWorkspace('non-existent')).rejects.toEqual({
        message: 'Workspace não encontrado',
        status: 404,
        code: undefined,
        details: { message: 'Workspace não encontrado' },
      });
    });
  });

  describe('createWorkspace', () => {
    it('should create workspace successfully', async () => {
      const request = {
        name: 'Novo Workspace',
        description: 'Descrição do workspace',
      };

      const result = await workspaceApi.createWorkspace(request);

      expect(result).toEqual(expect.objectContaining({
        id: expect.any(String),
        name: 'Novo Workspace',
        description: 'Descrição do workspace',
        ownerId: '1',
        memberCount: 1,
        projectCount: 0,
        documentCount: 0,
        settings: expect.objectContaining({
          isPublic: false,
          allowInvites: true,
          defaultRole: 'viewer',
        }),
      }));
    });

    it('should create workspace with minimal data', async () => {
      const request = {
        name: 'Workspace Mínimo',
      };

      const result = await workspaceApi.createWorkspace(request);

      expect(result).toEqual(expect.objectContaining({
        name: 'Workspace Mínimo',
        description: '',
      }));
    });
  });

  describe('getProjects', () => {
    it('should get projects for workspace', async () => {
      const result = await workspaceApi.getProjects('1');

      expect(result).toEqual({
        projects: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
            workspaceId: '1',
            status: expect.any(String),
            documentCount: expect.any(Number),
            collaborators: expect.any(Array),
          }),
        ]),
        total: expect.any(Number),
        hasMore: expect.any(Boolean),
      });
    });

    it('should handle pagination', async () => {
      const result = await workspaceApi.getProjects('1', undefined, 1, 0);

      expect(result.projects).toHaveLength(1);
      expect(result.total).toBeGreaterThanOrEqual(1);
    });

    it('should filter by status', async () => {
      const result = await workspaceApi.getProjects('1', 'active');

      result.projects.forEach(project => {
        expect(project.status).toBe('active');
      });
    });
  });
});

describe('workspaceUtils', () => {
  describe('hasPermission', () => {
    const ownerMember: WorkspaceMember = {
      id: '1',
      userId: '1',
      workspaceId: '1',
      role: 'owner',
      permissions: {
        canCreateProjects: true,
        canInviteMembers: true,
        canManageSettings: true,
        canDeleteDocuments: true,
        canViewAnalytics: true,
        canExportData: true,
      },
      joinedAt: '2024-01-01T00:00:00Z',
      user: {
        id: '1',
        name: 'Owner',
        email: 'owner@test.com',
        isActive: true,
      },
    };

    const editorMember: WorkspaceMember = {
      ...ownerMember,
      id: '2',
      userId: '2',
      role: 'editor',
      permissions: {
        canCreateProjects: true,
        canInviteMembers: false,
        canManageSettings: false,
        canDeleteDocuments: true,
        canViewAnalytics: false,
        canExportData: false,
      },
    };

    const viewerMember: WorkspaceMember = {
      ...ownerMember,
      id: '3',
      userId: '3',
      role: 'viewer',
      permissions: {
        canCreateProjects: false,
        canInviteMembers: false,
        canManageSettings: false,
        canDeleteDocuments: false,
        canViewAnalytics: false,
        canExportData: false,
      },
    };

    it('should grant all permissions to owner', () => {
      expect(workspaceUtils.hasPermission(ownerMember, 'canCreateProjects')).toBe(true);
      expect(workspaceUtils.hasPermission(ownerMember, 'canManageSettings')).toBe(true);
      expect(workspaceUtils.hasPermission(ownerMember, 'canViewAnalytics')).toBe(true);
    });

    it('should respect editor permissions', () => {
      expect(workspaceUtils.hasPermission(editorMember, 'canCreateProjects')).toBe(true);
      expect(workspaceUtils.hasPermission(editorMember, 'canManageSettings')).toBe(false);
      expect(workspaceUtils.hasPermission(editorMember, 'canViewAnalytics')).toBe(false);
    });

    it('should respect viewer permissions', () => {
      expect(workspaceUtils.hasPermission(viewerMember, 'canCreateProjects')).toBe(false);
      expect(workspaceUtils.hasPermission(viewerMember, 'canDeleteDocuments')).toBe(false);
      expect(workspaceUtils.hasPermission(viewerMember, 'canExportData')).toBe(false);
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(workspaceUtils.formatFileSize(0)).toBe('0 Bytes');
      expect(workspaceUtils.formatFileSize(500)).toBe('500 Bytes');
      expect(workspaceUtils.formatFileSize(1024)).toBe('1 KB');
      expect(workspaceUtils.formatFileSize(1536)).toBe('1.5 KB');
      expect(workspaceUtils.formatFileSize(1048576)).toBe('1 MB');
      expect(workspaceUtils.formatFileSize(1073741824)).toBe('1 GB');
    });

    it('should handle large numbers', () => {
      const oneTerabyte = 1024 * 1024 * 1024 * 1024;
      expect(workspaceUtils.formatFileSize(oneTerabyte)).toBe('1 TB');
    });
  });

  describe('getStorageUsagePercentage', () => {
    it('should calculate percentage correctly', () => {
      expect(workspaceUtils.getStorageUsagePercentage(500, 1000)).toBe(50);
      expect(workspaceUtils.getStorageUsagePercentage(750, 1000)).toBe(75);
      expect(workspaceUtils.getStorageUsagePercentage(1000, 1000)).toBe(100);
      expect(workspaceUtils.getStorageUsagePercentage(0, 1000)).toBe(0);
    });

    it('should handle edge cases', () => {
      expect(workspaceUtils.getStorageUsagePercentage(100, 0)).toBe(Infinity);
      expect(workspaceUtils.getStorageUsagePercentage(0, 0)).toBeNaN();
    });
  });

  describe('validateWorkspaceName', () => {
    it('should validate correct names', () => {
      expect(workspaceUtils.validateWorkspaceName('Valid Name')).toEqual({ valid: true });
      expect(workspaceUtils.validateWorkspaceName('Workspace-123')).toEqual({ valid: true });
      expect(workspaceUtils.validateWorkspaceName('My_Workspace')).toEqual({ valid: true });
    });

    it('should reject empty or whitespace names', () => {
      expect(workspaceUtils.validateWorkspaceName('')).toEqual({
        valid: false,
        error: 'Nome é obrigatório',
      });
      expect(workspaceUtils.validateWorkspaceName('   ')).toEqual({
        valid: false,
        error: 'Nome é obrigatório',
      });
    });

    it('should reject names that are too short', () => {
      expect(workspaceUtils.validateWorkspaceName('AB')).toEqual({
        valid: false,
        error: 'Nome deve ter pelo menos 3 caracteres',
      });
    });

    it('should reject names that are too long', () => {
      const longName = 'A'.repeat(51);
      expect(workspaceUtils.validateWorkspaceName(longName)).toEqual({
        valid: false,
        error: 'Nome deve ter no máximo 50 caracteres',
      });
    });

    it('should reject names with invalid characters', () => {
      expect(workspaceUtils.validateWorkspaceName('Name@Invalid')).toEqual({
        valid: false,
        error: 'Nome contém caracteres inválidos',
      });
      expect(workspaceUtils.validateWorkspaceName('Name#123')).toEqual({
        valid: false,
        error: 'Nome contém caracteres inválidos',
      });
    });
  });

  describe('generateTagColor', () => {
    it('should generate consistent colors for same tag', () => {
      const color1 = workspaceUtils.generateTagColor('javascript');
      const color2 = workspaceUtils.generateTagColor('javascript');
      expect(color1).toBe(color2);
    });

    it('should generate different colors for different tags', () => {
      const color1 = workspaceUtils.generateTagColor('javascript');
      const color2 = workspaceUtils.generateTagColor('python');
      expect(color1).not.toBe(color2);
    });

    it('should return valid hex colors', () => {
      const color = workspaceUtils.generateTagColor('test');
      expect(color).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });

  describe('filterByRole', () => {
    const members: WorkspaceMember[] = [
      {
        id: '1', userId: '1', workspaceId: '1', role: 'owner',
        permissions: {
          canCreateProjects: true,
          canInviteMembers: true,
          canManageSettings: true,
          canDeleteDocuments: true,
          canViewAnalytics: true,
          canExportData: true,
        }, 
        joinedAt: '', 
        user: {
          id: '1', name: 'Owner', email: 'owner@test.com', isActive: true,
        },
      },
      {
        id: '2', userId: '2', workspaceId: '1', role: 'editor',
        permissions: {
          canCreateProjects: true,
          canInviteMembers: false,
          canManageSettings: false,
          canDeleteDocuments: true,
          canViewAnalytics: false,
          canExportData: false,
        }, 
        joinedAt: '', 
        user: {
          id: '2', name: 'Editor', email: 'editor@test.com', isActive: true,
        },
      },
      {
        id: '3', userId: '3', workspaceId: '1', role: 'viewer',
        permissions: {
          canCreateProjects: false,
          canInviteMembers: false,
          canManageSettings: false,
          canDeleteDocuments: false,
          canViewAnalytics: false,
          canExportData: false,
        }, 
        joinedAt: '', 
        user: {
          id: '3', name: 'Viewer', email: 'viewer@test.com', isActive: true,
        },
      },
      {
        id: '4', userId: '4', workspaceId: '1', role: 'editor',
        permissions: {
          canCreateProjects: true,
          canInviteMembers: false,
          canManageSettings: false,
          canDeleteDocuments: true,
          canViewAnalytics: false,
          canExportData: false,
        }, 
        joinedAt: '', 
        user: {
          id: '4', name: 'Editor2', email: 'editor2@test.com', isActive: true,
        },
      },
    ];

    it('should filter members by role correctly', () => {
      const owners = workspaceUtils.filterByRole(members, 'owner');
      expect(owners).toHaveLength(1);
      expect(owners[0].role).toBe('owner');

      const editors = workspaceUtils.filterByRole(members, 'editor');
      expect(editors).toHaveLength(2);
      editors.forEach(member => expect(member.role).toBe('editor'));

      const viewers = workspaceUtils.filterByRole(members, 'viewer');
      expect(viewers).toHaveLength(1);
      expect(viewers[0].role).toBe('viewer');
    });
  });

  describe('document type utilities', () => {
    const imageDoc = {
      id: '1', name: 'image.jpg', mimeType: 'image/jpeg',
      originalName: '', type: '', size: 0, url: '', projectId: '',
      uploadedBy: '', status: 'ready' as const, version: 1, versions: [],
      tags: [], metadata: { keywords: [] }, createdAt: '', updatedAt: '',
      accessCount: 0,
    };

    const pdfDoc = {
      ...imageDoc,
      id: '2', name: 'document.pdf', mimeType: 'application/pdf',
    };

    const wordDoc = {
      ...imageDoc,
      id: '3', name: 'document.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    };

    it('should identify image documents', () => {
      expect(workspaceUtils.isImageDocument(imageDoc)).toBe(true);
      expect(workspaceUtils.isImageDocument(pdfDoc)).toBe(false);
    });

    it('should identify PDF documents', () => {
      expect(workspaceUtils.isPdfDocument(pdfDoc)).toBe(true);
      expect(workspaceUtils.isPdfDocument(imageDoc)).toBe(false);
    });

    it('should get appropriate file icons', () => {
      expect(workspaceUtils.getFileIcon(imageDoc)).toBe('🖼️');
      expect(workspaceUtils.getFileIcon(pdfDoc)).toBe('📄');
      expect(workspaceUtils.getFileIcon(wordDoc)).toBe('📝');
    });
  });
});