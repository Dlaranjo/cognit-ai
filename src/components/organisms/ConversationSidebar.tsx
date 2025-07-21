import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  model?: string;
  tokens?: number;
}

interface Conversation {
  id: string;
  title: string;
  model: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface ConversationSidebarProps {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isOpen: boolean;
  onToggle: () => void;
  onConversationSelect: (conversation: Conversation) => void;
  onNewConversation: () => void;
  onDeleteConversation: (conversationId: string) => void;
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  currentConversation,
  isOpen,
  onToggle,
  onConversationSelect,
  onNewConversation,
  onDeleteConversation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredConversation, setHoveredConversation] = useState<string | null>(
    null
  );

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.messages.some((message) =>
        message.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diffInHours < 168) {
      // 7 days
      return date.toLocaleDateString('pt-BR', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      });
    }
  };

  const getModelColor = (model: string) => {
    const colors: { [key: string]: string } = {
      'gpt-4-turbo': 'bg-green-100 text-green-800',
      'claude-3-opus': 'bg-orange-100 text-orange-800',
      'claude-3-sonnet': 'bg-blue-100 text-blue-800',
      'gemini-pro': 'bg-purple-100 text-purple-800',
      'llama-2-70b': 'bg-teal-100 text-teal-800',
    };
    return colors[model] || 'bg-gray-100 text-gray-800';
  };

  const getModelShortName = (model: string) => {
    const names: { [key: string]: string } = {
      'gpt-4-turbo': 'GPT-4',
      'claude-3-opus': 'Claude',
      'claude-3-sonnet': 'Sonnet',
      'gemini-pro': 'Gemini',
      'llama-2-70b': 'Llama',
    };
    return names[model] || model;
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-20 left-4 z-20 bg-white border border-gray-200 rounded-lg p-2 shadow-md hover:shadow-lg transition-all"
      >
        {isOpen ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
          isOpen ? 'w-80' : 'w-0'
        } overflow-hidden`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={onNewConversation}
            className="w-full bg-orange-600 text-white px-4 py-3 rounded-xl hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2 font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Conversa</span>
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            <div className="p-2 space-y-1">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`group relative p-3 rounded-lg cursor-pointer transition-all ${
                    currentConversation?.id === conversation.id
                      ? 'bg-orange-50 border border-orange-200'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => onConversationSelect(conversation)}
                  onMouseEnter={() => setHoveredConversation(conversation.id)}
                  onMouseLeave={() => setHoveredConversation(null)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <h3 className="font-medium text-gray-900 truncate text-sm">
                          {conversation.title}
                        </h3>
                      </div>

                      <div className="flex items-center space-x-2 mb-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getModelColor(conversation.model)}`}
                        >
                          {getModelShortName(conversation.model)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(conversation.updatedAt)}
                        </span>
                      </div>

                      {conversation.messages.length > 0 && (
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {
                            conversation.messages[
                              conversation.messages.length - 1
                            ].content
                          }
                        </p>
                      )}
                    </div>

                    {/* Delete Button */}
                    {hoveredConversation === conversation.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteConversation(conversation.id);
                        }}
                        className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>{conversation.messages.length} mensagens</span>
                    {conversation.messages.some((m) => m.tokens) && (
                      <span>
                        {conversation.messages
                          .filter((m) => m.tokens)
                          .reduce((sum, m) => sum + (m.tokens || 0), 0)}{' '}
                        tokens
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                {searchTerm
                  ? 'Nenhuma conversa encontrada'
                  : 'Nenhuma conversa ainda'}
              </p>
              {!searchTerm && (
                <p className="text-xs text-gray-400 mt-1">
                  Clique em "Nova Conversa" para começar
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer Stats */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Total de conversas:</span>
              <span className="font-medium">{conversations.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Mensagens hoje:</span>
              <span className="font-medium">
                {conversations.reduce((sum, conv) => {
                  const today = new Date().toDateString();
                  return (
                    sum +
                    conv.messages.filter(
                      (m) => new Date(m.timestamp).toDateString() === today
                    ).length
                  );
                }, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
