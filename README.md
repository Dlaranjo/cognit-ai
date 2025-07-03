# Cognit Studio

Uma aplicação React que funciona como um agregador de LLMs (Large Language Models), permitindo aos usuários interagir com diferentes provedores de IA em uma interface unificada.

## 🚀 Status do Projeto

**Versão**: 1.0.0-beta  
**Status**: Em desenvolvimento  
**MVP Target**: 4 semanas  

## 📚 Documentação Completa

### 📖 **[Projeto Completo](./docs/projeto-completo.md)**
Documento mestre com todas as especificações técnicas, arquitetura, padrões de código e configurações.

### 🚀 **[Roadmap de Produção](./docs/roadmap-producao.md)**
Plano de entregas funcionais, métricas, infraestrutura e checklist de produção.

### 🏗️ **[Regras do Cursor](./.cursorrules)**
Configurações para desenvolvimento assistido por IA com padrões em português.

### 🎯 **[Tarefas de Desenvolvimento](./docs/tarefas-desenvolvimento.md)**
Atividades atômicas quebradas para iteração do Cursor com **commits automáticos via MCP GitHub**.

---

## ⚡ Quick Start

```bash
# Clone e setup
git clone <repository-url>
cd cognit-studio
npm install

# Configurar ambiente
cp .env.example .env.local
# Editar .env.local com suas configurações

# Desenvolvimento
npm start                # Servidor de desenvolvimento
npm test                 # Executar testes
npm run build            # Build de produção
```

## 🛠️ Stack Principal

- **React 18** + **TypeScript** (strict mode)
- **Redux Toolkit** para estado global
- **React Router v6** para roteamento
- **Axios** para HTTP com interceptors
- **Google SSO** para autenticação (IEBT)
- **Vite** para build otimizado

## 🎨 Funcionalidades

- ✅ **Autenticação SSO** Google IEBT
- ✅ **Chat com IA** streaming em tempo real
- ✅ **Upload de arquivos** (imagem, PDF, texto)
- ✅ **Múltiplos providers** (OpenAI, Anthropic, etc.)
- ✅ **Histórico de conversas** com busca
- ✅ **Sistema de feedback** (like/dislike)
- ✅ **Interface responsiva** mobile-first

## 📁 Estrutura de Desenvolvimento

```
cognit-studio/
├── .cursorrules              # Regras desenvolvimento IA
├── .cursor/rules/            # Regras especializadas
├── docs/                     # Documentação consolidada
│   ├── projeto-completo.md   # Especificação técnica completa
│   ├── roadmap-producao.md   # Plano de entregas e produção
│   ├── tarefas-desenvolvimento.md # Tarefas atômicas para IA
│   └── dados-mockados.md     # Dados simulados para desenvolvimento
├── src/
│   ├── components/           # Atomic Design (atoms/molecules/organisms)
│   ├── pages/                # Páginas da aplicação
│   ├── redux/                # Estado global modularizado
│   ├── hooks/                # Hooks customizados
│   ├── api/                  # Configuração e endpoints
│   ├── shared/               # Utils, types, config, mocks
│   └── styles/               # Estilos globais e temas
└── scripts/                  # Automações e deploy
```

## 🎯 Próximos Marcos

### **Sprint Atual: Setup Base** (Semana 1)
- [ ] Configuração inicial React + TypeScript
- [ ] Redux Toolkit store
- [ ] Autenticação mockada
- [ ] Rotas protegidas

### **MVP** (4 semanas)
- Chat funcional com streaming
- Upload de arquivos
- Gerenciamento de conversas
- Interface responsiva

### **Produção** (6 semanas)
- Performance otimizada
- Testes abrangentes
- Pipeline CI/CD
- Monitoramento

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Servidor desenvolvimento
npm run preview          # Preview build produção

# Qualidade
npm run lint             # Verificar problemas
npm run lint:fix         # Corrigir automático
npm run format           # Formatter Prettier
npm run type-check       # Verificar TypeScript

# Testes
npm test                 # Executar testes
npm run test:coverage    # Coverage report
npm run test:watch       # Modo watch

# Análise
npm run analyze          # Análise bundle
```

## 🏗️ Ambientes

- **Development**: `http://localhost:5173`
- **Staging**: `https://staging.cognit-studio.iebt.org.br`
- **Production**: `https://cognit-studio.iebt.org.br`

## 🤝 Contribuição

1. **Fork** o projeto
2. **Clone** seu fork
3. **Siga** as regras do `.cursorrules`
4. **Commite** seguindo [Conventional Commits](https://www.conventionalcommits.org/)
5. **Abra** um Pull Request

### Padrões de Commit
```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
style: formatação código
refactor: refatoração
test: adiciona/modifica testes
chore: tarefas manutenção
```

## 📊 Métricas Alvo

- **Performance**: Lighthouse > 90
- **Bundle**: < 500KB
- **Coverage**: > 80%
- **First Load**: < 1.5s

## 📄 Licença

[MIT License](./LICENSE)

---

## 🔗 Links Importantes

- [Especificação Completa](./docs/projeto-completo.md)
- [Roadmap Detalhado](./docs/roadmap-producao.md)
- [Tarefas para IA](./docs/tarefas-desenvolvimento.md)
- [Git Workflow](./docs/git-workflow.md)
- [Dados Mockados](./docs/dados-mockados.md)
- [Atomic Design](https://atomicdesign.bradfrost.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Testing Library](https://testing-library.com/)

---

**Última atualização**: 03/07/2025
