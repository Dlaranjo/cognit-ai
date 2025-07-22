// Mock data for all entities

export const mockUsers = [
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

export const mockAgents = [
  {
    id: 'presentation-expert',
    name: 'Presentation Expert',
    description:
      'Creates professional PowerPoint presentations from your documents and data',
    icon: 'presentation',
    color: 'from-orange-500 to-red-500',
    capabilities: [
      'PowerPoint Creation',
      'Slide Design',
      'Data Visualization',
      'Content Structuring',
    ],
    examples: [
      'Create a presentation about our Q4 results',
      'Build slides summarizing the AI research findings',
      'Make a pitch deck for the new product launch',
    ],
    category: 'presentation' as const,
    isActive: true,
    usage: {
      totalRequests: 15,
      successRate: 93.3,
      avgResponseTime: 45000,
    },
  },
  {
    id: 'document-analyst',
    name: 'Document Analyst',
    description:
      'Analyzes documents, extracts insights, and provides comprehensive summaries',
    icon: 'file-text',
    color: 'from-blue-500 to-indigo-500',
    capabilities: [
      'Document Analysis',
      'Content Extraction',
      'Insight Generation',
      'Summarization',
    ],
    examples: [
      'Analyze the contract terms and highlight key points',
      'Summarize all research papers in the ML workspace',
      'Extract action items from meeting notes',
    ],
    category: 'analysis' as const,
    isActive: true,
    usage: {
      totalRequests: 12,
      successRate: 100,
      avgResponseTime: 32000,
    },
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    description:
      'Processes data, creates visualizations, and generates analytical reports',
    icon: 'bar-chart-3',
    color: 'from-green-500 to-emerald-500',
    capabilities: [
      'Data Analysis',
      'Statistical Modeling',
      'Visualization',
      'Report Generation',
    ],
    examples: [
      'Create charts from the sales data spreadsheet',
      'Analyze user behavior patterns',
      'Generate a data quality report',
    ],
    category: 'data' as const,
    isActive: true,
    usage: {
      totalRequests: 8,
      successRate: 87.5,
      avgResponseTime: 67000,
    },
  },
  {
    id: 'code-assistant',
    name: 'Code Assistant',
    description:
      'Reviews code, generates documentation, and creates technical specifications',
    icon: 'code',
    color: 'from-purple-500 to-pink-500',
    capabilities: [
      'Code Review',
      'Documentation',
      'API Specs',
      'Technical Writing',
    ],
    examples: [
      'Generate API documentation from the codebase',
      'Review the authentication module',
      'Create technical specifications for the new feature',
    ],
    category: 'code' as const,
    isActive: true,
    usage: {
      totalRequests: 6,
      successRate: 83.3,
      avgResponseTime: 52000,
    },
  },
  {
    id: 'content-writer',
    name: 'Content Writer',
    description: 'Creates engaging content, reports, and marketing materials',
    icon: 'pen-tool',
    color: 'from-teal-500 to-cyan-500',
    capabilities: [
      'Content Creation',
      'Copywriting',
      'Report Writing',
      'Marketing Materials',
    ],
    examples: [
      'Write a blog post about our latest features',
      'Create marketing copy for the product launch',
      'Draft a comprehensive project report',
    ],
    category: 'content' as const,
    isActive: true,
    usage: {
      totalRequests: 4,
      successRate: 100,
      avgResponseTime: 38000,
    },
  },
];

export const mockAgentTasks = [
  {
    id: 'task-1',
    agentId: 'presentation-expert',
    workspaceId: 'ws-1',
    title: 'Criar apresentação Q4 2024',
    description:
      'Criar uma apresentação profissional sobre os resultados do Q4 2024 baseada nos relatórios financeiros',
    status: 'completed' as const,
    priority: 'high' as const,
    input: {
      prompt:
        'Criar uma apresentação profissional sobre os resultados do Q4 2024 baseada nos relatórios financeiros',
      documentIds: ['doc-1', 'doc-2', 'doc-3'],
      parameters: {},
    },
    output: {
      files: [
        {
          id: 'file-1',
          name: 'Q4_2024_Results.pptx',
          type: 'presentation' as const,
          format: 'pptx',
          size: 3145728,
          downloadUrl: '#download',
          previewUrl: '#preview',
          description: 'Apresentação de 18 slides com resultados Q4 2024',
        },
      ],
      summary:
        'Apresentação criada com 18 slides cobrindo receita, despesas, crescimento e projeções para 2025.',
      insights: [
        'Crescimento de 23% na receita comparado ao Q3',
        'Redução de 15% nos custos operacionais',
        'Meta de receita para 2025 estabelecida',
      ],
    },
    progress: 100,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    completedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'task-2',
    agentId: 'document-analyst',
    workspaceId: 'ws-1',
    title: 'Análise de contratos fornecedores',
    description:
      'Analisar 12 contratos de fornecedores e identificar pontos-chave e riscos',
    status: 'processing' as const,
    priority: 'medium' as const,
    input: {
      prompt:
        'Analisar 12 contratos de fornecedores e identificar pontos-chave e riscos',
      documentIds: Array.from({ length: 12 }, (_, i) => `contract-${i + 1}`),
      parameters: {},
    },
    progress: 67,
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
  },
  {
    id: 'task-3',
    agentId: 'data-scientist',
    workspaceId: 'ws-1',
    title: 'Dashboard de métricas de vendas',
    description:
      'Criar dashboard interativo com métricas de vendas dos últimos 6 meses',
    status: 'pending' as const,
    priority: 'low' as const,
    input: {
      prompt:
        'Criar dashboard interativo com métricas de vendas dos últimos 6 meses',
      documentIds: ['sales-data.xlsx'],
      parameters: { timeRange: '6months', includeForecasting: true },
    },
    progress: 0,
    createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
  },
];

export const mockAgentConversations = [
  {
    id: 'conv-1',
    agentId: 'presentation-expert',
    workspaceId: 'ws-1',
    title: 'Apresentação AI Research',
    messages: [
      {
        id: 'msg-1',
        type: 'user' as const,
        content: 'Preciso de uma apresentação sobre nossas pesquisas em IA',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        attachments: ['research-paper-1.pdf', 'research-paper-2.pdf'],
      },
      {
        id: 'msg-2',
        type: 'agent' as const,
        content:
          'Perfeito! Analisei os papers de pesquisa e vou criar uma apresentação abrangente. Incluirei os principais insights, metodologias e resultados.',
        timestamp: new Date(Date.now() - 3580000).toISOString(),
        agentId: 'presentation-expert',
        actions: [
          {
            id: 'action-1',
            type: 'file_creation' as const,
            title: 'AI_Research_Presentation.pptx',
            description:
              '15 slides cobrindo metodologias, resultados e insights',
            status: 'completed' as const,
            result: {
              id: 'file-pres-1',
              name: 'AI_Research_Presentation.pptx',
              type: 'presentation' as const,
              format: 'pptx',
              size: 2621440,
              downloadUrl: '#download',
              previewUrl: '#preview',
              description: '15 slides sobre pesquisa em IA',
            },
            progress: 100,
            startedAt: new Date(Date.now() - 3580000).toISOString(),
            completedAt: new Date(Date.now() - 3300000).toISOString(),
          },
        ],
      },
    ],
    status: 'completed' as const,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3300000).toISOString(),
  },
];

export const mockConversations = [
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
        content:
          'Para implementar autenticação JWT em React, você pode seguir estes passos:\n\n1. Instalar dependências necessárias\n2. Configurar Axios interceptors\n3. Criar hooks personalizados\n4. Implementar guards de rota',
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

export const mockWorkspaces = [
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

export const mockProjects = [
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

export const mockLLMProviders = [
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