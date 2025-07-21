import '@testing-library/jest-dom';
import { vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';

// Set up DOM globals
(globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = vi
  .fn()
  .mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

// Mock IntersectionObserver
(
  globalThis as unknown as { IntersectionObserver: unknown }
).IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
}));

// Mock EventSource for SSE in chat API
(globalThis as unknown as { EventSource: unknown }).EventSource = vi
  .fn()
  .mockImplementation(() => ({
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    close: vi.fn(),
    onmessage: null,
    onerror: null,
    readyState: 1,
    url: '',
  }));

// Mock fetch for streaming tests
(globalThis as unknown as { fetch: unknown }).fetch = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock console methods in tests
const originalConsole = { ...console };

beforeAll(() => {
  console.warn = vi.fn();
  console.error = vi.fn();
  console.log = vi.fn();
});

afterAll(() => {
  Object.assign(console, originalConsole);
});

// Clear all mocks and localStorage before each test
beforeEach(() => {
  vi.clearAllMocks();
  localStorageMock.getItem.mockReturnValue(null);
  localStorageMock.setItem.mockImplementation(() => {});
  localStorageMock.removeItem.mockImplementation(() => {});
  localStorageMock.clear.mockImplementation(() => {});
});

afterEach(() => {
  vi.clearAllMocks();
});
