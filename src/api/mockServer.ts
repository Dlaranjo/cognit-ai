import { createServer, Response } from 'miragejs';

// Mock data
const mockUsers = [
  {
    id: '1',
    name: 'Ricardo Almeida',
    email: 'ricardo@cognit.com',
    avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=ricardo',
    role: 'admin' as const,
    isEmailVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    preferences: {
      theme: 'light' as const,
      language: 'pt' as const,
      notifications: {
        email: true,
        push: true,
        marketing: false,
      },
    },
  },
  {
    id: '2',
    name: 'Ana Silva',
    email: 'ana@cognit.com',
    avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=ana',
    role: 'user' as const,
    isEmailVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    preferences: {
      theme: 'light' as const,
      language: 'pt' as const,
      notifications: {
        email: true,
        push: true,
        marketing: false,
      },
    },
  },
  {
    id: '3',
    name: 'Carlos Santos',
    email: 'carlos@cognit.com',
    avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=carlos',
    role: 'user' as const,
    isEmailVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    preferences: {
      theme: 'light' as const,
      language: 'pt' as const,
      notifications: {
        email: true,
        push: true,
        marketing: false,
      },
    },
  },
  {
    id: '4',
    name: 'João Silva',
    email: 'joao@example.com',
    avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=joao',
    role: 'admin' as const,
    isEmailVerified: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    preferences: {
      theme: 'light' as const,
      language: 'pt' as const,
      notifications: {
        email: true,
        push: true,
        marketing: false,
      },
    },
  },
];

const mockConversations = [
  {
    id: '1',
    title: 'Como implementar autenticação JWT?',
    messages: [
      {
        id: '1',
        content: 'Como implementar autenticação JWT em React?',
        role: 'user' as const,
        timestamp: '2024-01-01T10:00:00Z',
        conversationId: '1',
      },
      {
        id: '2',
        content: 'Para implementar autenticação JWT em React, você pode seguir estes passos:\n\n1. Instalar dependências necessárias\n2. Configurar Axios interceptors\n3. Criar hooks personalizados\n4. Implementar guards de rota',
        role: 'assistant' as const,
        timestamp: '2024-01-01T10:00:30Z',
        conversationId: '1',
        provider: 'openai',
        model: 'gpt-4-turbo',
        tokens: { prompt: 150, completion: 200, total: 350 },
        cost: 0.0052,
      },
    ],
    provider: 'openai',
    model: 'gpt-4-turbo',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:30Z',
    isFavorite: false,
    tags: ['desenvolvimento', 'autenticação'],
    totalTokens: 350,
    totalCost: 0.0052,
    lastMessageAt: '2024-01-01T10:00:30Z',
    messageCount: 2,
  },
];

const mockWorkspaces = [
  {
    id: '1',
    name: 'Meu Workspace Principal',
    description: 'Workspace para desenvolvimento de projetos React',
    ownerId: '1',
    settings: {
      isPublic: false,
      allowInvites: true,
      defaultRole: 'viewer' as const,
      documentRetentionDays: 365,
      allowedDomains: ['company.com'],
      features: {
        aiAnalysis: true,
        documentVersioning: true,
        advancedSearch: true,
        bulkOperations: true,
        apiAccess: true,
        ssoIntegration: false,
      },
    },
    stats: {
      totalDocuments: 25,
      totalSize: 52428800, // 50MB
      totalMembers: 3,
      totalProjects: 5,
      documentsThisMonth: 8,
      storageUsed: 52428800,
      storageLimit: 1073741824, // 1GB
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    isArchived: false,
    memberCount: 3,
    projectCount: 5,
    documentCount: 25,
  },
];

const mockProjects = [
  {
    id: '1',
    name: 'Sistema de Autenticação',
    description: 'Documentação e implementação do sistema de autenticação',
    workspaceId: '1',
    status: 'active' as const,
    tags: ['autenticação', 'segurança'],
    createdBy: '1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    documentCount: 12,
    collaborators: [
      {
        userId: '1',
        role: 'owner' as const,
        addedAt: '2024-01-01T00:00:00Z',
        user: {
          id: '1',
          name: 'João Silva',
          email: 'joao@example.com',
          avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=joao',
        },
      },
    ],
    settings: {
      isPublic: false,
      allowComments: true,
      autoArchive: false,
      notificationSettings: {
        onNewDocument: true,
        onDocumentUpdate: true,
        onComments: true,
      },
    },
  },
];

const mockLLMProviders = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'Advanced language models from OpenAI',
    isAvailable: true,
    models: [
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        description: 'Most capable GPT-4 model',
        providerId: 'openai',
        contextLength: 128000,
        inputCostPer1kTokens: 0.01,
        outputCostPer1kTokens: 0.03,
        isAvailable: true,
        supportedFeatures: [
          { name: 'text', supported: true },
          { name: 'vision', supported: true },
          { name: 'function_calling', supported: true },
        ],
        parameters: {
          temperature: { min: 0, max: 2, default: 1, step: 0.1 },
          maxTokens: { min: 1, max: 4096, default: 1000 },
          topP: { min: 0, max: 1, default: 1, step: 0.1 },
        },
      },
    ],
    supportedFeatures: ['text', 'vision', 'function_calling'],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude family of models',
    isAvailable: true,
    models: [
      {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        description: 'Most capable Claude model',
        providerId: 'anthropic',
        contextLength: 200000,
        inputCostPer1kTokens: 0.015,
        outputCostPer1kTokens: 0.075,
        isAvailable: true,
        supportedFeatures: [
          { name: 'text', supported: true },
          { name: 'vision', supported: true },
        ],
        parameters: {
          temperature: { min: 0, max: 1, default: 0.7, step: 0.1 },
          maxTokens: { min: 1, max: 4096, default: 1000 },
          topP: { min: 0, max: 1, default: 1, step: 0.1 },
        },
      },
    ],
    supportedFeatures: ['text', 'vision'],
  },
];

// Helper functions
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const generateId = () => Math.random().toString(36).substr(2, 9);

export function createMockServer() {
  if (import.meta.env.PROD) {
    return; // Don't create mock server in production
  }

  return createServer({
    routes() {
      // Configure for test/development environment
      this.urlPrefix = 'http://localhost:3001';
      this.namespace = '';  // No namespace to match direct API calls

      console.log('🎭 Mirage server configuring routes...');

      // Auth endpoints - simple direct approach
      this.post('/auth/login', async (schema, request) => {
        console.log('🎯 Mirage intercepted login request:', request.requestBody);
        await delay(800); // Simulate network delay
        const attrs = JSON.parse(request.requestBody);

        // Support demo users
        const demoUsers = [
          { email: 'ricardo@cognit.com', password: 'demo-sso-token', user: mockUsers[0] },
          { email: 'ana@cognit.com', password: 'demo-sso-token', user: mockUsers[1] },
          { email: 'carlos@cognit.com', password: 'demo-sso-token', user: mockUsers[2] },
          { email: 'joao@example.com', password: 'password', user: mockUsers[3] } // Legacy support
        ];

        const validUser = demoUsers.find(u => u.email === attrs.email && u.password === attrs.password);

        if (validUser) {
          return {
            user: validUser.user,
            token: 'mock-jwt-token',
            refreshToken: 'mock-refresh-token',
            expiresIn: 3600,
          };
        }

        return new Response(400, {}, { message: 'Credenciais inválidas' });
      });

      console.log('🎭 Mirage registered login route');

      this.post('/auth/logout', async () => {
        await delay(300);
        return new Response(200, {}, { message: 'Logout realizado com sucesso' });
      });

      this.post('/auth/refresh', async () => {
        await delay(500);
        return {
          token: 'new-mock-jwt-token',
          refreshToken: 'new-mock-refresh-token',
          expiresIn: 3600,
        };
      });

      this.get('/auth/validate', async () => {
        await delay(300);
        return mockUsers[0];
      });

      this.get('/auth/profile', async () => {
        await delay(400);
        return mockUsers[0];
      });

      // Chat endpoints
      this.get('/chat/conversations', async (schema, request) => {
        await delay(600);
        const { queryParams } = request;
        const limit = parseInt(queryParams.limit) || 50;
        const offset = parseInt(queryParams.offset) || 0;
        
        return {
          conversations: mockConversations.slice(offset, offset + limit),
          total: mockConversations.length,
          hasMore: (offset + limit) < mockConversations.length,
        };
      });

      this.get('/chat/conversations/:id', async (schema, request) => {
        await delay(400);
        const conversation = mockConversations.find(c => c.id === request.params.id);
        return conversation || new Response(404, {}, { message: 'Conversa não encontrada' });
      });

      this.post('/chat/message', async (schema, request) => {
        await delay(1200); // Simulate AI processing time
        
        const formData = request.requestBody as FormData;
        const content = formData.get('content') as string;
        const provider = formData.get('provider') as string;
        const model = formData.get('model') as string;
        
        const newMessage = {
          id: generateId(),
          content: `Esta é uma resposta simulada para: "${content}"\n\nO mock server está funcionando corretamente com o provider ${provider} e modelo ${model}.`,
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
        await delay(300);
        return mockLLMProviders;
      });

      this.get('/chat/models', async (schema, request) => {
        await delay(300);
        const { queryParams } = request;
        const providerId = queryParams.provider;
        
        if (providerId) {
          const provider = mockLLMProviders.find(p => p.id === providerId);
          return provider?.models || [];
        }
        
        return mockLLMProviders.flatMap(p => p.models);
      });

      // Workspace endpoints
      this.get('/workspaces', async () => {
        await delay(500);
        return mockWorkspaces;
      });

      this.get('/workspaces/:id', async (schema, request) => {
        await delay(400);
        const workspace = mockWorkspaces.find(w => w.id === request.params.id);
        return workspace || new Response(404, {}, { message: 'Workspace não encontrado' });
      });

      this.post('/workspaces', async (schema, request) => {
        await delay(800);
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
        await delay(500);
        const { queryParams } = request;
        const limit = parseInt(queryParams.limit) || 20;
        const offset = parseInt(queryParams.offset) || 0;
        
        return {
          projects: mockProjects.slice(offset, offset + limit),
          total: mockProjects.length,
          hasMore: (offset + limit) < mockProjects.length,
        };
      });

      // File upload mock
      this.post('/chat/upload', async () => {
        await delay(2000); // Simulate file upload time
        
        return {
          id: generateId(),
          name: 'documento-exemplo.pdf',
          type: 'application/pdf',
          size: 1024768,
          url: 'https://example.com/files/documento-exemplo.pdf',
          thumbnailUrl: 'https://example.com/thumbnails/documento-exemplo.jpg',
        };
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
  const result = import.meta.env.DEV &&
         import.meta.env.VITE_USE_MOCK_SERVER === 'true';
  console.log('🔧 shouldUseMockServer:', result, 'DEV:', import.meta.env.DEV, 'VITE_USE_MOCK_SERVER:', import.meta.env.VITE_USE_MOCK_SERVER);
  return result;
};

export default createMockServer;