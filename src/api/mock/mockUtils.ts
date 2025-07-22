// Helper functions for mock server

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock server configuration
export const mockConfig = {
  defaultTiming: 400, // Default delay for API responses
  delays: {
    login: 800,
    logout: 300,
    refresh: 500,
    validate: 300,
    profile: 400,
    conversations: 600,
    conversation: 400,
    message: 1200,
    providers: 300,
    models: 300,
    streaming: 0, // No delay for streaming
    workspaces: 500,
    workspace: 400,
    projects: 500,
    members: 400,
    upload: 2000,
    agents: 300,
    agentConversations: 500,
    agentTasks: 600,
    agentUsage: 300,
  },
} as const;

// Demo users for authentication
export const demoUsers = [
  {
    email: 'ricardo@cognit.com',
    password: 'demo-sso-token',
    userIndex: 0,
  },
  {
    email: 'ana@cognit.com',
    password: 'demo-sso-token',
    userIndex: 1,
  },
  {
    email: 'carlos@cognit.com',
    password: 'demo-sso-token',
    userIndex: 2,
  },
  {
    email: 'joao@example.com',
    password: 'password',
    userIndex: 3,
  }, // Legacy support
];

// Response helpers
export const createSuccessResponse = <T>(data: T) => ({
  data,
  success: true,
  timestamp: new Date().toISOString(),
});

export const createErrorResponse = (message: string, status: number = 400) => ({
  error: {
    message,
    status,
    timestamp: new Date().toISOString(),
  },
  success: false,
});

// Pagination helpers
export const createPaginatedResponse = <T>(
  items: T[],
  limit: number = 50,
  offset: number = 0
) => ({
  data: items.slice(offset, offset + limit),
  pagination: {
    total: items.length,
    limit,
    offset,
    hasMore: offset + limit < items.length,
    page: Math.floor(offset / limit) + 1,
    totalPages: Math.ceil(items.length / limit),
  },
});

// Usage analytics helper
export const createUsageResponse = () => ({
  totalTasks: 45,
  completedTasks: 38,
  failedTasks: 2,
  totalFileSize: 52428800, // 50MB
  agentUsage: [
    {
      agentId: 'presentation-expert',
      agentName: 'Presentation Expert',
      totalRequests: 15,
      successRate: 93.3,
      avgResponseTime: 45000,
    },
    {
      agentId: 'document-analyst',
      agentName: 'Document Analyst',
      totalRequests: 12,
      successRate: 100,
      avgResponseTime: 32000,
    },
    {
      agentId: 'data-scientist',
      agentName: 'Data Scientist',
      totalRequests: 8,
      successRate: 87.5,
      avgResponseTime: 67000,
    },
  ],
  timeRange: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date().toISOString(),
  },
});

// Task simulation helpers
export const createMockTask = (
  agentId: string,
  workspaceId: string,
  prompt: string,
  priority: 'low' | 'medium' | 'high' = 'medium'
) => ({
  id: generateId(),
  agentId,
  workspaceId,
  title: prompt.substring(0, 50) + (prompt.length > 50 ? '...' : ''),
  description: prompt,
  status: 'processing' as const,
  priority,
  input: {
    prompt,
    documentIds: [],
    parameters: {},
  },
  progress: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const createCompletedTask = (taskId: string) => ({
  id: taskId,
  agentId: 'presentation-expert',
  workspaceId: 'ws-1',
  title: 'Apresentação sobre IA',
  description: 'Criar uma apresentação profissional sobre inteligência artificial',
  status: 'completed' as const,
  priority: 'medium' as const,
  input: {
    prompt: 'Criar uma apresentação profissional sobre inteligência artificial',
    documentIds: ['doc-1', 'doc-2'],
    parameters: {},
  },
  output: {
    files: [
      {
        id: generateId(),
        name: 'Apresentacao_IA.pptx',
        type: 'presentation' as const,
        format: 'pptx',
        size: 2048576,
        downloadUrl: '#download',
        previewUrl: '#preview',
        description: 'Apresentação de 15 slides sobre IA com gráficos e insights',
      },
    ],
    summary:
      'Apresentação criada com sucesso contendo 15 slides sobre inteligência artificial, incluindo conceitos básicos, aplicações e tendências futuras.',
    insights: [
      'Identificadas 3 principais tendências em IA para 2024',
      'Análise de 12 casos de uso práticos',
      'Gráficos de crescimento do mercado incluídos',
    ],
  },
  progress: 100,
  createdAt: new Date(Date.now() - 300000).toISOString(),
  updatedAt: new Date().toISOString(),
  completedAt: new Date().toISOString(),
});

// File upload mock helper
export const createMockUploadResponse = () => ({
  id: generateId(),
  name: 'documento-exemplo.pdf',
  type: 'application/pdf',
  size: 1024768,
  url: 'https://example.com/files/documento-exemplo.pdf',
  thumbnailUrl: 'https://example.com/thumbnails/documento-exemplo.jpg',
});