# 🚀 README - Integração Backend-Frontend

## 📋 Contexto Crítico

**SITUAÇÃO**: Frontend 100% mockado → Backend em produção disponível
**OBJETIVO**: Conectar frontend com backend real
**TEMPO**: 15 minutos para integração básica

## 🎯 Quick Start (15 minutos)

### 1. Backend em Produção ✅
**URL**: https://cognit-ai-s3q92.ondigitalocean.app/
**Status**: Rodando e funcional
**Docs**: https://cognit-ai-s3q92.ondigitalocean.app/docs

### 2. Configurar Frontend (5 min)
```bash
cd /home/iebt/projects/cognit-ai-web

# Criar arquivo de ambiente
cat > .env.local << EOF
VITE_USE_MOCK_SERVER=false
VITE_API_BASE_URL=https://cognit-ai-s3q92.ondigitalocean.app
VITE_GOOGLE_CLIENT_ID=1034043274094-vj8odt69hbpevp3uv9nl65ctf24r8km0.apps.googleusercontent.com
EOF

# Iniciar desenvolvimento
npm run dev
```

### 3. Verificar Integração (5 min)
- Acessar http://localhost:5173
- Network tab: requests para `cognit-ai-s3q92.ondigitalocean.app`
- Testar login e chat

### 4. Troubleshooting (5 min)
Consultar `TROUBLESHOOTING.md` se necessário

## 📁 Estrutura

```
Backend: https://cognit-ai-s3q92.ondigitalocean.app (Produção)
Frontend: /home/iebt/projects/cognit-ai-web (Local)
```

## 🔌 Integrações

### ✅ **Disponíveis**
- **Autenticação Google OAuth**: `/api/v1/auth/google/*`
- **Chat com IA**: `POST /api/v1/chat/` (OpenAI + Anthropic)
- **Modelos LLM**: `GET /api/v1/llm-models/` (7 modelos)

### 🔶 **Parciais**
- **Conversas**: Modelos existem, endpoints precisam implementação
- **Mensagens**: Estrutura existe, persistência precisa implementação

### ❌ **Não Implementadas**
- **Workspaces**: Permanecerão mockados
- **Agentes IA**: Permanecerão mockados
- **Upload Arquivos**: Permanecerá mockado

## 🛠️ Configuração

### Frontend (.env.local)
```bash
VITE_USE_MOCK_SERVER=false
VITE_API_BASE_URL=https://cognit-ai-s3q92.ondigitalocean.app
VITE_GOOGLE_CLIENT_ID=1034043274094-vj8odt69hbpevp3uv9nl65ctf24r8km0.apps.googleusercontent.com
```

### Backend
✅ **Já configurado em produção** - Não precisa configurar

## 📊 Mapeamento de Dados

### Usuário
```typescript
// Backend → Frontend
{
  id: number,           → id: string,
  google_sub: string,   → (interno)
  email: string,        → email: string,
  name: string          → name: string,
                        → role: 'user' (default),
                        → avatar: generated,
                        → preferences: default
}
```

### Mensagem
```typescript
// Backend → Frontend
{
  message: string,      → content: string,
  role: "ai"           → role: 'assistant',
                       → id: generated,
                       → timestamp: generated,
                       → conversationId: '1' (temp),
                       → provider: inferred,
                       → model: from request,
                       → tokens: estimated,
                       → cost: calculated
}
```

### Modelos LLM
```typescript
// Backend (lista) → Frontend (agrupado por provider)
[
  {id: 1, name: "gpt-4o", provider: "openai", ...},
  {id: 2, name: "claude-3-opus", provider: "anthropic", ...}
]
→
[
  {
    id: "openai",
    name: "OpenAI",
    models: [{id: "gpt-4o", ...}]
  },
  {
    id: "anthropic", 
    name: "Anthropic",
    models: [{id: "claude-3-opus", ...}]
  }
]
```

## 🔍 Verificação

### Backend
```bash
curl https://cognit-ai-s3q92.ondigitalocean.app/health
# Esperado: {"status": "healthy"}

curl https://cognit-ai-s3q92.ondigitalocean.app/api/v1/llm-models/
# Esperado: {"models": [...], "total": 7}
```

### Frontend
```javascript
// Console do browser
console.log('Mock:', shouldUseMockServer()); // false
console.log('API:', config.API_BASE_URL); // https://cognit-ai-s3q92.ondigitalocean.app

// Network tab: requests para cognit-ai-s3q92.ondigitalocean.app
```

## 📚 Docs Detalhadas
- **`INTEGRATION.md`**: Visão geral
- **`IMPLEMENTATION_STEPS.md`**: Passos detalhados
- **`TROUBLESHOOTING.md`**: Solução de problemas

## 🎯 Próximos Passos
1. Implementar gestão de conversas
2. Adicionar persistência de mensagens
3. Melhorar error handling

## ⚡ TL;DR
1. **Frontend**: criar `.env.local` → `VITE_USE_MOCK_SERVER=false`
2. **Backend**: ✅ Já rodando em produção
3. **Teste**: http://localhost:5173 → verificar Network tab

**Resultado**: Integração em ~15 minutos.
