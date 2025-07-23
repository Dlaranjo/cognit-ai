# 🚀 Implementação da Integração

## 📋 Pré-requisitos
- [ ] Node.js 18+ instalado
- [ ] Acesso ao projeto em `/home/iebt/projects/cognit-ai-web`

## 🎯 FASE 1: Configuração (5 min)

### 1.1 Backend
✅ **Já rodando em produção**: https://cognit-ai-s3q92.ondigitalocean.app

### 1.2 Frontend
```bash
cd /home/iebt/projects/cognit-ai-web

# Configurar ambiente
cat > .env.local << EOF
VITE_USE_MOCK_SERVER=false
VITE_API_BASE_URL=https://cognit-ai-s3q92.ondigitalocean.app
VITE_GOOGLE_CLIENT_ID=1034043274094-vj8odt69hbpevp3uv9nl65ctf24r8km0.apps.googleusercontent.com
EOF
```

## 🔐 FASE 2: Desabilitar Mock (5 min)

### 2.1 Atualizar Configuração

**Editar `src/shared/config.ts`:**
```typescript
const shouldUseMockServer = import.meta.env.VITE_USE_MOCK_SERVER === 'true';
const apiBaseUrl = shouldUseMockServer
  ? ''
  : import.meta.env.VITE_API_BASE_URL || 'https://cognit-ai-s3q92.ondigitalocean.app';
```

### 2.2 Criar Novo AuthAPI para Backend

**Criar `src/api/authApiReal.ts`:**
```typescript
import { apiClient } from './axiosConfig';

export const authApiReal = {
  // Obter URL de login do Google
  getGoogleLoginUrl: async (): Promise<{ authorization_url: string }> => {
    const response = await apiClient.get('/api/v1/auth/google/login');
    return response.data;
  },

  // Processar callback do Google
  handleGoogleCallback: async (code: string): Promise<AuthResponse> => {
    const response = await apiClient.get(`/api/v1/auth/google/callback?code=${code}`);
    return {
      user: mapBackendUser(response.data.user),
      token: response.data.access_token,
      refreshToken: response.data.access_token, // Backend não tem refresh token ainda
      expiresIn: 3600
    };
  },

  // Obter usuário atual
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/api/v1/auth/me');
    return mapBackendUser(response.data.user);
  },

  // Logout
  logout: async (): Promise<void> => {
    await apiClient.post('/api/v1/auth/logout');
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
  }
};

// Mapear usuário do backend para formato do frontend
function mapBackendUser(backendUser: any): User {
  return {
    id: backendUser.id.toString(),
    email: backendUser.email,
    name: backendUser.name || backendUser.email,
    role: 'user',
    avatar: `https://api.dicebear.com/7.x/avatars/svg?seed=${backendUser.email}`,
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    preferences: {
      theme: 'light',
      language: 'pt',
      notifications: { email: true, push: true, marketing: false }
    }
  };
}
```

### 2.3 Atualizar Hook de Autenticação

**Editar `src/hooks/useAuth.ts`:**
```typescript
import { authApiReal } from '../api/authApiReal';

// Substituir chamadas do authApi por authApiReal quando mock estiver desabilitado
const authService = shouldUseMockServer() ? authApi : authApiReal;
```

### 2.4 Implementar Fluxo OAuth

**Criar `src/components/organisms/GoogleAuthHandler.tsx`:**
```typescript
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const GoogleAuthHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    
    if (error) {
      console.error('OAuth error:', error);
      navigate('/auth?error=oauth_failed');
      return;
    }
    
    if (code) {
      handleGoogleCallback(code);
    }
  }, [searchParams]);
  
  const handleGoogleCallback = async (code: string) => {
    try {
      const authResponse = await authApiReal.handleGoogleCallback(code);
      login(authResponse);
      navigate('/studio');
    } catch (error) {
      console.error('Callback error:', error);
      navigate('/auth?error=callback_failed');
    }
  };
  
  return <div>Processando autenticação...</div>;
};
```

## 💬 FASE 3: Integração de Chat (30 min)

### 3.1 Criar ChatAPI para Backend

**Criar `src/api/chatApiReal.ts`:**
```typescript
import { apiClient } from './axiosConfig';

export const chatApiReal = {
  sendMessage: async (request: SendMessageRequest): Promise<Message> => {
    const response = await apiClient.post('/api/v1/chat/', {
      messages: [
        { role: 'user', content: request.content }
      ],
      model: request.model
    });
    
    return mapBackendMessage(response.data, request);
  },

  getModels: async (): Promise<LLMProvider[]> => {
    const response = await apiClient.get('/api/v1/llm-models/');
    return mapBackendModelsToProviders(response.data.models);
  }
};

function mapBackendMessage(backendResponse: any, originalRequest: SendMessageRequest): Message {
  return {
    id: generateId(),
    content: backendResponse.message,
    role: 'assistant',
    timestamp: new Date().toISOString(),
    conversationId: originalRequest.conversationId || '1',
    provider: inferProvider(originalRequest.model),
    model: originalRequest.model,
    tokens: { prompt: 50, completion: 100, total: 150 }, // Estimativa
    cost: 0.0023 // Calcular baseado no modelo
  };
}

function mapBackendModelsToProviders(models: any[]): LLMProvider[] {
  const grouped = models.reduce((acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push({
      id: model.name,
      name: model.name,
      description: `${model.name} model`,
      providerId: model.provider,
      contextLength: model.context_window || 4096,
      inputCostPer1kTokens: model.price_usd || 0.001,
      outputCostPer1kTokens: model.price_usd || 0.001,
      isAvailable: model.is_active,
      supportedFeatures: [
        { name: 'text', supported: true },
        { name: 'function_calling', supported: true }
      ],
      parameters: {
        temperature: { min: 0, max: 2, default: 0.7, step: 0.1 },
        maxTokens: { min: 1, max: model.max_tokens || 4096, default: 1000 },
        topP: { min: 0, max: 1, default: 1, step: 0.1 }
      }
    });
    return acc;
  }, {});

  return Object.entries(grouped).map(([providerId, models]) => ({
    id: providerId,
    name: providerId.charAt(0).toUpperCase() + providerId.slice(1),
    description: `${providerId} language models`,
    isAvailable: true,
    models: models as LLMModel[],
    supportedFeatures: ['text', 'function_calling']
  }));
}
```

### 3.2 Atualizar Hook de Chat

**Editar `src/hooks/useChat.ts`:**
```typescript
import { chatApiReal } from '../api/chatApiReal';

// Substituir chamadas do chatApi por chatApiReal quando mock estiver desabilitado
const chatService = shouldUseMockServer() ? chatApi : chatApiReal;
```

## 🔧 FASE 4: Desabilitar Sistema Mock (15 min)

### 4.1 Atualizar Mock Server

**Editar `src/api/mockServer.ts`:**
```typescript
export const shouldUseMockServer = (): boolean => {
  return import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_SERVER === 'true';
};
```

### 4.2 Atualizar Configuração Axios

**Editar `src/api/axiosConfig.ts`:**
```typescript
// Adicionar interceptor para debug
apiClient.interceptors.request.use(
  (config) => {
    if (!shouldUseMockServer()) {
      console.log('🌐 API Request:', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    if (!shouldUseMockServer()) {
      console.log('✅ API Response:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    if (!shouldUseMockServer()) {
      console.error('❌ API Error:', error.response?.status, error.config?.url);
    }
    return Promise.reject(error);
  }
);
```

## 🧪 FASE 3: Testes (5 min)

### 3.1 Teste Manual

```bash
# Iniciar frontend
cd /home/iebt/projects/cognit-ai-web
npm run dev

# Acessar http://localhost:5173
# Verificar Network tab no DevTools
# Testar: Login, modelos, chat
```

### 3.2 Checklist

- [ ] Frontend rodando em http://localhost:5173
- [ ] Mock desabilitado (console)
- [ ] Requests para cognit-ai-s3q92.ondigitalocean.app
- [ ] Login Google funcionando
- [ ] Chat respondendo com IA real

### 5.3 Debugging Comum

**Erro CORS:**
```python
# Adicionar no backend (main.py)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Erro de Autenticação:**
```typescript
// Verificar se token está sendo enviado
// Em axiosConfig.ts
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 🎯 FASE 6: Refinamentos (60 min)

### 6.1 Error Handling
- Implementar tratamento de erros específicos
- Adicionar retry logic
- Melhorar UX de loading states

### 6.2 Performance
- Implementar cache de modelos
- Otimizar requests
- Adicionar debounce em buscas

### 6.3 UX Improvements
- Loading skeletons
- Error boundaries
- Offline indicators

## ✅ Checklist Final

- [ ] Autenticação Google funcionando
- [ ] Chat com IA real funcionando
- [ ] Modelos LLM carregando do backend
- [ ] Sistema mock completamente desabilitado
- [ ] Sem erros no console
- [ ] Performance adequada
- [ ] UX polida

## 📚 Próximos Passos

Após integração básica:
1. Implementar gestão de conversas no backend
2. Adicionar persistência de mensagens
3. Implementar upload de arquivos
4. Expandir sistema de workspaces (se necessário)
5. Adicionar agentes especializados (se necessário)

## 🆘 Suporte

Em caso de problemas:
1. Verificar logs do backend
2. Verificar Network tab do browser
3. Verificar configurações de ambiente
4. Consultar documentação da API em http://localhost:8501/docs
