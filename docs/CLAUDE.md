# Claude Code - Diretrizes Técnicas

## 🎯 Objetivo

Diretrizes técnicas para desenvolvimento e manutenção do **Cognit AI Platform** seguindo padrões enterprise com Atomic Design.

> **📖 Referências**: `PLANNING.md` (arquitetura), `PRD.md` (funcional), `TASKS.md` (status atual)

## 🏗️ Stack Tecnológica

- **React 18+** com TypeScript strict mode
- **Redux Toolkit** para estado global
- **React Router v6** para roteamento
- **Axios** para HTTP com interceptors
- **Tailwind CSS** + Design System
- **Vite** como build tool
- **Vitest** + React Testing Library

## 📁 Estrutura Obrigatória

```
src/
├── api/              # Configuração HTTP + endpoints
├── components/
│   ├── atoms/        # Button, Input, Icon, Avatar, Badge
│   ├── molecules/    # SearchBar, MessageBubble, UserProfile
│   ├── organisms/    # ChatInterface, ConversationList
│   └── templates/    # Layout base das páginas
├── pages/            # Páginas roteadas
├── hooks/            # Custom hooks
├── redux/            # Estado global (auth, chat, workspace)
├── shared/           # Config, types, utils, constants
└── styles/           # Design tokens
```

## 🎨 Atomic Design

### Atoms (Elementos UI Básicos)
- **Responsabilidade**: Apenas UI, sem lógica de negócio
- **Props**: Totalmente tipadas e reutilizáveis
- **Exemplos**: Button, Input, Icon, Avatar, Badge

### Molecules (Composição de Atoms)
- **Responsabilidade**: Combinações funcionais de atoms
- **Estado**: Local simples permitido
- **Exemplos**: SearchBar, MessageBubble, UserProfile

### Organisms (Lógica + Composição)
- **Responsabilidade**: Lógica de negócio + molecules/atoms
- **Estado**: Conectados ao Redux quando necessário
- **Exemplos**: ChatInterface, ConversationList, Header

### Templates (Layout)
- **Responsabilidade**: Estrutura de página + composição organisms
- **Exemplos**: StudioTemplate, LoginTemplate

## ⚙️ Redux - Módulos

### Estrutura Padrão
```typescript
// Cada módulo deve ter:
- actions.ts    # Async actions (createAsyncThunk)
- reducer.ts    # Slice (createSlice)  
- types.ts      # Interfaces específicas
```

### Módulos Obrigatórios
- **auth**: user, token, isAuthenticated
- **chat**: messages, selectedModel, isTyping
- **conversations**: lista, favorites, searchQuery
- **workspaces**: lista, currentWorkspace, permissions

## 🎯 Design System

### Tokens
```typescript
colors: {
  primary: '#FF6B35',      // Laranja Cognit
  secondary: '#2D3748',    // Cinza escuro
  success: '#48BB78',      // Verde
  warning: '#ED8936',      // Laranja warning
  error: '#E53E3E',        // Vermelho
}

spacing: ['4px', '8px', '16px', '24px', '32px', '48px', '64px']
fontSize: ['12px', '14px', '16px', '18px', '24px', '32px', '48px']
```

## ✅ Padrões de Qualidade

### TypeScript
- **Strict mode** ativado
- **Zero `any`** - sempre tipar especificamente
- **Props tipadas** em todos os componentes
- **Interfaces** bem definidas

### Performance
- **React.memo** para componentes puros
- **useMemo/useCallback** quando necessário
- **Lazy loading** de rotas
- **Code splitting** por feature

### Testes
- **80%+ coverage** para utils e hooks
- **Render + interactions** para componentes
- **Actions/reducers** para Redux
- **Mocks** para APIs externas

## 🚀 Comandos Obrigatórios

```bash
npm run lint      # ESLint sem erros
npm run typecheck # TypeScript sem erros  
npm run test      # Testes passando
npm run build     # Build funcionando
```

## ❌ Práticas Proibidas

- Usar `any` em TypeScript
- Acessar `process.env` diretamente (usar config.ts)
- setState em useEffect sem cleanup
- Commits sem passar comandos de verificação
- Componentes sem tipagem
- Mutação direta de estado Redux
- console.log em produção (exceto modo mock - ver seção Logging)

## 🔄 Ambiente Mockado (Produção Atual)

⚠️ **IMPORTANTE**: O projeto atualmente usa **dados mockados em produção** até a API real ser desenvolvida.

### Configuração de Mock
```typescript
// Variáveis de ambiente atuais
VITE_USE_MOCK=true          # Ativa modo mock
VITE_API_BASE_URL=mock      # Indica modo mock ativo
```

### Sistema de Logging para Mock
```typescript
// src/shared/utils/logger.ts - DEVE SER IMPLEMENTADO
const isDev = import.meta.env.DEV;
const isMockMode = import.meta.env.VITE_USE_MOCK === 'true';

export const logger = {
  // Permitido em desenvolvimento OU modo mock
  mock: (message: string, data?: any) => {
    if (isDev || isMockMode) {
      console.log(`[MOCK] ${message}`, data);
    }
  },
  
  // Logs de desenvolvimento protegidos
  dev: (message: string, data?: any) => {
    if (isDev) {
      console.log(`[DEV] ${message}`, data);
    }
  },
  
  // Errors sempre permitidos
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
  }
};
```

## 📊 Status Atual - REFATORAÇÃO NECESSÁRIA

⚠️ **Conformidade com Diretrizes**: 73% (Requer Ação)

### ✅ Conformes
- **TypeScript**: 100% strict, zero `any`
- **Atomic Design**: 92% implementado
- **Redux**: 92% estrutura completa
- **Funcionalidades**: 100% operacionais

### ❌ Não Conformes (Requerem Correção)
- **Logging**: 0% - 47 console.logs sem proteção
- **Imports**: 65% - Barrel exports não utilizados consistentemente

### 🔧 Comandos de Verificação
```bash
npm run lint         # ❌ Falhas por console.logs  
npm run typecheck    # ✅ Passa
npm run test         # ✅ 27+ testes passando
npm run build        # ✅ Passa (mas inclui console.logs)
```