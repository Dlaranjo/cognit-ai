# Claude Code - Diretrizes de Refatoração

## Objetivo
Você é responsável por refatorar páginas/componentes monolíticos criados pelo Bolt.new para a arquitetura modular e sustentável do **Cognit Studio**. Seu papel é transformar protótipos funcionais em código produtivo seguindo rigorosamente a arquitetura definida.

## Arquitetura do Projeto

### Stack Tecnológica
- **React 18+** com TypeScript
- **React Router** para roteamento
- **Redux Toolkit** para gerenciamento de estado global
- **Axios** para requisições HTTP
- **Atomic Design** para organização de componentes

### Estrutura de Pastas Obrigatória
```
src/
├── api/
│   ├── axiosConfig.ts
│   ├── authApi.ts
│   └── chatApi.ts
├── components/
│   ├── atoms/          # Elementos básicos (Button, Input, Icon)
│   ├── molecules/      # Combinações de atoms (SearchBar, MessageBubble)
│   ├── organisms/      # Seções complexas (ChatInterface, ConversationList)
│   └── templates/      # Layout base
├── pages/              # Páginas da aplicação
├── hooks/              # Custom hooks compartilhados
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
│   ├── rootReducer.ts
│   └── store.ts
├── shared/
│   ├── config.ts       # Variáveis de ambiente
│   ├── types/          # Interfaces globais
│   └── utils/          # Funções utilitárias
├── App.tsx
└── index.tsx
```

## Diretrizes de Refatoração

### 1. Análise do Código Monolítico
- Identifique componentes reutilizáveis
- Mapeie estados que devem ser globais vs locais
- Identifique lógicas que devem virar hooks personalizados
- Analise requisições que devem ir para a camada API

### 2. Quebra em Atomic Design

#### Atoms (src/components/atoms/)
- Elementos UI básicos sem lógica de negócio
- Exemplos: Button, Input, Avatar, Icon, Badge
- Props bem definidas e tipadas
- Reutilizáveis em todo o projeto

#### Molecules (src/components/molecules/)
- Combinações de atoms com funcionalidade específica
- Exemplos: SearchInput, MessageBubble, UserProfile, FileUpload
- Podem ter estado local simples

#### Organisms (src/components/organisms/)
- Componentes complexos com lógica de negócio
- Exemplos: ChatInterface, ConversationList, LoginForm
- Conectados ao Redux quando necessário
- Podem conter múltiplas molecules/atoms

### 3. Gerenciamento de Estado Redux

#### Auth Module
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}
```

#### Chat Module
```typescript
interface ChatState {
  currentConversation: Conversation | null;
  messages: Message[];
  isTyping: boolean;
  selectedProvider: Provider;
  selectedModel: Model;
}
```

#### Conversations Module
```typescript
interface ConversationsState {
  conversations: Conversation[];
  favoriteConversations: Conversation[];
  searchQuery: string;
  isLoading: boolean;
  hasMore: boolean;
}
```

### 4. Camada API (src/api/)

#### axiosConfig.ts
- Configuração base do Axios
- Interceptors para autenticação
- Tratamento de erros global

#### authApi.ts
- Funções de autenticação (login, logout, refresh)
- Validação de token

#### chatApi.ts
- Envio de mensagens
- Upload de arquivos
- Seleção de providers/modelos

### 5. Hooks Personalizados (src/hooks/)
- `useAuth()` - Gerenciamento de autenticação
- `useChat()` - Lógica do chat
- `useConversations()` - Gerenciamento de conversas
- `useFileUpload()` - Upload de arquivos
- `useInfiniteScroll()` - Scroll infinito

### 6. Configuração (src/shared/config.ts)
```typescript
export const config = {
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || '',
  GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID || '',
  MAX_FILE_SIZE: parseInt(process.env.REACT_APP_MAX_FILE_SIZE || '10485760'),
};
```

## Processo de Refatoração

### 1. Preparação
- Analise todo o código monolítico
- Identifique dependências e imports necessários
- Mapeie fluxo de dados e estados

### 2. Criação da Estrutura
- Crie pastas seguindo a arquitetura
- Separe tipos e interfaces em arquivos específicos
- Configure Redux modules

### 3. Componentização
- Comece pelos atoms mais simples
- Construa molecules combinando atoms
- Monte organisms com lógica de negócio
- Finalize com pages conectando tudo

### 4. Integração Redux
- Migre estados locais complexos para Redux
- Implemente actions e reducers
- Conecte componentes ao store

### 5. Otimização
- Implemente lazy loading
- Adicione memoização onde necessário
- Otimize re-renders
- Valide performance

## Padrões de Qualidade

### TypeScript
- Interfaces bem definidas para todos os dados
- Props tipadas em todos os componentes
- Evite `any`, use tipos específicos
- Use enums para valores constantes

### Testes
- Execute `npm run lint` e `npm run typecheck`
- Garanta que não há erros de TypeScript
- Teste funcionalidades críticas

### Performance
- Use React.memo para componentes puros
- Implemente useMemo e useCallback apropriadamente
- Lazy load de rotas e componentes pesados

## Funcionalidades Específicas

### Autenticação
- SSO Google integrado
- Gerenciamento de token JWT
- Estados de loading/error
- Redirecionamentos baseados em auth

### Chat Interface
- Streaming de respostas
- Upload de múltiplos arquivos
- Feedback de mensagens
- Seleção dinâmica de providers

### Conversas
- Infinite scroll otimizado
- Busca em tempo real
- Favoritos persistentes
- Soft delete com confirmação

## Comandos de Verificação
Sempre execute após refatoração:
```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

## Nota Importante
Mantenha sempre a funcionalidade original do protótipo enquanto aplica a arquitetura modular. O objetivo é ter código produtivo, testável e sustentável sem perder nenhuma feature implementada pelo Bolt.new.