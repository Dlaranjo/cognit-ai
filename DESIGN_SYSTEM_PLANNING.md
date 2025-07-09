# Design System Planning - Cognit Studio

## Visão Geral
Este documento define o planejamento e estrutura do design system para o Cognit Studio, uma aplicação React de agregação de LLMs com interface de chat unificada.

## Tokens de Design

### Cores
- **Primary**: Azul (#0066CC)
- **Secondary**: Cinza (#6B7280)
- **Success**: Verde (#10B981)
- **Warning**: Amarelo (#F59E0B)
- **Error**: Vermelho (#EF4444)
- **Background**: Branco (#FFFFFF)
- **Surface**: Cinza claro (#F9FAFB)
- **Text Primary**: Cinza escuro (#111827)
- **Text Secondary**: Cinza médio (#6B7280)

### Tipografia
- **Font Family**: Inter, system-ui, sans-serif
- **Font Sizes**: 
  - xs: 12px
  - sm: 14px
  - base: 16px
  - lg: 18px
  - xl: 20px
  - 2xl: 24px
  - 3xl: 30px
- **Font Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Espaçamento
- **Scale**: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px
- **Breakpoints**: 
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px

### Bordas
- **Radius**: 4px (small), 8px (medium), 12px (large), 16px (xl)
- **Width**: 1px (thin), 2px (medium), 4px (thick)

## Componentes Atômicos

### Button
- **Variantes**: primary, secondary, outline, ghost, danger
- **Tamanhos**: sm, md, lg
- **Estados**: default, hover, active, disabled, loading

### Input
- **Tipos**: text, email, password, textarea
- **Estados**: default, focus, error, disabled
- **Tamanhos**: sm, md, lg

### Avatar
- **Tamanhos**: xs, sm, md, lg, xl
- **Tipos**: imagem, iniciais, ícone
- **Estados**: online, offline, away

### Icon
- **Biblioteca**: Lucide React
- **Tamanhos**: 16px, 20px, 24px, 32px
- **Variantes**: outline, filled

### Badge
- **Variantes**: default, primary, secondary, success, warning, error
- **Tamanhos**: sm, md, lg

## Componentes Moleculares

### MessageBubble
- **Tipos**: user, assistant, system
- **Estados**: sending, sent, error
- **Funcionalidades**: copy, regenerate, feedback

### FormField
- **Componentes**: label, input, help text, error message
- **Validação**: visual feedback de erro/sucesso

### SearchBar
- **Funcionalidades**: busca, filtros, sugestões
- **Estados**: empty, searching, results

### FileUpload
- **Tipos**: drag & drop, click to upload
- **Formatos**: image, text, pdf
- **Estados**: idle, uploading, success, error

## Componentes Organizacionais

### Header
- **Seções**: logo, navegação, perfil do usuário
- **Responsividade**: mobile menu collapse

### Sidebar
- **Seções**: conversas, configurações, modelos
- **Estados**: expandido, colapsado
- **Funcionalidades**: busca, filtros, scroll infinito

### ChatInterface
- **Seções**: header, messages, input
- **Funcionalidades**: streaming, file upload, provider selection

### Layout
- **Estrutura**: header, sidebar, main content
- **Responsividade**: adaptação mobile/desktop

## Padrões de Interação

### Navegação
- **Breadcrumbs**: navegação hierárquica
- **Tabs**: organização de conteúdo
- **Pagination**: listagem de dados

### Feedback
- **Loading**: spinners, skeleton screens
- **Notifications**: toasts, alerts
- **Modals**: confirmações, formulários

### Formulários
- **Validação**: inline, on submit
- **Estados**: pristine, dirty, submitting
- **Acessibilidade**: labels, aria attributes

## Tema e Customização

### Dark Mode
- **Implementação**: CSS variables, context provider
- **Cores**: versões escuras dos tokens

### Responsividade
- **Breakpoints**: mobile-first approach
- **Componentes**: adaptação automática

## Implementação

### Estrutura de Arquivos
```
src/
├── components/
│   ├── atoms/
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Avatar/
│   │   └── ...
│   ├── molecules/
│   │   ├── MessageBubble/
│   │   ├── FormField/
│   │   └── ...
│   └── organisms/
│       ├── Header/
│       ├── Sidebar/
│       └── ...
├── styles/
│   ├── tokens/
│   │   ├── colors.css
│   │   ├── typography.css
│   │   └── spacing.css
│   └── globals.css
└── hooks/
    ├── useTheme.ts
    └── useBreakpoint.ts
```

### Metodologia
- **Atomic Design**: organização hierárquica
- **CSS Modules**: escopo de estilos
- **TypeScript**: tipagem estrita
- **Storybook**: documentação de componentes

## Próximos Passos

1. **Implementar tokens de design** como CSS variables
2. **Criar componentes atômicos** básicos
3. **Desenvolver componentes moleculares** para chat
4. **Implementar tema escuro** e responsividade
5. **Documentar componentes** no Storybook
6. **Testes visuais** e de acessibilidade

## Convenções

### Nomenclatura
- **Componentes**: PascalCase em português
- **Props**: camelCase em português
- **CSS Classes**: kebab-case

### Estrutura de Componente
```
ComponentName/
├── index.ts
├── ComponentName.tsx
├── ComponentName.types.ts
├── ComponentName.module.css
└── ComponentName.stories.tsx
```

### Padrões de Código
- **Props interface**: sempre tipada
- **Default props**: usando destructuring
- **CSS Modules**: uma classe por elemento
- **Acessibilidade**: ARIA attributes obrigatórios