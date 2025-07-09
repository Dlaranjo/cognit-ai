# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cognit Studio is a React-based LLM aggregator application that allows users to interact with multiple AI providers through a unified interface. The application serves as a chat interface where users can send messages, upload files, and receive AI responses in real-time.

## Key Technologies

- **React** with **TypeScript** - Main framework with strict typing
- **Redux Toolkit** - State management with modular slices
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **Vite** - Build tool and development server
- **Vitest** - Testing framework with jsdom environment
- **CSS Modules** - Component-scoped styling

## Architecture

### Component Structure (Atomic Design)
- **Atoms** (`src/components/atoms/`): Basic UI components (Button, Input, Avatar, etc.)
- **Molecules** (`src/components/molecules/`): Combinations of atoms (MessageBubble, FormField, etc.)
- **Organisms** (`src/components/organisms/`): Complex components (Header, Sidebar, Layout, etc.)
- **Pages** (`src/pages/`): Route-level components

### State Management
Redux store with modular slices in `src/redux/`:
- `auth/` - Authentication state and user management
- `chat/` - Chat conversations and messages
- Each slice contains: `[name]Slice.ts`, `[name]Types.ts`, `[name]Selectors.ts`

### Configuration
- `src/shared/config.ts` - Centralized environment variables (currently empty)
- All environment variable access should go through this file, not `import.meta.env` directly

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type checking
npm run type-check

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Preview production build
npm run preview

# Bundle analysis
npm run analyze
```

## Key Features to Implement

### Authentication
- SSO integration with Google IEBT
- JWT token storage and management
- User avatar display from Google profile

### Chat Interface
- Real-time messaging with AI
- File upload support (Images, Text, PDF)
- Streaming responses from AI
- Provider/model selection
- Message feedback (like/dislike)
- Response copying and regeneration
- Auto-generated chat titles

### Conversation Management
- Conversation history listing
- Soft-delete functionality
- Search through conversations
- Infinite scroll pagination
- Conversation favorites

## Testing

Tests use Vitest with jsdom environment. Setup file located at `src/setupTests.ts`.

## Code Conventions

- Use TypeScript interfaces and types consistently
- Follow Atomic Design principles for component organization
- CSS Modules for component styling
- Portuguese naming for components and variables (matching existing codebase)
- Each component should have its own folder with: `[Name].tsx`, `[Name].types.ts`, `[Name].module.css`, `index.ts`

## Important Notes

- The project has both root-level and `protoype-ui/` directories - focus on the root-level `src/` structure
- Configuration in `src/shared/config.ts` is currently empty and needs to be populated
- All API calls should go through `src/api/` (structure exists but not fully implemented)
- Custom hooks are in `src/hooks/` for reusable logic
- Mock data is available in `src/shared/mocks/` for development and testing