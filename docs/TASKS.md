# TASKS - Status Atual do Projeto

## 📊 Status Geral

**Projeto**: Cognit AI Platform  
**Status**: ⚠️ **REFATORAÇÃO NECESSÁRIA**  
**Última Atualização**: Julho 2025  

> **📖 Referências**: `CLAUDE.md` (técnico), `PLANNING.md` (estratégico), `PRD.md` (funcional)

## 🚨 TAREFAS CRÍTICAS DE CONFORMIDADE

### 🔄 CONTEXTO ESSENCIAL PARA AGENTES

⚠️ **SITUAÇÃO ATUAL**: O **Cognit AI Platform** está em **produção com dados mockados** até a API real ser desenvolvida. Todas as funcionalidades estão operacionais através de sistema mock robusto.

#### Por que isto é CRÍTICO:
- Sistema mock usa `console.log` para debugging em **produção**
- Remover todos os console.logs **QUEBRARIA** o ambiente atual
- Solução: **logging condicional** que preserva funcionalidade mock

#### Arquivos Mock Críticos (NÃO remover console.logs sem proteção):
```bash
src/api/mockServer.ts           # Servidor mock principal
src/api/mock/mockResponses.ts   # Responses simuladas  
src/api/mock/mockData.ts        # Dados de exemplo
src/components/organisms/StudioChatInterface.tsx  # 8 logs de streaming
```

**Após investigação QA detalhada, foram identificadas violações das diretrizes técnicas que requerem correção com cuidado especial ao ambiente mockado.**

## 🔥 PRIORIDADE CRÍTICA - SEMANA 1

### 1. ❌ SISTEMA DE LOGGING (Mock-Safe) 
**Status**: 0% Conforme | **Risco**: Alto - Segurança  
**Problema**: 47 console.* sem proteção, mas **PRESERVAR funcionalidade mock**

#### ⚠️ ATENÇÃO: Abordagem Mock-Safe
**NÃO** remover console.logs diretamente - isto quebrará produção mockada!

**Tarefas Obrigatórias (Ordem Sequencial)**:

**Fase 1 - Criar Sistema de Logging:**
- [ ] **CRÍTICO**: Criar `src/shared/utils/logger.ts` com proteção mock
- [ ] **CRÍTICO**: Implementar logging condicional (`DEV` OR `MOCK` mode)
- [ ] **CRÍTICO**: Configurar variável `VITE_USE_MOCK=true` atual

**Fase 2 - Migrar Console.logs Gradualmente:**
- [ ] **ALTA**: Substituir logs de desenvolvimento por `logger.dev()`
- [ ] **ALTA**: Substituir logs de mock por `logger.mock()`  
- [ ] **ALTA**: Manter logs de erro como `logger.error()`

**Fase 3 - Configurar Build Condicional:**
- [ ] **MÉDIA**: Configurar Vite condicional (só remove se `VITE_USE_MOCK !== 'true'`)
- [ ] **MÉDIA**: Configurar ESLint condicional para console.logs

#### Arquivos Prioritários (47 ocorrências):
```bash
# CRÍTICO - Logs de teste para remover imediatamente
src/api/mock/mockResponses.ts:14 - console.log('Olá, mundo!')

# IMPORTANTE - Migrar para logger.mock()
src/components/organisms/StudioChatInterface.tsx - 8 logs de streaming
src/api/mockServer.ts - 4 logs de servidor mock

# MÉDIO - Migrar para logger.error()  
src/hooks/useLocalStorage.ts - 4 logs de error handling
```

#### Template do Logger (DEVE ser implementado primeiro):
```typescript
// src/shared/utils/logger.ts
const isDev = import.meta.env.DEV;
const isMockMode = import.meta.env.VITE_USE_MOCK === 'true';

export const logger = {
  // Permitido em desenvolvimento OU modo mock
  mock: (message: string, data?: any) => {
    if (isDev || isMockMode) {
      console.log(`[MOCK] ${message}`, data);
    }
  },
  
  dev: (message: string, data?: any) => {
    if (isDev) {
      console.log(`[DEV] ${message}`, data);
    }
  },
  
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
  }
};
```

#### Verificação Segura:
```bash
# Após implementar logger
grep -r "console\." src/           # Deve mostrar apenas logs migrados
npm run build                      # Deve incluir logs mock se VITE_USE_MOCK=true
npm run dev                        # Deve funcionar normalmente
```

### 2. ⚠️ IMPORTS INCONSISTENTES (65% Conforme)  
**Status**: Não Conforme | **Risco**: Médio - Manutenibilidade
**Problema**: Barrel exports não utilizados - 24+ arquivos afetados

#### Contexto para Agente:
O projeto tem arquivos `index.ts` (barrel exports) implementados, mas muitos componentes importam diretamente dos arquivos específicos ao invés de usar os centralizados.

**Estrutura Atual:**
```bash
src/components/
├── atoms/index.ts          # ✅ Existe - exports centralizados
├── molecules/index.ts      # ✅ Existe - exports centralizados  
├── organisms/index.ts      # ✅ Existe - exports centralizados
└── templates/index.ts      # ✅ Existe - exports centralizados
```

**Tarefas Sequenciais:**

**Fase 1 - Verificar Barrel Exports:**
- [ ] **ALTA**: Verificar se todos os index.ts estão completos e atualizados
- [ ] **ALTA**: Garantir que novos componentes estão exportados nos index.ts

**Fase 2 - Refatorar Imports (24+ arquivos):**
- [ ] **ALTA**: Refatorar atoms: `from '../atoms/Button'` → `from '../atoms'`
- [ ] **ALTA**: Refatorar molecules: `from '../molecules/SearchBar'` → `from '../molecules'`
- [ ] **ALTA**: Refatorar organisms: `from '../organisms/Header'` → `from '../organisms'`

**Fase 3 - Padronizar Ordem:**
- [ ] **MÉDIA**: Implementar ordem padrão: External → Internal → Types
- [ ] **MÉDIA**: Configurar ESLint rules para imports

#### Arquivos Prioritários Identificados:
```bash
# Atoms importados diretamente (11+ ocorrências)
src/App.tsx:22 - import { Spinner } from './components/atoms/Spinner'
src/components/molecules/UserProfile.tsx:3-5 - 3 imports diretos
src/components/molecules/SearchBar.tsx:3-4 - 2 imports diretos

# Molecules importados diretamente (13+ ocorrências)  
src/components/organisms/ChatInterface.tsx:3-4 - 2 imports diretos
src/components/organisms/Sidebar.tsx:4-6 - 3 imports diretos
```

#### Padrão Correto (Objetivo):
```typescript
// ✅ CORRETO (usar sempre)
import { Button, Input, Spinner } from '../atoms';
import { MessageBubble, SearchBar } from '../molecules';
import { ChatInterface } from '../organisms';

// ❌ ERRADO (encontrado atualmente)
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { MessageBubble } from '../molecules/MessageBubble';
```

#### Verificação:
```bash
# Após refatoração
grep -r "from.*atoms/" src/        # Não deve retornar resultados
grep -r "from.*molecules/" src/    # Não deve retornar resultados  
grep -r "from '../atoms'" src/     # Deve mostrar imports corretos
```

## 🟡 PRIORIDADE ALTA - SEMANA 2-3

### 3. ⚠️ REDUX ESTRUTURA (92% Conforme)
**Tarefas Pendentes**:
- [ ] **MÉDIA**: Criar `/src/redux/ui/uiActions.ts` para completar estrutura padrão
- [ ] **MÉDIA**: Padronizar export em `agentsReducer.ts` para consistência

### 4. ⚠️ ATOMIC DESIGN REFINAMENTO (92% Conforme) 
**Tarefas de Melhoria**:
- [ ] **MÉDIA**: Extrair lógica de auto-resize do `Textarea.tsx` para hook customizado
- [ ] **MÉDIA**: Simplificar validações em `FileUpload.tsx` 
- [ ] **BAIXA**: Remover `console.warn` de `Icon.tsx` (side effect em atom)

## ✅ ÁREAS CONFORMES (Manter Padrão)

### ✅ TypeScript Strict Compliance (100% Conforme)
- Zero uso de `any` em todo o codebase
- Strict mode ativado e funcionando
- Props totalmente tipadas em todos os componentes

### ✅ Funcionalidades Core (100% Implementadas)
- **Multi-LLM Studio**: Chat streaming com 5+ modelos funcionais
- **Knowledge Management**: Sistema hierárquico completo
- **AI Agents**: 5 agentes especializados operacionais  
- **Enterprise Security**: SSO Google + JWT + RBAC implementados
- **Search Engine**: Full-text search com filtros funcionais

### ✅ Arquitetura Atomic Design (92% Conforme)
- **4 Templates + 14 Organisms + 11 Molecules + 10 Atoms** implementados
- Separação de responsabilidades clara
- Componentes reutilizáveis e modulares

## 🛠️ COMANDOS DE CONFORMIDADE

### Verificação Obrigatória (Devem Passar)
```bash
npm run lint         # ❌ Falha por console.logs
npm run typecheck    # ✅ Passa
npm run test         # ✅ 27+ testes passando  
npm run build        # ✅ Passa (mas inclui console.logs)
```

### Após Correções (Meta)
```bash
npm run lint         # ✅ Deve passar sem warnings
npm run typecheck    # ✅ Mantém aprovação
npm run test         # ✅ Mantém 27+ testes  
npm run build        # ✅ Bundle limpo sem logs
```

## 📊 CRONOGRAMA DE REFATORAÇÃO

### 📅 Semana 1 - CRÍTICO (Mock-Safe)
**Foco**: Sistema de logging que preserva funcionalidade mock
- [ ] **Dia 1**: Criar `logger.ts` com proteção condicional (mock + dev)
- [ ] **Dia 2-3**: Migrar console.logs críticos gradualmente
- [ ] **Dia 4**: Configurar Vite/ESLint condicional (preservar mock)
- [ ] **Dia 5**: Testar build com `VITE_USE_MOCK=true` funcionando

**Entregável**: Sistema logging que mantém produção mockada operacional

### 📅 Semana 2-3 - REFATORAÇÃO  
**Foco**: Padronização de imports e estrutura
- [ ] **Semana 2**: Refatorar imports em atoms e molecules (24+ arquivos)
- [ ] **Semana 3**: Implementar verificações ESLint de imports
- [ ] **Teste**: Verificar manutenibilidade melhorada

**Entregável**: Imports 100% padronizados

### 📅 Semana 4 - POLIMENTO
**Foco**: Completar estruturas e refinamentos
- [ ] **Dia 1-2**: Completar módulo Redux UI
- [ ] **Dia 3-4**: Refinar componentes Atomic Design
- [ ] **Dia 5**: Documentação e validação final

**Entregável**: 100% conformidade com diretrizes

## 🎯 MÉTRICAS DE SUCESSO

### Estado Atual vs Meta
| Categoria | Atual | Meta | Prioridade |
|-----------|--------|------|-----------|
| **Console.logs** | 0% | 100% | 🚨 CRÍTICA |
| **Imports** | 65% | 100% | 🔴 ALTA |
| **Redux** | 92% | 100% | 🟡 MÉDIA |
| **Atomic Design** | 92% | 98%+ | 🟡 MÉDIA |
| **TypeScript** | 100% | 100% | ✅ MANTIDO |

### Impacto Esperado Pós-Correção
- **+100% Segurança**: Zero logs expostos em produção
- **+50% Manutenibilidade**: Imports totalmente padronizados  
- **+25% Consistência**: Estrutura Redux 100% uniforme
- **+15% Qualidade**: Atomic Design refinado

## 🚀 RESULTADO FINAL ESPERADO

Após completar todas as tarefas de conformidade:

```bash
# Comandos que devem passar 100%
npm run lint         # ✅ ZERO warnings
npm run typecheck    # ✅ ZERO errors  
npm run test         # ✅ 27+ testes passando
npm run build        # ✅ Bundle limpo para produção
```

**Status Final**: ✅ **100% ENTERPRISE READY**

## 🔗 RECURSOS E REFERÊNCIAS

### 📋 Checklists de Conformidade
```bash
# Verificação diária durante refatoração
./quick-check.sh           # Script de verificação rápida
npm run lint -- --fix     # Auto-corrigir problemas ESLint
npm run typecheck          # Verificar tipagem
grep -r "console\." src/   # Buscar console.logs restantes
```

### 📚 Documentação Relacionada
- **`CLAUDE.md`**: Diretrizes técnicas completas
- **`PRD.md`**: Especificações funcionais
- **`PLANNING.md`**: Visão arquitetural
- **`TASKS.md`**: Este documento (tarefas atuais)

### 🎯 Definição de Pronto (DoD)
Para considerar as tarefas de conformidade completas:

**✅ Console.logs**:
- Zero ocorrências de `console.*` no bundle de produção
- ESLint configurado com `no-console: error` em produção
- Sistema de logging implementado com proteção `DEV`

**✅ Imports**:
- 100% dos components usando barrel exports (`from '../atoms'`)
- Ordem de imports padronizada em todos os arquivos
- ESLint import rules configuradas e passando

**✅ Redux**:
- Módulo UI com estrutura completa (actions.ts incluído)
- Exports padronizados em todos os reducers

**✅ Build Pipeline**:
- `npm run lint` - 0 warnings
- `npm run typecheck` - 0 errors  
- `npm run test` - 27+ testes passando
- `npm run build` - sucesso sem logs

---

## 🤖 INSTRUÇÕES PARA AGENTES

### ⚠️ AVISOS CRÍTICOS ANTES DE COMEÇAR:

1. **NUNCA QUEBRAR PRODUÇÃO MOCKADA**:
   - Sistema está em produção com dados mock
   - Console.logs são FUNCIONAIS no ambiente atual
   - Sempre implementar proteção condicional primeiro

2. **ORDEM DE EXECUÇÃO OBRIGATÓRIA**:
   - ✅ Criar logger.ts ANTES de migrar qualquer console.log
   - ✅ Testar cada arquivo individualmente após mudança
   - ✅ Verificar que modo mock ainda funciona

3. **COMANDOS DE VERIFICAÇÃO CONTÍNUA**:
```bash
# Verificar que mock ainda funciona
npm run dev                 # Interface deve carregar normalmente
grep -r "console\." src/    # Monitorar logs restantes
npm run build               # Build deve passar
```

### 📋 CHECKLIST OBRIGATÓRIO ANTES DE COMMIT:

**Para Logging (Semana 1)**:
- [ ] Logger.ts implementado com proteção mock/dev
- [ ] Pelo menos logs de teste removidos (mockResponses.ts:14)
- [ ] Vite configurado condicionalmente
- [ ] Interface mock funciona normalmente em dev

**Para Imports (Semana 2-3)**:
- [ ] Barrel exports verificados e completos
- [ ] Pelo menos 50% dos imports diretos corrigidos
- [ ] Nenhum import quebrado após refatoração
- [ ] Build passa sem erros

### 🆘 PROBLEMAS POSSÍVEIS E SOLUÇÕES:

**Se mock parar de funcionar:**
1. Verificar `VITE_USE_MOCK=true` nas variáveis
2. Verificar se logger.mock() está sendo usado
3. Reverter última mudança e testar gradualmente

**Se imports quebrarem:**
1. Verificar se todos os componentes estão exportados no index.ts
2. Usar busca/substituição gradual (arquivo por arquivo)
3. Testar componente após cada mudança

### 🎯 DEFINIÇÃO DE SUCESSO:

**Semana 1 Completa:**
- Sistema de logging implementado ✓
- Produção mockada funcionando ✓
- Console.logs protegidos ✓

**Semana 2-3 Completa:**
- Imports padronizados (barrel exports) ✓
- Zero imports diretos de atoms/molecules ✓
- Manutenibilidade melhorada ✓

## 📞 PRÓXIMOS PASSOS

1. **Ler todos os documentos em @docs/** (contexto completo)
2. **Começar com Tarefa 1 - Logging Mock-Safe** (CRÍTICO)
3. **Seguir ordem sequencial estabelecida**
4. **Verificar conformidade após cada etapa**
5. **Atualizar este documento** conforme progresso

**Resultado Final**: Projeto 100% conforme com diretrizes enterprise, mantendo funcionalidade mockada intacta até transição para API real.