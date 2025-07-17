import type { Message, Conversation, SendMessageRequest } from '../../api/chatApi';

export interface ChatState {
  currentConversation: Conversation | null;
  messages: Message[];
  isTyping: boolean;
  selectedProvider: string;
  selectedModel: string;
  streamingMessage: string | null;
  isLoading: boolean;
  error: string | null;
}

export type SendMessagePayload = SendMessageRequest;
