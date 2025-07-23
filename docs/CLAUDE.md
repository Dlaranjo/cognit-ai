# CLAUDE - Checklist de Validação Técnica

## 🎯 Objetivo

Checklist técnico obrigatório para validação de conformidade do **Cognit AI Platform** durante code review e refatoração sistemática.

> **📖 Referências**: `PLANNING.md` (metodologia), `PRD.md` (problemas identificados), `TASKS.md` (roadmap revisão)

## 🚨 **PROBLEMAS CRÍTICOS A VALIDAR**

**Conformidade Atual**: 73% → **Meta**: 95%+

### ❌ Logging System (CRÍTICO)
- **Problema**: 47+ console.logs sem proteção
- **Localizar**: `grep -r "console\." src/`
- **Corrigir**: Usar `logger.dev()`, `logger.error()`
- **Arquivo**: `src/shared/utils/logger.ts`

### ❌ Import Patterns (ALTO)  
- **Problema**: Barrel exports inconsistentes
- **Localizar**: `grep -r "from.*components.*/" src/`
- **Corrigir**: Usar `from '@/components/atoms'`
- **Validar**: `index.ts` em cada pasta components/

### ⚠️ TypeScript Strict (ALTO)
- **Problema**: Tipos implícitos e `any`
- **Localizar**: `grep -r ": any" src/`
- **Corrigir**: Interfaces explícitas
- **Garantir**: 100% strict mode compliance

## ✅ Checklist de Validação por Arquivo

### **1. LOGGING COMPLIANCE**
```typescript
// ❌ PROIBIDO
console.log("Debug info");
console.error("Error occurred");

// ✅ OBRIGATÓRIO  
import { logger } from '@/shared/utils/logger';
logger.dev("Debug info", data);
logger.error("Error occurred", error);
```

### **2. IMPORT PATTERNS**
```typescript
// ✅ CORRETO - Barrel exports
import { Button, Input } from '@/components/atoms';
import { SearchBar } from '@/components/molecules';
import { ChatInterface } from '@/components/organisms';

// ❌ EVITAR - Imports diretos desnecessários
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
```

### **3. TYPESCRIPT STRICT**
```typescript
// ✅ CORRETO - Props totalmente tipadas
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
}

// ❌ PROIBIDO - any ou tipos implícitos
const handleClick = (data: any) => { ... }
const handleClick = (data) => { ... } // implícito
```

## 📁 Atomic Design - Estrutura Obrigatória

```
src/components/
├── atoms/        # ✅ UI básico: Button, Input, Icon, Avatar
├── molecules/    # ✅ Combinações: SearchBar, MessageBubble  
├── organisms/    # ✅ Lógica + UI: ChatInterface, Header
└── templates/    # ✅ Layout: StudioTemplate, LoginTemplate
```

### **4. ATOMIC DESIGN COMPLIANCE**
- **atoms/**: Sem lógica de negócio, apenas UI
- **molecules/**: Estado local simples permitido
- **organisms/**: Conectados ao Redux quando necessário  
- **templates/**: Estrutura de página + composição

## 🎨 Design System - Tokens Obrigatórios

```typescript
// CORES PADRÃO - NÃO ALTERAR
colors: {
  primary: '#FF6B35',      // Laranja Cognit
  secondary: '#2D3748',    // Cinza escuro
  success: '#48BB78',      // Verde  
  warning: '#ED8936',      // Laranja warning
  error: '#E53E3E',        // Vermelho
}

// USAR CLASSES TAILWIND CORRESPONDENTES
'bg-primary' 'text-secondary' 'border-success'
```

## ⚙️ Comandos de Verificação OBRIGATÓRIOS

### **SEMPRE Executar Após Mudanças**
```bash
npm run lint      # ESLint deve passar 100%
npm run typecheck # TypeScript sem erros  
npm run test      # Testes não podem quebrar
npm run build     # Build deve funcionar
```

### **Busca de Problemas**
```bash
# Localizar console.logs
grep -r "console\." src/ --include="*.ts" --include="*.tsx"

# Localizar imports diretos
grep -r "from.*components.*/" src/ --include="*.ts" --include="*.tsx"  

# Localizar tipos any
grep -r ": any" src/ --include="*.ts" --include="*.tsx"
```

## ❌ Práticas PROIBIDAS

- **Usar `any`** em TypeScript - sempre tipos explícitos
- **console.log direto** - usar logger.dev() ou logger.error()
- **Imports diretos** - usar barrel exports consistentemente  
- **Componentes sem tipagem** - sempre interface/type
- **Mutação direta Redux** - usar createSlice
- **Quebrar funcionalidades** - testar sempre após mudanças

## 📊 Status de Conformidade

### **Meta: 73% → 95%+**

**✅ Mantidos (Não Alterar)**
- Funcionalidades: 100% operacionais
- TypeScript: 100% strict mode
- Architecture: 92% Atomic Design

**❌ Críticos (Corrigir Obrigatoriamente)**  
- Logging: 0% conforme (47 console.logs)
- Imports: 65% conforme (inconsistente)

## 🎯 Fluxo de Validação

**Para cada arquivo revisado:**

1. ✅ **Localizar problemas** (grep console.log, imports, any)
2. ✅ **Aplicar correções** (logger, barrel exports, tipos)
3. ✅ **Executar comandos** (lint, typecheck, test, build)
4. ✅ **Validar funcionalidade** (não quebrar features)
5. ✅ **Documentar mudanças** (o que foi corrigido)

**🚨 CRÍTICO**: Projeto em produção - zero quebras permitidas.