import React from 'react';
import { Avatar, Button, Badge, Icon } from '../atoms';

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
      <div
        className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} ${className}`}
      >
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Avatar
            src={avatar}
            name={displayName}
            size="md"
            fallbackIcon={!isUser}
          />
        </div>

        {/* Message Content */}
        <div
          className={`flex-1 max-w-3xl ${isUser ? 'text-right' : 'text-left'}`}
        >
          {/* Header */}
          <div
            className={`flex items-center gap-2 mb-1 ${isUser ? 'justify-end' : 'justify-start'}`}
          >
            <span className="text-sm font-medium text-neutral-700">
              {displayName}
            </span>

            {model && !isUser && (
              <Badge variant="secondary" size="sm">
                {model}
              </Badge>
            )}

            {timestamp && (
              <span className="text-xs text-neutral-500">
                {formatTime(timestamp)}
              </span>
            )}
          </div>

          {/* Message Bubble */}
          <div
            className={`
              rounded-lg transition-all duration-200
              inline-block max-w-full text-sm whitespace-pre-wrap
              px-3 py-2
              ${isUser ? 'bg-orange-500 text-white border-2 border-orange-500' : 'bg-gray-100 text-gray-900 border-2 border-gray-200'}
            `}
          >
            {content}
            {isStreaming && (
              <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
            )}
          </div>

          {/* Actions */}
          {!isUser && !isStreaming && (
            <div className="flex items-center gap-1 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="p-1 h-auto min-h-0 hover:bg-orange-100 hover:text-orange-600"
              >
                <Icon name="copy" size="sm" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onLike}
                className="p-1 h-auto min-h-0 hover:bg-green-100 hover:text-green-600"
              >
                <Icon name="thumbs-up" size="sm" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onDislike}
                className="p-1 h-auto min-h-0 hover:bg-red-100 hover:text-red-600"
              >
                <Icon name="thumbs-down" size="sm" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={onRegenerate}
                className="p-1 h-auto min-h-0 hover:bg-orange-100 hover:text-orange-600"
              >
                <Icon name="rotate-ccw" size="sm" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default MessageBubble;
