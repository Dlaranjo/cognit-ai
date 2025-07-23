# 🔧 Troubleshooting - Integração

## 🚨 Problemas Comuns

### 1. Backend não responde

#### Verificar Status
```bash
# Testar backend em produção
curl https://cognit-ai-s3q92.ondigitalocean.app/health
# Esperado: {"status": "healthy"}

# Se não responder: Backend pode estar offline
# Contatar responsável pelo deploy
```

### 2. Frontend não conecta

#### Erro: Requests ainda para mock
```typescript
// Problema: Mock ainda ativo
// Solução: Verificar .env.local
VITE_USE_MOCK_SERVER=false
VITE_API_BASE_URL=https://cognit-ai-s3q92.ondigitalocean.app

// Verificar src/shared/config.ts
const shouldUseMockServer = import.meta.env.VITE_USE_MOCK_SERVER === 'true';
```

#### Erro: `404 Not Found`
```bash
# Verificar URL no .env.local
VITE_API_BASE_URL=https://cognit-ai-s3q92.ondigitalocean.app

# Testar backend diretamente
curl https://cognit-ai-s3q92.ondigitalocean.app/api/v1/llm-models/
```

#### Erro: CORS
```javascript
// Se CORS error, backend precisa configurar
// Contatar responsável pelo backend
```

### 3. Autenticação não funciona

#### Erro: `Invalid Google OAuth configuration`
```bash
# Problema: Configuração OAuth incorreta
# Solução: Verificar .env no backend
IEBT_API_AUTH_CLIENT_ID=your-google-client-id
IEBT_API_AUTH_CLIENT_SECRET=your-google-client-secret
IEBT_API_AUTH_REDIRECT_URI=http://localhost:8501/api/v1/auth/google/callback

# E no frontend (.env.local):
VITE_GOOGLE_CLIENT_ID=same-google-client-id
```

#### Erro: `JWT token invalid`
```bash
# Problema: Chave JWT não configurada ou diferente
# Solução: Verificar .env no backend
JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production
JWT_ALGORITHM=HS256
```

#### Erro: `User not found after OAuth`
```python
# Problema: Usuário não sendo criado/encontrado
# Solução: Verificar logs do backend e tabela users
# Debug no backend:
print(f"User info from Google: {user_info}")
print(f"User created/found: {user}")
```

### 4. Chat não funciona

#### Erro: `OpenAI API error`
```bash
# Problema: Chave da API inválida ou sem créditos
# Solução:
# 1. Verificar chave no .env
# 2. Verificar saldo na conta OpenAI
# 3. Testar chave diretamente:
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Erro: `Model not found`
```python
# Problema: Modelo não existe nos seeders
# Solução: Executar seeders
python database/seeders/run_seeders.py

# Ou verificar modelos disponíveis:
curl http://localhost:8501/api/v1/llm-models/
```

#### Erro: `Chat response empty`
```python
# Problema: Resposta da IA vazia
# Solução: Verificar logs do backend
# Debug no chat endpoint:
print(f"Messages sent to LLM: {messages}")
print(f"LLM response: {response}")
```

### 5. Modelos LLM não carregam

#### Erro: `No models found`
```bash
# Problema: Seeders não executados
# Solução:
python database/seeders/run_seeders.py

# Verificar se modelos foram inseridos:
psql -d cognit-ai -c "SELECT * FROM llm_models;"
```

#### Erro: `Models not grouped by provider`
```typescript
// Problema: Mapeamento incorreto no frontend
// Solução: Verificar função mapBackendModelsToProviders
// Debug:
console.log('Backend models:', backendModels);
console.log('Mapped providers:', mappedProviders);
```

## 🔍 Debugging Tools

### 1. Verificar Backend
```bash
# Health check
curl https://cognit-ai-s3q92.ondigitalocean.app/health

# Listar modelos
curl https://cognit-ai-s3q92.ondigitalocean.app/api/v1/llm-models/

# Documentação
# Acessar: https://cognit-ai-s3q92.ondigitalocean.app/docs
```

### 2. Verificar Status do Frontend
```javascript
// No console do browser
console.log('Mock server enabled:', shouldUseMockServer());
console.log('API Base URL:', config.API_BASE_URL);
console.log('Auth token:', localStorage.getItem('authToken'));

// Verificar se requests estão indo para o backend
// Network tab -> verificar se URLs começam com localhost:8501
```

### 3. Logs Úteis

#### Backend (Python)
```python
# Adicionar logs temporários nos endpoints
import logging
logging.basicConfig(level=logging.DEBUG)

# Nos endpoints:
print(f"Request received: {request}")
print(f"Response sent: {response}")
```

#### Frontend (TypeScript)
```typescript
// Adicionar logs temporários
console.log('🔍 Debug - Request:', request);
console.log('🔍 Debug - Response:', response);
console.log('🔍 Debug - Error:', error);
```

## 📊 Monitoramento

### 1. Verificar Performance
```bash
# Backend - tempo de resposta
time curl http://localhost:8501/api/v1/llm-models/

# Frontend - bundle size
npm run build
# Verificar dist/ folder size
```

### 2. Verificar Memória
```bash
# Backend
ps aux | grep python

# Frontend
# DevTools -> Performance tab
```

## 🛠️ Ferramentas de Debug

### 1. Postman/Insomnia
Criar collection com endpoints:
- GET http://localhost:8501/health
- GET http://localhost:8501/api/v1/llm-models/
- GET http://localhost:8501/api/v1/auth/google/login
- POST http://localhost:8501/api/v1/chat/

### 2. Browser DevTools
- **Network tab**: Verificar requests/responses
- **Console tab**: Verificar logs e erros
- **Application tab**: Verificar localStorage
- **Sources tab**: Debug do código

### 3. Database Tools
```bash
# Conectar ao PostgreSQL
psql -d cognit-ai

# Verificar tabelas
\dt

# Verificar usuários
SELECT * FROM users;

# Verificar modelos
SELECT * FROM llm_models;

# Verificar sessões de chat
SELECT * FROM chat_sessions;
```

## 🚨 Problemas Críticos

### 1. Dados Perdidos
```bash
# Backup do banco antes de mudanças
pg_dump cognit-ai > backup.sql

# Restaurar se necessário
psql -d cognit-ai < backup.sql
```

### 2. Configuração Corrompida
```bash
# Reset completo do ambiente
cd /home/iebt/projects/cognit-ai
rm .env
cp .env.example .env
# Reconfigurar .env

cd /home/iebt/projects/cognit-ai-web
rm .env.local
# Recriar .env.local
```

### 3. Dependências Quebradas
```bash
# Backend
cd /home/iebt/projects/cognit-ai
rm poetry.lock
poetry install

# Frontend
cd /home/iebt/projects/cognit-ai-web
rm package-lock.json node_modules/
npm install
```

## 📞 Checklist de Suporte

Antes de pedir ajuda, verificar:

- [ ] Backend rodando sem erros
- [ ] Frontend rodando sem erros
- [ ] Variáveis de ambiente configuradas
- [ ] Mock server desabilitado
- [ ] Banco de dados funcionando
- [ ] Migrações executadas
- [ ] Seeders executados
- [ ] Chaves de API válidas
- [ ] CORS configurado
- [ ] Network tab mostrando requests corretos
- [ ] Console sem erros críticos

## 🔄 Reset Completo

Se tudo falhar, reset completo:

```bash
# 1. Parar todos os serviços
pkill -f "python api.py"
pkill -f "npm run dev"

# 2. Reset do backend
cd /home/iebt/projects/cognit-ai
rm .env
cp .env.example .env
# Reconfigurar .env
alembic downgrade base
alembic upgrade head
python database/seeders/run_seeders.py

# 3. Reset do frontend
cd /home/iebt/projects/cognit-ai-web
rm .env.local
# Recriar .env.local
rm -rf node_modules package-lock.json
npm install

# 4. Reiniciar serviços
cd /home/iebt/projects/cognit-ai
python api.py &

cd /home/iebt/projects/cognit-ai-web
npm run dev &

# 5. Testar integração básica
curl http://localhost:8501/health
# Acessar http://localhost:5173
```

## 📚 Recursos Adicionais

- **FastAPI Docs**: http://localhost:8501/docs
- **Backend Logs**: Terminal onde `python api.py` está rodando
- **Frontend Logs**: Browser DevTools Console
- **Database**: `psql -d cognit-ai`
- **API Testing**: Postman/Insomnia
- **Code**: VSCode com extensões Python e TypeScript
