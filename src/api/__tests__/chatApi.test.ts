import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { chatApi, chatUtils } from '../chatApi';
import { createMockServer } from '../mockServer';
import { config } from '../../shared/config';
import type { Server } from 'miragejs';

describe('chatApi', () => {
  let server: Server;

  beforeEach(() => {
    server = createMockServer() as Server;
    vi.clearAllMocks();
  });

  afterEach(() => {
    server.shutdown();
  });

  describe('sendMessage', () => {
    it('should send message successfully', async () => {
      const request = {
        content: 'Hello, how are you?',
        provider: 'openai',
        model: 'gpt-4-turbo',
        stream: false,
      };

      const result = await chatApi.sendMessage(request);

      expect(result).toEqual(expect.objectContaining({
        id: expect.any(String),
        content: expect.stringContaining('Hello, how are you?'),
        role: 'assistant',
        timestamp: expect.any(String),
        provider: 'openai',
        model: 'gpt-4-turbo',
        tokens: expect.objectContaining({
          prompt: expect.any(Number),
          completion: expect.any(Number),
          total: expect.any(Number),
        }),
        cost: expect.any(Number),
      }));
    });

    it('should send message with files', async () => {
      const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
      const request = {
        content: 'Analyze this file',
        provider: 'openai',
        model: 'gpt-4-turbo',
        files: [file],
        stream: false,
      };

      const result = await chatApi.sendMessage(request);

      expect(result).toEqual(expect.objectContaining({
        content: expect.stringContaining('Analyze this file'),
        provider: 'openai',
        model: 'gpt-4-turbo',
      }));
    });
  });

  describe('getConversations', () => {
    it('should get conversations list', async () => {
      const result = await chatApi.getConversations(20, 0);

      expect(result).toEqual({
        conversations: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            title: expect.any(String),
            provider: expect.any(String),
            model: expect.any(String),
            createdAt: expect.any(String),
            totalTokens: expect.any(Number),
            totalCost: expect.any(Number),
          }),
        ]),
        total: expect.any(Number),
        hasMore: expect.any(Boolean),
      });
    });

    it('should handle pagination correctly', async () => {
      const result = await chatApi.getConversations(1, 0);

      expect(result.conversations).toHaveLength(1);
      expect(result.total).toBeGreaterThanOrEqual(1);
    });
  });

  describe('getConversation', () => {
    it('should get specific conversation', async () => {
      const result = await chatApi.getConversation('1');

      expect(result).toEqual(expect.objectContaining({
        id: '1',
        title: expect.any(String),
        messages: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            content: expect.any(String),
            role: expect.any(String),
          }),
        ]),
      }));
    });

    it('should handle non-existent conversation', async () => {
      await expect(chatApi.getConversation('non-existent')).rejects.toEqual({
        message: 'Conversa não encontrada',
        status: 404,
        code: 'ERR_BAD_REQUEST',
        details: { message: 'Conversa não encontrada' },
      });
    });
  });

  describe('getProviders', () => {
    it('should get LLM providers', async () => {
      const result = await chatApi.getProviders();

      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          isAvailable: expect.any(Boolean),
          models: expect.any(Array),
          supportedFeatures: expect.any(Array),
        }),
      ]));

      // Check specific providers are present
      const providerIds = result.map(p => p.id);
      expect(providerIds).toContain('openai');
      expect(providerIds).toContain('anthropic');
    });
  });

  describe('getModels', () => {
    it('should get all models', async () => {
      const result = await chatApi.getModels();

      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          providerId: expect.any(String),
          contextLength: expect.any(Number),
          inputCostPer1kTokens: expect.any(Number),
          outputCostPer1kTokens: expect.any(Number),
          isAvailable: expect.any(Boolean),
        }),
      ]));
    });

    it('should filter models by provider', async () => {
      const result = await chatApi.getModels('openai');

      expect(result).toEqual(expect.arrayContaining([
        expect.objectContaining({
          providerId: 'openai',
        }),
      ]));

      // Ensure no models from other providers
      result.forEach(model => {
        expect(model.providerId).toBe('openai');
      });
    });
  });

  describe('uploadFile', () => {
    it('should upload file successfully', async () => {
      const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });

      const result = await chatApi.uploadFile(file);

      expect(result).toEqual(expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        type: expect.any(String),
        size: expect.any(Number),
        url: expect.any(String),
      }));
    });

    it('should handle upload progress callback', async () => {
      const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
      const onProgress = vi.fn();

      await chatApi.uploadFile(file, onProgress);

      // Note: In real implementation, onProgress would be called during upload
      // Mock server actually triggers progress callbacks
      expect(onProgress).toHaveBeenCalledTimes(2); // Mock triggers progress events
    });
  });
});

describe('chatUtils', () => {
  describe('calculateCost', () => {
    it('should calculate cost correctly', () => {
      const tokens = { prompt: 1000, completion: 500 };
      const model = {
        id: 'test-model',
        name: 'Test Model',
        description: 'Test',
        providerId: 'test',
        contextLength: 4096,
        inputCostPer1kTokens: 0.01,
        outputCostPer1kTokens: 0.03,
        isAvailable: true,
        supportedFeatures: [],
        parameters: {
          temperature: { min: 0, max: 1, default: 0.7, step: 0.1 },
          maxTokens: { min: 1, max: 4096, default: 1000 },
          topP: { min: 0, max: 1, default: 1, step: 0.1 },
        },
      };

      const cost = chatUtils.calculateCost(tokens, model);

      // (1000 / 1000) * 0.01 + (500 / 1000) * 0.03 = 0.01 + 0.015 = 0.025
      expect(cost).toBeCloseTo(0.025);
    });
  });

  describe('formatCost', () => {
    it('should format cost in BRL currency', () => {
      const formatted = chatUtils.formatCost(0.025, 'BRL');
      expect(formatted).toMatch(/R\$.*0,0250/);
    });

    it('should format cost in USD currency (default)', () => {
      const formatted = chatUtils.formatCost(0.025);
      expect(formatted).toMatch(/US\$.*0,0250/);
    });
  });

  describe('validateFile', () => {
    beforeEach(() => {
      // Mock config values
      vi.mocked(config).MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
      vi.mocked(config).SUPPORTED_FILE_TYPES = ['pdf', 'txt', 'doc', 'docx'];
    });

    it('should validate correct file', () => {
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      Object.defineProperty(file, 'size', { value: 5 * 1024 * 1024 }); // 5MB

      const result = chatUtils.validateFile(file);

      expect(result).toEqual({ valid: true });
    });

    it('should reject file that is too large', () => {
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      Object.defineProperty(file, 'size', { value: 15 * 1024 * 1024 }); // 15MB

      const result = chatUtils.validateFile(file);

      expect(result).toEqual({
        valid: false,
        error: expect.stringContaining('Arquivo muito grande'),
      });
    });

    it('should reject unsupported file type', () => {
      const file = new File(['content'], 'test.exe', { type: 'application/x-executable' });
      Object.defineProperty(file, 'size', { value: 1024 }); // 1KB

      const result = chatUtils.validateFile(file);

      expect(result).toEqual({
        valid: false,
        error: expect.stringContaining('Tipo de arquivo não suportado'),
      });
    });
  });

  describe('generateConversationTitle', () => {
    it('should return short message as is', () => {
      const message = 'Hello world';
      const title = chatUtils.generateConversationTitle(message);
      expect(title).toBe('Hello world');
    });

    it('should truncate long message', () => {
      const message = 'This is a very long message that should be truncated because it exceeds the maximum length allowed for conversation titles';
      const title = chatUtils.generateConversationTitle(message);
      
      expect(title.length).toBeLessThanOrEqual(50);
      expect(title.endsWith('...')).toBe(true);
    });

    it('should replace newlines with spaces', () => {
      const message = 'Line 1\nLine 2\n\nLine 3';
      const title = chatUtils.generateConversationTitle(message);
      
      expect(title).toBe('Line 1 Line 2 Line 3');
    });
  });

  describe('estimateTokens', () => {
    it('should estimate tokens approximately', () => {
      // Rule: ~4 characters per token
      const text = 'This is a test message'; // 22 characters
      const tokens = chatUtils.estimateTokens(text);
      
      expect(tokens).toBe(Math.ceil(22 / 4)); // Should be 6 tokens
    });

    it('should handle empty string', () => {
      const tokens = chatUtils.estimateTokens('');
      expect(tokens).toBe(0);
    });
  });
});