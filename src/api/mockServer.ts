import { createServer, Response } from 'miragejs';

// Function to generate varied mock responses
const generateMockResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase();

  // Programming/Technical questions
  if (message.includes('código') || message.includes('programar') || message.includes('javascript') || message.includes('react') || message.includes('typescript')) {
    return `Claro! Vou te ajudar com programação. 💻

**Sobre ${message.includes('react') ? 'React' : message.includes('javascript') ? 'JavaScript' : message.includes('typescript') ? 'TypeScript' : 'programação'}:**

\`\`\`javascript
// Exemplo prático
const exemplo = () => {
  console.log('Olá, mundo!');
  return 'Código funcionando!';
};
\`\`\`

**Principais conceitos:**

1. **Sintaxe**: Estrutura básica da linguagem
2. **Variáveis**: Armazenamento de dados
3. **Funções**: Blocos de código reutilizáveis
4. **Objetos**: Estruturas de dados complexas

**Dicas importantes:**
- 🎯 Pratique regularmente
- 📚 Leia a documentação oficial
- 🔍 Use ferramentas de debug
- 🤝 Participe da comunidade

Precisa de ajuda com algum código específico?`;
  }

  // Business/Strategy questions
  if (message.includes('negócio') || message.includes('empresa') || message.includes('estratégia') || message.includes('marketing')) {
    return `Excelente pergunta sobre negócios! 📈

**Análise estratégica:**

**Pontos-chave para considerar:**

1. **Mercado-alvo**: Quem são seus clientes ideais?
2. **Proposta de valor**: O que te diferencia da concorrência?
3. **Modelo de receita**: Como você vai monetizar?
4. **Recursos necessários**: Que investimentos são precisos?

**Métricas importantes:**
- 💰 **ROI**: Retorno sobre investimento
- 📊 **CAC**: Custo de aquisição de cliente
- 🔄 **LTV**: Valor do tempo de vida do cliente
- 📈 **Growth Rate**: Taxa de crescimento

**Próximos passos sugeridos:**
- Validar hipóteses com dados reais
- Criar um MVP (Produto Mínimo Viável)
- Testar com um grupo pequeno de usuários
- Iterar baseado no feedback

Quer discutir algum aspecto específico do seu negócio?`;
  }

  // AI/Technology questions
  if (message.includes('ia') || message.includes('inteligência artificial') || message.includes('machine learning') || message.includes('chatbot')) {
    return `Ótima pergunta sobre IA! 🤖

**O mundo da Inteligência Artificial:**

A IA está revolucionando como interagimos com a tecnologia. Aqui estão os principais conceitos:

**Tipos de IA:**

1. **IA Generativa**: Como ChatGPT, Claude, Gemini
   - Gera texto, código, imagens
   - Baseada em Large Language Models (LLMs)

2. **Machine Learning**: Aprendizado automático
   - Supervised Learning
   - Unsupervised Learning
   - Reinforcement Learning

3. **Deep Learning**: Redes neurais profundas
   - Processamento de linguagem natural
   - Visão computacional
   - Reconhecimento de padrões

**Aplicações práticas:**
- 🎨 **Criação de conteúdo**: Textos, imagens, vídeos
- 🔍 **Análise de dados**: Insights e previsões
- 🤖 **Automação**: Processos e tarefas repetitivas
- 💬 **Assistentes virtuais**: Como eu!

**Tendências futuras:**
- Modelos multimodais (texto + imagem + áudio)
- IA mais eficiente e sustentável
- Integração com IoT e robótica

Que aspecto da IA te interessa mais?`;
  }

  // Help/Tutorial questions
  if (message.includes('ajuda') || message.includes('como') || message.includes('tutorial') || message.includes('ensinar')) {
    return `Claro! Estou aqui para ajudar! 🙋‍♂️

**Como posso te auxiliar:**

**Áreas de expertise:**
- 💻 **Programação**: JavaScript, React, TypeScript, Python
- 🎨 **Design**: UI/UX, prototipagem, design systems
- 📊 **Dados**: Análise, visualização, dashboards
- 🚀 **Negócios**: Estratégia, marketing, growth hacking
- 🤖 **IA**: Machine learning, automação, chatbots

**Formato das respostas:**
- Explicações passo a passo
- Exemplos práticos e código
- Recursos para aprofundamento
- Dicas e melhores práticas

**Dicas para perguntas mais eficazes:**
1. **Seja específico**: "Como criar um componente React" vs "Como programar"
2. **Contexto**: Mencione seu nível de experiência
3. **Objetivo**: O que você quer alcançar
4. **Restrições**: Tecnologias, tempo, orçamento

**Exemplos de perguntas:**
- "Como implementar autenticação em React?"
- "Qual a melhor estratégia de SEO para e-commerce?"
- "Como analisar dados de vendas no Excel?"

O que você gostaria de aprender hoje?`;
  }

  // Greeting/General questions
  if (message.includes('olá') || message.includes('oi') || message.includes('bom dia') || message.includes('boa tarde') || message.includes('boa noite')) {
    return `Olá! Muito prazer em conversar com você! 👋

**Bem-vindo ao Cognit Studio!**

Sou seu assistente de IA e estou aqui para ajudar com uma ampla variedade de tópicos:

**O que posso fazer por você:**

🎯 **Responder perguntas** sobre tecnologia, negócios, programação e muito mais

💡 **Dar sugestões** e ideias criativas para seus projetos

📝 **Ajudar com textos** - escrever, revisar, melhorar conteúdo

🔍 **Analisar problemas** e propor soluções práticas

📊 **Explicar conceitos** complexos de forma simples

**Recursos especiais:**
- Respostas com formatação rica (listas, código, tabelas)
- Explicações passo a passo
- Exemplos práticos
- Links e recursos úteis

**Dica:** Seja específico nas suas perguntas para respostas mais precisas!

Em que posso te ajudar hoje? 😊`;
  }

  // Default response for other topics
  return `Interessante pergunta! Vou fazer o meu melhor para te ajudar. 🤔

**Sobre "${userMessage}":**

Baseado na sua pergunta, posso oferecer algumas perspectivas:

**Análise inicial:**
- Este é um tópico que pode ter várias abordagens
- É importante considerar o contexto específico
- Existem diferentes escolas de pensamento sobre isso

**Pontos importantes a considerar:**

1. **Contexto**: Qual é a situação específica?
2. **Objetivos**: O que você espera alcançar?
3. **Recursos**: Que ferramentas/tempo você tem disponível?
4. **Restrições**: Existem limitações a considerar?

**Sugestões gerais:**
- 🔍 Pesquise fontes confiáveis sobre o assunto
- 💬 Converse com especialistas na área
- 🧪 Teste diferentes abordagens em pequena escala
- 📊 Meça resultados e ajuste conforme necessário

**Próximos passos:**
- Defina objetivos claros
- Crie um plano de ação
- Implemente gradualmente
- Monitore e ajuste

Você poderia me dar mais detalhes sobre o contexto? Assim posso oferecer uma resposta mais específica e útil! 😊`;
};

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

// Mock Agents data
const mockAgents = [
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

const mockAgentTasks = [
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

const mockAgentConversations = [
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
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const generateId = () => Math.random().toString(36).substr(2, 9);

export function createMockServer() {
  // Allow mock server in production for demo/testing purposes
  // if (import.meta.env.PROD) {
  //   return; // Don't create mock server in production
  // }

  return createServer({
    routes() {
      // Configure namespace to match API base URL
      this.namespace = '';
      this.timing = 400; // Add some realistic delay

      // Auth endpoints - simple direct approach
      this.post('/auth/login', async (schema, request) => {
        await delay(800); // Simulate network delay
        const attrs = JSON.parse(request.requestBody);

        // Support demo users
        const demoUsers = [
          {
            email: 'ricardo@cognit.com',
            password: 'demo-sso-token',
            user: mockUsers[0],
          },
          {
            email: 'ana@cognit.com',
            password: 'demo-sso-token',
            user: mockUsers[1],
          },
          {
            email: 'carlos@cognit.com',
            password: 'demo-sso-token',
            user: mockUsers[2],
          },
          {
            email: 'joao@example.com',
            password: 'password',
            user: mockUsers[3],
          }, // Legacy support
        ];

        const validUser = demoUsers.find(
          (u) => u.email === attrs.email && u.password === attrs.password
        );

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

      // Google OAuth endpoint
      this.post('/auth/google', async (schema, request) => {
        await delay(500);
        const attrs = JSON.parse(request.requestBody);

        // For demo purposes, any Google token works
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
        await delay(300);
        return new Response(
          200,
          {},
          { message: 'Logout realizado com sucesso' }
        );
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
          hasMore: offset + limit < mockConversations.length,
        };
      });

      this.get('/chat/conversations/:id', async (schema, request) => {
        await delay(400);
        const conversation = mockConversations.find(
          (c) => c.id === request.params.id
        );
        return (
          conversation ||
          new Response(404, {}, { message: 'Conversa não encontrada' })
        );
      });

      this.post('/chat/message', async (schema, request) => {
        await delay(1200); // Simulate AI processing time

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
        await delay(300);
        return mockLLMProviders;
      });

      this.get('/chat/models', async (schema, request) => {
        await delay(300);
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

        // Generate varied responses based on user message
        const response = generateMockResponse(userMessage);

        console.log('📤 Returning streaming response');

        // Para compatibilidade com Mirage.js, vamos retornar uma resposta que simula streaming
        // mas na verdade retorna o texto completo para que o efeito de digitação seja aplicado no frontend
        return {
          content: response,
          role: 'assistant',
          timestamp: new Date().toISOString(),
          isStreaming: true
        };
      });

      // Workspace endpoints
      this.get('/workspaces', async () => {
        await delay(500);
        return mockWorkspaces;
      });

      this.get('/workspaces/:id', async (schema, request) => {
        await delay(400);
        const workspace = mockWorkspaces.find(
          (w) => w.id === request.params.id
        );
        return (
          workspace ||
          new Response(404, {}, { message: 'Workspace não encontrado' })
        );
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
          hasMore: offset + limit < mockProjects.length,
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

      // AI Agents endpoints
      this.get('/agents', async () => {
        await delay(300);
        return { data: mockAgents };
      });

      this.get('/agents/:id', async (schema, request) => {
        await delay(300);
        const agent = mockAgents.find((a) => a.id === request.params.id);
        return agent
          ? { data: agent }
          : new Response(404, {}, { message: 'Agent não encontrado' });
      });

      this.post('/agents/conversations', async (schema, request) => {
        await delay(500);
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

      this.get(
        '/agents/conversations/:conversationId',
        async (schema, request) => {
          await delay(300);
          const conversation = mockAgentConversations.find(
            (c) => c.id === request.params.conversationId
          );
          return conversation
            ? { data: conversation }
            : new Response(404, {}, { message: 'Conversa não encontrada' });
        }
      );

      this.post('/agents/conversations/:conversationId/messages', async () => {
        await delay(800);

        // Simulate agent response
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
              description:
                'Analisando documentos e criando slides profissionais',
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
        await delay(600);
        const attrs = JSON.parse(request.requestBody);

        const newTask = {
          id: generateId(),
          agentId: attrs.agentId,
          workspaceId: attrs.workspaceId,
          title:
            attrs.prompt.substring(0, 50) +
            (attrs.prompt.length > 50 ? '...' : ''),
          description: attrs.prompt,
          status: 'processing' as const,
          priority: attrs.priority || ('medium' as const),
          input: {
            prompt: attrs.prompt,
            documentIds: attrs.documentIds || [],
            parameters: attrs.parameters || {},
          },
          progress: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        return { data: newTask };
      });

      this.get('/agents/tasks/:taskId', async (schema, request) => {
        await delay(300);

        // Simulate task progression
        const mockTask = {
          id: request.params.taskId,
          agentId: 'presentation-expert',
          workspaceId: 'ws-1',
          title: 'Apresentação sobre IA',
          description:
            'Criar uma apresentação profissional sobre inteligência artificial',
          status: 'completed' as const,
          priority: 'medium' as const,
          input: {
            prompt:
              'Criar uma apresentação profissional sobre inteligência artificial',
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
                description:
                  'Apresentação de 15 slides sobre IA com gráficos e insights',
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
        };

        return { data: mockTask };
      });

      this.post('/agents/tasks/:taskId/cancel', async (schema, request) => {
        await delay(300);
        return {
          data: {
            success: true,
            message: `Task ${request.params.taskId} cancelled successfully`,
          },
        };
      });

      this.post('/agents/tasks/:taskId/retry', async (schema, request) => {
        await delay(500);
        const retryTask = {
          id: request.params.taskId,
          agentId: 'presentation-expert',
          workspaceId: 'ws-1',
          title: 'Retrying task...',
          description: 'Task is being retried',
          status: 'processing' as const,
          priority: 'medium' as const,
          input: {
            prompt: 'Retrying previous task',
            documentIds: [],
            parameters: {},
          },
          progress: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return { data: retryTask };
      });

      this.get('/agents/tasks', async (schema, request) => {
        await delay(400);
        const { queryParams } = request;
        const limit = parseInt(queryParams.limit) || 10;
        const offset = parseInt(queryParams.offset) || 0;

        return {
          tasks: mockAgentTasks.slice(offset, offset + limit),
          usage: {
            totalTasks: mockAgentTasks.length,
            completedTasks: mockAgentTasks.filter(
              (t) => t.status === 'completed'
            ).length,
            failedTasks: mockAgentTasks.filter((t) => t.status === 'failed')
              .length,
            totalFileSize: 15728640, // 15MB
          },
          pagination: {
            total: mockAgentTasks.length,
            page: Math.floor(offset / limit) + 1,
            limit,
            hasMore: offset + limit < mockAgentTasks.length,
          },
        };
      });

      this.get('/agents/conversations', async (schema, request) => {
        await delay(400);
        const { queryParams } = request;
        const limit = parseInt(queryParams.limit) || 10;
        const offset = parseInt(queryParams.offset) || 0;

        return { data: mockAgentConversations.slice(offset, offset + limit) };
      });

      this.get('/agents/usage/:workspaceId', async () => {
        await delay(300);

        return {
          data: {
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
              start: new Date(
                Date.now() - 30 * 24 * 60 * 60 * 1000
              ).toISOString(),
              end: new Date().toISOString(),
            },
          },
        };
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
