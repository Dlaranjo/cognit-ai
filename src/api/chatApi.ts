import { apiClient, uploadFile, createCancelToken } from './axiosConfig';
import { config } from '../shared/config';

// Interfaces de mensagens e conversas
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: string;
  conversationId: string;
  provider?: string;
  model?: string;
  tokens?: {
    prompt: number;
    completion: number;
    total: number;
  };
  cost?: number;
  attachments?: MessageAttachment[];
  feedback?: MessageFeedback;
  metadata?: MessageMetadata;
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
}

export interface MessageFeedback {
  liked: boolean | null;
  rating?: number;
  comment?: string;
  createdAt: string;
}

export interface MessageMetadata {
  processingTime?: number;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stopSequences?: string[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  provider: string;
  model: string;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  tags: string[];
  summary?: string;
  totalTokens: number;
  totalCost: number;
  lastMessageAt: string;
  messageCount: number;
}

// Interfaces de requests
export interface SendMessageRequest {
  conversationId?: string;
  content: string;
  provider: string;
  model: string;
  files?: File[];
  stream?: boolean;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stopSequences?: string[];
}

export interface StreamMessageRequest extends SendMessageRequest {
  stream: true;
}

export interface CreateConversationRequest {
  title?: string;
  provider: string;
  model: string;
  firstMessage?: string;
}

export interface UpdateConversationRequest {
  title?: string;
  isFavorite?: boolean;
  tags?: string[];
}

export interface SearchConversationsRequest {
  query: string;
  limit?: number;
  offset?: number;
  provider?: string;
  model?: string;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  isFavorite?: boolean;
}

export interface ConversationsListResponse {
  conversations: Conversation[];
  total: number;
  hasMore: boolean;
}

export interface SendFeedbackRequest {
  messageId: string;
  liked: boolean | null;
  rating?: number;
  comment?: string;
}

export interface RegenerateMessageRequest {
  messageId: string;
  temperature?: number;
  maxTokens?: number;
}

// Interfaces de providers e modelos
export interface LLMProvider {
  id: string;
  name: string;
  description: string;
  isAvailable: boolean;
  models: LLMModel[];
  supportedFeatures: string[];
}

export interface LLMModel {
  id: string;
  name: string;
  description: string;
  providerId: string;
  contextLength: number;
  inputCostPer1kTokens: number;
  outputCostPer1kTokens: number;
  isAvailable: boolean;
  supportedFeatures: ModelFeature[];
  parameters: ModelParameters;
}

export interface ModelFeature {
  name: string;
  supported: boolean;
  description?: string;
}

export interface ModelParameters {
  temperature: {
    min: number;
    max: number;
    default: number;
    step: number;
  };
  maxTokens: {
    min: number;
    max: number;
    default: number;
  };
  topP: {
    min: number;
    max: number;
    default: number;
    step: number;
  };
}

// Interface para streaming
export interface StreamingResponse {
  id: string;
  type: 'start' | 'content' | 'end' | 'error';
  content?: string;
  metadata?: Record<string, unknown>;
  error?: string;
}

// API methods
export const chatApi = {
  // Enviar mensagem (normal)
  sendMessage: async (request: SendMessageRequest): Promise<Message> => {
    const formData = new FormData();
    formData.append('content', request.content);
    formData.append('provider', request.provider);
    formData.append('model', request.model);
    formData.append('stream', 'false');
    
    if (request.conversationId) {
      formData.append('conversationId', request.conversationId);
    }
    
    if (request.temperature !== undefined) {
      formData.append('temperature', request.temperature.toString());
    }
    
    if (request.maxTokens !== undefined) {
      formData.append('maxTokens', request.maxTokens.toString());
    }
    
    if (request.topP !== undefined) {
      formData.append('topP', request.topP.toString());
    }
    
    if (request.files) {
      request.files.forEach((file) => {
        formData.append('files', file);
      });
    }

    const response = await apiClient.post('/chat/message', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Enviar mensagem com streaming
  sendStreamMessage: (
    request: StreamMessageRequest,
    onMessage: (data: StreamingResponse) => void,
    onError?: (error: Error) => void,
    onComplete?: () => void
  ): (() => void) => {
    const cancelToken = createCancelToken();
    
    const eventSource = new EventSource(
      `${config.API_BASE_URL}/chat/stream?` + 
      new URLSearchParams({
        content: request.content,
        provider: request.provider,
        model: request.model,
        conversationId: request.conversationId || '',
        temperature: request.temperature?.toString() || '',
        maxTokens: request.maxTokens?.toString() || '',
        topP: request.topP?.toString() || '',
      }).toString()
    );

    eventSource.onmessage = (event) => {
      try {
        const data: StreamingResponse = JSON.parse(event.data);
        onMessage(data);
        
        if (data.type === 'end') {
          eventSource.close();
          onComplete?.();
        }
      } catch (error) {
        onError?.(error as Error);
      }
    };

    eventSource.onerror = (error) => {
      eventSource.close();
      onError?.(error as Error);
    };

    // Retorna função para cancelar
    return () => {
      eventSource.close();
      cancelToken.cancel('Request cancelled by user');
    };
  },

  // Regenerar mensagem
  regenerateMessage: async (request: RegenerateMessageRequest): Promise<Message> => {
    const response = await apiClient.post(`/chat/messages/${request.messageId}/regenerate`, {
      temperature: request.temperature,
      maxTokens: request.maxTokens,
    });
    return response.data;
  },

  // Gestão de conversas
  createConversation: async (request: CreateConversationRequest): Promise<Conversation> => {
    const response = await apiClient.post('/chat/conversations', request);
    return response.data;
  },

  getConversations: async (
    limit: number = 50,
    offset: number = 0,
    search?: string
  ): Promise<ConversationsListResponse> => {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });
    
    if (search) {
      params.append('search', search);
    }

    const response = await apiClient.get(`/chat/conversations?${params}`);
    return response.data;
  },

  getConversation: async (id: string): Promise<Conversation> => {
    const response = await apiClient.get(`/chat/conversations/${id}`);
    return response.data;
  },

  updateConversation: async (
    id: string,
    request: UpdateConversationRequest
  ): Promise<Conversation> => {
    const response = await apiClient.put(`/chat/conversations/${id}`, request);
    return response.data;
  },

  deleteConversation: async (id: string): Promise<void> => {
    await apiClient.delete(`/chat/conversations/${id}`);
  },

  searchConversations: async (request: SearchConversationsRequest): Promise<ConversationsListResponse> => {
    const response = await apiClient.post('/chat/conversations/search', request);
    return response.data;
  },

  // Favoritos
  toggleFavorite: async (conversationId: string): Promise<{ isFavorite: boolean }> => {
    const response = await apiClient.post(`/chat/conversations/${conversationId}/favorite`);
    return response.data;
  },

  getFavoriteConversations: async (): Promise<Conversation[]> => {
    const response = await apiClient.get('/chat/conversations/favorites');
    return response.data;
  },

  // Mensagens
  getMessage: async (messageId: string): Promise<Message> => {
    const response = await apiClient.get(`/chat/messages/${messageId}`);
    return response.data;
  },

  deleteMessage: async (messageId: string): Promise<void> => {
    await apiClient.delete(`/chat/messages/${messageId}`);
  },

  // Feedback de mensagens
  sendFeedback: async (request: SendFeedbackRequest): Promise<MessageFeedback> => {
    const response = await apiClient.post(`/chat/messages/${request.messageId}/feedback`, {
      liked: request.liked,
      rating: request.rating,
      comment: request.comment,
    });
    return response.data;
  },

  // Upload de arquivos
  uploadFile: async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<MessageAttachment> => {
    const response = await uploadFile('/chat/upload', file, onProgress);
    return response.data;
  },

  uploadMultipleFiles: async (
    files: File[],
    onProgress?: (fileIndex: number, progress: number) => void
  ): Promise<MessageAttachment[]> => {
    const uploads = files.map(async (file, index) => {
      return uploadFile('/chat/upload', file, (progress) => {
        onProgress?.(index, progress);
      });
    });

    const responses = await Promise.all(uploads);
    return responses.map(response => response.data);
  },

  deleteFile: async (fileId: string): Promise<void> => {
    await apiClient.delete(`/chat/files/${fileId}`);
  },

  // Providers e modelos
  getProviders: async (): Promise<LLMProvider[]> => {
    const response = await apiClient.get('/chat/providers');
    return response.data;
  },

  getModels: async (providerId?: string): Promise<LLMModel[]> => {
    const params = providerId ? `?provider=${providerId}` : '';
    const response = await apiClient.get(`/chat/models${params}`);
    return response.data;
  },

  getModel: async (providerId: string, modelId: string): Promise<LLMModel> => {
    const response = await apiClient.get(`/chat/providers/${providerId}/models/${modelId}`);
    return response.data;
  },

  // Estatísticas
  getUsageStats: async (
    period: 'day' | 'week' | 'month' | 'year' = 'month'
  ): Promise<UsageStats> => {
    const response = await apiClient.get(`/chat/stats/usage?period=${period}`);
    return response.data;
  },

  getCostStats: async (
    period: 'day' | 'week' | 'month' | 'year' = 'month'
  ): Promise<CostStats> => {
    const response = await apiClient.get(`/chat/stats/costs?period=${period}`);
    return response.data;
  },

  // Exportar dados
  exportConversation: async (
    conversationId: string,
    format: 'json' | 'csv' | 'pdf' = 'json'
  ): Promise<Blob> => {
    const response = await apiClient.get(
      `/chat/conversations/${conversationId}/export?format=${format}`,
      { responseType: 'blob' }
    );
    return response.data;
  },

  exportAllConversations: async (
    format: 'json' | 'csv' = 'json'
  ): Promise<Blob> => {
    const response = await apiClient.get(
      `/chat/conversations/export?format=${format}`,
      { responseType: 'blob' }
    );
    return response.data;
  },
};

// Interfaces para estatísticas
export interface UsageStats {
  totalMessages: number;
  totalTokens: number;
  totalConversations: number;
  byProvider: Record<string, {
    messages: number;
    tokens: number;
    conversations: number;
  }>;
  byModel: Record<string, {
    messages: number;
    tokens: number;
    conversations: number;
  }>;
  timeline: Array<{
    date: string;
    messages: number;
    tokens: number;
  }>;
}

export interface CostStats {
  totalCost: number;
  currency: string;
  byProvider: Record<string, number>;
  byModel: Record<string, number>;
  timeline: Array<{
    date: string;
    cost: number;
  }>;
}

// Utilitários
export const chatUtils = {
  // Calcular custo estimado de uma mensagem
  calculateCost: (tokens: { prompt: number; completion: number }, model: LLMModel): number => {
    const promptCost = (tokens.prompt / 1000) * model.inputCostPer1kTokens;
    const completionCost = (tokens.completion / 1000) * model.outputCostPer1kTokens;
    return promptCost + completionCost;
  },

  // Formatar custo para exibição
  formatCost: (cost: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 4,
    }).format(cost);
  },

  // Validar arquivo para upload
  validateFile: (file: File): { valid: boolean; error?: string } => {
    if (file.size > config.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `Arquivo muito grande. Máximo permitido: ${config.MAX_FILE_SIZE / 1024 / 1024}MB`,
      };
    }

    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!config.SUPPORTED_FILE_TYPES.includes(extension.slice(1))) {
      return {
        valid: false,
        error: `Tipo de arquivo não suportado. Tipos aceitos: ${config.SUPPORTED_FILE_TYPES.join(', ')}`,
      };
    }

    return { valid: true };
  },

  // Gerar título automático para conversa
  generateConversationTitle: (firstMessage: string): string => {
    const maxLength = 50;
    const cleaned = firstMessage.trim().replace(/\n+/g, ' ');
    
    if (cleaned.length <= maxLength) {
      return cleaned;
    }
    
    return cleaned.substring(0, maxLength - 3) + '...';
  },

  // Estimar tokens (aproximação simples)
  estimateTokens: (text: string): number => {
    // Aproximação: 1 token ≈ 4 caracteres
    return Math.ceil(text.length / 4);
  },
};

export default chatApi;
