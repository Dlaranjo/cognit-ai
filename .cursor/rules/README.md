# Cursor Rules - Sistema Otimizado

## 📋 **RESUMO DA OTIMIZAÇÃO REALIZADA**

A estrutura anterior de 5 arquivos .mdc fragmentados foi **consolidada em um sistema otimizado** que maximiza a eficiência do Cursor AI através de melhor gestão de tokens e contexto mais focado.

## 🏗️ **NOVA ESTRUTURA**

### **Arquivo Principal: `.cursorrules`**
- **Função**: Contexto core sempre ativo
- **Conteúdo**: Padrões fundamentais, linguagem portuguesa, Atomic Design, Redux
- **Vantagem**: Single source of truth, carregamento eficiente

### **Regras Especializadas: `.cursor/rules/*.mdc`**
```
.cursor/rules/
├── 001-typescript-specialized.mdc    # Auto-attach para *.ts, *.tsx
├── 002-testing-patterns.mdc          # Auto-attach para *.test.*, *.spec.*
├── 003-mock-data.mdc                 # Manual, via @003-mock-data
└── README.md                         # Esta documentação
```

## 🎯 **COMO FUNCIONA**

### **Sistema de Precedência**
1. **`.cursorrules`** - Sempre ativo (base)
2. **`001-typescript-specialized.mdc`** - Ativa automaticamente em arquivos TypeScript
3. **`002-testing-patterns.mdc`** - Ativa automaticamente em arquivos de teste
4. **`003-mock-data.mdc`** - Ativação manual quando trabalhar com dados mockados

### **Configuração de Frontmatter**

| Arquivo | description | globs | alwaysApply | Comportamento |
|---------|-------------|-------|-------------|---------------|
| `.cursorrules` | N/A | N/A | N/A | Sempre ativo (legacy format) |
| `001-typescript-*` | ✅ Detalhada | `**/*.ts, **/*.tsx` | `false` | Auto-attach para TS |
| `002-testing-*` | ✅ Detalhada | `**/*.test.*, **/*.spec.*` | `false` | Auto-attach para testes |
| `003-mock-data` | ❌ Vazia | ❌ Vazia | `false` | Manual apenas |

## 📈 **BENEFÍCIOS DA OTIMIZAÇÃO**

### **1. Eficiência de Tokens**
- **Antes**: ~2500 tokens carregados sempre (5 arquivos)
- **Depois**: ~800 tokens base + contexto específico quando necessário
- **Economia**: ~70% redução no uso desnecessário de tokens

### **2. Contexto Mais Relevante**
- Regras TypeScript só aparecem quando editando TS
- Regras de teste só aparecem quando trabalhando com testes
- Mock data só quando explicitamente solicitado

### **3. Manutenção Simplificada**
- Arquivo principal centralizado e fácil de atualizar
- Especializações organizadas por domínio
- Zero redundância entre regras

## 🔧 **COMO USAR**

### **Desenvolvimento Normal**
```bash
# Ao abrir qualquer arquivo .tsx
# ✅ Carrega: .cursorrules + 001-typescript-specialized.mdc
# 🎯 Contexto: Padrões gerais + TypeScript específico
```

### **Trabalhando com Testes**
```bash
# Ao abrir qualquer arquivo .test.ts
# ✅ Carrega: .cursorrules + 001-typescript-specialized.mdc + 002-testing-patterns.mdc
# 🎯 Contexto: Padrões gerais + TypeScript + Testes
```

### **Usando Dados Mockados**
```bash
# No chat do Cursor
"@003-mock-data Preciso criar uma nova API mockada para upload"
# ✅ Carrega: .cursorrules + 003-mock-data.mdc
# 🎯 Contexto: Padrões gerais + Sistema de mocks
```

## 📚 **REFERÊNCIAS DE DOCUMENTAÇÃO**

### **Arquivos de Apoio**
- [docs/arquitetura.md](mdc:docs/arquitetura.md) - Especificações técnicas completas
- [docs/plano-desenvolvimento.md](mdc:docs/plano-desenvolvimento.md) - 100 micro tarefas organizadas
- [docs/dados-mockados.md](mdc:docs/dados-mockados.md) - Sistema completo de mocks
- [docs/historias-usuario.md](mdc:docs/historias-usuario.md) - Requisitos funcionais

### **Estrutura do Projeto**
```
cognit-ai/
├── .cursorrules                    # ← CORE: Sempre ativo
├── .cursor/rules/                  # ← ESPECIALIZADAS: Contextuais
│   ├── 001-typescript-specialized.mdc
│   ├── 002-testing-patterns.mdc
│   ├── 003-mock-data.mdc
│   └── README.md
├── docs/                          # ← DOCUMENTAÇÃO: Referência
│   ├── arquitetura.md
│   ├── plano-desenvolvimento.md
│   ├── dados-mockados.md
│   └── historias-usuario.md
└── README.md                      # ← VISÃO GERAL: Links organizados
```

## 🚀 **PRÓXIMOS PASSOS**

1. **Iniciar desenvolvimento** seguindo as tarefas do [docs/plano-desenvolvimento.md](mdc:docs/plano-desenvolvimento.md)
2. **Usar dados mockados** conforme [docs/dados-mockados.md](mdc:docs/dados-mockados.md)
3. **Seguir arquitetura** definida em [docs/arquitetura.md](mdc:docs/arquitetura.md)
4. **Implementar histórias** descritas em [docs/historias-usuario.md](mdc:docs/historias-usuario.md)

## ⚠️ **IMPORTANTE**

- **Não editar** os frontmatter dos arquivos .mdc diretamente
- **Sempre usar português** para nomes de variáveis, funções e comentários
- **Seguir Atomic Design** rigorosamente conforme estrutura obrigatória
- **Consultar este README** antes de modificar a estrutura de regras

---

Esta estrutura otimizada garante que o Cursor AI tenha sempre o contexto necessário sem desperdício de tokens, resultando em respostas mais precisas e desenvolvimento mais eficiente. 