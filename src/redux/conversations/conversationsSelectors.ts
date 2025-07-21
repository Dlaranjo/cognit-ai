import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../types';

// Base selectors
export const selectConversationsState = (state: RootState) => state.conversations;

// Memoized selectors
export const selectConversations = createSelector(
  [selectConversationsState],
  (conversations) => Array.isArray(conversations.conversations) ? conversations.conversations : []
);

export const selectFavoriteConversations = createSelector(
  [selectConversationsState],
  (conversations) => conversations.favoriteConversations
);

export const selectSearchQuery = createSelector(
  [selectConversationsState],
  (conversations) => conversations.searchQuery
);

export const selectConversationsLoading = createSelector(
  [selectConversationsState],
  (conversations) => conversations.isLoading
);

export const selectHasMoreConversations = createSelector(
  [selectConversationsState],
  (conversations) => conversations.hasMore
);

export const selectConversationFilters = createSelector(
  [selectConversationsState],
  (conversations) => conversations.filters
);

// Complex selectors
export const selectConversationById = createSelector(
  [selectConversations, (state: RootState, conversationId: string) => conversationId],
  (conversations, conversationId) => conversations.find(c => c.id === conversationId)
);

export const selectFavoriteConversationsList = createSelector(
  [selectConversations, selectFavoriteConversations],
  (conversations, favoriteIds) => 
    conversations.filter(c => favoriteIds.includes(c.id))
);

export const selectFilteredConversations = createSelector(
  [selectConversations, selectSearchQuery, selectConversationFilters],
  (conversations, searchQuery, filters) => {
    let filtered = conversations;

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply provider filter
    if (filters.provider) {
      filtered = filtered.filter(c => c.provider === filters.provider);
    }

    // Apply date range filter
    if (filters.dateRange) {
      filtered = filtered.filter(c => {
        const conversationDate = new Date(c.createdAt);
        return conversationDate >= filters.dateRange!.start && 
               conversationDate <= filters.dateRange!.end;
      });
    }

    // Apply files filter
    if (filters.hasFiles) {
      filtered = filtered.filter(c => 
        c.messages.some(m => m.attachments && m.attachments.length > 0)
      );
    }

    return filtered;
  }
);

export const selectRecentConversations = createSelector(
  [selectConversations],
  (conversations) => 
    [...conversations]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10)
);

export const selectConversationsByProvider = createSelector(
  [selectConversations],
  (conversations) => {
    const grouped: Record<string, typeof conversations> = {};
    conversations.forEach(c => {
      if (!grouped[c.provider]) {
        grouped[c.provider] = [];
      }
      grouped[c.provider].push(c);
    });
    return grouped;
  }
);
