# PLANNING - Estratégia de Code Review

## 🎯 Estratégia de Refatoração

O **Cognit AI Platform** possui base sólida (73% conformidade) que precisa ser **elevada para 95%+** através de revisão sistemática e refatoração dirigida por diretrizes técnicas estabelecidas.

> **📖 Referências**: `CLAUDE.md` (checklist técnico), `PRD.md` (problemas identificados), `TASKS.md` (roadmap de revisão)

## 💡 Abordagem de Revisão Sistemática

### 🔍 **Fase 1: Identificação e Mapeamento**
- **Análise Estática**: Localizar todos os pontos não conformes
- **Catalogação**: Mapear console.logs, imports diretos, tipos implícitos
- **Priorização**: Crítico > Alto > Médio > Baixo
- **Estimativa**: Calcular esforço por arquivo/componente

### 🔧 **Fase 2: Refatoração Dirigida**
- **Substituição Sistemática**: console.log → logger system
- **Padronização**: Imports diretos → barrel exports
- **Tipagem**: Tipos implícitos → interfaces explícitas
- **Validação**: Teste contínuo de funcionalidades

## 🏗️ Arquitetura de Código Atual (Para Contexto)

### **Estrutura Atomic Design Implementada**
```
src/components/
├── atoms/        # ✅ Button, Input, Icon, Avatar (UI básico)
├── molecules/    # ✅ SearchBar, MessageBubble (combinações)
├── organisms/    # ✅ ChatInterface, Header (lógica + UI)
└── templates/    # ✅ StudioTemplate, LoginTemplate (layout)
```

### **Stack Técnica Consolidada**
```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Stack                       │
├─────────────────────────────────────────────────────────┤
│  React 18 + TypeScript Strict + Redux Toolkit          │
│  Tailwind CSS + Atomic Design + Vite                    │
│  ↓                                                      │
│  Funcionalidades 100% Operacionais:                     │
│  • Multi-LLM Studio (5+ modelos)                        │
│  • AI Agents (5 especializados)                         │
│  • SSO Google + Knowledge Management                     │
│  • Chat Interface + Conversas + Favoritos               │
└─────────────────────────────────────────────────────────┘
```

### **Pontos de Não Conformidade Mapeados**
```
❌ Logging: 47 console.logs espalhados
❌ Imports: Barrel exports inconsistentes  
⚠️ Types: Alguns implícitos identificados
```

## 💻 Ferramentas de Revisão

### **Comandos de Validação Automática**
```bash
# Executar SEMPRE após mudanças
npm run lint      # Identifica problemas de código
npm run typecheck # Valida TypeScript strict
npm run test      # Garante funcionalidades preservadas
npm run build     # Confirma build sem erros
```

### **Padrões de Busca (Para Localizar Problemas)**
```bash
# Localizar console.logs
grep -r "console\." src/ --include="*.ts" --include="*.tsx"

# Localizar imports diretos (não barrel)
grep -r "from.*components.*/" src/ --include="*.ts" --include="*.tsx"

# Localizar tipos any
grep -r ": any" src/ --include="*.ts" --include="*.tsx"
```

## 📊 Metodologia de Revisão

### **Abordagem Sistemática por Arquivo**
1. **Análise**: Identificar problemas específicos no arquivo
2. **Priorização**: Ordenar correções por impacto (Crítico > Alto > Médio)  
3. **Refatoração**: Aplicar correções mantendo funcionalidade
4. **Validação**: Executar comandos de verificação
5. **Documentação**: Registrar mudanças realizadas

### **Critérios de Qualidade**
- ❌ **Bloqueadores**: console.logs desprotegidos, tipos `any`
- ⚠️ **Melhorias**: imports inconsistentes, componentes mal posicionados
- ✅ **Validações**: funcionalidades preservadas, testes passando

## 🎯 Meta Final

**Objetivo**: Transformar conformidade de **73% → 95%+**
**Princípio**: Zero quebras de funcionalidade
**Validação**: Comandos npm run (lint/typecheck/test/build) passando
**Timeline**: Revisão sistemática arquivo por arquivo

**🚨 CRÍTICO**: Este é um projeto em produção. Toda mudança deve ser incremental e segura.