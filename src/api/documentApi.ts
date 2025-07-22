import { apiClient, uploadFile } from './axiosConfig';
import type {
  Document,
  DocumentVersion,
  BulkDocumentRequest,
  SearchRequest,
  SearchResult,
} from '../types';

export const documentApi = {
  // Document CRUD
  getDocuments: async (
    workspaceId: string,
    options?: {
      projectId?: string;
      limit?: number;
      offset?: number;
      status?: string;
      type?: string;
    }
  ): Promise<{ documents: Document[]; total: number; hasMore: boolean }> => {
    const params = new URLSearchParams();
    if (options?.projectId) params.append('projectId', options.projectId);
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());
    if (options?.status) params.append('status', options.status);
    if (options?.type) params.append('type', options.type);

    const response = await apiClient.get(`/workspaces/${workspaceId}/documents?${params}`);
    return response.data;
  },

  getDocument: async (workspaceId: string, documentId: string): Promise<Document> => {
    const response = await apiClient.get(`/workspaces/${workspaceId}/documents/${documentId}`);
    return response.data;
  },

  uploadDocument: async (
    workspaceId: string,
    projectId: string,
    file: File,
    options?: { tags?: string[]; metadata?: Record<string, unknown> }
  ): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId);
    
    if (options?.tags) {
      formData.append('tags', JSON.stringify(options.tags));
    }
    
    if (options?.metadata) {
      formData.append('metadata', JSON.stringify(options.metadata));
    }

    const response = await uploadFile(`/workspaces/${workspaceId}/documents/upload`, formData);
    return response.data;
  },

  uploadMultipleDocuments: async (
    workspaceId: string,
    projectId: string,
    files: File[],
    options?: { tags?: string[]; metadata?: Record<string, unknown> }
  ): Promise<Document[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('projectId', projectId);
    
    if (options?.tags) {
      formData.append('tags', JSON.stringify(options.tags));
    }
    
    if (options?.metadata) {
      formData.append('metadata', JSON.stringify(options.metadata));
    }

    const response = await uploadFile(`/workspaces/${workspaceId}/documents/upload-multiple`, formData);
    return response.data;
  },

  updateDocument: async (
    workspaceId: string,
    documentId: string,
    updates: {
      name?: string;
      tags?: string[];
      projectId?: string;
      metadata?: Record<string, unknown>;
    }
  ): Promise<Document> => {
    const response = await apiClient.put(`/workspaces/${workspaceId}/documents/${documentId}`, updates);
    return response.data;
  },

  deleteDocument: async (workspaceId: string, documentId: string): Promise<void> => {
    await apiClient.delete(`/workspaces/${workspaceId}/documents/${documentId}`);
  },

  archiveDocument: async (workspaceId: string, documentId: string): Promise<Document> => {
    const response = await apiClient.post(`/workspaces/${workspaceId}/documents/${documentId}/archive`);
    return response.data;
  },

  moveDocument: async (
    workspaceId: string,
    documentId: string,
    targetProjectId: string
  ): Promise<Document> => {
    const response = await apiClient.post(`/workspaces/${workspaceId}/documents/${documentId}/move`, {
      targetProjectId,
    });
    return response.data;
  },

  downloadDocument: async (workspaceId: string, documentId: string): Promise<Blob> => {
    const response = await apiClient.get(`/workspaces/${workspaceId}/documents/${documentId}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Document Versions
  getDocumentVersions: async (
    workspaceId: string,
    documentId: string
  ): Promise<DocumentVersion[]> => {
    const response = await apiClient.get(`/workspaces/${workspaceId}/documents/${documentId}/versions`);
    return response.data;
  },

  uploadDocumentVersion: async (
    workspaceId: string,
    documentId: string,
    file: File,
    changes?: string
  ): Promise<DocumentVersion> => {
    const formData = new FormData();
    formData.append('file', file);
    if (changes) {
      formData.append('changes', changes);
    }

    const response = await uploadFile(
      `/workspaces/${workspaceId}/documents/${documentId}/versions`,
      formData
    );
    return response.data;
  },

  downloadDocumentVersion: async (
    workspaceId: string,
    documentId: string,
    versionId: string
  ): Promise<Blob> => {
    const response = await apiClient.get(
      `/workspaces/${workspaceId}/documents/${documentId}/versions/${versionId}/download`,
      { responseType: 'blob' }
    );
    return response.data;
  },

  // Bulk Operations
  bulkDocumentOperation: async (
    workspaceId: string,
    request: BulkDocumentRequest
  ): Promise<{ success: boolean; results: { documentId: string; success: boolean; error?: string }[] }> => {
    const response = await apiClient.post(`/workspaces/${workspaceId}/documents/bulk`, request);
    return response.data;
  },

  // Search
  searchDocuments: async (workspaceId: string, request: SearchRequest): Promise<SearchResult> => {
    const response = await apiClient.post(`/workspaces/${workspaceId}/documents/search`, request);
    return response.data;
  },

  // AI Analysis
  analyzeDocument: async (
    workspaceId: string,
    documentId: string,
    options?: { forceReprocess?: boolean }
  ): Promise<{ taskId: string }> => {
    const response = await apiClient.post(`/workspaces/${workspaceId}/documents/${documentId}/analyze`, {
      forceReprocess: options?.forceReprocess || false,
    });
    return response.data;
  },

  generateDocumentSummary: async (
    workspaceId: string,
    documentId: string,
    options?: { language?: string; maxLength?: number }
  ): Promise<{ summary: string; keywords: string[] }> => {
    const response = await apiClient.post(`/workspaces/${workspaceId}/documents/${documentId}/summarize`, {
      language: options?.language || 'pt',
      maxLength: options?.maxLength || 500,
    });
    return response.data;
  },
};