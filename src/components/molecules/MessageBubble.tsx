import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, ThumbsUp, ThumbsDown, RotateCcw, Sparkles, Paperclip, FileText, Image, Check, Heart, HeartOff, Edit3, Save, X } from 'lucide-react';
import { formatFileSize, getFileTypeLabel } from '../../shared/utils/fileUtils';

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
  onEdit?: (newContent: string) => void;
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
    onEdit,
    isStreaming = false,
    className = '',
  }) => {
    const isUser = role === 'user';
    const displayName = isUser ? userName || 'Você' : model || 'Assistente';
    
    const [buttonStates, setButtonStates] = useState({
      copied: false,
      liked: false,
      disliked: false,
      regenerating: false,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(content);

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
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



    const handleCopy = () => {
      navigator.clipboard.writeText(content);
      setButtonStates(prev => ({ ...prev, copied: true }));
      setTimeout(() => {
        setButtonStates(prev => ({ ...prev, copied: false }));
      }, 2000);
      onCopy?.();
    };

    const handleLike = () => {
      setButtonStates(prev => ({
        ...prev,
        liked: !prev.liked, // Toggle like state
        disliked: false, // Clear dislike if active
      }));
      onLike?.();
    };

    const handleDislike = () => {
      setButtonStates(prev => ({
        ...prev,
        disliked: !prev.disliked, // Toggle dislike state
        liked: false, // Clear like if active
      }));
      onDislike?.();
    };

    const handleRegenerate = () => {
      setButtonStates(prev => ({ ...prev, regenerating: true }));
      setTimeout(() => {
        setButtonStates(prev => ({ ...prev, regenerating: false }));
      }, 2000);
      onRegenerate?.();
    };

    const handleEdit = () => {
      setIsEditing(true);
      setEditContent(content);
    };

    const handleSaveEdit = () => {
      // Não executa se estiver em streaming
      if (isStreaming) return;

      if (editContent.trim() && editContent !== content) {
        onEdit?.(editContent.trim());
      }
      setIsEditing(false);
    };

    const handleCancelEdit = () => {
      setIsEditing(false);
      setEditContent(content);
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
            <div className="group relative w-full py-1">
              {isEditing ? (
                /* Edit Mode */
                <div className="w-full max-w-4xl">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full min-h-[100px] p-4 border border-orange-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base leading-relaxed"
                    placeholder="Digite sua mensagem..."
                    autoFocus
                  />
                </div>
              ) : (
                /* Normal Display Mode */
                <div
                  className="
                    rounded-2xl transition-all duration-300 ease-out
                    block max-w-full text-base leading-relaxed
                    px-4 py-3 shadow-sm w-fit ml-auto
                    bg-gradient-to-r from-orange-500 to-orange-600 text-white
                  "
                >
                  <div className="whitespace-pre-wrap">{content}</div>

                </div>
              )}
              
              {/* Action Buttons for User Message */}
              {(
                <div className="flex justify-end gap-0.5 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out">
                  {isEditing ? (
                    /* Edit Mode Buttons */
                    <>
                      <button
                        onClick={handleSaveEdit}
                        disabled={isStreaming}
                        className={`group/btn relative p-1.5 rounded-lg hover:scale-105 active:scale-100 outline-none transition-colors duration-200 ${
                          isStreaming
                            ? 'text-gray-400 cursor-not-allowed opacity-60'
                            : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                        }`}
                        title={isStreaming ? 'Aguarde o fim da geração' : 'Salvar alterações'}
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                      >
                        <Save className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:scale-110" />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                          Salvar
                        </div>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="group/btn relative p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg hover:scale-105 active:scale-100 outline-none"
                        title="Cancelar edição"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                      >
                        <X className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:scale-110" />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                          Cancelar
                        </div>
                      </button>
                    </>
                  ) : (
                    /* Normal Mode Buttons */
                    <>
                      <button
                        onClick={handleCopy}
                        className={`group/btn relative p-1.5 rounded-lg hover:scale-105 active:scale-100 outline-none transition-colors duration-200 ${
                          buttonStates.copied
                            ? 'text-green-600'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                        }`}
                        title="Copiar mensagem"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                      >
                        {buttonStates.copied ? (
                          <Check className="w-3.5 h-3.5 transition-transform duration-200" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:scale-110" />
                        )}
                        {!buttonStates.copied && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                            Copiar
                          </div>
                        )}
                      </button>
                      <button
                        onClick={handleEdit}
                        className="group/btn relative p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg hover:scale-105 active:scale-100 outline-none"
                        title="Editar mensagem"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                      >
                        <Edit3 className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:scale-110" />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                          Editar
                        </div>
                      </button>
                    </>
                  )}
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

              </div>
            </div>
          )}

          {/* Actions */}
          {!isUser && (
            <div className="flex items-center gap-0.5 mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out">
              {/* Copy Button */}
              <button
                onClick={handleCopy}
                className={`group/btn relative p-1.5 rounded-lg hover:scale-105 active:scale-100 outline-none transition-colors duration-200 ${
                  buttonStates.copied
                    ? 'text-green-600'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
                title="Copiar mensagem"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {buttonStates.copied ? (
                  <Check className="w-3.5 h-3.5 transition-transform duration-200" />
                ) : (
                  <Copy className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:scale-110" />
                )}
                {!buttonStates.copied && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    Copiar
                  </div>
                )}
              </button>

              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`group/btn relative p-1.5 rounded-lg hover:scale-105 active:scale-100 outline-none transition-colors duration-200 ${
                  buttonStates.liked
                    ? 'text-green-600'
                    : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                }`}
                title="Gostei da resposta"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {buttonStates.liked ? (
                  <Heart className="w-3.5 h-3.5 transition-transform duration-200 fill-current" />
                ) : (
                  <ThumbsUp className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:scale-110" />
                )}
                {!buttonStates.liked && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    Gostei
                  </div>
                )}
              </button>

              {/* Dislike Button */}
              <button
                onClick={handleDislike}
                className={`group/btn relative p-1.5 rounded-lg hover:scale-105 active:scale-100 outline-none transition-colors duration-200 ${
                  buttonStates.disliked
                    ? 'text-red-500'
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
                title="Não gostei da resposta"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {buttonStates.disliked ? (
                  <HeartOff className="w-3.5 h-3.5 transition-transform duration-200 fill-current" />
                ) : (
                  <ThumbsDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:scale-110" />
                )}
                {!buttonStates.disliked && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    Não gostei
                  </div>
                )}
              </button>

              {/* Regenerate Button */}
              {onRegenerate && (
                <button
                  onClick={handleRegenerate}
                  className={`group/btn relative p-1.5 rounded-lg hover:scale-105 active:scale-100 outline-none transition-colors duration-200 ${
                    buttonStates.regenerating
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-gray-400 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                  title={buttonStates.regenerating ? 'Regenerando!' : 'Gerar nova resposta'}
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  <RotateCcw className={`w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:scale-110 ${
                    buttonStates.regenerating ? 'animate-spin' : 'group-hover/btn:rotate-180'
                  }`} />
                  <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 text-white text-xs px-2 py-1 rounded-md transition-opacity duration-200 pointer-events-none whitespace-nowrap ${
                    buttonStates.regenerating
                      ? 'bg-orange-600 opacity-100'
                      : 'bg-gray-800 opacity-0 group-hover/btn:opacity-100'
                  }`}>
                    {buttonStates.regenerating ? 'Regenerando!' : 'Regenerar'}
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