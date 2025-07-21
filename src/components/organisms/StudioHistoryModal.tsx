import React from 'react';
import { History, X } from 'lucide-react';
import { ConversationList } from './ConversationList';
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

export const StudioHistoryModal: React.FC<StudioHistoryModalProps> = ({
  isOpen,
  conversations,
  currentConversationId,
  selectedModelName,
  onClose,
  onConversationSelect,
  onConversationDelete,
}) => {
  if (!isOpen) return null;

  const handleConversationSelect = (conversationId: string) => {
    onConversationSelect(conversationId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <History className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Histórico de Conversas</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-hidden">
          <ConversationList
            conversations={conversations.map(conv => ({
              id: conv.id,
              title: conv.title,
              lastMessage: conv.messages[conv.messages.length - 1]?.content,
              timestamp: new Date(conv.updatedAt),
              model: selectedModelName,
              messageCount: conv.messages.length,
            }))}
            selectedConversationId={currentConversationId}
            onConversationSelect={handleConversationSelect}
            onConversationDelete={onConversationDelete}
            showSearch={true}
          />
        </div>
      </div>
    </div>
  );
};
