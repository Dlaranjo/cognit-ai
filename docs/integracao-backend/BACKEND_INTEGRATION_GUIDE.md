# 🔧 Guia Técnico de Integração Backend

## 📋 Análise Técnica Completa

### Arquitetura Backend (cognit-ai)
```
src/
├── adapters/           # Integrações externas
│   ├── auth/          # Google OAuth
│   └── llm_chat/      # OpenAI, Anthropic
├── application/        # Lógica de negócio
│   ├── auth/          # Autenticação
│   ├── chat/          # Chat com IA
│   ├── llm_model/     # Gestão de modelos
│   └── user/          # Gestão de usuários
├── presentation/       # API REST
│   └── api/
│       ├── routers/   # Endpoints
│       └── schemas/   # Validação
└── shared_kernel/      # Utilitários
    ├── config.py      # Configurações
    └── utils/         # JWT, etc.
```

### Arquitetura Frontend (cognit-ai-web)
```
src/
├── api/               # Clientes HTTP
│   ├── mock/         # Sistema mock (MirageJS)
│   ├── authApi.ts    # Autenticação
│   ├── chatApi.ts    # Chat
│   └── axiosConfig.ts # Configuração HTTP
├── components/        # Atomic Design
├── hooks/            # React hooks
├── redux/            # Estado global
├── types/            # TypeScript types
└── shared/
    └── config.ts     # Configurações
```

## 🔌 Endpoints Mapeados

### 1. Autenticação

#### Backend (FastAPI)
```python
# /src/presentation/api/routers/auth.py
@router.get("/google/login")
async def google_login() -> dict:
    return {"authorization_url": "https://accounts.google.com/..."}

@router.get("/google/callback")
async def google_callback(code: str) -> dict:
    return {
        "access_token": "jwt_token",
        "token_type": "bearer",
        "user": {"id": 1, "email": "...", "sub": "..."}
    }

@router.get("/me")
async def get_current_user_info() -> dict:
    return {"user": {...}, "payload": {...}}

@router.post("/logout")
async def logout() -> dict:
    return {"message": "Logout realizado com sucesso"}
```

#### Frontend (React)
```typescript
// /src/api/authApi.ts
export const authApi = {
  // ATUAL (Mock)
  login: (credentials) => POST('/auth/login'),
  googleAuth: (request) => POST('/auth/google'),
  
  // NECESSÁRIO (Backend Integration)
  getGoogleLoginUrl: () => GET('/api/v1/auth/google/login'),
  handleGoogleCallback: (code) => GET(`/api/v1/auth/google/callback?code=${code}`),
  getCurrentUser: () => GET('/api/v1/auth/me'),
  logout: () => POST('/api/v1/auth/logout')
}
```

### 2. Chat

#### Backend (FastAPI)
```python
# /src/presentation/api/routers/chat.py
@router.post("/", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    # request.messages: List[dict]
    # request.model: str = "gpt-4o-mini"
    return ChatResponse(message="...", role="ai")
```

#### Frontend (React)
```typescript
// /src/api/chatApi.ts
export const chatApi = {
  // ATUAL (Mock)
  sendMessage: (request: SendMessageRequest) => {
    // FormData com content, provider, model, files
  },
  
  // NECESSÁRIO (Backend Integration)
  sendMessage: (request) => POST('/api/v1/chat/', {
    messages: [{"role": "user", "content": request.content}],
    model: request.model
  })
}
```

### 3. Modelos LLM

#### Backend (FastAPI)
```python
# /src/presentation/api/routers/llm_models.py
@router.get("/", response_model=LLMModelsListResponse)
async def get_llm_models(active_only: bool = False):
    return LLMModelsListResponse(models=[...], total=7)

@router.get("/{model_id}", response_model=LLMModelResponse)
async def get_llm_model_by_id(model_id: int):
    return LLMModelResponse(id=1, name="gpt-4o", provider="openai", ...)
```

#### Frontend (React)
```typescript
// /src/api/chatApi.ts
export const chatApi = {
  // ATUAL (Mock)
  getProviders: () => GET('/chat/providers'),
  getModels: (providerId?) => GET('/chat/models'),
  
  // NECESSÁRIO (Backend Integration)
  getModels: () => GET('/api/v1/llm-models/'),
  getModelById: (id) => GET(`/api/v1/llm-models/${id}`)
}
```

## 🗄️ Estrutura do Banco de Dados

### Tabelas Existentes
```sql
-- Usuários
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR,
    google_sub VARCHAR UNIQUE NOT NULL,
    name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL
);

-- Sessões de Chat
CREATE TABLE chat_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR,
    first_interaction TIMESTAMP DEFAULT NOW(),
    last_interaction TIMESTAMP DEFAULT NOW()
);

-- Mensagens de Chat
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES chat_sessions(id),
    author ENUM('BOT', 'USER'),
    content TEXT,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Modelos LLM
CREATE TABLE llm_models (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    base_url VARCHAR(255),
    max_tokens INTEGER,
    context_window INTEGER,
    price_type VARCHAR(50),
    price_usd DECIMAL(10,6),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Seeders Disponíveis
```python
# /database/seeders/llm_models_seeder.py
# Modelos pré-configurados:
- gpt-4o (OpenAI)
- gpt-4o-mini (OpenAI)  
- gpt-3.5-turbo (OpenAI)
- claude-3-5-sonnet-20241022 (Anthropic)
- claude-3-haiku-20240307 (Anthropic)
- gemini-1.5-pro (Google)
- gemini-1.5-flash (Google)
```

## 🔐 Sistema de Autenticação

### Fluxo OAuth Google (Backend)
```python
# 1. Usuário acessa /auth/google/login
# 2. Backend retorna authorization_url
# 3. Usuário é redirecionado para Google
# 4. Google redireciona para /auth/google/callback?code=...
# 5. Backend troca code por token
# 6. Backend busca/cria usuário
# 7. Backend retorna JWT token
```

### JWT Implementation
```python
# /src/shared_kernel/utils/jwt_utils.py
def create_token_for_user(user_sub: str, email: str) -> str:
    token_data = {"sub": user_sub, "email": email}
    return create_access_token(token_data)

# /src/presentation/api/dependencies/auth.py
async def get_current_user(credentials, db):
    payload = verify_token(credentials.credentials)
    user = db.query(User).filter(User.google_sub == payload["sub"]).first()
    return {"user": {...}, "payload": payload}
```

## 🎨 Adaptadores de Dados

### User Mapping
```typescript
// Backend → Frontend
function mapUser(backendUser: any): User {
  return {
    id: backendUser.id.toString(),
    email: backendUser.email,
    name: backendUser.name,
    role: 'user', // Default, backend não tem role
    avatar: `https://api.dicebear.com/7.x/avatars/svg?seed=${backendUser.name}`,
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    preferences: {
      theme: 'light',
      language: 'pt',
      notifications: { email: true, push: true, marketing: false }
    }
  }
}
```

### Message Mapping
```typescript
// Backend → Frontend
function mapMessage(backendResponse: any, userMessage: string): Message {
  return {
    id: generateId(),
    content: backendResponse.message,
    role: 'assistant',
    timestamp: new Date().toISOString(),
    conversationId: '1', // Temporário até implementar conversas
    provider: 'openai', // Inferir do modelo
    model: backendResponse.model || 'gpt-4o-mini',
    tokens: { prompt: 50, completion: 100, total: 150 }, // Estimativa
    cost: 0.0023 // Calcular baseado no modelo
  }
}
```

### LLM Models Mapping
```typescript
// Backend → Frontend (agrupar por provider)
function mapModelsToProviders(backendModels: any[]): LLMProvider[] {
  const grouped = groupBy(backendModels, 'provider');
  
  return Object.entries(grouped).map(([providerId, models]) => ({
    id: providerId,
    name: capitalize(providerId),
    description: `${capitalize(providerId)} language models`,
    isAvailable: true,
    models: models.map(mapModel),
    supportedFeatures: ['text', 'function_calling']
  }));
}
```

## 🔄 Sistema Mock → Real

### Configuração Atual (Mock)
```typescript
// /src/shared/config.ts
const shouldUseMockServer = 'true'; // Hardcoded
const apiBaseUrl = shouldUseMockServer ? '' : 'https://cognit-ai-web-main-rhecs.ondigitalocean.app:3001';

// /src/api/mockServer.ts
export const shouldUseMockServer = (): boolean => {
  return true; // Always enabled
};
```

### Configuração para Backend Real
```typescript
// /src/shared/config.ts
const shouldUseMockServer = import.meta.env.VITE_USE_MOCK_SERVER === 'true';
const apiBaseUrl = shouldUseMockServer ? '' : 'http://localhost:8501';

// /src/api/mockServer.ts
export const shouldUseMockServer = (): boolean => {
  return import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_SERVER === 'true';
};
```

### Variáveis de Ambiente
```bash
# .env.local (desenvolvimento)
VITE_USE_MOCK_SERVER=false
VITE_API_BASE_URL=http://localhost:8501

# .env.production
VITE_USE_MOCK_SERVER=false
VITE_API_BASE_URL=https://api.cognit.ai
```

## 🧪 Testes de Integração

### Checklist de Verificação
```bash
# 1. Backend rodando
curl http://localhost:8501/health
# Esperado: {"status": "healthy"}

# 2. Modelos LLM disponíveis
curl http://localhost:8501/api/v1/llm-models/
# Esperado: {"models": [...], "total": 7}

# 3. Autenticação Google
curl http://localhost:8501/api/v1/auth/google/login
# Esperado: {"authorization_url": "https://accounts.google.com/..."}

# 4. Chat (requer autenticação)
curl -X POST http://localhost:8501/api/v1/chat/ \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Hello"}], "model": "gpt-4o-mini"}'
# Esperado: {"message": "...", "role": "ai"}
```

### Debugging Frontend
```typescript
// Verificar se mock está desabilitado
console.log('Mock server enabled:', shouldUseMockServer());

// Verificar URL base
console.log('API Base URL:', config.API_BASE_URL);

// Verificar chamadas HTTP (Network tab)
// Todas as requests devem ir para localhost:8501
```

## 🚀 Deploy e Produção

### Backend (FastAPI)
```bash
# Produção com Uvicorn
uvicorn src.presentation.api.main:app --host 0.0.0.0 --port 8501

# Docker (se disponível)
docker build -t cognit-ai-backend .
docker run -p 8501:8501 cognit-ai-backend
```

### Frontend (React)
```bash
# Build para produção
npm run build

# Servir arquivos estáticos
npm run preview

# Deploy (exemplo)
# Configurar VITE_API_BASE_URL para URL de produção do backend
```

## 📚 Próximos Passos

### Implementações Necessárias no Backend
1. **Gestão de Conversas**: CRUD completo
2. **Persistência de Mensagens**: Salvar automaticamente
3. **Upload de Arquivos**: Endpoints de upload
4. **Sistema de Workspaces**: Se necessário
5. **Agentes Especializados**: Se necessário

### Melhorias no Frontend
1. **Error Handling**: Tratamento de erros da API real
2. **Loading States**: Estados de carregamento adequados
3. **Retry Logic**: Retry automático em falhas
4. **Offline Support**: Cache e sincronização
5. **Performance**: Otimizações para API real
