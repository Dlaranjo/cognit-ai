# TASKS - Roadmap das Entregas

## 📊 Status Geral

**Projeto**: Cognit AI Platform  
**Nova Visão**: Assistente IA + Workflows Conversacionais  
**Target**: Analistas Organizacionais  
**Timeline**: 5-7 semanas totais

> **📖 Referências**: `CLAUDE.md` (técnico), `PLANNING.md` (estratégico), `PRD.md` (funcional)

## 🚀 ROADMAP DAS DUAS ENTREGAS

### **🎯 ENTREGA 1: Assistente IA Personalizado**
**Timeline**: 2-3 semanas | **Base Existente**: 80% | **Foco**: Adaptação empresarial

#### ✅ **Vantagem Competitiva**
**Já temos implementado e funcionando:**
- ✅ **Multi-LLM Studio**: Interface completa para 5+ modelos
- ✅ **AI Agents**: 5 agentes especializados funcionais
- ✅ **SSO Google**: Autenticação organizacional implementada
- ✅ **Atomic Design**: Arquitetura de componentes enterprise
- ✅ **TypeScript 100%**: Strict mode, zero `any`
- ✅ **Testes**: 111 testes passando

#### 🔄 **Adaptações Necessárias (Semanas 1-3)**

**Semana 1 - Templates Empresariais:**
- [ ] **ALTA**: Criar prompt templates por área (vendas, marketing, financeiro)
- [ ] **ALTA**: Configurar AI Agents para contexto organizacional
- [ ] **ALTA**: Personalizar interface para casos de uso internos
- [ ] **MÉDIA**: Implementar sistema de favorites por departamento

**Semana 2 - Google Workspace Integration:**
- [ ] **CRÍTICA**: Integrar Google Sheets API para leitura/escrita
- [ ] **CRÍTICA**: Conectar Google Drive para acesso a documentos
- [ ] **ALTA**: Implementar Gmail API para automação de emails
- [ ] **MÉDIA**: Criar bridge SSO → Google APIs

**Semana 3 - UI/UX Empresarial:**
- [ ] **ALTA**: Simplificar interface focando em analistas
- [ ] **ALTA**: Implementar dashboard de analytics de uso
- [ ] **MÉDIA**: Criar onboarding específico para casos empresariais
- [ ] **BAIXA**: Otimizar mobile para tablets corporativos

### **⚡ ENTREGA 2: Workflows de IA Conversacionais**
**Timeline**: 3-4 semanas | **Base Existente**: 0% | **Foco**: Desenvolvimento completo

#### 🆕 **Desenvolvimento Full-Stack (Semanas 4-7)**

**Semana 4 - n8n Frontend Integration:**
- [ ] **CRÍTICA**: Assumir servidor n8n externo já configurado (responsabilidade backend)
- [ ] **CRÍTICA**: Implementar MCP Client no frontend (comunicação com servidor MCP existente)
- [ ] **ALTA**: Configurar autenticação bridge no frontend (SSO Google → n8n)
- [ ] **ALTA**: Preparar estrutura frontend para receber contexto de documentação

**Semana 5 - Interface Components:**
- [ ] **CRÍTICA**: Implementar iframe sandbox seguro para n8n (frontend puro)
- [ ] **CRÍTICA**: Criar componente WorkflowCanvas responsivo
- [ ] **ALTA**: Implementar comunicação postMessage com iframe n8n
- [ ] **ALTA**: Desenvolver sistema de state sync frontend-only

**Semana 6 - AI Integration Frontend:**
- [ ] **CRÍTICA**: Integrar LLM existente para construção de workflows (via API)
- [ ] **CRÍTICA**: Implementar interface conversacional para comandos
- [ ] **ALTA**: Criar sistema de step-by-step UI building
- [ ] **ALTA**: Implementar learning mode interface e best practices

**Semana 7 - Templates & Polish:**
- [ ] **ALTA**: Criar workflow templates para casos comuns
- [ ] **ALTA**: Implementar sistema de error debugging
- [ ] **MÉDIA**: Criar biblioteca de componentes n8n mais usados
- [ ] **BAIXA**: Otimizar performance e user experience

## 🛠️ STACK TÉCNICA NECESSÁRIA

### **Entrega 1 - Tecnologias a Adicionar:**
```bash
# Google APIs
npm install googleapis @google-cloud/storage
npm install @types/google-apps-script

# Template Engine
npm install handlebars
npm install @types/handlebars

# Analytics
npm install @amplitude/analytics-browser
```

### **Entrega 2 - Tecnologias a Adicionar:**
```bash
# MCP Protocol
npm install @modelcontextprotocol/client
npm install @modelcontextprotocol/sdk

# n8n Integration
npm install n8n-workflow n8n-core
npm install @types/n8n

# WebSocket & Real-time
npm install socket.io-client
npm install @types/socket.io-client

# Iframe Security
npm install dompurify postmate
npm install @types/dompurify
```

## 📊 MÉTRICAS DE SUCESSO

### **Entrega 1 Targets:**
- **Adoption Rate**: > 80% analistas usando diariamente
- **Time to Value**: < 5min para primeiro resultado útil
- **Template Usage**: > 70% usando prompts empresariais
- **Satisfaction**: > 9/10 em pesquisas internas

### **Entrega 2 Targets:**
- **Workflow Creation Speed**: 10x mais rápido que manual
- **Learning Curve**: Analistas criando workflows em < 30min
- **Success Rate**: > 95% workflows executando corretamente
- **Process Automation**: > 50% processos manuais automatizados

## 🎯 CASOS DE USO IDENTIFICADOS

### **Entrega 1 - Assistente IA:**
1. **Análise de Planilhas**: "Analise esta planilha de vendas e gere insights"
2. **Pesquisa de Mercado**: "Pesquise concorrentes do produto X"
3. **Documentação**: "Crie um relatório executivo baseado nestes dados"
4. **Email Marketing**: "Escreva 5 variações de email para campanha Y"
5. **Análise Financeira**: "Calcule ROI deste investimento com dados do Drive"

### **Entrega 2 - Workflows:**
1. **Monitor de Planilhas**: "Monitore mudanças na planilha de vendas e avise no Slack"
2. **Automação de Relatórios**: "Gere relatório semanal e envie por email"
3. **Lead Processing**: "Quando novo lead no formulário, adicione ao CRM"
4. **Data Pipeline**: "Sincronize dados entre Sheets e sistema interno"
5. **Notification System**: "Envie alertas quando KPIs ficarem fora do range"

## ⚠️ RISCOS E MITIGAÇÕES

### **Riscos Técnicos:**
1. **MCP Integration Complexity**
   - **Risco**: Protocolo MCP pode ser instável
   - **Mitigação**: Implementar fallback REST API

2. **n8n Iframe Security**
   - **Risco**: Vulnerabilidades de segurança
   - **Mitigação**: Sandbox rigoroso + CSP headers

3. **Google API Quotas**
   - **Risco**: Limites de rate limiting
   - **Mitigação**: Implementar cache e batch processing

### **Riscos de Negócio:**
1. **Adoption Resistance**
   - **Risco**: Analistas resistentes a mudança
   - **Mitigação**: Onboarding personalizado + casos de uso claros

2. **Complexity Overload**
   - **Risco**: Interface muito complexa
   - **Mitigação**: Progressive disclosure + templates

## 🔄 AMBIENTE DE DESENVOLVIMENTO

### **Setup Frontend (Apenas Frontend):**
```bash
# Configurações de ambiente (servidores externos)
VITE_N8N_SERVER_URL=http://backend-team-n8n-server:5678
VITE_MCP_SERVER_URL=http://backend-team-mcp-server:8080
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### **Comandos de Desenvolvimento:**
```bash
npm run dev           # Frontend development apenas
npm run test          # Frontend unit tests
npm run test:integration  # Tests com mocks de APIs externas
npm run build         # Build frontend
```

### **⚠️ Dependências Externas (Backend Team):**
- **n8n Server**: URL configurável via env
- **MCP Server**: Endpoint para comunicação IA ↔ n8n  
- **Google OAuth**: Servidor de autenticação (pode usar mock inicial)

## 📅 CRONOGRAMA DETALHADO

```
📅 SEMANA 1-3: Entrega 1 (Assistente IA)
├── Semana 1: Templates + AI Agents personalization
├── Semana 2: Google Workspace integration
└── Semana 3: UI/UX empresarial + testing

📅 SEMANA 4-7: Entrega 2 (Workflows IA - Frontend)
├── Semana 4: MCP client + auth bridge (frontend)
├── Semana 5: n8n iframe embedding + components
├── Semana 6: AI workflow interface + conversational UI
└── Semana 7: Templates + optimization + deploy
```

## 🏆 DEFINIÇÃO DE PRONTO

### **Entrega 1 Ready:**
- [ ] Templates empresariais funcionais para 5+ áreas
- [ ] Google APIs integradas (Sheets, Drive, Gmail)
- [ ] Interface simplificada para analistas
- [ ] Analytics de uso implementado
- [ ] 95%+ tests passando
- [ ] Deploy em produção funcionando

### **Entrega 2 Ready (Frontend):**
- [ ] n8n iframe embarcado funcionando com sandbox seguro
- [ ] MCP client comunicando com servidor externo
- [ ] Interface conversacional para criação de workflows
- [ ] 10+ templates de workflows (UI components)
- [ ] Sync frontend com estado n8n via postMessage
- [ ] Error handling e debugging interface

## 🤖 INSTRUÇÕES PARA AGENTES

### **Priorização Obrigatória:**
1. **SEMPRE** começar pela Entrega 1 (base 80% pronta)
2. **NUNCA** iniciar Entrega 2 sem Entrega 1 100% funcional
3. **FOCAR** em casos de uso específicos, não features genéricas

### **Comandos de Verificação:**
```bash
# Após cada mudança
npm run lint && npm run typecheck && npm run test
npm run build  # Deve passar sem erros

# Testes específicos por entrega
npm run test:templates    # Entrega 1
npm run test:workflows    # Entrega 2
```

### **Critério de Qualidade:**
- **Zero breaking changes** em funcionalidades existentes
- **Backward compatibility** total
- **Enterprise security** em todas as integrações
- **Mobile responsiveness** mantida

---

**Status Final Esperado**: 🚀 **Duas entregas de alto valor prontas para analistas organizacionais, maximizando ROI através de IA conversacional e automação de processos.**