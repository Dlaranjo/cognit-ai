import type { Conversation } from '../../api/chatApi';

export interface ConversationsState {
  conversations: Conversation[];
  favoriteConversations: string[];
  searchQuery: string;
  isLoading: boolean;
  hasMore: boolean;
  filters: ConversationFilters;
}

export interface ConversationFilters {
  provider?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  hasFiles?: boolean;
}
