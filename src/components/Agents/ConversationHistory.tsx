import React from 'react';
import { Bot, User } from 'lucide-react';
import { ActionResults } from './ActionResults';

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  color: string;
  capabilities: string[];
  examples: string[];
}

interface ActionResult {
  id: string;
  type: 'file' | 'analysis' | 'summary';
  title: string;
  description: string;
  downloadUrl?: string;
  previewUrl?: string;
  status: 'completed' | 'processing' | 'failed';
}

interface Message {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string;
  agentId?: string;
  attachments?: File[];
  actions?: ActionResult[];
}

interface ConversationHistoryProps {
  messages: Message[];
  agents: Agent[];
  isProcessing: boolean;
}

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  messages,
  agents,
  isProcessing
}) => {
  const getAgent = (agentId: string) => agents.find(a => a.id === agentId);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 space-y-6">
      {messages.map(message => {
        const agent = message.agentId ? getAgent(message.agentId) : null;
        
        return (
          <div key={message.id} className={`flex space-x-4 ${
            message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
          }`}>
            {/* Avatar */}
            <div className="flex-shrink-0">
              {message.type === 'user' ? (
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              ) : agent ? (
                <div className={`w-8 h-8 bg-gradient-to-br ${agent.color} rounded-full flex items-center justify-center`}>
                  <agent.icon className="w-4 h-4 text-white" />
                </div>
              ) : (
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Message Content */}
            <div className={`flex-1 max-w-3xl ${message.type === 'user' ? 'text-right' : ''}`}>
              {/* Message Header */}
              <div className={`flex items-center space-x-2 mb-2 ${
                message.type === 'user' ? 'justify-end' : ''
              }`}>
                <span className="text-sm font-medium text-gray-900">
                  {message.type === 'user' ? 'You' : agent?.name || 'AI Assistant'}
                </span>
                <span className="text-xs text-gray-500">
                  {formatTime(message.timestamp)}
                </span>
              </div>

              {/* Message Bubble */}
              <div className={`rounded-2xl px-4 py-3 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white ml-12'
                  : 'bg-gray-100 text-gray-900 mr-12'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>

              {/* Action Results */}
              {message.actions && message.actions.length > 0 && (
                <div className="mt-4 mr-12">
                  <ActionResults actions={message.actions} />
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="flex space-x-4">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="bg-gray-100 rounded-2xl px-4 py-3 mr-12">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
                <span className="text-sm text-gray-600">AI is thinking...</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};