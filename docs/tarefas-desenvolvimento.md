# Tarefas de Desenvolvimento - Cognit Studio

## 🎯 METODOLOGIA DE ITERAÇÃO

Este documento contém **tarefas atômicas** para desenvolvimento assistido por IA. Cada tarefa:
- ✅ Pode ser completada em uma única iteração (15-30min)
- ✅ Tem contexto claro e arquivos específicos
- ✅ Inclui critérios de validação
- ✅ Segue ordem lógica de dependências
- ✅ **COMMIT AUTOMÁTICO** obrigatório ao finalizar

### **🔄 PROCEDIMENTO PADRÃO POR TAREFA:**

1. **Implementar** a tarefa conforme especificação
2. **Validar** todos os critérios de sucesso
3. **Testar** que não quebrou funcionalidades existentes
4. **Commit + Push** automático via MCP GitHub
5. **Marcar** tarefa como ✅ concluída no tracking

### **📝 PADRÃO DE COMMIT:**
```
<tipo>(tarefa): <descrição-concisa>

Implementa TAREFA XXX: <objetivo-da-tarefa>

- <item-principal-1>
- <item-principal-2>
- <item-principal-3>

Validação: ✅ Todos os critérios atendidos
```

---

## 📋 FASE 1: SETUP E FUNDAÇÃO

### **TAREFA 001: Setup Inicial do Projeto**
```
🎯 OBJETIVO: Criar projeto React + TypeScript base funcional

📂 COMANDO:
Execute: ./scripts/setup-projeto.sh
Valide que o projeto roda com npm run dev

📁 ARQUIVOS ESPERADOS:
- cognit-studio/ (pasta do projeto)
- package.json com dependências corretas
- tsconfig.json configurado
- src/ com estrutura Atomic Design

✅ VALIDAÇÃO:
- [ ] Projeto roda em localhost:5173
- [ ] TypeScript compila sem erros
- [ ] ESLint passa sem warnings
- [ ] Estrutura de pastas criada corretamente

📝 COMMIT:
feat(tarefa): setup inicial projeto React + TypeScript

Implementa TAREFA 001: Criar projeto React + TypeScript base funcional

- Projeto React com Vite configurado
- Estrutura Atomic Design criada
- TypeScript strict mode ativo
- ESLint + Prettier configurados

Validação: ✅ Todos os critérios atendidos

🔗 REFERÊNCIA: scripts/setup-projeto.sh
```

### **TAREFA 002: Configurar Redux Store**
```
🎯 OBJETIVO: Implementar Redux Toolkit store base

📁 ARQUIVOS:
- src/redux/store.ts
- src/redux/rootReducer.ts
- src/main.tsx (adicionar Provider)

💻 IMPLEMENTAR:
1. Criar store.ts com configuração básica
2. Criar rootReducer.ts vazio (preparado para módulos)
3. Adicionar Redux Provider no main.tsx
4. Configurar Redux DevTools para development

✅ VALIDAÇÃO:
- [ ] Store conectado à aplicação
- [ ] Redux DevTools funcionando
- [ ] Sem erros de TypeScript
- [ ] App ainda renderiza normalmente

📝 COMMIT:
feat(tarefa): configurar Redux Toolkit store base

Implementa TAREFA 002: Implementar Redux Toolkit store base

- Store.ts com configuração básica criado
- RootReducer preparado para módulos
- Redux Provider integrado ao main.tsx
- Redux DevTools habilitado para development

Validação: ✅ Todos os critérios atendidos

🔗 REFERÊNCIA: docs/projeto-completo.md seção "API e Estado"
```

### **TAREFA 003: Módulo Redux Auth**
...

---

## 📊 TRACKING DE PROGRESSO

### **FASE 1: Setup e Fundação**
- [x] T001: Setup Inicial do Projeto `feat(tarefa): setup inicial projeto React + TypeScript`
- [x] T002: Configurar Redux Store `feat(tarefa): configurar Redux Toolkit store base`
- [ ] T003: Módulo Redux Auth `feat(tarefa): implementar módulo Redux auth mockado`
- [ ] T004: Hook useAutenticacao `feat(tarefa): criar hook useAutenticacao customizado`
- [ ] T005: React Router e Rotas Protegidas `feat(tarefa): configurar React Router com rotas protegidas`

### **FASE 2: Componentes Atoms**
- [ ] T006: Componente Botao `feat(tarefa): criar componente Botao atômico completo`
- [ ] T007: Componente Input `feat(tarefa): criar componente Input com validação`
- [ ] T008: Componente Avatar `feat(tarefa): criar componente Avatar do usuário`

### **FASE 3: Interface de Chat**
- [ ] T009: Redux Chat Module `feat(tarefa): implementar Redux chat module`
- [ ] T010: Componente BolhaMensagem `feat(tarefa): criar componente BolhaMensagem`
- [ ] T011: Componente EntradaMensagem `feat(tarefa): criar componente EntradaMensagem`
- [ ] T012: Hook useChat `feat(tarefa): criar hook useChat para lógica`

### **FASE 4: Layout e Navegação**
- [ ] T013: Layout Principal `feat(tarefa): criar layout principal responsivo`
- [ ] T014: Página Chat Completa `feat(tarefa): integrar página chat completa`

---

*Este documento será atualizado conforme o progresso. Cada tarefa completada deve ser marcada com ✅*
