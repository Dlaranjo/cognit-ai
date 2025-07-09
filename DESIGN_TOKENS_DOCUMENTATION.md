# Design Tokens - Documentação das Melhorias

## Visão Geral

Este documento detalha as melhorias implementadas no sistema de design tokens do Cognit Studio, focando em consistência visual, acessibilidade WCAG AA e flexibilidade para diferentes contextos de uso.

## Principais Melhorias Implementadas

### 1. Sistema de Cores Corporativas

#### Paleta Primária Expandida
- **Antes**: Apenas 5 variações da cor primária
- **Depois**: Sistema completo com 11 variações (50-950) + estados interativos

```css
/* Novo sistema de cores primárias */
--color-primary-50: #FFF4F1;   /* Muito claro */
--color-primary-100: #FFE0D6;  /* Claro */
--color-primary-500: #FF6B35;  /* Base */
--color-primary-900: #BF360C;  /* Escuro */
--color-primary-950: #8D2A0A;  /* Muito escuro */

/* Estados interativos */
--color-primary-hover: #FF5722;
--color-primary-active: #E64A19;
--color-primary-focus: rgba(255, 107, 53, 0.2);
```

#### Cores Neutras Sistemáticas
- Sistema de 11 variações de neutros (50-950)
- Contraste WCAG AA garantido
- Aliases semânticos para facilitar uso

#### Cores de Status Expandidas
- 4 categorias: Success, Warning, Danger, Info
- Cada categoria com 10 variações
- Cores otimizadas para diferentes contextos

### 2. Sistema de Espaçamentos 8px

#### Grid System Baseado em 8px
```css
/* Base unit */
--spacing-unit: 0.5rem;  /* 8px */

/* Escala completa */
--spacing-1: 0.125rem;   /* 2px */
--spacing-4: 0.5rem;     /* 8px */
--spacing-8: 1rem;       /* 16px */
--spacing-16: 2rem;      /* 32px */
--spacing-64: 8rem;      /* 128px */
```

#### Densidades de Componentes
- **Compact**: Para interfaces densas (height: 32px)
- **Normal**: Para uso geral (height: 40px)
- **Comfortable**: Para acessibilidade (height: 48px)

### 3. Tipografia Empresarial

#### Escala Tipográfica Modular
- Base: 16px com ratio 1.25 (Perfect Fourth)
- 12 tamanhos disponíveis (2xs até 7xl)
- Hierarquia clara com pesos e alturas de linha

#### Hierarquia Semântica
```css
/* Display - Títulos principais */
--typography-display-1-size: 4.5rem;  /* 72px */
--typography-display-1-weight: 700;
--typography-display-1-line-height: 1.25;

/* Headings - Títulos de seção */
--typography-h1-size: 3rem;    /* 48px */
--typography-h2-size: 2.25rem; /* 36px */
--typography-h3-size: 1.875rem; /* 30px */

/* Body - Texto principal */
--typography-body-size: 1rem;     /* 16px */
--typography-body-weight: 400;
--typography-body-line-height: 1.5;
```

### 4. Sistema de Elevação Avançado

#### Hierarquia de Elevações
- 7 níveis de elevação (0-6)
- Sombras coloridas para diferentes contextos
- Elevações semânticas por componente

```css
/* Elevações por componente */
--elevation-card-rest: var(--elevation-1);
--elevation-card-hover: var(--elevation-2);
--elevation-modal: var(--elevation-4);
--elevation-tooltip: var(--elevation-6);
```

#### Efeitos Avançados
- Blur effects para glassmorphism
- Ring shadows para focus states
- Sombras internas para pressed states

### 5. Sistema de Temas Expandido

#### Temas Disponíveis
1. **Light** (Padrão): Tema claro corporativo
2. **Dark**: Tema escuro elegante
3. **Blue**: Tema azul corporativo
4. **Green**: Tema verde corporativo
5. **High Contrast**: Tema de alto contraste para acessibilidade

#### Preferências de Sistema
- Suporte a `prefers-color-scheme: dark`
- Suporte a `prefers-contrast: high`
- Suporte a `prefers-reduced-motion: reduce`

### 6. Sistema de Bordas e Animações

#### Bordas Sistemáticas
```css
/* Border radius */
--border-radius-sm: 0.25rem;  /* 4px */
--border-radius-md: 0.375rem; /* 6px */
--border-radius-lg: 0.5rem;   /* 8px */

/* Bordas semânticas */
--border-input: 1px solid var(--color-border-light);
--border-input-focus: 2px solid var(--color-border-focus);
--border-card: 1px solid var(--color-border-light);
```

#### Animações Otimizadas
```css
/* Easing curves */
--easing-ease-out: cubic-bezier(0, 0, 0.2, 1);
--easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Transições específicas */
--transition-button: background-color 150ms, border-color 150ms, box-shadow 250ms;
--transition-card: box-shadow 250ms, transform 250ms;
```

## Exemplos de Uso

### Componente Card
```css
.card {
  background: var(--theme-background-elevated);
  border: var(--border-card);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--elevation-card-rest);
  padding: var(--spacing-md);
  transition: var(--transition-card);
}

.card:hover {
  box-shadow: var(--elevation-card-hover);
  transform: translateY(-2px);
}
```

### Botão Primário
```css
.button-primary {
  background: var(--theme-primary);
  border: var(--border-button-primary);
  border-radius: var(--border-radius-md);
  color: var(--color-text-on-primary);
  font-size: var(--typography-ui-size);
  font-weight: var(--typography-ui-weight);
  padding: var(--density-normal-padding-y) var(--density-normal-padding-x);
  transition: var(--transition-button);
}

.button-primary:hover {
  background: var(--theme-primary-hover);
  box-shadow: var(--elevation-button-hover);
}

.button-primary:focus {
  box-shadow: var(--ring-primary);
}
```

### Typography System
```css
.heading-1 {
  font-size: var(--typography-h1-size);
  font-weight: var(--typography-h1-weight);
  line-height: var(--typography-h1-line-height);
  letter-spacing: var(--typography-h1-letter-spacing);
}

.body-text {
  font-size: var(--typography-body-size);
  font-weight: var(--typography-body-weight);
  line-height: var(--typography-body-line-height);
  color: var(--theme-text);
}
```

## Migração de Tokens Antigos

### Mapeamento de Cores
```css
/* Antigo → Novo */
--color-text → --color-text-primary
--color-text-light → --color-text-secondary
--color-text-lighter → --color-text-muted
--color-background → --color-background-primary
--color-background-alt → --color-background-secondary
```

### Mapeamento de Espaçamentos
```css
/* Antigo → Novo */
--spacing-xs → --spacing-2    /* 4px */
--spacing-sm → --spacing-4    /* 8px */
--spacing-md → --spacing-8    /* 16px */
--spacing-lg → --spacing-12   /* 24px */
--spacing-xl → --spacing-16   /* 32px */
```

## Benefícios das Melhorias

### 1. Consistência Visual
- Sistema coeso de cores, espaçamentos e tipografia
- Tokens semânticos facilitam manutenção
- Hierarquia visual clara

### 2. Acessibilidade
- Contraste WCAG AA garantido
- Tema de alto contraste
- Suporte a preferências de sistema
- Focus states bem definidos

### 3. Flexibilidade
- 5 temas diferentes para diversos contextos
- Densidades de componentes ajustáveis
- Tokens granulares para customização

### 4. Performance
- Tokens organizados e otimizados
- Menos redundância no código
- Transições otimizadas

### 5. Experiência do Desenvolvedor
- Nomenclatura intuitiva e consistente
- Documentação completa
- Aliases para compatibilidade

## Próximos Passos

1. **Validação**: Testar tokens em componentes existentes
2. **Refinamento**: Ajustar baseado no feedback de uso
3. **Automatização**: Criar ferramentas para validação automática
4. **Expansão**: Adicionar mais temas conforme necessário

## Arquivos Afetados

- `/src/styles/tokens.css` - Tokens principais refinados
- `/src/styles/themes.css` - Temas expandidos
- `/src/styles/globals.css` - Classes utilitárias (mantidas)

---

*Documentação criada pelo Agent-Tokens em 2025-07-09*