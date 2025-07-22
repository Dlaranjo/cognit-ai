import React from 'react';
import { SearchBar } from '../molecules/SearchBar';
import { Button, Badge, Card, Input, Icon } from '../atoms';

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
      <Card
        key={conversation.id}
        variant={isSelected ? 'outlined' : 'default'}
        className={`
          group relative cursor-pointer transition-colors
          ${isSelected 
            ? 'bg-orange-50 border-orange-200' 
            : 'hover:bg-orange-50 hover:border-orange-200'
          }
        `}
        onClick={() => !isEditing && onConversationSelect(conversation.id)}
      >
        <div className="flex items-start gap-3">
          <Icon name="message-square" className="text-neutral-400 mt-0.5 flex-shrink-0" />
          
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <Input
                type="text"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyDown={handleKeyDown}
                size="sm"
                className="text-sm font-medium"
                autoFocus
              />
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-neutral-900 truncate">
                  {conversation.title}
                </h3>
                {conversation.isFavorite && (
                  <Icon name="star" className="w-3 h-3 text-warning fill-current flex-shrink-0" />
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
            onClick={() => {
              setExpandedMenuId(
                expandedMenuId === conversation.id ? null : conversation.id
              );
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto min-h-0"
          >
            <Icon name="more-horizontal" />
          </Button>

          {/* Context Menu */}
          {expandedMenuId === conversation.id && (
            <div className="absolute right-0 top-8 z-10 w-48 bg-white border border-neutral-200 rounded-md shadow-lg">
              <div className="py-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleStartEdit(conversation);
                  }}
                  className="w-full justify-start px-3 py-2 text-left hover:bg-orange-100 hover:text-orange-700"
                >
                  <Icon name="edit" size="sm" className="mr-2" />
                  Renomear
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onConversationToggleFavorite?.(conversation.id);
                    setExpandedMenuId(null);
                  }}
                  className="w-full justify-start px-3 py-2 text-left hover:bg-orange-100 hover:text-orange-700"
                >
                  <Icon name="star" size="sm" className="mr-2" />
                  {conversation.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onConversationDelete?.(conversation.id);
                    setExpandedMenuId(null);
                  }}
                  className="w-full justify-start px-3 py-2 text-left text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Icon name="trash-2" size="sm" className="mr-2" />
                  Excluir
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
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
            <Icon name="message-square" className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
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