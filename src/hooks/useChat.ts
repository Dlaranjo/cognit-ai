import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { 
  sendMessage, 
  uploadFile 
} from '../redux/chat/chatActions';
import {
  setCurrentConversation,
  setSelectedProvider,
  setSelectedModel,
  setIsTyping,
  setStreamingMessage,
  addMessage,
  updateMessage,
  removeMessagesAfter,
  clearMessages,
  clearError,
} from '../redux/chat/chatReducer';
import {
  selectCurrentConversation,
  selectMessages,
  selectIsTyping,
  selectSelectedProvider,
  selectSelectedModel,
  selectStreamingMessage,
  selectChatLoading,
  selectChatError,
  selectLastMessage,
  selectMessageCount,
} from '../redux/chat/chatSelectors';
import type { SendMessageRequest, Conversation, Message } from '../api/chatApi';

export const useChat = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const currentConversation = useAppSelector(selectCurrentConversation);
  const messages = useAppSelector(selectMessages);
  const isTyping = useAppSelector(selectIsTyping);
  const selectedProvider = useAppSelector(selectSelectedProvider);
  const selectedModel = useAppSelector(selectSelectedModel);
  const streamingMessage = useAppSelector(selectStreamingMessage);
  const isLoading = useAppSelector(selectChatLoading);
  const error = useAppSelector(selectChatError);
  const lastMessage = useAppSelector(selectLastMessage);
  const messageCount = useAppSelector(selectMessageCount);

  // Actions
  const sendChatMessage = useCallback((request: SendMessageRequest) => {
    return dispatch(sendMessage(request));
  }, [dispatch]);

  const uploadChatFile = useCallback((file: File) => {
    return dispatch(uploadFile(file));
  }, [dispatch]);

  const setConversation = useCallback((conversation: Conversation | null) => {
    dispatch(setCurrentConversation(conversation));
  }, [dispatch]);

  const changeProvider = useCallback((provider: string) => {
    dispatch(setSelectedProvider(provider));
  }, [dispatch]);

  const changeModel = useCallback((model: string) => {
    dispatch(setSelectedModel(model));
  }, [dispatch]);

  const setTyping = useCallback((typing: boolean) => {
    dispatch(setIsTyping(typing));
  }, [dispatch]);

  const setStreaming = useCallback((message: string | null) => {
    dispatch(setStreamingMessage(message));
  }, [dispatch]);

  const addNewMessage = useCallback((message: Message) => {
    dispatch(addMessage(message));
  }, [dispatch]);

  const clearChatMessages = useCallback(() => {
    dispatch(clearMessages());
  }, [dispatch]);

  const clearChatError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const updateChatMessage = useCallback((messageId: string, content: string) => {
    dispatch(updateMessage({ messageId, content }));
  }, [dispatch]);

  const removeMessagesAfterMessage = useCallback((messageId: string) => {
    dispatch(removeMessagesAfter(messageId));
  }, [dispatch]);

  // Helper functions
  const sendQuickMessage = useCallback((content: string, files?: File[]) => {
    const request: SendMessageRequest = {
      content,
      provider: selectedProvider,
      model: selectedModel,
      files,
      conversationId: currentConversation?.id,
    };
    return sendChatMessage(request);
  }, [sendChatMessage, selectedProvider, selectedModel, currentConversation]);

  const regenerateLastMessage = useCallback(() => {
    if (lastMessage && lastMessage.role === 'assistant') {
      // Find the user message that prompted this response
      const userMessageIndex = messages.findIndex(m => m.id === lastMessage.id) - 1;
      if (userMessageIndex >= 0) {
        const userMessage = messages[userMessageIndex];
        return sendQuickMessage(userMessage.content, userMessage.attachments);
      }
    }
  }, [lastMessage, messages, sendQuickMessage]);

  const startNewConversation = useCallback(() => {
    dispatch(clearMessages());
    dispatch(setCurrentConversation(null));
  }, [dispatch]);

  // Computed values
  const hasMessages = messageCount > 0;
  const canRegenerate = lastMessage?.role === 'assistant';
  const isStreaming = !!streamingMessage;

  return {
    // State
    currentConversation,
    messages,
    isTyping,
    selectedProvider,
    selectedModel,
    streamingMessage,
    isLoading,
    error,
    lastMessage,
    messageCount,
    
    // Computed
    hasMessages,
    canRegenerate,
    isStreaming,
    
    // Actions
    sendChatMessage,
    sendQuickMessage,
    uploadChatFile,
    setConversation,
    changeProvider,
    changeModel,
    setTyping,
    setStreaming,
    addNewMessage,
    updateChatMessage,
    removeMessagesAfterMessage,
    clearChatMessages,
    clearChatError,
    regenerateLastMessage,
    startNewConversation,
  };
};
