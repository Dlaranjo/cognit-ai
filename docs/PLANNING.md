# PLANNING - Cognit AI Platform

> **📖 Referências Complementares**
>
> - `CLAUDE.md`: Diretrizes técnicas para desenvolvimento
> - `PRD.md`: Especificações funcionais e user stories
> - `TASKS.md`: Lista granular de tarefas para execução

## 🎯 VISÃO ESTRATÉGICA DO PROJETO

### Declaração da Visão

O **Cognit AI Platform** é uma plataforma enterprise unificada que permite às organizações interagir com múltiplos modelos de Large Language Models (LLMs) através de uma interface moderna e intuitiva, combinada com um robusto sistema de gestão de conhecimento organizacional.

### Objetivos Estratégicos

- **Agregação Inteligente**: Acesso unificado aos melhores LLMs do mercado em uma única interface
- **Gestão de Conhecimento**: Sistema hierárquico de organização e busca inteligente de documentos corporativos
- **Controle Empresarial**: Sistema granular de permissões e governança para uso corporativo
- **Produtividade Maximizada**: Interface otimizada para fluxos de trabalho profissionais e colaboração

### Proposta de Valor

- Eliminar a necessidade de múltiplas assinaturas e interfaces para diferentes LLMs
- Centralizar conhecimento organizacional com busca e contextualização inteligente
- Proporcionar controle granular de acesso e permissões para dados sensíveis
- Acelerar processos de tomada de decisão com AI assistants especializados

## 🏗️ ARQUITETURA DO SISTEMA

### Arquitetura Frontend

```
┌─────────────────────────────────────────────┐
│                 Frontend                     │
├─────────────────────────────────────────────┤
│ React 18 + TypeScript + Redux Toolkit       │
│                                             │
│ ┌─────────────┐ ┌─────────────┐ ┌──────────┐│
│ │   Atomic    │ │   Redux     │ │   API    ││
│ │   Design    │ │   Modules   │ │   Layer  ││
│ │             │ │             │ │          ││
│ │ • Atoms     │ │ • Auth      │ │ • Axios  ││
│ │ • Molecules │ │ • Chat      │ │ • Config ││
│ │ • Organisms │ │ • Workspace │ │ • Inter. ││
│ └─────────────┘ └─────────────┘ └──────────┘│
└─────────────────────────────────────────────┘
```

### Estrutura de Dados

```
Organization
└── Workspace (Knowledge Portfolio)
    ├── Members (Owner/Editor/Viewer)
    └── Projects (Specific Initiatives)
        └── Documents (Files & Knowledge Base)
            └── AI Conversations & Analysis
```

### Fluxo de Dados

```
User Action → Redux Action → API Call → Backend → Database
     ↑                                               ↓
UI Update ← Redux Store ← API Response ← Backend ←──┘
```

## 💻 STACK TECNOLÓGICO

### Core Framework

- **React 18.3+**: Frontend framework com Concurrent Features
- **TypeScript 5.5+**: Tipagem estática e desenvolvimento seguro
- **Vite 5.4+**: Build tool moderno e rápido

### Estado e Roteamento

- **Redux Toolkit**: Gerenciamento de estado global centralizado
- **React Router v6**: Roteamento client-side com lazy loading
- **RTK Query**: Cache e sincronização de dados da API

### UI e Styling

- **Tailwind CSS 3.4+**: Utility-first CSS framework
- **Headless UI**: Componentes acessíveis e customizáveis
- **Lucide React**: Biblioteca de ícones moderna e consistente
- **Framer Motion**: Animações e transições fluidas

### HTTP e APIs

- **Axios**: Cliente HTTP com interceptors e middleware
- **React Query**: Cache inteligente e sincronização de servidor
- **WebSockets**: Streaming de respostas LLM em tempo real

### Desenvolvimento e Qualidade

- **ESLint**: Linting de código com regras enterprise
- **Prettier**: Formatação automática de código
- **Husky**: Git hooks para quality gates
- **Vitest**: Framework de testes rápido e moderno
- **React Testing Library**: Testes de componentes focados no usuário

### Build e Deploy

- **Vite**: Bundling otimizado para produção
- **PostCSS**: Processamento de CSS com plugins
- **GitHub Actions**: CI/CD pipeline automatizado

## 🛠️ FERRAMENTAS NECESSÁRIAS

### Desenvolvimento Local

```bash
# Runtime Environment
Node.js 18+
npm/yarn/pnpm

# Code Editor
VS Code com extensões:
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- Thunder Client (API testing)
```

### Dependências de Produção

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.15.0",
  "@reduxjs/toolkit": "^1.9.5",
  "react-redux": "^8.1.2",
  "axios": "^1.5.0",
  "@tanstack/react-query": "^4.32.0",
  "tailwindcss": "^3.4.0",
  "@headlessui/react": "^1.7.17",
  "lucide-react": "^0.344.0",
  "framer-motion": "^10.16.0"
}
```

### Dependências de Desenvolvimento

```json
{
  "typescript": "^5.5.0",
  "vite": "^5.4.0",
  "@vitejs/plugin-react": "^4.0.0",
  "vitest": "^0.34.0",
  "@testing-library/react": "^13.4.0",
  "@testing-library/jest-dom": "^6.0.0",
  "eslint": "^8.45.0",
  "@typescript-eslint/eslint-plugin": "^6.0.0",
  "prettier": "^3.0.0",
  "husky": "^8.0.0",
  "lint-staged": "^13.2.0"
}
```

### Ferramentas de Design

- **Figma**: Design system e prototyping
- **Adobe Color**: Paleta de cores e brand consistency
- **Unsplash/Pexels**: Assets e imagens de alta qualidade

### Ferramentas de Produtividade

- **GitHub Projects**: Gestão de tarefas e roadmap
- **Notion**: Documentação e knowledge base
- **Slack/Discord**: Comunicação da equipe
- **Loom**: Screen recording para demos

## 🚀 FUNCIONALIDADES CORE

### 1. Multi-LLM Studio

- **Interface Unificada**: Chat com múltiplos modelos em uma única UI
- **Modelos Suportados**: GPT-4, Claude 3, Gemini Pro, Llama 2, PaLM
- **Recursos Avançados**: Streaming, regeneração, upload de arquivos
- **Personalização**: Configuração de parâmetros por modelo

### 2. Knowledge Management

- **Hierarquia Organizacional**: Workspace → Project → Document
- **Upload Inteligente**: Suporte a PDF, DOC, TXT, MD com OCR
- **Busca Semântica**: Full-text search com embeddings
- **Versionamento**: Controle de versões de documentos

### 3. Sistema de Permissões

- **RBAC**: Role-Based Access Control granular
- **Níveis de Acesso**: Owner, Editor, Viewer por workspace
- **Auditoria**: Logs de ações e alterações
- **SSO Integration**: Google OAuth e futuramente SAML

### 4. AI Agents Especializados

- **Research Agent**: Análise e síntese de documentos
- **Code Agent**: Assistência em desenvolvimento
- **Writing Agent**: Criação e edição de conteúdo
- **Business Agent**: Insights e análises estratégicas

## ⏱️ CRONOGRAMA ESTRATÉGICO

### Fase 1: Fundação (Semana 1)

**Objetivo**: Estabelecer base sólida para desenvolvimento

- Setup completo da arquitetura
- Design system inicial
- Estado global configurado
- APIs base funcionando

### Fase 2: Core Development (Semana 2)

**Objetivo**: Implementar funcionalidades principais

- Componentes UI completos
- Lógica de negócio implementada
- Integração de APIs
- Páginas principais funcionais

### Fase 3: Feature Integration (Semana 3)

**Objetivo**: Conectar todos os módulos

- Interface responsiva
- Recursos avançados
- Otimização inicial
- Testes de integração

### Fase 4: Polish & Quality (Semana 4)

**Objetivo**: Preparar para produção

- Refinamento final
- Performance otimizada
- Documentação completa
- Deploy ready

## 🎯 CRITÉRIOS DE SUCESSO

### Técnicos

- **Performance**: First Contentful Paint < 1.5s
- **Bundle Size**: < 500KB inicial, < 2MB total
- **Test Coverage**: > 80% cobertura de código
- **TypeScript**: 100% tipagem, zero `any`
- **Accessibility**: WCAG 2.1 AA compliance

### Funcionais

- **Multi-LLM**: 5+ modelos integrados funcionando
- **Real-time**: Streaming de respostas < 500ms latência
- **File Upload**: Suporte a múltiplos formatos + preview
- **Search**: Busca full-text em < 200ms
- **Permissions**: Sistema granular 100% funcional

### Negócio

- **User Experience**: SUS Score > 80
- **Adoption**: > 90% conclusão do onboarding
- **Performance**: > 95% satisfação em testes
- **Scalability**: Suporte a 1000+ usuários simultâneos

---

## 📊 STATUS DO PROJETO

### 🚨 **AUDITORIA CRÍTICA - REFATORAÇÃO ATOMIC DESIGN NECESSÁRIA**

**Data da Auditoria**: 21 de Julho de 2025  
**Status**: Refatoração Urgente - Violações Críticas do Atomic Design Descobertas

### ❌ **Problemas Críticos Identificados**

#### **Violações Fundamentais da Arquitetura**

- **React 18 + TypeScript**: ✅ Funcionando (300KB bundle)
- **Redux Toolkit**: ✅ Estado global implementado
- **Build Pipeline**: ✅ Funcionando perfeitamente
- **⚠️ PROBLEMA**: Atomic Design violado em múltiplos componentes

#### **Arquitetura Real Pós-Auditoria**

- **4 Templates**: ✅ Corretos (apenas composição)
- **14 Organisms**: ❌ **VIOLAÇÕES GRAVES** (elementos UI hardcoded)
- **11 Molecules**: ❌ **VIOLAÇÕES CRÍTICAS** (HTML específico hardcoded)
- **7 Atoms**: ❌ Parcialmente corretos (faltam atoms básicos)

#### **Features Funcionais (Requerem Refatoração UI)**

- **Multi-LLM Studio**: ✅ Funcional - ❌ UI viola atomic design
- **AI Agents**: ✅ Funcional - ❌ Components violam princípios
- **Knowledge Management**: ✅ Funcional - ❌ Cards precisam refatoração
- **Authentication**: ✅ Robusto - ❌ UI precisa refatoração

#### **Qualidade Técnica (Mantida)**

- **TypeScript**: ✅ 100% compliance, zero `any` types
- **Testing**: ✅ 27+ testes unitários passando
- **Performance**: ✅ Bundle otimizado (300KB)
- **❌ CRÍTICO**: Arquitetura atomic design violada

### 🔥 **Violações Identificadas na Auditoria**

| Componente | Violação | Linha | Prioridade |
| ---------- | -------- | ----- | ---------- |
| `ModelSelector.tsx` | Dropdown hardcoded | 72-169 | 🔥 CRÍTICA |
| `WorkspaceCard.tsx` | Card layout específico | 44-104 | 🔥 CRÍTICA |
| `Header.tsx` | Buttons `<button>` raw | 21-26 | 🔥 CRÍTICA |
| `ChatInterface.tsx` | Textarea hardcoded | 140+ | 🔥 CRÍTICA |
| `Input.tsx` | Lógica password toggle | 101-114 | 🔥 CRÍTICA |
| `ConversationList.tsx` | Elementos hardcoded | Múltiplas | 🔥 CRÍTICA |

### 🛠️ **Plano de Refatoração Obrigatório**

#### **Fase 1: Criação de Atoms Faltantes (1 dia)**
- [ ] Criar `Dropdown.tsx` atom
- [ ] Criar `Card.tsx` atom  
- [ ] Criar `Textarea.tsx` atom
- [ ] Refatorar `Input.tsx` (remover password toggle)

#### **Fase 2: Refatoração de Molecules (2 dias)**
- [ ] Refatorar `ModelSelector` (usar Dropdown atom)
- [ ] Refatorar `WorkspaceCard` (usar Card atom)
- [ ] Refatorar `MessageBubble` (usar atoms)
- [ ] Criar `PasswordInput` molecule

#### **Fase 3: Refatoração de Organisms (2 dias)**
- [ ] Refatorar `Header` (usar Button atoms)
- [ ] Refatorar `ChatInterface` (usar Textarea atom)
- [ ] Refatorar `ConversationList` (usar atoms/molecules)

#### **Fase 4: Validação (1 dia)**
- [ ] Auditoria pós-refatoração
- [ ] Comandos de verificação (lint, typecheck, build)
- [ ] Testes de funcionalidade

### 🚀 **Próximas Fases (Pós-Refatoração)**

Após correção das violações críticas:

1. **✅ Atomic Design Puro**: Implementação completa dos princípios
2. **🔧 Manutenibilidade Máxima**: Componentes totalmente reutilizáveis  
3. **📈 Expansão Segura**: Novos features seguindo padrões corretos
4. **🎯 Design System Completo**: Tokens e componentes consistentes
