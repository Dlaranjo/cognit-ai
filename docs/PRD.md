# PRD - Code Review & Refactoring Guide

## 📋 Contexto do Projeto para Agentes

**Produto**: Cognit AI Platform v3.0 Enterprise
**Status**: Produção com sistema mock → Backend em integração
**Missão do Agente**: Revisar conformidade e refatorar código existente
**Escopo**: Validação completa de arquivos seguindo diretrizes estabelecidas

> **📖 Referências**: `CLAUDE.md` (checklist técnico), `PLANNING.md` (arquitetura), `TASKS.md` (roadmap de revisão)

## 🚨 **PROBLEMAS CRÍTICOS IDENTIFICADOS**

**Conformidade Atual**: 73% (Requer elevação para 95%+)

### Problemas Críticos
- ❌ **Logging**: 47+ console.logs sem proteção para produção
- ❌ **Imports**: Barrel exports não utilizados consistentemente
- ⚠️ **TypeScript**: Alguns tipos implícitos identificados

### Impacto
- **Segurança**: Logs sensíveis expostos em produção
- **Performance**: Bundle size comprometido
- **Manutenibilidade**: Inconsistência de padrões

## 🎯 Arquitetura Base do Produto (Para Contexto)

**Stack Principal**: React 18 + TypeScript strict + Redux Toolkit + Tailwind CSS
**Padrão**: Atomic Design obrigatório
**Status**: Frontend 100% funcional com dados mockados

### Funcionalidades Implementadas ✅
- **🤖 Multi-LLM Studio**: Interface para 5+ modelos (GPT-4, Claude, Gemini)
- **🔄 AI Agents**: 5 agentes especializados funcionais
- **🔐 SSO Google**: Autenticação organizacional implementada
- **📚 Knowledge Management**: Sistema hierárquico completo
- **💬 Chat Interface**: Conversas com regeneração e histórico

## 📋 Áreas Críticas para Revisão

### **🔍 PRIORIDADE 1: Conformidade Técnica**

#### Logging System - CRÍTICO
- **Localizar**: Todos os `console.log()` no código
- **Substituir**: Por `logger.dev()`, `logger.error()`, etc.
- **Arquivo**: `src/shared/utils/logger.ts` deve estar sendo usado

#### Import Patterns - ALTO
- **Validar**: Uso de barrel exports `from '@/components/atoms'`
- **Corrigir**: Imports diretos desnecessários
- **Padrão**: Verificar `index.ts` em cada pasta components/

#### TypeScript Strict - ALTO
- **Garantir**: Zero tipos `any` ou implícitos
- **Validar**: Props de componentes totalmente tipadas
- **Verificar**: Interfaces bem definidas

### **🔍 PRIORIDADE 2: Estrutura Atomic Design**

#### Validação de Componentes
- **atoms/**: Elementos UI básicos (Button, Input, Icon, Avatar)
- **molecules/**: Combinações funcionais (SearchBar, MessageBubble)
- **organisms/**: Lógica + composição (ChatInterface, Header)
- **templates/**: Layout de páginas (StudioTemplate, LoginTemplate)

#### Checklist por Componente
- ✅ **Localização**: Componente na pasta correta da hierarquia
- ✅ **Props**: Interface tipada e bem definida
- ✅ **Imports**: Usando barrel exports quando disponível
- ✅ **Logging**: Sem console.logs desprotegidos
- ✅ **Funcionalidade**: Mantendo comportamento existente

## ⚙️ Design System & Standards

### **Tokens Obrigatórios**
```typescript
colors: {
  primary: '#FF6B35',      // Laranja Cognit
  secondary: '#2D3748',    // Cinza escuro  
  success: '#48BB78',      // Verde
  warning: '#ED8936',      // Laranja warning
  error: '#E53E3E',        // Vermelho
}
```

### **Padrões de Código**
- **Zero `any`**: Sempre tipos explícitos
- **Props tipadas**: Interfaces obrigatórias
- **Logger system**: Nunca console.log direto
- **Barrel exports**: Imports organizados
- **Atomic hierarchy**: Componentes na pasta correta

## ✅ Comandos de Verificação Obrigatórios

**SEMPRE executar após mudanças:**
```bash
npm run lint      # ESLint deve passar 100%
npm run typecheck # TypeScript sem erros  
npm run test      # Testes não podem quebrar
npm run build     # Build deve funcionar
```

## 🎯 Meta de Conformidade

**Objetivo**: Elevar conformidade de **73% para 95%+**

### Status Atual Detalhado
- ✅ **Funcionalidades**: 100% operacionais (manter)
- ✅ **TypeScript**: 100% strict mode (manter)  
- ✅ **Architecture**: 92% Atomic Design (validar)
- ❌ **Logging**: 0% conforme - 47 console.logs
- ❌ **Imports**: 65% conforme - inconsistência barrel exports

### Critérios de Aprovação Final
- ✅ Zero console.logs desprotegidos
- ✅ 100% imports usando padrão barrel exports
- ✅ Zero tipos `any` ou implícitos
- ✅ Todas as funcionalidades preservadas
- ✅ Comandos npm run lint/typecheck/test/build passando

**🚨 IMPORTANTE**: Este projeto está em produção. Qualquer mudança deve preservar 100% das funcionalidades existentes.