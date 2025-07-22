import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, ThumbsUp, ThumbsDown, RotateCcw, Sparkles, Paperclip, FileText, Image } from 'lucide-react';

export interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
  thumbnailUrl?: string;
}

export interface MessageBubbleProps {
  content: string;
  role: 'user' | 'assistant';
  timestamp?: Date;
  model?: string;
  avatar?: string;
  userName?: string;
  attachments?: MessageAttachment[];
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
    userName,
    attachments = [],
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

    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (type: string) => {
      if (type.startsWith('image/')) {
        return <Image className="w-4 h-4" />;
      }
      if (type.includes('pdf') || type.includes('document') || type.includes('text')) {
        return <FileText className="w-4 h-4" />;
      }
      return <Paperclip className="w-4 h-4" />;
    };

    const getFileTypeLabel = (type: string): string => {
      if (type.startsWith('image/')) {
        return 'Imagem';
      } else if (type.includes('pdf')) {
        return 'PDF';
      } else if (type.includes('text/')) {
        return 'Texto';
      } else if (type.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        return 'Word';
      } else if (type.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
        return 'Excel';
      } else if (type.includes('application/vnd.openxmlformats-officedocument.presentationml.presentation')) {
        return 'PowerPoint';
      } else if (type.includes('application/zip') || type.includes('application/x-rar')) {
        return 'Arquivo';
      } else {
        return 'Arquivo';
      }
    };

    const handleCopy = () => {
      navigator.clipboard.writeText(content);
      onCopy?.();
    };

    return (
      <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'} ${className}`}>
        {/* Avatar - Only show for assistant */}
        {!isUser && (
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
        )}

        {/* Message Content */}
        <div
          className={`flex-1 max-w-4xl ${isUser ? 'text-right' : 'text-left'}`}
        >
          {/* Header - Only show for assistant */}
          {!isUser && (
            <div className="flex items-center gap-2 mb-2 justify-start">
              <span className="text-sm font-semibold text-gray-700">
                {displayName}
              </span>

              {timestamp && (
                <span className="text-xs text-gray-500">
                  {formatTime(timestamp)}
                </span>
              )}
            </div>
          )}

          {/* Attachments - Above message content */}
          {attachments && attachments.length > 0 && (
            <div className={`mb-2 space-y-1 ${isUser ? 'flex flex-col items-end' : 'mr-8'}`}>
              {attachments.map((attachment, index) => (
                <a
                  key={`${attachment.id}-${index}`}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    flex items-center gap-2 p-2 rounded-lg border transition-all duration-200 cursor-pointer max-w-xs
                    ${isUser
                      ? 'bg-white/90 border-white/50 text-gray-800 hover:bg-white shadow-sm'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0 bg-orange-100 text-orange-600">
                    {getFileIcon(attachment.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate ${isUser ? 'text-gray-800' : 'text-gray-900'}`}>
                      {attachment.name}
                    </div>
                    <div className={`text-xs ${isUser ? 'text-gray-600' : 'text-gray-500'}`}>
                      {getFileTypeLabel(attachment.type)} • {formatFileSize(attachment.size)}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* Message Content */}
          {isUser ? (
            /* User Message Bubble */
            <div className="group relative">
              <div
                className="
                  rounded-2xl transition-all duration-300 ease-out
                  inline-block max-w-full text-base leading-relaxed
                  px-4 py-3 shadow-sm
                  bg-gradient-to-r from-orange-500 to-orange-600 text-white
                "
              >
                <div className="whitespace-pre-wrap">{content}</div>
                {isStreaming && (
                  <span className="inline-flex items-center ml-2">
                    <span className="w-1 h-1 bg-orange-400 rounded-full animate-bounce"></span>
                    <span className="w-1 h-1 bg-orange-400 rounded-full animate-bounce delay-100 ml-1"></span>
                    <span className="w-1 h-1 bg-orange-400 rounded-full animate-bounce delay-200 ml-1"></span>
                  </span>
                )}
              </div>
              
              {/* Copy Button for User Message */}
              {!isStreaming && (
                <div className="flex justify-end mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                  <button
                    onClick={handleCopy}
                    className="group/btn relative p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200 ease-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-1"
                    title="Copiar mensagem"
                  >
                    <Copy className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:scale-110" />
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                      Copiar
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Assistant Message - No Bubble, Direct Text */
            <div className="mr-8 text-base leading-relaxed text-gray-800">
              <div className="prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-800 prose-strong:text-gray-900 prose-code:text-orange-600 prose-code:bg-orange-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-50 prose-pre:border prose-ul:text-gray-800 prose-ol:text-gray-800 prose-li:text-gray-800 prose-ol:list-decimal prose-ul:list-disc prose-li:list-item">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Customizar componentes se necessário
                    code: (props) => {
                      const { children, ...rest } = props;
                      const isInline = !String(children).includes('\n');
                      return isInline ? (
                        <code className="bg-orange-50 text-orange-600 px-1 py-0.5 rounded text-sm" {...rest}>
                          {children}
                        </code>
                      ) : (
                        <pre className="bg-gray-50 border rounded p-3 overflow-x-auto">
                          <code className="text-sm" {...rest}>
                            {children}
                          </code>
                        </pre>
                      );
                    },
                    h1: ({ children }) => <h1 className="text-xl font-bold text-gray-800 mb-3">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-lg font-bold text-gray-800 mb-2">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-base font-bold text-gray-800 mb-2">{children}</h3>,
                    p: ({ children }) => <p className="text-gray-800 mb-2 last:mb-0">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc ml-4 text-gray-800 mb-3 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal ml-4 text-gray-800 mb-3 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="text-gray-800 ml-2">{children}</li>,
                    strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
                    em: ({ children }) => <em className="italic text-gray-800">{children}</em>,
                  }}
                >
                  {content}
                </ReactMarkdown>
                {isStreaming && (
                  <span className="inline-flex items-center ml-2">
                    <span className="w-1 h-1 bg-orange-400 rounded-full animate-bounce"></span>
                    <span className="w-1 h-1 bg-orange-400 rounded-full animate-bounce delay-100 ml-1"></span>
                    <span className="w-1 h-1 bg-orange-400 rounded-full animate-bounce delay-200 ml-1"></span>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          {!isUser && !isStreaming && (
            <div className="flex items-center gap-0.5 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className="group/btn relative p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200 ease-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-1"
                title="Copiar mensagem"
              >
                <Copy className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:scale-110" />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  Copiar
                </div>
              </button>

              {/* Like Button */}
              <button
                onClick={onLike}
                className="group/btn relative p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 ease-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-200 focus:ring-offset-1"
                title="Gostei da resposta"
              >
                <ThumbsUp className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:scale-110" />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  Gostei
                </div>
              </button>

              {/* Dislike Button */}
              <button
                onClick={onDislike}
                className="group/btn relative p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 ease-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-offset-1"
                title="Não gostei da resposta"
              >
                <ThumbsDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:scale-110" />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  Não gostei
                </div>
              </button>

              {/* Regenerate Button */}
              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="group/btn relative p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200 ease-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:ring-offset-1"
                  title="Gerar nova resposta"
                >
                  <RotateCcw className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:scale-110 group-hover/btn:rotate-180" />
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