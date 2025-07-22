import React from 'react';
import { Avatar, Button, Badge } from '../atoms';
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
            <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="p-2 h-auto min-h-0 hover:bg-gray-100 hover:text-gray-700 rounded-lg transition-colors"
                title="Copiar"
              >
                <Copy className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onLike}
                className="p-2 h-auto min-h-0 hover:bg-orange-100 hover:text-orange-600 rounded-lg transition-colors"
                title="Gostei"
              >
                <ThumbsUp className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onDislike}
                className="p-2 h-auto min-h-0 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
                title="Não gostei"
              >
                <ThumbsDown className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onRegenerate}
                className="p-2 h-auto min-h-0 hover:bg-orange-100 hover:text-orange-600 rounded-lg transition-colors"
                title="Regenerar"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default MessageBubble;