import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../types';

// Base selectors
export const selectChatState = (state: RootState) => state.chat;

// Memoized selectors
export const selectCurrentConversation = createSelector(
  [selectChatState],
  (chat) => chat.currentConversation
);

export const selectMessages = createSelector(
  [selectChatState],
  (chat) => chat.messages
);

export const selectIsTyping = createSelector(
  [selectChatState],
  (chat) => chat.isTyping
);

export const selectSelectedProvider = createSelector(
  [selectChatState],
  (chat) => chat.selectedProvider
);

export const selectSelectedModel = createSelector(
  [selectChatState],
  (chat) => chat.selectedModel
);

export const selectStreamingMessage = createSelector(
  [selectChatState],
  (chat) => chat.streamingMessage
);

export const selectChatLoading = createSelector(
  [selectChatState],
  (chat) => chat.isLoading
);

export const selectChatError = createSelector(
  [selectChatState],
  (chat) => chat.error
);

export const selectLastMessage = createSelector(
  [selectMessages],
  (messages) => messages[messages.length - 1]
);

export const selectMessageCount = createSelector(
  [selectMessages],
  (messages) => messages.length
);

export const selectUserMessages = createSelector(
  [selectMessages],
  (messages) => messages.filter(message => message.role === 'user')
);

export const selectAssistantMessages = createSelector(
  [selectMessages],
  (messages) => messages.filter(message => message.role === 'assistant')
);
