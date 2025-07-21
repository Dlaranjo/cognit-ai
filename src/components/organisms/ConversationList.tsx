import React from 'react';
import { MessageSquare, Star, MoreHorizontal, Trash2, Edit } from 'lucide-react';
import { SearchBar } from '../molecules/SearchBar';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';

export interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  timestamp: Date;
  model?: string;
  isFavorite?: boolean;
  messageCount?: number;
}

export interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onConversationSelect: (conversationId: string) => void;
  onConversationDelete?: (conversationId: string) => void;
  onConversationRename?: (conversationId: string, newTitle: string) => void;
  onConversationToggleFavorite?: (conversationId: string) => void;
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
  isLoading?: boolean;
  className?: string;
  showSearch?: boolean;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onConversationSelect,
  onConversationDelete,
  onConversationRename,
  onConversationToggleFavorite,
  onSearchChange,
  searchQuery = '',
  isLoading = false,
  className = '',
  showSearch = true,
}) => {
  const [expandedMenuId, setExpandedMenuId] = React.useState<string | null>(null);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editingTitle, setEditingTitle] = React.useState('');

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Agora há pouco';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h atrás`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d atrás`;
    } else {
      return timestamp.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      });
    }
  };

  const handleStartEdit = (conversation: Conversation) => {
    setEditingId(conversation.id);
    setEditingTitle(conversation.title);
    setExpandedMenuId(null);
  };

  const handleSaveEdit = () => {
    if (editingId && editingTitle.trim()) {
      onConversationRename?.(editingId, editingTitle.trim());
    }
    setEditingId(null);
    setEditingTitle('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  // Group conversations by favorites and recent
  const favoriteConversations = conversations.filter(conv => conv.isFavorite);
  const regularConversations = conversations.filter(conv => !conv.isFavorite);

  const renderConversation = (conversation: Conversation) => {
    const isSelected = conversation.id === selectedConversationId;
    const isEditing = editingId === conversation.id;

    return (
      <div
        key={conversation.id}
        className={`
          group relative p-3 rounded-lg cursor-pointer transition-colors
          ${isSelected 
            ? 'bg-orange-50 border border-orange-200' 
            : 'hover:bg-orange-50 border border-transparent hover:border-orange-200'
          }
        `}
        onClick={() => !isEditing && onConversationSelect(conversation.id)}
      >
        <div className="flex items-start gap-3">
          <MessageSquare className="w-4 h-4 text-neutral-400 mt-0.5 flex-shrink-0" />
          
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyDown={handleKeyDown}
                className="w-full text-sm font-medium bg-white border border-primary rounded px-2 py-1"
                autoFocus
              />
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-neutral-900 truncate">
                  {conversation.title}
                </h3>
                {conversation.isFavorite && (
                  <Star className="w-3 h-3 text-warning fill-current flex-shrink-0" />
                )}
              </div>
            )}
            
            {conversation.lastMessage && (
              <p className="text-xs text-neutral-500 truncate mt-1">
                {conversation.lastMessage}
              </p>
            )}
            
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-neutral-400">
                {formatTimestamp(conversation.timestamp)}
              </span>
              
              <div className="flex items-center gap-2">
                {conversation.model && (
                  <Badge variant="neutral" size="sm">
                    {conversation.model}
                  </Badge>
                )}
                
                {conversation.messageCount && (
                  <span className="text-xs text-neutral-400">
                    {conversation.messageCount} msgs
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setExpandedMenuId(
                expandedMenuId === conversation.id ? null : conversation.id
              );
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto min-h-0"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>

          {/* Context Menu */}
          {expandedMenuId === conversation.id && (
            <div className="absolute right-0 top-8 z-10 w-48 bg-white border border-neutral-200 rounded-md shadow-lg">
              <div className="py-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartEdit(conversation);
                  }}
                  className="w-full justify-start px-3 py-2 text-left hover:bg-orange-100 hover:text-orange-700"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Renomear
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onConversationToggleFavorite?.(conversation.id);
                    setExpandedMenuId(null);
                  }}
                  className="w-full justify-start px-3 py-2 text-left hover:bg-orange-100 hover:text-orange-700"
                >
                  <Star className="w-4 h-4 mr-2" />
                  {conversation.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onConversationDelete?.(conversation.id);
                    setExpandedMenuId(null);
                  }}
                  className="w-full justify-start px-3 py-2 text-left text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Search */}
      {showSearch && (
        <div className="p-4 border-b border-neutral-200">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Buscar conversas..."
            size="md"
          />
        </div>
      )}

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-neutral-500">
            <p>Carregando conversas...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-center text-neutral-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
            <p className="text-sm">
              {searchQuery ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda'}
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {/* Favorites Section */}
            {favoriteConversations.length > 0 && (
              <div className="mb-4">
                <h4 className="text-xs font-medium text-neutral-500 uppercase tracking-wide px-2 mb-2">
                  Favoritos
                </h4>
                <div className="space-y-1">
                  {favoriteConversations.map(renderConversation)}
                </div>
              </div>
            )}

            {/* Regular Conversations */}
            {regularConversations.length > 0 && (
              <div>
                {favoriteConversations.length > 0 && (
                  <h4 className="text-xs font-medium text-neutral-500 uppercase tracking-wide px-2 mb-2">
                    Recentes
                  </h4>
                )}
                <div className="space-y-1">
                  {regularConversations.map(renderConversation)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;