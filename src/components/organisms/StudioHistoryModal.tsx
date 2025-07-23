import React, { useState, useMemo } from 'react';
import { History, X, Search, MessageSquare, Trash2 } from 'lucide-react';
import { Input } from '../atoms/Input';
import type { Conversation } from '../../types';

interface StudioHistoryModalProps {
  isOpen: boolean;
  conversations: Conversation[];
  currentConversationId?: string;
  onClose: () => void;
  onConversationSelect: (conversationId: string) => void;
  onConversationDelete: (conversationId: string) => void;
}

type FilterType = 'all' | 'today' | 'week' | 'month';

export const StudioHistoryModal: React.FC<StudioHistoryModalProps> = ({
  isOpen,
  conversations,
  currentConversationId,
  onClose,
  onConversationSelect,
  onConversationDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredConversations = useMemo(() => {
    let filtered = conversations;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(conv => 
        conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.messages.some(msg => 
          msg.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply time/favorite filters
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    switch (activeFilter) {
      case 'today':
        filtered = filtered.filter(conv => new Date(conv.updatedAt) >= today);
        break;
      case 'week':
        filtered = filtered.filter(conv => new Date(conv.updatedAt) >= weekAgo);
        break;
      case 'month':
        filtered = filtered.filter(conv => new Date(conv.updatedAt) >= monthAgo);
        break;
    }

    // Sort by most recent
    return filtered.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [conversations, searchQuery, activeFilter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Agora há pouco';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h atrás`;
    } else if (diffInHours < 48) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit',
        year: '2-digit'
      });
    }
  };

  const getConversationPreview = (conversation: Conversation) => {
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    if (!lastMessage) return 'Conversa vazia';
    
    const preview = lastMessage.content.length > 100 
      ? lastMessage.content.substring(0, 100) + '...'
      : lastMessage.content;
    
    return preview;
  };

  const handleConversationSelect = (conversationId: string) => {
    onConversationSelect(conversationId);
    onClose();
  };

  const filters = [
    { key: 'all' as FilterType, label: 'Todas' },
    { key: 'today' as FilterType, label: 'Hoje' },
    { key: 'week' as FilterType, label: 'Semana' },
    { key: 'month' as FilterType, label: 'Mês' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-red-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <History className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Histórico de Conversas</h2>
              <p className="text-sm text-gray-600">
                {filteredConversations.length} de {conversations.length} conversas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-100 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-4 border-b border-gray-100">
          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar conversas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200 focus:border-orange-400 focus:ring-orange-200"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            {filters.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeFilter === key
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
              <MessageSquare className="w-10 h-10 mb-3 text-gray-300" />
              <h3 className="font-medium mb-1">
                {searchQuery ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa'}
              </h3>
              <p className="text-sm text-center">
                {searchQuery 
                  ? 'Tente ajustar sua busca'
                  : 'Suas conversas aparecerão aqui'
                }
              </p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`group relative rounded-lg border transition-all duration-200 hover:shadow-sm cursor-pointer ${
                    currentConversationId === conversation.id
                      ? 'border-orange-300 bg-orange-50/70'
                      : 'border-gray-200 hover:border-orange-200 hover:bg-orange-50/30'
                  }`}
                  onClick={() => handleConversationSelect(conversation.id)}
                >
                  <div className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate text-sm">
                          {conversation.title || 'Conversa sem título'}
                        </h3>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                          <span>{conversation.messages.length} msgs</span>
                          <span>•</span>
                          <span>{formatDate(conversation.updatedAt)}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Excluir esta conversa?')) {
                            onConversationDelete(conversation.id);
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all duration-200"
                        title="Excluir conversa"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Preview */}
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {getConversationPreview(conversation)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {conversations.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/30">
            <div className="text-center text-xs text-gray-500">
              {filteredConversations.length} de {conversations.length} conversas
            </div>
          </div>
        )}
      </div>
    </div>
  );
};