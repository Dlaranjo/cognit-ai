# Claude Code - Diretrizes Técnicas para IA

## 🎯 Objetivo

Você é responsável por desenvolver e manter o **Cognit AI Platform** seguindo rigorosamente estas diretrizes técnicas. Este arquivo contém instruções específicas para assistentes de IA sobre como implementar código de qualidade enterprise.

> **📖 Referências Complementares**
>
> - `PRD.md`: Especificações funcionais e user stories
> - `PLANNING.md`: Visão estratégica e arquitetura do sistema
> - `TASKS.md`: Lista granular de tarefas para execução
> - `REFACTORING_CONTEXT.md`: **LEIA PRIMEIRO** - Contexto crítico para agentes

## 📊 Status do Projeto

### 🚨 **AUDITORIA ATOMIC DESIGN - VIOLAÇÕES CRÍTICAS IDENTIFICADAS**

**Data da Auditoria**: 21 de Julho de 2025  
**Status**: REFATORAÇÃO URGENTE NECESSÁRIA - Violações do Atomic Design

#### ❌ **PROBLEMA CRÍTICO DESCOBERTO**

**VIOLAÇÃO FUNDAMENTAL**: Componentes estão criando elementos UI específicos ao invés de compor atoms existentes, violando completamente os princípios do Atomic Design.

#### ❌ **Violações Identificadas na Auditoria**

**Molecules com UI Hardcoded:**
- ❌ `ModelSelector.tsx` - Dropdown hardcoded (linhas 72-169)
- ❌ `WorkspaceCard.tsx` - Card layout específico (linhas 44-104)  
- ❌ `MessageBubble.tsx` - Estrutura complexa hardcoded

**Organisms com Elementos Raw:**
- ❌ `Header.tsx` - Buttons `<button>` raw ao invés de Button atom
- ❌ `ChatInterface.tsx` - Textarea hardcoded ao invés de Input atom
- ❌ `ConversationList.tsx` - Elementos específicos hardcoded

**Atoms Híbridos:**
- ❌ `Input.tsx` - Contém lógica de password toggle (deveria ser molecule)

**Atoms Faltantes:**
- ❌ `Dropdown.tsx` - Não existe (necessário para ModelSelector)
- ❌ `Card.tsx` - Não existe (necessário para WorkspaceCard)
- ❌ `Textarea.tsx` - Não existe (necessário para ChatInterface)

#### 🎯 **Funcionalidades Implementadas (Precisam Refatoração Completa)**

- ✅ Multi-LLM Studio - **UI precisa refatoração atomic**
- ✅ AI Agents especializados - **Components violam atomic design**
- ✅ Knowledge Management - **Cards precisam refatoração**
- ✅ Autenticação SSO Google + JWT - **Funcional, UI precisa refatoração**
- ✅ Search Engine - **Interface precisa refatoração atomic**

#### 🔧 **Estado Real da Arquitetura (Pós-Auditoria)**

- ✅ **4 Templates** - Corretos (apenas composição)
- ❌ **14 Organisms** - **VIOLAÇÕES GRAVES** (elementos específicos)
- ❌ **11 Molecules** - **VIOLAÇÕES CRÍTICAS** (UI hardcoded)  
- ❌ **7 Atoms** - Parcialmente corretos (faltam atoms básicos)

#### 📈 **Qualidade Técnica Mantida**

- ✅ Performance otimizada (300KB bundle)
- ✅ Testing coverage (27+ testes passando)
- ✅ CI/CD pipeline funcionando
- ✅ TypeScript strict mode (100% compliance)
- ❌ **PROBLEMA CRÍTICO**: Arquitetura atomic design violada

## 🏗️ Arquitetura Obrigatória

### Stack Tecnológica OBRIGATÓRIA

- **React 18+** com TypeScript (strict mode)
- **Redux Toolkit** para gerenciamento de estado global
- **React Router v6** para roteamento
- **Axios** para requisições HTTP
- **Tailwind CSS** + Design System customizado
- **Vite** como build tool
- **Vitest** + React Testing Library para testes

### Estrutura de Pastas OBRIGATÓRIA

```
src/
├── api/
│   ├── axiosConfig.ts      # Configuração base + interceptors
│   ├── authApi.ts          # Endpoints de autenticação
│   ├── chatApi.ts          # Endpoints de LLMs e conversas
│   └── workspaceApi.ts     # Endpoints de gestão de conhecimento
├── components/
│   ├── atoms/              # Button, Input, Icon, Avatar, Badge
│   ├── molecules/          # SearchBar, MessageBubble, UserProfile
│   ├── organisms/          # ChatInterface, ConversationList, LoginForm
│   └── templates/          # Layout base
├── pages/                  # Páginas da aplicação (roteadas)
├── hooks/                  # Custom hooks compartilhados
├── redux/
│   ├── auth/
│   │   ├── authActions.ts
│   │   ├── authReducer.ts
│   │   └── authTypes.ts
│   ├── chat/
│   │   ├── chatActions.ts
│   │   ├── chatReducer.ts
│   │   └── chatTypes.ts
│   ├── conversations/
│   │   ├── conversationsActions.ts
│   │   ├── conversationsReducer.ts
│   │   └── conversationsTypes.ts
│   ├── workspaces/
│   │   ├── workspacesActions.ts
│   │   ├── workspacesReducer.ts
│   │   └── workspacesTypes.ts
│   ├── rootReducer.ts
│   └── store.ts
├── shared/
│   ├── config.ts           # Variáveis de ambiente centralizadas
│   ├── types/              # Interfaces globais
│   ├── utils/              # Funções utilitárias
│   └── constants/          # Constantes da aplicação
├── styles/                 # Design tokens e estilos globais
├── App.tsx
└── main.tsx
```

## 🎨 Atomic Design - Diretrizes Rigorosas

### Atoms (src/components/atoms/)

- **Elementos UI básicos** sem lógica de negócio
- **Props bem definidas** e totalmente tipadas
- **Reutilizáveis** em toda aplicação
- **Exemplos obrigatórios**: Button, Input, Avatar, Icon, Badge, Spinner

**Template de Atom:**

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ ... }) => {
  // Implementação sem lógica de negócio
};
```

### Molecules (src/components/molecules/)

- **Combinações de atoms** com funcionalidade específica
- **Estado local simples** permitido
- **Exemplos obrigatórios**: SearchBar, MessageBubble, UserProfile, FileUpload

### Organisms (src/components/organisms/)

- **Componentes complexos** com lógica de negócio
- **Conectados ao Redux** quando necessário
- **Exemplos obrigatórios**: ChatInterface, ConversationList, LoginForm, WorkspaceManager

## 🔄 Redux - Estrutura Obrigatória

### Módulos Redux Obrigatórios

#### Auth Module

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

// authActions.ts - Async actions com createAsyncThunk
// authReducer.ts - Reducer com createSlice
// authTypes.ts - Interfaces específicas do módulo
```

#### Chat Module

```typescript
interface ChatState {
  currentConversation: Conversation | null;
  messages: Message[];
  isTyping: boolean;
  selectedProvider: Provider;
  selectedModel: Model;
  streamingMessage: string | null;
}
```

#### Conversations Module

```typescript
interface ConversationsState {
  conversations: Conversation[];
  favoriteConversations: string[];
  searchQuery: string;
  isLoading: boolean;
  hasMore: boolean;
  filters: ConversationFilters;
}
```

#### Workspaces Module

```typescript
interface WorkspacesState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  projects: Project[];
  documents: Document[];
  permissions: WorkspacePermission[];
  isLoading: boolean;
}
```

## 🌐 Camada de API (src/api/)

### axiosConfig.ts - OBRIGATÓRIO

```typescript
import axios from 'axios';
import { config } from '../shared/config';

const apiClient = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 10000,
});

// Request interceptor para autenticação
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor para tratamento de erros
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Lógica de refresh token
    // Redirecionamento para login se necessário
    return Promise.reject(error);
  }
);

export { apiClient };
```

### APIs Específicas

- **authApi.ts**: login, logout, refreshToken, validateToken
- **chatApi.ts**: sendMessage, getConversations, uploadFile, selectModel
- **workspaceApi.ts**: CRUD de workspaces, projects, documents

## 🎣 Hooks Personalizados Obrigatórios

### useAuth() - Gerenciamento de Autenticação

```typescript
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth
  );

  const login = useCallback(
    (credentials: LoginCredentials) => {
      return dispatch(loginUser(credentials));
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  return { user, isAuthenticated, isLoading, login, logout };
};
```

### useChat() - Lógica do Chat

```typescript
export const useChat = () => {
  const dispatch = useAppDispatch();
  const chatState = useAppSelector((state) => state.chat);

  const sendMessage = useCallback(
    (content: string, files?: File[]) => {
      return dispatch(sendChatMessage({ content, files }));
    },
    [dispatch]
  );

  return { ...chatState, sendMessage };
};
```

## ⚙️ Configuração (src/shared/config.ts)

### Variáveis de Ambiente Centralizadas

```typescript
interface Config {
  API_BASE_URL: string;
  GOOGLE_CLIENT_ID: string;
  MAX_FILE_SIZE: number;
  SUPPORTED_FILE_TYPES: string[];
  LLM_PROVIDERS: LLMProvider[];
}

export const config: Config = {
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001',
  GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
  MAX_FILE_SIZE: parseInt(process.env.REACT_APP_MAX_FILE_SIZE || '10485760'), // 10MB
  SUPPORTED_FILE_TYPES: ['pdf', 'doc', 'docx', 'txt', 'md'],
  LLM_PROVIDERS: [
    { id: 'openai', name: 'OpenAI', models: ['gpt-4-turbo', 'gpt-3.5-turbo'] },
    {
      id: 'anthropic',
      name: 'Anthropic',
      models: ['claude-3-opus', 'claude-3-sonnet'],
    },
    // ... outros providers
  ],
};
```

## 🎨 Design System

### Design Tokens OBRIGATÓRIOS

```typescript
export const designTokens = {
  colors: {
    primary: '#FF6B35', // Laranja Cognit
    secondary: '#2D3748', // Cinza escuro
    success: '#48BB78', // Verde
    warning: '#ED8936', // Laranja warning
    error: '#E53E3E', // Vermelho
    neutral: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      // ... escala completa
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '24px',
      '2xl': '32px',
      '3xl': '48px',
    },
  },
};
```

## 📝 Padrões de Qualidade OBRIGATÓRIOS

### TypeScript

- **Strict mode ATIVADO** em tsconfig.json
- **Zero uso de `any`** - sempre tipar especificamente
- **Interfaces bem definidas** para todos os dados
- **Props tipadas** em todos os componentes
- **Enums para valores constantes**

### Nomenclatura e Organização

- **PascalCase** para componentes e interfaces
- **camelCase** para funções e variáveis
- **SCREAMING_SNAKE_CASE** para constantes
- **kebab-case** para arquivos não-componentes

### Performance

- **React.memo** para componentes puros
- **useMemo/useCallback** para otimizações necessárias
- **Lazy loading** de rotas e componentes pesados
- **Code splitting** por funcionalidade

### Testes

- **Cobertura mínima**: 80% para utils e hooks
- **Testes de componentes**: Render + interações básicas
- **Testes de Redux**: Actions, reducers e selectors
- **Mocks** para APIs externas

## 🚀 Comandos de Verificação OBRIGATÓRIOS

### Antes de Qualquer Commit

```bash
npm run lint          # ESLint sem erros
npm run typecheck     # TypeScript sem erros
npm run test          # Todos os testes passando
npm run build         # Build sem erros
```

### Configuração Scripts package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "preview": "vite preview"
  }
}
```

## 🔒 Funcionalidades Específicas

### Autenticação Enterprise

- **SSO Google** com OAuth 2.0
- **JWT tokens** com refresh automático
- **Interceptors Axios** para autenticação automática
- **Guards de rota** baseados em permissões

### Multi-LLM Studio

- **Streaming de respostas** em tempo real
- **Upload de múltiplos arquivos** (PDF, DOC, imagens)
- **Feedback de mensagens** (like/dislike, regenerate)
- **Histórico persistente** com busca

### Knowledge Management

- **Hierarquia**: Workspace → Project → Document
- **Permissões granulares**: Owner/Editor/Viewer
- **Busca full-text** em documentos
- **Infinite scroll** otimizado

### AI Agents

- **Agents especializados** por domínio
- **Resultados acionáveis** (downloads, previews)
- **Histórico de interações** por agent

## ❌ Práticas PROIBIDAS

- Nunca usar `any` em TypeScript
- Nunca acessar `process.env` diretamente (usar config.ts)
- Nunca fazer setState em useEffect sem cleanup
- Nunca commits sem passar nos comandos de verificação
- Nunca criar componentes sem tipagem adequada
- Nunca fazer mutação direta de estado Redux
- Nunca deixar console.log em código de produção

## ✅ Padrões de Qualidade

**Checklist Obrigatório para Qualquer Desenvolvimento:**

- [ ] Código segue Atomic Design rigorosamente
- [ ] Estado gerenciado via Redux quando necessário
- [ ] APIs integradas com error handling
- [ ] Componentes 100% tipados (zero `any`)
- [ ] Comandos de verificação passando (lint, typecheck, build)
- [ ] Design tokens aplicados consistentemente

## 🔄 Fluxo de Trabalho para IA

1. **Consulte** `TASKS.md` para tarefas específicas
2. **Execute** comandos de verificação: `npm run lint`, `npm run typecheck`, `npm run build`
3. **Mantenha** qualidade enterprise em cada commit

## 📚 Nota Final

### ✅ **ARQUITETURA IMPLEMENTADA COM SUCESSO**

Este projeto **CONCLUIU** com sucesso a implementação dos padrões enterprise rigorosos. A aplicação agora possui:

- **Atomic Design Puro**: Estrutura 100% implementada e funcional
- **Robustez Enterprise**: Código escalável e maintível
- **Qualidade Máxima**: Padrões rigorosos aplicados e validados
- **Produção Ready**: Sistema pronto para uso em ambiente corporativo

### 🎯 **Status: MISSION ACCOMPLISHED**

**A arquitetura Atomic Design foi completamente implementada e está funcionando perfeitamente.**

O Cognit AI Platform agora serve como referência de implementação para projetos enterprise com React + TypeScript + Atomic Design.
