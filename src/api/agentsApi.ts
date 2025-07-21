import { apiClient } from './axiosConfig';
import type {
  Agent,
  AgentTask,
  AgentConversation,
  AgentMessage,
  AgentAction,
} from '../redux/agents/agentsTypes';

export interface CreateTaskRequest {
  agentId: string;
  workspaceId: string;
  prompt: string;
  documentIds?: string[];
  parameters?: Record<string, unknown>;
  priority?: 'low' | 'medium' | 'high';
}

export interface StartConversationRequest {
  agentId: string;
  workspaceId: string;
  title?: string;
}

export interface SendMessageRequest {
  conversationId: string;
  content: string;
  attachments?: string[];
  parameters?: Record<string, unknown>;
}

export interface ProvideFeedbackRequest {
  messageId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  feedback?: string;
}

export interface TasksResponse {
  tasks: AgentTask[];
  usage: {
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
    totalFileSize: number;
  };
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface UsageStatsResponse {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  totalFileSize: number;
  agentUsage: Array<{
    agentId: string;
    agentName: string;
    totalRequests: number;
    successRate: number;
    avgResponseTime: number;
  }>;
  timeRange: {
    start: string;
    end: string;
  };
}

class AgentsApi {
  // Get all available agents
  async getAgents(): Promise<{ data: Agent[] }> {
    const response = await apiClient.get('/agents');
    return response.data;
  }

  // Get specific agent details
  async getAgent(agentId: string): Promise<{ data: Agent }> {
    const response = await apiClient.get(`/agents/${agentId}`);
    return response.data;
  }

  // Start a new conversation with an agent
  async startConversation(
    request: StartConversationRequest
  ): Promise<{ data: AgentConversation }> {
    const response = await apiClient.post('/agents/conversations', request);
    return response.data;
  }

  // Send a message in a conversation
  async sendMessage(
    request: SendMessageRequest
  ): Promise<{ data: { message: AgentMessage; actions?: AgentAction[] } }> {
    const response = await apiClient.post(
      `/agents/conversations/${request.conversationId}/messages`,
      {
        content: request.content,
        attachments: request.attachments,
        parameters: request.parameters,
      }
    );
    return response.data;
  }

  // Get conversation details and history
  async getConversation(
    conversationId: string
  ): Promise<{ data: AgentConversation }> {
    const response = await apiClient.get(
      `/agents/conversations/${conversationId}`
    );
    return response.data;
  }

  // Get all conversations for a workspace
  async getConversations(
    workspaceId: string,
    filters?: {
      agentId?: string;
      status?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<{ data: AgentConversation[] }> {
    const params = new URLSearchParams();
    params.append('workspaceId', workspaceId);

    if (filters?.agentId) params.append('agentId', filters.agentId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const response = await apiClient.get(
      `/agents/conversations?${params.toString()}`
    );
    return response.data;
  }

  // Create a new agent task
  async createTask(request: CreateTaskRequest): Promise<{ data: AgentTask }> {
    const response = await apiClient.post('/agents/tasks', request);
    return response.data;
  }

  // Get task details and status
  async getTask(taskId: string): Promise<{ data: AgentTask }> {
    const response = await apiClient.get(`/agents/tasks/${taskId}`);
    return response.data;
  }

  // Get all tasks for a workspace
  async getTasks(
    workspaceId: string,
    filters?: {
      agentId?: string;
      status?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<{ data: TasksResponse }> {
    const params = new URLSearchParams();
    params.append('workspaceId', workspaceId);

    if (filters?.agentId) params.append('agentId', filters.agentId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const response = await apiClient.get(`/agents/tasks?${params.toString()}`);
    return response.data;
  }

  // Cancel a running task
  async cancelTask(
    taskId: string
  ): Promise<{ data: { success: boolean; message: string } }> {
    const response = await apiClient.post(`/agents/tasks/${taskId}/cancel`);
    return response.data;
  }

  // Retry a failed task
  async retryTask(taskId: string): Promise<{ data: AgentTask }> {
    const response = await apiClient.post(`/agents/tasks/${taskId}/retry`);
    return response.data;
  }

  // Download generated file
  async downloadFile(taskId: string, fileId: string): Promise<{ data: Blob }> {
    const response = await apiClient.get(
      `/agents/tasks/${taskId}/files/${fileId}/download`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  }

  // Get file preview URL
  async getFilePreview(
    taskId: string,
    fileId: string
  ): Promise<{ data: { previewUrl: string } }> {
    const response = await apiClient.get(
      `/agents/tasks/${taskId}/files/${fileId}/preview`
    );
    return response.data;
  }

  // Get usage statistics
  async getUsageStats(
    workspaceId: string,
    timeRange: '7d' | '30d' | '90d' | '1y' = '30d'
  ): Promise<{ data: UsageStatsResponse }> {
    const response = await apiClient.get(
      `/agents/usage/${workspaceId}?timeRange=${timeRange}`
    );
    return response.data;
  }

  // Provide feedback on agent response
  async provideFeedback(
    request: ProvideFeedbackRequest
  ): Promise<{ data: { success: boolean } }> {
    const response = await apiClient.post('/agents/feedback', request);
    return response.data;
  }

  // Get available agent capabilities
  async getAgentCapabilities(
    agentId: string
  ): Promise<{
    data: { capabilities: string[]; parameters: Record<string, unknown> };
  }> {
    const response = await apiClient.get(`/agents/${agentId}/capabilities`);
    return response.data;
  }

  // Stream agent response (for real-time updates)
  streamAgentResponse(conversationId: string, messageId: string): EventSource {
    const eventSource = new EventSource(
      `${apiClient.defaults.baseURL}/agents/conversations/${conversationId}/messages/${messageId}/stream`,
      {
        withCredentials: true,
      }
    );

    return eventSource;
  }

  // Get task progress updates via WebSocket/SSE
  streamTaskProgress(taskId: string): EventSource {
    const eventSource = new EventSource(
      `${apiClient.defaults.baseURL}/agents/tasks/${taskId}/progress`,
      {
        withCredentials: true,
      }
    );

    return eventSource;
  }

  // Upload files for agent processing
  async uploadFiles(
    files: File[],
    workspaceId: string,
    onProgress?: (progress: number) => void
  ): Promise<{
    data: {
      fileIds: string[];
      uploadedFiles: Array<{ id: string; name: string; size: number }>;
    };
  }> {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('workspaceId', workspaceId);

    const response = await apiClient.post('/agents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    });

    return response.data;
  }

  // Delete conversation
  async deleteConversation(
    conversationId: string
  ): Promise<{ data: { success: boolean } }> {
    const response = await apiClient.delete(
      `/agents/conversations/${conversationId}`
    );
    return response.data;
  }

  // Archive conversation
  async archiveConversation(
    conversationId: string
  ): Promise<{ data: { success: boolean } }> {
    const response = await apiClient.post(
      `/agents/conversations/${conversationId}/archive`
    );
    return response.data;
  }

  // Update conversation title
  async updateConversationTitle(
    conversationId: string,
    title: string
  ): Promise<{ data: AgentConversation }> {
    const response = await apiClient.patch(
      `/agents/conversations/${conversationId}`,
      { title }
    );
    return response.data;
  }
}

export const agentsApi = new AgentsApi();
