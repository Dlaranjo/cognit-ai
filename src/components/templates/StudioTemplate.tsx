import React, { useState, useEffect } from 'react';
import { Plus, History, Database } from 'lucide-react';
import { StudioChatInterface } from '../organisms/StudioChatInterface';
import { StudioHistoryModal } from '../organisms/StudioHistoryModal';
import { StudioKnowledgeModal } from '../organisms/StudioKnowledgeModal';
import { useChat } from '../../hooks/useChat';
import { useConversations } from '../../hooks/useConversations';

export const StudioTemplate: React.FC = () => {
  // Redux hooks
  const {
    currentConversation,
    startNewConversation,
    setConversation,
  } = useChat();

  const { conversations, removeConversation, loadConversations } = useConversations();

  // Local UI state
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showKnowledgeModal, setShowKnowledgeModal] = useState(false);

  // Load conversations on component mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const createNewConversation = () => {
    startNewConversation();
  };

  const handleDeleteConversation = (conversationId: string) => {
    removeConversation(conversationId);
    if (currentConversation?.id === conversationId) {
      const remaining = conversations.filter((c) => c.id !== conversationId);
      setConversation(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const handleConversationSelect = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setConversation(conversation);
    }
  };

  return (
    <div className="h-full relative bg-white overflow-hidden">
      {/* Main Chat Interface - Full height */}
      <div className="h-full">
        <StudioChatInterface />
      </div>

      {/* Floating Action Buttons - Compact & Elegant */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-50">
        {/* New Conversation Button */}
        <button
          onClick={createNewConversation}
          className="group relative bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white p-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
          title="Nova conversa"
        >
          <Plus className="w-4 h-4" />

          {/* Tooltip */}
          <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-900/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-150 whitespace-nowrap pointer-events-none delay-75">
            Nova conversa
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-2 border-transparent border-l-gray-900/90"></div>
          </div>
        </button>

        {/* History Button */}
        <button
          onClick={() => setShowHistoryModal(true)}
          className="group relative bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:bg-white/90 hover:border-gray-300/60 text-gray-600 hover:text-gray-700 p-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
          title="Histórico de conversas"
        >
          <History className="w-4 h-4" />

          {/* Tooltip */}
          <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-900/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-150 whitespace-nowrap pointer-events-none delay-75">
            Histórico
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-2 border-transparent border-l-gray-900/90"></div>
          </div>
        </button>

        {/* Knowledge Base Button */}
        <button
          onClick={() => setShowKnowledgeModal(true)}
          className="group relative bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:bg-white/90 hover:border-gray-300/60 text-gray-600 hover:text-gray-700 p-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
          title="Base de Conhecimento"
        >
          <Database className="w-4 h-4" />

          {/* Tooltip */}
          <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-900/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-150 whitespace-nowrap pointer-events-none delay-75">
            Base de Conhecimento
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-2 border-transparent border-l-gray-900/90"></div>
          </div>
        </button>
      </div>

      {/* History Modal */}
      <StudioHistoryModal
        isOpen={showHistoryModal}
        conversations={conversations}
        currentConversationId={currentConversation?.id}
        onClose={() => setShowHistoryModal(false)}
        onConversationSelect={handleConversationSelect}
        onConversationDelete={handleDeleteConversation}
      />

      {/* Knowledge Base Modal */}
      <StudioKnowledgeModal
        isOpen={showKnowledgeModal}
        onClose={() => setShowKnowledgeModal(false)}
      />
    </div>
  );
};