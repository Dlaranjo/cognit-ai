import '@testing-library/jest-dom';
import { vi, beforeAll, afterEach, afterAll } from 'vitest';
import { createServer } from 'miragejs';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock EventSource for streaming tests
global.EventSource = vi.fn().mockImplementation(() => ({
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  close: vi.fn(),
  readyState: 1,
  CONNECTING: 0,
  OPEN: 1,
  CLOSED: 2,
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock as Storage;

// Create a simple test server
let server: ReturnType<typeof createServer>;

beforeAll(() => {
  server = createServer({
    environment: 'test',
    routes() {
      // Auth endpoints
      this.post('/auth/login', () => {
        return {
          token: 'mock-jwt-token',
          refreshToken: 'mock-refresh-token',
          user: {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            role: 'user',
          },
        };
      });

      this.post('/auth/logout', () => {
        return new Response(200, {}, {});
      });

      this.post('/auth/refresh', () => {
        return {
          token: 'new-mock-jwt-token',
          refreshToken: 'new-mock-refresh-token',
        };
      });

      this.get('/auth/validate', () => {
        return {
          user: {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            role: 'user',
          },
        };
      });

      this.get('/auth/profile', () => {
        return {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          role: 'user',
        };
      });

      // Chat endpoints
      this.post('/chat/message', () => {
        return {
          id: 'msg-1',
          content: 'Mock response',
          role: 'assistant',
          timestamp: new Date().toISOString(),
        };
      });

      this.get('/conversations', () => {
        return {
          conversations: [
            {
              id: 'conv-1',
              title: 'Test Conversation',
              lastMessage: 'Last message',
              timestamp: new Date().toISOString(),
            },
          ],
          hasMore: false,
          total: 1,
        };
      });

      this.get('/conversations/:id', (schema, request) => {
        const id = request.params.id;
        if (id === 'non-existent') {
          return new Response(404, {}, { error: 'Conversa não encontrada' });
        }
        return {
          id: id,
          title: 'Test Conversation',
          messages: [],
        };
      });

      this.get('/chat/providers', () => {
        return {
          providers: [
            { id: 'openai', name: 'OpenAI' },
            { id: 'anthropic', name: 'Anthropic' },
          ],
        };
      });

      this.get('/chat/models', () => {
        return {
          models: [
            { id: 'gpt-4', name: 'GPT-4', provider: 'openai' },
            { id: 'claude-3', name: 'Claude 3', provider: 'anthropic' },
          ],
        };
      });

      this.post('/chat/upload', () => {
        return {
          fileId: 'file-123',
          url: 'https://example.com/file.pdf',
          size: 1024,
        };
      });

      // Workspace endpoints
      this.get('/workspaces', () => {
        return {
          workspaces: [
            {
              id: 'ws-1',
              name: 'Test Workspace',
              description: 'Test description',
              role: 'owner',
            },
          ],
        };
      });

      this.post('/workspaces', () => {
        return {
          id: 'ws-new',
          name: 'New Workspace',
          description: 'New description',
          role: 'owner',
        };
      });

      // Catch all other routes
      this.passthrough();
    },
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

afterAll(() => {
  server.shutdown();
});
