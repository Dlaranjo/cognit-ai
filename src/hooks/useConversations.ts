import { useCallback } from 'react';
import { useAppDispatch, useAppSelector, store } from '../redux/store';
import {
  fetchConversations,
  fetchConversation,
  deleteConversation,
} from '../redux/conversations/conversationsActions';
import {
  setSearchQuery,
  setFilters,
  toggleFavorite,
  clearFilters,
} from '../redux/conversations/conversationsReducer';
import {
  selectConversations,
  selectFavoriteConversations,
  selectSearchQuery,
  selectConversationsLoading,
  selectHasMoreConversations,
  selectConversationFilters,
  selectConversationById,
  selectFavoriteConversationsList,
  selectFilteredConversations,
  selectRecentConversations,
  selectConversationsByProvider,
} from '../redux/conversations/conversationsSelectors';
import type { ConversationFilters } from '../redux/conversations/conversationsTypes';

export const useConversations = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const conversations = useAppSelector(selectConversations);
  const favoriteConversations = useAppSelector(selectFavoriteConversations);
  const searchQuery = useAppSelector(selectSearchQuery);
  const isLoading = useAppSelector(selectConversationsLoading);
  const hasMore = useAppSelector(selectHasMoreConversations);
  const filters = useAppSelector(selectConversationFilters);
  const filteredConversations = useAppSelector(selectFilteredConversations);
  const recentConversations = useAppSelector(selectRecentConversations);
  const favoriteConversationsList = useAppSelector(selectFavoriteConversationsList);
  const conversationsByProvider = useAppSelector(selectConversationsByProvider);

  // Actions
  const loadConversations = useCallback(() => {
    return dispatch(fetchConversations());
  }, [dispatch]);

  const loadConversation = useCallback((id: string) => {
    return dispatch(fetchConversation(id));
  }, [dispatch]);

  const removeConversation = useCallback((id: string) => {
    return dispatch(deleteConversation(id));
  }, [dispatch]);

  const updateSearchQuery = useCallback((query: string) => {
    dispatch(setSearchQuery(query));
  }, [dispatch]);

  const updateFilters = useCallback((newFilters: ConversationFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const toggleConversationFavorite = useCallback((conversationId: string) => {
    dispatch(toggleFavorite(conversationId));
  }, [dispatch]);

  const resetFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  // Helper functions - Note: This should be used differently in components
  // Instead of calling this function, components should use useAppSelector directly
  const getConversationById = useCallback((conversationId: string) => {
    // This is not ideal - components should call useAppSelector directly
    const state = store.getState();
    return selectConversationById(state, conversationId);
  }, []);

  const isConversationFavorite = useCallback((conversationId: string) => {
    return favoriteConversations.includes(conversationId);
  }, [favoriteConversations]);

  const searchConversations = useCallback((query: string) => {
    updateSearchQuery(query);
  }, [updateSearchQuery]);

  const filterByProvider = useCallback((provider: string) => {
    updateFilters({ ...filters, provider });
  }, [filters, updateFilters]);

  const filterByDateRange = useCallback((start: Date, end: Date) => {
    updateFilters({ ...filters, dateRange: { start, end } });
  }, [filters, updateFilters]);

  const filterByFiles = useCallback((hasFiles: boolean) => {
    updateFilters({ ...filters, hasFiles });
  }, [filters, updateFilters]);

  // Computed values
  const hasConversations = conversations.length > 0;
  const hasFavorites = favoriteConversations.length > 0;
  const hasActiveFilters = Object.keys(filters).length > 0 || searchQuery.length > 0;
  const filteredCount = filteredConversations.length;

  return {
    // State
    conversations,
    favoriteConversations,
    searchQuery,
    isLoading,
    hasMore,
    filters,
    filteredConversations,
    recentConversations,
    favoriteConversationsList,
    conversationsByProvider,
    
    // Computed
    hasConversations,
    hasFavorites,
    hasActiveFilters,
    filteredCount,
    
    // Actions
    loadConversations,
    loadConversation,
    removeConversation,
    updateSearchQuery,
    updateFilters,
    toggleConversationFavorite,
    resetFilters,
    
    // Helpers
    getConversationById,
    isConversationFavorite,
    searchConversations,
    filterByProvider,
    filterByDateRange,
    filterByFiles,
  };
};
