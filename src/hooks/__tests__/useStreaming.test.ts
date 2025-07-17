import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import React, { type ReactNode } from 'react';
import { useStreaming } from '../useStreaming';
import { chatReducer } from '../../redux/chat/chatReducer';
import { config } from '../../shared/config';

// Mock config
vi.mock('../../shared/config', () => ({
  config: {
    API_BASE_URL: 'http://localhost:3001',
  },
}));

// Mock fetch
global.fetch = vi.fn();

describe('useStreaming', () => {
  let store: ReturnType<typeof configureStore>;
  
  const createWrapper = ({ children }: { children: ReactNode }) =>
    React.createElement(Provider, { store }, children);

  beforeEach(() => {
    store = configureStore({
      reducer: {
        chat: chatReducer,
      },
      preloadedState: {
        chat: {
          currentConversation: {
            id: 'test-conversation',
            title: 'Test Conversation',
            messages: [],
            provider: 'openai',
            model: 'gpt-4-turbo',
            createdAt: '2024-01-20T10:00:00Z',
            updatedAt: '2024-01-20T10:00:00Z',
            isFavorite: false,
            tags: [],
            totalTokens: 0,
            totalCost: 0,
            lastMessageAt: '2024-01-20T10:00:00Z',
            messageCount: 0,
          },
          messages: [],
          isTyping: false,
          selectedProvider: 'openai',
          selectedModel: 'gpt-4-turbo',
          streamingMessage: null,
          isLoading: false,
          error: null,
        },
      },
    });
    
    vi.clearAllMocks();
    
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'mock-token'),
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useStreaming(), { wrapper: createWrapper });
    
    expect(result.current.isStreaming).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.startStreaming).toBe('function');
    expect(typeof result.current.stopStreaming).toBe('function');
  });

  it('should handle successful streaming', async () => {
    const mockReader = {
      read: vi.fn()
        .mockResolvedValueOnce({ 
          done: false, 
          value: new TextEncoder().encode('data: {"content": "Hello"}\n') 
        })
        .mockResolvedValueOnce({ 
          done: false, 
          value: new TextEncoder().encode('data: {"content": " world"}\n') 
        })
        .mockResolvedValueOnce({ 
          done: false, 
          value: new TextEncoder().encode('data: [DONE]\n') 
        })
        .mockResolvedValueOnce({ done: true, value: undefined }),
    };

    const mockResponse = {
      ok: true,
      body: {
        getReader: () => mockReader,
      },
    };

    vi.mocked(fetch).mockResolvedValue(mockResponse as any);

    const { result } = renderHook(() => useStreaming(), { wrapper: createWrapper });
    
    const onStart = vi.fn();
    const onComplete = vi.fn();
    const onError = vi.fn();

    await act(async () => {
      await result.current.startStreaming('Test message', {
        model: 'gpt-4-turbo',
        provider: 'openai',
        onStart,
        onComplete,
        onError,
      });
    });

    expect(fetch).toHaveBeenCalledWith(
      `${config.API_BASE_URL}/api/chat/stream`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token',
        }),
        body: JSON.stringify({
          message: 'Test message',
          model: 'gpt-4-turbo',
          provider: 'openai',
          conversationId: 'test-conversation',
        }),
      })
    );

    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith('Hello world');
    expect(onError).not.toHaveBeenCalled();
    expect(result.current.isStreaming).toBe(false);
  });

  it('should handle streaming errors', async () => {
    const mockResponse = {
      ok: false,
      status: 500,
    };

    vi.mocked(fetch).mockResolvedValue(mockResponse as any);

    const { result } = renderHook(() => useStreaming(), { wrapper: createWrapper });
    
    const onStart = vi.fn();
    const onComplete = vi.fn();
    const onError = vi.fn();

    await act(async () => {
      await result.current.startStreaming('Test message', {
        model: 'gpt-4-turbo',
        provider: 'openai',
        onStart,
        onComplete,
        onError,
      });
    });

    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onComplete).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(expect.any(Error));
    expect(result.current.isStreaming).toBe(false);
    expect(result.current.error).toBeTruthy();
  });

  it('should handle network errors', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useStreaming(), { wrapper: createWrapper });
    
    const onStart = vi.fn();
    const onComplete = vi.fn();
    const onError = vi.fn();

    await act(async () => {
      await result.current.startStreaming('Test message', {
        model: 'gpt-4-turbo',
        provider: 'openai',
        onStart,
        onComplete,
        onError,
      });
    });

    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onComplete).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(expect.any(Error));
    expect(result.current.isStreaming).toBe(false);
    expect(result.current.error).toBe('Network error');
  });

  it('should prevent multiple concurrent streaming requests', async () => {
    const { result } = renderHook(() => useStreaming(), { wrapper: createWrapper });
    
    // Mock a long-running stream
    vi.mocked(fetch).mockImplementation(() => new Promise(() => {})); // Never resolves

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await act(async () => {
      // Start first request
      result.current.startStreaming('Message 1', {
        model: 'gpt-4-turbo',
        provider: 'openai',
      });
      
      // Try to start second request immediately
      result.current.startStreaming('Message 2', {
        model: 'gpt-4-turbo',
        provider: 'openai',
      });
    });

    expect(consoleSpy).toHaveBeenCalledWith('Streaming already in progress');
    expect(fetch).toHaveBeenCalledTimes(1);
    
    consoleSpy.mockRestore();
  });

  it('should handle abort via stopStreaming', async () => {
    const mockAbort = vi.fn();
    const mockAbortController = {
      abort: mockAbort,
      signal: {},
    };
    
    (globalThis as any).AbortController = vi.fn(() => mockAbortController);

    const { result } = renderHook(() => useStreaming(), { wrapper: createWrapper });
    
    // Mock a long-running stream
    vi.mocked(fetch).mockImplementation(() => new Promise(() => {})); // Never resolves

    await act(async () => {
      result.current.startStreaming('Test message', {
        model: 'gpt-4-turbo',
        provider: 'openai',
      });
    });

    expect(result.current.isStreaming).toBe(true);

    act(() => {
      result.current.stopStreaming();
    });

    expect(mockAbort).toHaveBeenCalledTimes(1);
    expect(result.current.isStreaming).toBe(false);
  });

  it('should parse streaming data correctly', async () => {
    const mockReader = {
      read: vi.fn()
        .mockResolvedValueOnce({ 
          done: false, 
          value: new TextEncoder().encode('data: {"content": "Hello"}\n\ndata: {"content": " world"}\n') 
        })
        .mockResolvedValueOnce({ 
          done: false, 
          value: new TextEncoder().encode('data: [DONE]\n') 
        })
        .mockResolvedValueOnce({ done: true, value: undefined }),
    };

    const mockResponse = {
      ok: true,
      body: {
        getReader: () => mockReader,
      },
    };

    vi.mocked(fetch).mockResolvedValue(mockResponse as any);

    const { result } = renderHook(() => useStreaming(), { wrapper: createWrapper });
    
    const onComplete = vi.fn();

    await act(async () => {
      await result.current.startStreaming('Test message', {
        model: 'gpt-4-turbo',
        provider: 'openai',
        onComplete,
      });
    });

    expect(onComplete).toHaveBeenCalledWith('Hello world');
  });

  it('should handle invalid JSON gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    
    const mockReader = {
      read: vi.fn()
        .mockResolvedValueOnce({ 
          done: false, 
          value: new TextEncoder().encode('data: invalid json\n') 
        })
        .mockResolvedValueOnce({ 
          done: false, 
          value: new TextEncoder().encode('data: {"content": "Valid"}\n') 
        })
        .mockResolvedValueOnce({ 
          done: false, 
          value: new TextEncoder().encode('data: [DONE]\n') 
        })
        .mockResolvedValueOnce({ done: true, value: undefined }),
    };

    const mockResponse = {
      ok: true,
      body: {
        getReader: () => mockReader,
      },
    };

    vi.mocked(fetch).mockResolvedValue(mockResponse as any);

    const { result } = renderHook(() => useStreaming(), { wrapper: createWrapper });
    
    const onComplete = vi.fn();

    await act(async () => {
      await result.current.startStreaming('Test message', {
        model: 'gpt-4-turbo',
        provider: 'openai',
        onComplete,
      });
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to parse streaming data:',
      expect.any(Error)
    );
    expect(onComplete).toHaveBeenCalledWith('Valid');
    
    consoleSpy.mockRestore();
  });

  it('should handle error in streaming data', async () => {
    const mockReader = {
      read: vi.fn()
        .mockResolvedValueOnce({ 
          done: false, 
          value: new TextEncoder().encode('data: {"error": "Stream error"}\n') 
        })
        .mockResolvedValueOnce({ done: true, value: undefined }),
    };

    const mockResponse = {
      ok: true,
      body: {
        getReader: () => mockReader,
      },
    };

    vi.mocked(fetch).mockResolvedValue(mockResponse as any);

    const { result } = renderHook(() => useStreaming(), { wrapper: createWrapper });
    
    const onError = vi.fn();

    await act(async () => {
      await result.current.startStreaming('Test message', {
        model: 'gpt-4-turbo',
        provider: 'openai',
        onError,
      });
    });

    expect(onError).toHaveBeenCalledWith(expect.any(Error));
    expect(result.current.error).toBe('Stream error');
  });
});