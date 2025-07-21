import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, Send, Loader2 } from 'lucide-react';
import { AgentSelector } from '../organisms/AgentSelector';
import { ConversationHistory } from '../organisms/ConversationHistory';
import { useAgents } from '../../hooks/useAgents';
import { useWorkspaces } from '../../hooks/useWorkspaces';

// Importing types from Redux
import type { Agent } from '../../redux/agents/agentsTypes';

// Component helper functions
const getIconByName = (iconName: string) => {
  switch (iconName) {
    case 'presentation':
      return () => (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
        </svg>
      );
    case 'file-text':
      return () => (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
            clipRule="evenodd"
          />
        </svg>
      );
    case 'bar-chart-3':
      return () => (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      );
    case 'code':
      return () => (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      );
    case 'pen-tool':
      return () => (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5.05 3.636a1 1 0 010 1.414 7 7 0 000 9.9 1 1 0 11-1.414 1.414 9 9 0 010-12.728 1 1 0 011.414 0zm9.9 0a1 1 0 011.414 0 9 9 0 010 12.728 1 1 0 11-1.414-1.414 7 7 0 000-9.9 1 1 0 010-1.414zM7.879 6.464a1 1 0 010 1.414 3 3 0 000 4.244 1 1 0 11-1.415 1.414 5 5 0 010-7.072 1 1 0 011.415 0zm4.242 0a1 1 0 011.415 0 5 5 0 010 7.072 1 1 0 01-1.415-1.414 3 3 0 000-4.244 1 1 0 010-1.414zM10 8a2 2 0 100 4 2 2 0 000-4z"
            clipRule="evenodd"
          />
        </svg>
      );
    default:
      return Bot;
  }
};

export const AgentTemplate: React.FC = () => {
  const [message, setMessage] = useState('');

  // Redux hooks
  const {
    agents,
    selectedAgent,
    currentConversation,
    currentMessages,
    isProcessing,
    error,
    selectAgentById,
    startNewConversation,
    sendAgentMessage,
    clearAgentsError,
  } = useAgents();

  const { currentWorkspace } = useWorkspaces();

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedAgent || !currentWorkspace) return;

    try {
      // If no conversation exists, start a new one
      if (!currentConversation) {
        const result = await startNewConversation(
          selectedAgent.id,
          currentWorkspace.id,
          `Conversa com ${selectedAgent.name}`
        );

        if (result.type === 'fulfilled') {
          // Send the message to the new conversation
          await sendAgentMessage(result.payload.id, message);
        }
      } else {
        // Send message to existing conversation
        await sendAgentMessage(currentConversation.id, message);
      }

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleExampleClick = (example: string) => {
    setMessage(example);
  };

  const handleAgentSelect = (agent: Agent) => {
    selectAgentById(agent.id);
  };

  // Clear error on mount
  useEffect(() => {
    if (error) {
      clearAgentsError();
    }
  }, [error, clearAgentsError]);

  return (
    <div className="h-full flex">
      {/* Agent Selector Sidebar */}
      <div className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">AI Agents</h2>
              <p className="text-sm text-gray-600">Choose your assistant</p>
            </div>
          </div>
        </div>

        <AgentSelector
          agents={agents}
          selectedAgent={selectedAgent}
          onAgentSelect={handleAgentSelect}
          onExampleClick={handleExampleClick}
        />
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col">
        {selectedAgent ? (
          <>
            {/* Agent Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 bg-gradient-to-br ${selectedAgent.color} rounded-xl flex items-center justify-center`}
                >
                  {React.createElement(getIconByName(selectedAgent.icon), {
                    className: 'w-6 h-6 text-white',
                  })}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedAgent.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedAgent.description}
                  </p>
                </div>
                <div className="ml-auto">
                  <div className="flex items-center space-x-1 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">
                      {selectedAgent.isActive ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Conversation Area */}
            <div className="flex-1 overflow-y-auto">
              <ConversationHistory
                messages={currentMessages}
                agents={agents}
                isProcessing={isProcessing}
              />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-gray-200 bg-white">
              <div className="flex items-end space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder={`Ask ${selectedAgent.name} to help you...`}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                      Press Enter to send
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isProcessing}
                  className="bg-orange-600 text-white p-3 rounded-xl hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Quick Actions */}
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedAgent.examples.slice(0, 2).map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(example)}
                    className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Welcome Screen */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Choose an AI Agent
              </h3>
              <p className="text-gray-600 mb-6">
                Select an AI agent from the sidebar to start creating
                presentations, analyzing documents, processing data, and much
                more.
              </p>
              <div className="bg-orange-50 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-orange-700 mb-2">
                  <Bot className="w-5 h-5" />
                  <span className="font-medium">Pro Tip</span>
                </div>
                <p className="text-sm text-orange-600">
                  Each agent specializes in different tasks. Choose the one that
                  best matches your needs!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
