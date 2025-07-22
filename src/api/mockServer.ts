import { createServer, Response } from 'miragejs';
import {
  mockUsers,
  mockAgents,
  mockAgentTasks,
  mockAgentConversations,
  mockConversations,
  mockWorkspaces,
  mockProjects,
  mockLLMProviders,
  generateMockResponse,
  delay,
  generateId,
  mockConfig,
  demoUsers,
  createPaginatedResponse,
  createUsageResponse,
  createMockTask,
  createCompletedTask,
  createMockUploadResponse,
} from './mock';

export function createMockServer() {
  // Allow mock server in production for demo/testing purposes
  // if (import.meta.env.PROD) {
  //   return; // Don't create mock server in production
  // }

  return createServer({
    routes() {
      // Configure namespace to match API base URL
      this.namespace = '';
      this.timing = mockConfig.defaultTiming;

      // Auth endpoints
      this.post('/auth/login', async (schema, request) => {
        await delay(mockConfig.delays.login);
        const attrs = JSON.parse(request.requestBody);

        const validUser = demoUsers.find(
          (u) => u.email === attrs.email && u.password === attrs.password
        );

        if (validUser) {
          return {
            user: mockUsers[validUser.userIndex],
            token: 'mock-jwt-token',
            refreshToken: 'mock-refresh-token',
            expiresIn: 3600,
          };
        }

        return new Response(400, {}, { message: 'Credenciais inválidas' });
      });

      this.post('/auth/google', async (schema, request) => {
        await delay(mockConfig.delays.refresh);
        const attrs = JSON.parse(request.requestBody);

        if (attrs.token) {
          return {
            user: mockUsers[0], // Default to Ricardo
            token: 'mock-jwt-token-google',
            refreshToken: 'mock-refresh-token-google',
            expiresIn: 3600,
          };
        }

        return new Response(400, {}, { message: 'Invalid Google token' });
      });

      this.post('/auth/logout', async () => {
        await delay(mockConfig.delays.logout);
        return new Response(200, {}, { message: 'Logout realizado com sucesso' });
      });

      this.post('/auth/refresh', async () => {
        await delay(mockConfig.delays.refresh);
        return {
          token: 'new-mock-jwt-token',
          refreshToken: 'new-mock-refresh-token',
          expiresIn: 3600,
        };
      });

      this.get('/auth/validate', async () => {
        await delay(mockConfig.delays.validate);
        return mockUsers[0];
      });

      this.get('/auth/profile', async () => {
        await delay(mockConfig.delays.profile);
        return mockUsers[0];
      });

      // Chat endpoints
      this.get('/chat/conversations', async (schema, request) => {
        await delay(mockConfig.delays.conversations);
        const { queryParams } = request;
        const limit = parseInt(queryParams.limit) || 50;
        const offset = parseInt(queryParams.offset) || 0;

        const paginatedResponse = createPaginatedResponse(mockConversations, limit, offset);
        return {
          conversations: paginatedResponse.data,
          total: paginatedResponse.pagination.total,
          hasMore: paginatedResponse.pagination.hasMore,
        };
      });

      this.get('/chat/conversations/:id', async (schema, request) => {
        await delay(mockConfig.delays.conversation);
        const conversation = mockConversations.find((c) => c.id === request.params.id);
        return conversation || new Response(404, {}, { message: 'Conversa não encontrada' });
      });

      this.post('/chat/message', async (schema, request) => {
        await delay(mockConfig.delays.message);

        const formData = request.requestBody as FormData;
        const content = formData.get('content') as string;
        const provider = formData.get('provider') as string;
        const model = formData.get('model') as string;

        const newMessage = {
          id: generateId(),
          content: `Esta é uma resposta simulada para: "${content}"\nO mock server está funcionando corretamente com o provider ${provider} e modelo ${model}.\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu sapien non diam faucibus elementum. Donec purus felis, gravida volutpat nibh vel, suscipit sodales sapien. Nam id diam a leo sollicitudin egestas eget quis ex. Curabitur egestas turpis et sollicitudin placerat. Nulla accumsan sapien vel justo mollis, vel pellentesque sapien ultricies. In posuere urna metus, nec egestas nulla ornare vitae. Praesent vel sollicitudin sem.`,
          role: 'assistant' as const,
          timestamp: new Date().toISOString(),
          conversationId: '1',
          provider,
          model,
          tokens: { prompt: 50, completion: 100, total: 150 },
          cost: 0.0023,
        };

        return newMessage;
      });

      this.get('/chat/providers', async () => {
        await delay(mockConfig.delays.providers);
        return mockLLMProviders;
      });

      this.get('/chat/models', async (schema, request) => {
        await delay(mockConfig.delays.models);
        const { queryParams } = request;
        const providerId = queryParams.provider;

        if (providerId) {
          const provider = mockLLMProviders.find((p) => p.id === providerId);
          return provider?.models || [];
        }

        return mockLLMProviders.flatMap((p) => p.models);
      });

      // Chat streaming endpoint
      this.post('/api/chat/stream', async (schema, request) => {
        console.log('🎯 Mock streaming endpoint called');

        const attrs = JSON.parse(request.requestBody);
        const userMessage = attrs.message;
        const provider = attrs.provider || 'openai';
        const model = attrs.model || 'gpt-4-turbo';

        console.log('📝 Streaming request:', { userMessage, provider, model });

        const response = generateMockResponse(userMessage);

        console.log('📤 Returning streaming response');

        return {
          content: response,
          role: 'assistant',
          timestamp: new Date().toISOString(),
          isStreaming: true,
        };
      });

      // Workspace endpoints
      this.get('/workspaces', async () => {
        await delay(mockConfig.delays.workspaces);
        return mockWorkspaces;
      });

      this.get('/workspaces/:id', async (schema, request) => {
        await delay(mockConfig.delays.workspace);
        const workspace = mockWorkspaces.find((w) => w.id === request.params.id);
        return workspace || new Response(404, {}, { message: 'Workspace não encontrado' });
      });

      this.post('/workspaces', async (schema, request) => {
        await delay(mockConfig.delays.workspaces);
        const attrs = JSON.parse(request.requestBody);

        const newWorkspace = {
          id: generateId(),
          name: attrs.name,
          description: attrs.description || '',
          ownerId: '1',
          settings: {
            isPublic: false,
            allowInvites: true,
            defaultRole: 'viewer' as const,
            allowedDomains: [],
            features: {
              aiAnalysis: true,
              documentVersioning: true,
              advancedSearch: true,
              bulkOperations: false,
              apiAccess: false,
              ssoIntegration: false,
            },
          },
          stats: {
            totalDocuments: 0,
            totalSize: 0,
            totalMembers: 1,
            totalProjects: 0,
            documentsThisMonth: 0,
            storageUsed: 0,
            storageLimit: 1073741824, // 1GB
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isArchived: false,
          memberCount: 1,
          projectCount: 0,
          documentCount: 0,
        };

        return newWorkspace;
      });

      this.get('/workspaces/:workspaceId/projects', async (schema, request) => {
        await delay(mockConfig.delays.workspaces);
        const { queryParams } = request;
        const limit = parseInt(queryParams.limit) || 20;
        const offset = parseInt(queryParams.offset) || 0;

        const paginatedResponse = createPaginatedResponse(mockProjects, limit, offset);
        return {
          projects: paginatedResponse.data,
          total: paginatedResponse.pagination.total,
          hasMore: paginatedResponse.pagination.hasMore,
        };
      });

      // File upload mock
      this.post('/chat/upload', async () => {
        await delay(mockConfig.delays.upload);
        return createMockUploadResponse();
      });

      // AI Agents endpoints
      this.get('/agents', async () => {
        await delay(mockConfig.delays.agents);
        return { data: mockAgents };
      });

      this.get('/agents/:id', async (schema, request) => {
        await delay(mockConfig.delays.agents);
        const agent = mockAgents.find((a) => a.id === request.params.id);
        return agent
          ? { data: agent }
          : new Response(404, {}, { message: 'Agent não encontrado' });
      });

      this.post('/agents/conversations', async (schema, request) => {
        await delay(mockConfig.delays.agentConversations);
        const attrs = JSON.parse(request.requestBody);

        const newConversation = {
          id: generateId(),
          agentId: attrs.agentId,
          workspaceId: attrs.workspaceId,
          title:
            attrs.title ||
            `Conversa com ${mockAgents.find((a) => a.id === attrs.agentId)?.name}`,
          messages: [],
          status: 'active' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        return { data: newConversation };
      });

      this.get('/agents/conversations/:conversationId', async (schema, request) => {
        await delay(mockConfig.delays.agents);
        const conversation = mockAgentConversations.find(
          (c) => c.id === request.params.conversationId
        );
        return conversation
          ? { data: conversation }
          : new Response(404, {}, { message: 'Conversa não encontrada' });
      });

      this.post('/agents/conversations/:conversationId/messages', async () => {
        await delay(mockConfig.delays.agentConversations);

        const agentMessage = {
          id: generateId(),
          type: 'agent' as const,
          content:
            'Entendi sua solicitação. Vou processar os documentos e criar o resultado que você precisa. Isso pode levar alguns minutos.',
          timestamp: new Date(Date.now() + 1000).toISOString(),
          agentId: 'presentation-expert',
          actions: [
            {
              id: generateId(),
              type: 'file_creation' as const,
              title: 'Criando apresentação...',
              description: 'Analisando documentos e criando slides profissionais',
              status: 'processing' as const,
              progress: 0,
              startedAt: new Date().toISOString(),
            },
          ],
        };

        return {
          data: {
            message: agentMessage,
            actions: agentMessage.actions,
          },
        };
      });

      this.post('/agents/tasks', async (schema, request) => {
        await delay(mockConfig.delays.agentTasks);
        const attrs = JSON.parse(request.requestBody);

        const newTask = createMockTask(
          attrs.agentId,
          attrs.workspaceId,
          attrs.prompt,
          attrs.priority
        );

        return { data: newTask };
      });

      this.get('/agents/tasks/:taskId', async (schema, request) => {
        await delay(mockConfig.delays.agents);
        const mockTask = createCompletedTask(request.params.taskId);
        return { data: mockTask };
      });

      this.post('/agents/tasks/:taskId/cancel', async (schema, request) => {
        await delay(mockConfig.delays.agents);
        return {
          data: {
            success: true,
            message: `Task ${request.params.taskId} cancelled successfully`,
          },
        };
      });

      this.post('/agents/tasks/:taskId/retry', async (schema, request) => {
        await delay(mockConfig.delays.agentConversations);
        const retryTask = createMockTask('presentation-expert', 'ws-1', 'Retrying previous task');
        retryTask.id = request.params.taskId;
        return { data: retryTask };
      });

      this.get('/agents/tasks', async (schema, request) => {
        await delay(mockConfig.delays.members);
        const { queryParams } = request;
        const limit = parseInt(queryParams.limit) || 10;
        const offset = parseInt(queryParams.offset) || 0;

        const paginatedResponse = createPaginatedResponse(mockAgentTasks, limit, offset);
        return {
          tasks: paginatedResponse.data,
          usage: {
            totalTasks: mockAgentTasks.length,
            completedTasks: mockAgentTasks.filter((t) => t.status === 'completed').length,
            failedTasks: mockAgentTasks.filter((t) => t.status === 'failed').length,
            totalFileSize: 15728640, // 15MB
          },
          pagination: paginatedResponse.pagination,
        };
      });

      this.get('/agents/conversations', async (schema, request) => {
        await delay(mockConfig.delays.members);
        const { queryParams } = request;
        const limit = parseInt(queryParams.limit) || 10;
        const offset = parseInt(queryParams.offset) || 0;

        const paginatedResponse = createPaginatedResponse(
          mockAgentConversations,
          limit,
          offset
        );
        return { data: paginatedResponse.data };
      });

      this.get('/agents/usage/:workspaceId', async () => {
        await delay(mockConfig.delays.agentUsage);
        return { data: createUsageResponse() };
      });

      this.post('/agents/feedback', async () => {
        await delay(200);
        return { data: { success: true } };
      });

      // Fallback for unmatched requests - temporarily disabled for debugging
      // this.passthrough((request) => {
      //   if (request.url.includes(config.API_BASE_URL)) {
      //     console.warn(`Mock server: Unhandled ${request.method} ${request.url}`);
      //   }
      //   return true;
      // });
    },
  });
}

// Utility function to check if mock server should be enabled
export const shouldUseMockServer = (): boolean => {
  // For production demo, always enable mock server
  return true;
  // const result =
  //   import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_SERVER === 'true';
  // return result;
};

export default createMockServer;