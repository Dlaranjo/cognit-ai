# 🚨 CONTEXTO CRÍTICO - REFATORAÇÃO ATOMIC DESIGN URGENTE

## ⚠️ LEIA ESTE ARQUIVO PRIMEIRO

**Para agentes sem contexto**: Este arquivo contém informações CRÍTICAS sobre o estado atual do projeto. Leia completamente antes de fazer qualquer alteração.

## 🔍 SITUAÇÃO ATUAL

### ❌ **PROBLEMA DESCOBERTO**
Uma auditoria revelou **violações graves do Atomic Design** em todo o projeto. Componentes estão criando elementos UI específicos ao invés de compor atoms existentes.

### 📊 **Estado Real dos Components**
```
src/components/
├── atoms/          ❌ 7 atoms (faltam: Dropdown, Card, Textarea)
├── molecules/      ❌ 11 molecules (violações críticas)  
├── organisms/      ❌ 14 organisms (elementos hardcoded)
└── templates/      ✅ 4 templates (corretos)
```

### 🚨 **Violações Críticas Identificadas**

#### Molecules com UI Hardcoded:
- `ModelSelector.tsx` - Dropdown hardcoded (linhas 72-169)
- `WorkspaceCard.tsx` - Card layout específico (linhas 44-104)
- `MessageBubble.tsx` - Estrutura complexa hardcoded

#### Organisms com Elementos Raw:
- `Header.tsx` - Buttons `<button>` raw ao invés de Button atom
- `ChatInterface.tsx` - Textarea hardcoded ao invés de Textarea atom
- `ConversationList.tsx` - Elementos específicos hardcoded

#### Atoms Problemáticos:
- `Input.tsx` - Contém lógica de password toggle (deveria ser molecule)

## 🎯 PRINCÍPIOS QUE DEVEM SER SEGUIDOS

### ✅ **Atomic Design Correto**

#### Atoms (Elementos UI Básicos)
```typescript
// ✅ CORRETO - Apenas elemento UI
export const Button = ({ variant, size, children, onClick }) => {
  return (
    <button 
      className={getVariantClasses(variant, size)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

#### Molecules (Composição de Atoms)
```typescript
// ✅ CORRETO - Apenas composição
export const SearchInput = ({ onSearch }) => {
  return (
    <div className="flex">
      <Input placeholder="Search..." />
      <Button variant="primary">
        <Icon name="search" />
      </Button>
    </div>
  );
};
```

#### Organisms (Lógica + Composição)
```typescript
// ✅ CORRETO - Lógica + molecules/atoms
export const UserProfile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <Card>
      <Avatar src={user.avatar} />
      <UserInfo user={user} />
      <Button onClick={() => setIsEditing(true)}>
        Edit
      </Button>
    </Card>
  );
};
```

### ❌ **Padrões Incorretos (Encontrados no Projeto)**

```typescript
// ❌ ERRADO - Molecule criando UI específico
export const ModelSelector = () => {
  return (
    <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-xl">
      <div className="p-4 border-b">
        // HTML específico hardcoded - VIOLAÇÃO!
      </div>
    </div>
  );
};

// ❌ ERRADO - Organism com elementos raw
export const Header = () => {
  return (
    <div>
      <button className="p-2"> {/* Raw button - VIOLAÇÃO! */}
        <Bell />
      </button>
    </div>
  );
};
```

## 🚀 INSTRUÇÕES PARA AGENTE

### 1. **LEIA OS DOCS OBRIGATÓRIOS**
```bash
docs/CLAUDE.md    # Diretrizes técnicas  
docs/TASKS.md     # Tarefas específicas de refatoração
docs/PLANNING.md  # Contexto do projeto
```

### 2. **EXECUTE COMANDOS DE VERIFICAÇÃO**
```bash
npm run lint      # Deve passar
npm run typecheck # Deve passar  
npm run build     # Deve funcionar
```

### 3. **INICIE PELA FASE 1 do TASKS.md**
- Criar atoms faltantes primeiro
- Seguir exatamente as specs do TASKS.md
- Executar testes após cada mudança

### 4. **REGRAS OBRIGATÓRIAS**
- **ZERO HTML hardcoded** em molecules
- **ZERO elementos raw** (`<button>`, `<input>`, etc) em organisms
- **Atoms apenas UI básico**, sem lógica de negócio
- **Manter todas as funcionalidades** existentes

## 🔧 ATOMS FALTANTES QUE DEVEM SER CRIADOS

### 1. Dropdown Atom
```typescript
// src/components/atoms/Dropdown.tsx
interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}
```

### 2. Card Atom  
```typescript
// src/components/atoms/Card.tsx
interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}
```

### 3. Textarea Atom
```typescript
// src/components/atoms/Textarea.tsx
interface TextareaProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  autoResize?: boolean;
}
```

## ⚠️ COMPONENTES QUE PRECISAM REFATORAÇÃO URGENTE

1. **ModelSelector.tsx** - Remover dropdown hardcoded
2. **WorkspaceCard.tsx** - Usar Card atom
3. **Header.tsx** - Usar Button atoms
4. **ChatInterface.tsx** - Usar Textarea atom
5. **Input.tsx** - Remover password toggle (criar PasswordInput molecule)

## 🎯 RESULTADO ESPERADO

Após refatoração completa:
- ✅ Zero violações do Atomic Design
- ✅ Componentes 100% reutilizáveis  
- ✅ Manutenibilidade máxima
- ✅ Todas as funcionalidades preservadas

## 📞 EMERGENCY CONTEXT

**Se você é um agente sem contexto anterior**:
1. Este projeto ESTAVA funcionando perfeitamente
2. Uma auditoria descobriu problemas arquiteturais graves  
3. Sua missão é corrigir as violações do Atomic Design
4. **NÃO QUEBRE** nenhuma funcionalidade existente
5. Siga rigorosamente o TASKS.md

**Status dos comandos** (devem continuar passando):
- ✅ `npm run lint` - passing
- ✅ `npm run typecheck` - passing  
- ✅ `npm run build` - passing (300KB bundle)
- ✅ Funcionalidades - todas funcionais

**Sua meta**: Implementar Atomic Design puro mantendo tudo funcionando.