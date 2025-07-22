import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import {
  setStreamingMessage,
  addMessage,
  replaceLastAssistantMessage,
  clearStreamingMessage,
} from '../redux/chat/chatReducer';
import { selectCurrentConversation } from '../redux/chat/chatSelectors';

interface Message {
  id: string;
  content: string;
  role: 'assistant';
  timestamp: string;
  conversationId: string;
  provider: string;
  model: string;
  tokens?: { prompt: number; completion: number; total: number };
  cost?: number;
}

export const useMessageStreaming = () => {
  const dispatch = useAppDispatch();
  const currentConversation = useAppSelector(selectCurrentConversation);

  const startStreaming = useCallback(() => {
    dispatch(clearStreamingMessage());
  }, [dispatch]);

  const updateStreamingMessage = useCallback((content: string) => {
    dispatch(setStreamingMessage(content));
  }, [dispatch]);

  const completeMessage = useCallback((
    content: string,
    provider: string,
    model: string,
    isRegeneration: boolean = false,
    tokens?: { prompt: number; completion: number; total: number },
    cost?: number
  ) => {
    const messageId = Math.random().toString(36).substr(2, 9);
    
    const message: Message = {
      id: messageId,
      content,
      role: 'assistant',
      timestamp: new Date().toISOString(),
      conversationId: currentConversation?.id || '1',
      provider,
      model,
      tokens,
      cost,
    };

    if (isRegeneration) {
      dispatch(replaceLastAssistantMessage(message));
    } else {
      dispatch(addMessage(message));
    }
    
    dispatch(clearStreamingMessage());
  }, [dispatch, currentConversation?.id]);

  const clearStreaming = useCallback(() => {
    dispatch(clearStreamingMessage());
  }, [dispatch]);

  const handleStreamChunk = useCallback((chunk: string, currentContent: string) => {
    const newContent = currentContent + chunk;
    updateStreamingMessage(newContent);
    return newContent;
  }, [updateStreamingMessage]);

  const handleStreamComplete = useCallback((
    fullMessage: string,
    provider: string,
    model: string,
    options?: {
      isRegeneration?: boolean;
      tokens?: { prompt: number; completion: number; total: number };
      cost?: number;
    }
  ) => {
    completeMessage(
      fullMessage,
      provider,
      model,
      options?.isRegeneration || false,
      options?.tokens,
      options?.cost
    );
  }, [completeMessage]);

  return {
    startStreaming,
    updateStreamingMessage,
    completeMessage,
    clearStreaming,
    handleStreamChunk,
    handleStreamComplete,
  };
};