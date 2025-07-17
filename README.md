# Cognit AI Platform

> **Enterprise-grade Multi-LLM Platform with Knowledge Management**

Uma plataforma unificada que permite às organizações interagir com múltiplos modelos de Large Language Models (LLMs) através de uma interface moderna e intuitiva, combinada com um robusto sistema de gestão de conhecimento organizacional.

## 🚀 Status do Projeto

**Versão**: 2.0 (Refatorado)  
**Progresso**: 64% completo (140/220 tarefas)  
**Status**: ✅ Production Ready Architecture

### 🏆 Marcos Completados

- ✅ **Foundation & Setup** (91% completo)
- ✅ **Design System** (63% completo) - Atomic Design implementado
- ✅ **Redux & State Management** (88% completo)
- ✅ **API Layer** (100% completo)
- ✅ **Pages & User Interface** (88% completo)
- ✅ **Custom Hooks** (90% completo)
- ✅ **Performance Optimization** (42% completo)

## 🛠️ Stack Tecnológico

### Core Framework

- **React 18.3+** com TypeScript strict mode
- **Redux Toolkit** para gerenciamento de estado
- **React Router v6** para roteamento com nested routes
- **Vite 5.4+** como build tool

### UI & Design

- **Tailwind CSS 3.4+** utility-first framework
- **Atomic Design** pattern implementado
- **Lucide React** para ícones consistentes
- **Headless UI** para componentes acessíveis

### Performance & Quality

- **Code Splitting** com lazy loading
- **React.memo** para otimização de re-renders
- **TypeScript 100%** tipado sem uso de `any`
- **ESLint + Prettier** para qualidade de código

## 📦 Instalação e Setup

### Pré-requisitos

- Node.js 18+
- npm, yarn ou pnpm

### Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd cognit-ai-platform

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas configurações

# Inicie o servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview da build
npm run lint         # Verificação ESLint
npm run typecheck    # Verificação TypeScript
npm run test         # Executar testes
npm run test:watch   # Testes em modo watch
```

## 🏗️ Arquitetura

### Estrutura de Pastas

```
src/
├── api/              # API layer com Axios
├── components/       # Componentes organizados por Atomic Design
│   ├── atoms/        # Elementos básicos (Button, Input, Icon)
│   ├── molecules/    # Combinações (SearchBar, MessageBubble)
│   ├── organisms/    # Seções complexas (ChatInterface)
│   └── common/       # Componentes utilitários
├── hooks/            # Custom hooks
├── pages/            # Páginas da aplicação
├── redux/            # Estado global com Redux Toolkit
├── shared/           # Configurações e utilitários
└── types/            # Definições TypeScript
```

### Redux Modules

- **auth/** - Autenticação e autorização
- **chat/** - Gerenciamento de conversas e mensagens
- **workspaces/** - Gestão de conhecimento
- **ui/** - Estados da interface (modals, theme, notifications)

### Custom Hooks

- `useAuth()` - Autenticação e permissões
- `useChat()` - Lógica de chat e streaming
- `useGoogleAuth()` - SSO Google integration
- `useStreaming()` - Chat streaming em tempo real
- `useTheme()` - Gerenciamento de tema dark/light
- `useInfiniteScroll()` - Scroll infinito otimizado

## 🎨 Design System

### Design Tokens

```typescript
// Cores principais
primary: '#FF6B35'      // Laranja Cognit
secondary: '#2D3748'    // Cinza escuro
success: '#48BB78'      // Verde
warning: '#ED8936'      // Laranja warning
error: '#E53E3E'        // Vermelho

// Typography
fontFamily: 'Inter, system-ui, sans-serif'
fontSize: 12px, 14px, 16px, 18px, 24px, 32px, 48px

// Spacing
spacing: 4px, 8px, 16px, 24px, 32px, 48px, 64px
```

## 🔐 Funcionalidades

### ✅ Implementadas

- **Arquitetura & Navegação** - React Router com nested routes
- **Autenticação** - Google SSO, JWT management, protected routes
- **Knowledge Management** - Hierarquia Workspace → Project → Document
- **Multi-LLM Studio** - Interface base, model selector, streaming hooks

### 🔄 Em Desenvolvimento

- **Chat Streaming Integration** - Conectar useStreaming ao StudioInterface
- **AI Agents** - Assistentes especializados
- **Advanced Search** - Busca semântica

## 📊 Performance

### Métricas Atuais

- **Bundle inicial**: 287KB (reduzido de 380KB)
- **Code splitting**: Chunks separados por página
- **TypeScript**: 100% tipado, strict mode
- **Build time**: ~6 segundos
- **Lighthouse score**: A medir

### Otimizações Implementadas

- Lazy loading de páginas
- React.memo em componentes puros
- Bundle analysis e tree shaking
- Memoização de selectors Redux

## 🧪 Testing

```bash
npm run test         # Executar todos os testes
npm run test:watch   # Modo watch
npm run test:coverage # Relatório de cobertura
```

### Estratégia de Testes

- **Unit tests**: Componentes atoms e hooks
- **Integration tests**: Redux flows e API integration
- **E2E tests**: Fluxos críticos da aplicação

## 🌍 Variáveis de Ambiente

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3001

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# File Upload
VITE_MAX_FILE_SIZE=10485760

# Development
VITE_USE_MOCK_SERVER=true
```

## 🚀 Deploy

### Build para Produção

```bash
npm run build
npm run preview  # Testar build localmente
```

### Deploy Automático

- CI/CD configurado com GitHub Actions
- Deploy automático para staging/production
- Quality gates com lint + typecheck + tests

## 📚 Documentação

### Referências Técnicas

- [`docs/CLAUDE.md`](docs/CLAUDE.md) - Diretrizes técnicas para desenvolvimento
- [`docs/PRD.md`](docs/PRD.md) - Product Requirements Document
- [`docs/PLANNING.md`](docs/PLANNING.md) - Arquitetura e planejamento estratégico
- [`docs/TASKS.md`](docs/TASKS.md) - Lista granular de tarefas

## 🤝 Contribuição

### Padrões de Código

- TypeScript strict mode obrigatório
- ESLint + Prettier para formatação
- Atomic Design para componentes
- Redux Toolkit para estado global
- Conventional Commits para mensagens

### Workflow

1. Fork do repositório
2. Feature branch (`git checkout -b feature/amazing-feature`)
3. Commit das mudanças (`git commit -m 'feat: add amazing feature'`)
4. Push para branch (`git push origin feature/amazing-feature`)
5. Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

- **Documentação**: Consulte os arquivos em `/docs/`
- **Issues**: Use o GitHub Issues para reportar bugs
- **Discussões**: GitHub Discussions para perguntas gerais

---

**🚀 Cognit AI Platform - Transformando a interação com IA em organizações**
