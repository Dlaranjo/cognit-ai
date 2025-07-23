# 🔗 Guia de Integração Backend-Frontend

## 📋 Visão Geral

Integração do frontend **cognit-ai-web** (React + TypeScript) com backend **cognit-ai** (FastAPI + Python) em produção.

### Estrutura
```
Backend: https://cognit-ai-s3q92.ondigitalocean.app (Produção)
Frontend: /home/iebt/projects/cognit-ai-web (Local)
Docs: https://cognit-ai-s3q92.ondigitalocean.app/docs
```

## 🎯 Status

### ✅ Backend (Produção)
- **URL**: https://cognit-ai-s3q92.ondigitalocean.app
- **Autenticação Google OAuth**: Funcionando
- **Chat IA**: OpenAI + Anthropic + streaming
- **Modelos LLM**: 7 modelos disponíveis
- **Docs**: /docs endpoint ativo

### ✅ Frontend (Local)
- **100% funcional**: Dados mockados
- **Pronto**: Estrutura de APIs definida

## 🚀 Integrações Possíveis

### 1. ✅ **AUTENTICAÇÃO GOOGLE OAUTH** (Pronto)

#### Backend Disponível
```python
# Endpoints funcionais
GET  /api/v1/auth/google/login     # Gera URL de autorização
GET  /api/v1/auth/google/callback  # Processa callback do Google
GET  /api/v1/auth/me               # Informações do usuário atual
POST /api/v1/auth/logout           # Logout
```

#### Frontend Atual (Mock)
```typescript
// Endpoints esperados pelo frontend
POST /auth/google      # Autenticação Google (token-based)
GET  /auth/profile     # Perfil do usuário
POST /auth/logout      # Logout
```

#### 🔧 Adaptação Necessária
O backend usa **fluxo redirect-based** enquanto o frontend espera **token-based**. Duas opções:

**Opção A**: Adaptar frontend para redirect-based (recomendado)
**Opção B**: Implementar endpoint token-based no backend

### 2. ✅ **CHAT COM IA** (Pronto)

#### Backend Disponível
```python
POST /api/v1/chat/
# Request: { messages: [{"role": "user", "content": "..."}], model: "gpt-4o-mini" }
# Response: { message: "...", role: "ai" }
# Suporte: OpenAI, Anthropic, streaming
```

#### Frontend Atual (Mock)
```typescript
POST /chat/message
# FormData: content, provider, model, files
# Response: Message object com tokens, cost, etc.
```

#### 🔧 Adaptação Necessária
- Mapear estrutura de request/response
- Implementar streaming no frontend
- Ajustar formato de dados

### 3. ✅ **MODELOS LLM** (Pronto)

#### Backend Disponível
```python
GET /api/v1/llm-models/           # Lista todos os modelos
GET /api/v1/llm-models/{id}       # Detalhes de modelo específico
# Seeders com: OpenAI, Anthropic, Google models
```

#### Frontend Atual (Mock)
```typescript
GET /chat/providers  # Lista de providers
GET /chat/models     # Lista de modelos por provider
```

#### 🔧 Adaptação Necessária
- Mapear estrutura de dados
- Agrupar modelos por provider no frontend

## ⚠️ Funcionalidades Parciais

### 4. 🔶 **GESTÃO DE CONVERSAS** (Backend precisa expansão)

#### Backend Atual
```python
# Modelos existem no banco
class ChatHistorySession(Base):
    id, user_id, title, first_interaction, last_interaction

class ChatHistoryMessage(Base):
    id, session_id, author, content, timestamp
```

#### Endpoints Necessários
```python
# Implementar no backend
GET  /api/v1/chat/conversations      # Listar conversas
POST /api/v1/chat/conversations      # Criar conversa
GET  /api/v1/chat/conversations/{id} # Obter conversa específica
PUT  /api/v1/chat/conversations/{id} # Atualizar conversa
DEL  /api/v1/chat/conversations/{id} # Deletar conversa
```

### 5. 🔶 **PERSISTÊNCIA DE MENSAGENS** (Implementação automática)

#### Necessário
- Salvar mensagens automaticamente no endpoint de chat
- Associar mensagens a sessões/conversas
- Implementar histórico de mensagens

## ❌ Funcionalidades Não Implementadas

### 6. **SISTEMA DE WORKSPACES**
O frontend possui sistema completo de workspaces, projetos e documentos que não existe no backend.

### 7. **AGENTES IA ESPECIALIZADOS**
O frontend possui agentes especializados que não existem no backend.

### 8. **UPLOAD E GESTÃO DE ARQUIVOS**
O frontend suporta upload de arquivos, mas o backend não possui endpoints correspondentes.

## 🛠️ Configuração

### Backend
✅ **Já rodando em produção** - Não precisa configurar

### Frontend
```bash
cd /home/iebt/projects/cognit-ai-web

# Configurar ambiente
cat > .env.local << EOF
VITE_USE_MOCK_SERVER=false
VITE_API_BASE_URL=https://cognit-ai-s3q92.ondigitalocean.app
VITE_GOOGLE_CLIENT_ID=1034043274094-vj8odt69hbpevp3uv9nl65ctf24r8km0.apps.googleusercontent.com
EOF

# Iniciar desenvolvimento
npm run dev
```

## 📊 Mapeamento de Dados

### Usuário
```typescript
// Backend
{
  id: number,
  google_sub: string,
  email: string,
  name: string
}

// Frontend esperado
{
  id: string,
  email: string,
  name: string,
  role: 'admin' | 'user' | 'viewer',
  avatar?: string,
  // ... outros campos
}
```

### Mensagem
```typescript
// Backend
{
  message: string,
  role: "ai"
}

// Frontend esperado
{
  id: string,
  content: string,
  role: 'user' | 'assistant' | 'system',
  timestamp: string,
  conversationId: string,
  provider?: string,
  model?: string,
  tokens?: { prompt: number, completion: number, total: number },
  cost?: number
}
```

### Modelo LLM
```typescript
// Backend
{
  id: number,
  name: string,
  provider: string,
  is_active: boolean,
  max_tokens?: number,
  context_window?: number,
  price_usd?: number
}

// Frontend esperado (agrupado por provider)
{
  id: string,
  name: string,
  description: string,
  isAvailable: boolean,
  models: LLMModel[]
}
```

## 🎯 Plano de Implementação

### Fase 1: Integrações Básicas (1-2 dias)
1. **Configurar ambientes** (backend + frontend)
2. **Integrar autenticação Google OAuth**
3. **Conectar chat básico**
4. **Mapear modelos LLM**

### Fase 2: Funcionalidades Avançadas (3-5 dias)
1. **Implementar gestão de conversas no backend**
2. **Adicionar persistência de mensagens**
3. **Conectar histórico com frontend**

### Fase 3: Expansões (1-2 semanas)
1. **Sistema de workspaces** (se necessário)
2. **Upload de arquivos** (se necessário)
3. **Agentes especializados** (se necessário)

## 🔍 Debugging e Testes

### Verificar Backend
```bash
# Testar endpoints
curl http://localhost:8501/health
curl http://localhost:8501/api/v1/llm-models/

# Logs do servidor
python api.py  # Ver logs no terminal
```

### Verificar Frontend
```bash
# Desabilitar mock server
# Em src/api/mockServer.ts, linha 425:
export const shouldUseMockServer = (): boolean => {
  return false;  // Mudança aqui
};

# Verificar network tab no browser
# Todas as chamadas devem ir para localhost:8501
```

## 📚 Recursos Adicionais

### Documentação Backend
- **FastAPI Docs**: http://localhost:8501/docs (quando rodando)
- **Modelos**: `/home/iebt/projects/cognit-ai/database/models/`
- **Routers**: `/home/iebt/projects/cognit-ai/src/presentation/api/routers/`

### Documentação Frontend
- **APIs**: `/home/iebt/projects/cognit-ai-web/src/api/`
- **Types**: `/home/iebt/projects/cognit-ai-web/src/types/`
- **Mock Data**: `/home/iebt/projects/cognit-ai-web/src/api/mock/`

## ⚡ Quick Start

Para uma integração rápida, siga estes passos:

1. **Configure o backend** (5 min)
2. **Desabilite o mock server** (1 min)
3. **Teste autenticação** (10 min)
4. **Teste chat básico** (10 min)
5. **Ajuste mapeamento de dados** (30 min)

Total: ~1 hora para integração básica funcional.
