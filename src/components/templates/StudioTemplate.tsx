import React, { useState } from 'react';
import { StudioHeader } from '../organisms/StudioHeader';
import { StudioChatInterface } from '../organisms/StudioChatInterface';
import { StudioHistoryModal } from '../organisms/StudioHistoryModal';
import { useChat } from '../../hooks/useChat';
import { useConversations } from '../../hooks/useConversations';
import { createAvailableModels } from '../../shared/utils/modelUtils';
import type { LLMModel } from '../../types';

export const StudioTemplate: React.FC = () => {
  // Redux hooks
  const {
    currentConversation,
    startNewConversation,
    setConversation,
  } = useChat();

  const { conversations, removeConversation } = useConversations();

  // Local UI state
  const availableModels = createAvailableModels();
  const [selectedModel] = useState<LLMModel>(availableModels[0]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

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
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <StudioHeader
        onNewConversation={createNewConversation}
        onShowHistory={() => setShowHistoryModal(true)}
      />

      {/* Main Chat Interface */}
      <StudioChatInterface />

      {/* History Modal */}
      <StudioHistoryModal
        isOpen={showHistoryModal}
        conversations={conversations}
        currentConversationId={currentConversation?.id}
        selectedModelName={selectedModel.name}
        onClose={() => setShowHistoryModal(false)}
        onConversationSelect={handleConversationSelect}
        onConversationDelete={handleDeleteConversation}
      />
    </div>
  );
};