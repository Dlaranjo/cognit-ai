import React, { useState, useMemo } from 'react';
import { History, X, Search, MessageSquare, Calendar, Trash2, Star, StarOff, Filter, Clock, Bot } from 'lucide-react';
import { ConversationList } from './ConversationList';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import type { Conversation } from '../../types';

interface StudioHistoryModalProps {
  isOpen: boolean;
  conversations: Conversation[];
  currentConversationId?: string;
  selectedModelName: string;
  onClose: () => void;
  onConversationSelect: (conversationId: string) => void;
  onConversationDelete: (conversationId: string) => void;
}

type FilterType = 'all' | 'favorites' | 'today' | 'week' | 'month';

export const StudioHistoryModal: React.FC<StudioHistoryModalProps> = ({
  isOpen,
  conversations,
  currentConversationId,
  selectedModelName,
  onClose,
  onConversationSelect,
  onConversationDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (conversationId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(conversationId)) {
      newFavorites.delete(conversationId);
    } else {
      newFavorites.add(conversationId);
    }
    setFavorites(newFavorites);
  };

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
      case 'favorites':
        filtered = filtered.filter(conv => favorites.has(conv.id));
        break;
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
  }, [conversations, searchQuery, activeFilter, favorites]);

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
    { key: 'all' as FilterType, label: 'Todas', icon: MessageSquare },
    { key: 'favorites' as FilterType, label: 'Favoritas', icon: Star },
    { key: 'today' as FilterType, label: 'Hoje', icon: Clock },
    { key: 'week' as FilterType, label: 'Semana', icon: Calendar },
    { key: 'month' as FilterType, label: 'Mês', icon: Calendar },
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
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          {/* Search Bar */}
          <div className="relative mb-4">
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
          <div className="flex flex-wrap gap-2">
            {filters.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeFilter === key
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                    : 'bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600 border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                {key === 'favorites' && favorites.size > 0 && (
                  <Badge variant="secondary" size="sm" className="bg-white/20 text-white border-white/30">
                    {favorites.size}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <MessageSquare className="w-12 h-12 mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">
                {searchQuery ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda'}
              </h3>
              <p className="text-sm text-center max-w-md">
                {searchQuery 
                  ? 'Tente ajustar sua busca ou filtros'
                  : 'Suas conversas aparecerão aqui conforme você usar o chat'
                }
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`group relative bg-white rounded-xl border transition-all duration-200 hover:shadow-md hover:border-orange-200 cursor-pointer ${
                    currentConversationId === conversation.id
                      ? 'border-orange-300 bg-orange-50 shadow-sm'
                      : 'border-gray-200 hover:bg-orange-50/50'
                  }`}
                  onClick={() => handleConversationSelect(conversation.id)}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate mb-1">
                          {conversation.title || 'Conversa sem título'}
                        </h3>
                        <div className="flex items-center space-x-3 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="w-3 h-3" />
                            <span>{conversation.messages.length} mensagens</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(conversation.updatedAt)}</span>
                          </div>
                          {conversation.model && (
                            <div className="flex items-center space-x-1">
                              <Bot className="w-3 h-3" />
                              <span>{conversation.model}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(conversation.id);
                          }}
                          className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                            favorites.has(conversation.id)
                              ? 'text-yellow-500 hover:bg-yellow-50'
                              : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'
                          }`}
                          title={favorites.has(conversation.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                        >
                          {favorites.has(conversation.id) ? (
                            <Star className="w-4 h-4 fill-current" />
                          ) : (
                            <StarOff className="w-4 h-4" />
                          )}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Tem certeza que deseja excluir esta conversa?')) {
                              onConversationDelete(conversation.id);
                            }
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-105"
                          title="Excluir conversa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Preview */}
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {getConversationPreview(conversation)}
                    </p>

                    {/* Current Indicator */}
                    {currentConversationId === conversation.id && (
                      <div className="absolute top-4 right-4">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>💡 Dica: Use Ctrl+H para abrir o histórico rapidamente</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Total: {conversations.length} conversas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};