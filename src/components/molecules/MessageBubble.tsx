import React from 'react';
import { Avatar, Badge } from '../atoms';
import { Copy, ThumbsUp, ThumbsDown, RotateCcw, Sparkles } from 'lucide-react';

export interface MessageBubbleProps {
  content: string;
  role: 'user' | 'assistant';
  timestamp?: Date;
  model?: string;
  avatar?: string;
  userName?: string;
  onCopy?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  onRegenerate?: () => void;
  isStreaming?: boolean;
  className?: string;
}

export const MessageBubble = React.memo<MessageBubbleProps>(
  ({
    content,
    role,
    timestamp,
    model,
    avatar,
    userName,
    onCopy,
    onLike,
    onDislike,
    onRegenerate,
    isStreaming = false,
    className = '',
  }) => {
    const isUser = role === 'user';
    const displayName = isUser ? userName || 'Você' : model || 'Assistente';

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const handleCopy = () => {
      navigator.clipboard.writeText(content);
      onCopy?.();
    };

    return (
      <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'} ${className}`}>
        {/* Avatar */}
        <div className="flex-shrink-0">
          {isUser ? (
            <Avatar
              src={avatar}
              name={displayName}
              size="md"
              className="ring-2 ring-orange-100"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Message Content */}
        <div
          className={`flex-1 max-w-4xl ${isUser ? 'text-right' : 'text-left'}`}
        >
          {/* Header */}
          <div
            className={`flex items-center gap-2 mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}
          >
            <span className="text-sm font-semibold text-gray-700">
              {displayName}
            </span>

            {model && !isUser && (
              <Badge variant="primary" size="sm" className="bg-orange-100 text-orange-700 border-orange-200">
                {model}
              </Badge>
            )}

            {timestamp && (
              <span className="text-xs text-gray-500">
                {formatTime(timestamp)}
              </span>
            )}
          </div>

          {/* Message Bubble */}
          <div
            className={`
              rounded-2xl transition-all duration-300 ease-out
              inline-block max-w-full text-base whitespace-pre-wrap leading-relaxed
              px-4 py-3 shadow-sm
              ${isUser 
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white ml-8' 
                : 'bg-white text-gray-800 border border-gray-200 mr-8'
              }
            `}
          >
            {content}
            {isStreaming && (
              <span className="inline-flex items-center ml-2">
                <span className="w-1 h-1 bg-orange-400 rounded-full animate-bounce"></span>
                <span className="w-1 h-1 bg-orange-400 rounded-full animate-bounce delay-100 ml-1"></span>
                <span className="w-1 h-1 bg-orange-400 rounded-full animate-bounce delay-200 ml-1"></span>
              </span>
            )}
          </div>

          {/* Actions */}
          {!isUser && !isStreaming && (
            <div className="flex items-center gap-1 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className="group/btn relative p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200 ease-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-1"
                title="Copiar mensagem"
              >
                <Copy className="w-4 h-4 transition-transform duration-200 group-hover/btn:scale-110" />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  Copiar
                </div>
              </button>

              {/* Like Button */}
              <button
                onClick={onLike}
                className="group/btn relative p-2.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 ease-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-200 focus:ring-offset-1"
                title="Gostei da resposta"
              >
                <ThumbsUp className="w-4 h-4 transition-transform duration-200 group-hover/btn:scale-110" />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  Gostei
                </div>
              </button>

              {/* Dislike Button */}
              <button
                onClick={onDislike}
                className="group/btn relative p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 ease-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-1"
                title="Não gostei da resposta"
              >
                <ThumbsDown className="w-4 h-4 transition-transform duration-200 group-hover/btn:scale-110" />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  Não gostei
                </div>
              </button>

              {/* Regenerate Button */}
              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="group/btn relative p-2.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 ease-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:ring-offset-1"
                  title="Gerar nova resposta"
                >
                  <RotateCcw className="w-4 h-4 transition-transform duration-200 group-hover/btn:scale-110 group-hover/btn:rotate-180" />
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    Regenerar
                  </div>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default MessageBubble;