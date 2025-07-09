import React, { useState } from 'react';
import { User, Bot, Copy, ThumbsUp, ThumbsDown, RotateCcw, Check, X } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  model?: string;
  tokens?: number;
  regenerating?: boolean;
}

interface LLMModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  contextWindow: number;
  pricing: {
    input: number;
    output: number;
  };
  capabilities: string[];
  color: string;
}

interface MessageBubbleProps {
  message: Message;
  model?: LLMModel;
  onRegenerate?: () => void;
  showRegenerate?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  model,
  onRegenerate,
  showRegenerate
}) => {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(feedback === type ? null : type);
  };

  if (message.type === 'user') {
    return (
      <div className="flex items-start space-x-4 justify-end">
        <div className="flex-1 max-w-3xl">
          <div className="bg-orange-600 text-white rounded-2xl px-4 py-3 ml-12">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
          <div className="flex items-center justify-end space-x-2 mt-2 text-xs text-gray-500">
            <span>{formatTime(message.timestamp)}</span>
          </div>
        </div>
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-4">
      <div className={`w-8 h-8 bg-gradient-to-br ${model?.color || 'from-gray-500 to-gray-600'} rounded-full flex items-center justify-center flex-shrink-0`}>
        <Bot className="w-4 h-4 text-white" />
      </div>
      
      <div className="flex-1 max-w-3xl">
        {/* Model Info */}
        {model && (
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm font-medium text-gray-900">{model.name}</span>
            {message.tokens && (
              <span className="text-xs text-gray-500">• {message.tokens} tokens</span>
            )}
            <span className="text-xs text-gray-500">• {formatTime(message.timestamp)}</span>
          </div>
        )}
        
        {/* Message Content */}
        <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200 mr-12 relative">
          {message.regenerating ? (
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
              <span className="text-sm">Regenerando resposta...</span>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-900 m-0">
                {message.content}
              </p>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        {!message.regenerating && (
          <div className="flex items-center space-x-2 mt-2">
            <button
              onClick={copyToClipboard}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Copiar mensagem"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
            
            <button
              onClick={() => handleFeedback('up')}
              className={`p-1.5 rounded-lg transition-colors ${
                feedback === 'up' 
                  ? 'text-green-600 bg-green-100' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              title="Gostei"
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => handleFeedback('down')}
              className={`p-1.5 rounded-lg transition-colors ${
                feedback === 'down' 
                  ? 'text-red-600 bg-red-100' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              title="Não gostei"
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
            
            {showRegenerate && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Regenerar resposta"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};