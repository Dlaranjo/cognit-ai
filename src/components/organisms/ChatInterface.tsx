import React from 'react';
import { Send, Paperclip, Mic, Square } from 'lucide-react';
import { MessageBubble, FileUpload } from '../molecules';
import { Button, Spinner, Textarea } from '../atoms';
import { formatFileSize, getFileIcon, getFileTypeLabel } from '../../shared/utils/fileUtils';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  model?: string;
  attachments?: File[];
}

export interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string, files?: File[]) => void;
  onStopStreaming?: () => void;
  onMessageAction?: (messageId: string, action: 'like' | 'dislike' | 'copy' | 'regenerate') => void;
  isLoading?: boolean;
  isStreaming?: boolean;
  disabled?: boolean;
  placeholder?: string;
  currentModel?: string;
  className?: string;
  allowFileUpload?: boolean;
  allowVoiceInput?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  onStopStreaming,
  onMessageAction,
  isLoading = false,
  isStreaming = false,
  disabled = false,
  placeholder = 'Digite sua mensagem...',
  currentModel,
  className = '',
  allowFileUpload = true,
  allowVoiceInput = false,
}) => {
  const [inputValue, setInputValue] = React.useState('');
  const [attachedFiles, setAttachedFiles] = React.useState<File[]>([]);
  const [showFileUpload, setShowFileUpload] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSendOrStop();
  };

  const handleSendOrStop = () => {
    if (isStreaming) {
      onStopStreaming?.();
    } else {
      if (!inputValue.trim() || disabled || isLoading) return;

      onSendMessage(inputValue.trim(), attachedFiles.length > 0 ? attachedFiles : undefined);
      setInputValue('');
      setAttachedFiles([]);
      setShowFileUpload(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as React.FormEvent<HTMLFormElement>);
    }
  };

  const handleFileSelect = (files: File[]) => {
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const handleFileRemove = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const canSend = inputValue.trim().length > 0 && !disabled && !isLoading;
  const canInteract = isStreaming || canSend;

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 ? (
          <div className="text-center text-neutral-500 mt-12">
            <p className="text-lg font-medium mb-2">
              Comece uma conversa
            </p>
            <p className="text-sm">
              {currentModel ? `Conversando com ${currentModel}` : 'Envie uma mensagem para começar'}
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              content={message.content}
              role={message.role}
              timestamp={message.timestamp}
              model={message.model}
              onCopy={() => onMessageAction?.(message.id, 'copy')}
              onLike={() => onMessageAction?.(message.id, 'like')}
              onDislike={() => onMessageAction?.(message.id, 'dislike')}
              onRegenerate={() => onMessageAction?.(message.id, 'regenerate')}
              isStreaming={isStreaming && message.id === messages[messages.length - 1]?.id}
            />
          ))
        )}
        
        {isLoading && (
          <div className="flex items-center gap-2 text-neutral-500">
            <Spinner size="sm" />
            <span className="text-sm">Pensando...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* File Upload Area */}
      {showFileUpload && allowFileUpload && (
        <div className="border-t border-neutral-200 p-4">
          <FileUpload
            files={attachedFiles}
            onFilesSelect={handleFileSelect}
            onFileRemove={handleFileRemove}
            acceptedTypes={['.pdf', '.doc', '.docx', '.txt', '.md', 'image/*']}
            maxFiles={5}
            multiple={true}
          />
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-neutral-200 p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-end gap-2">
            {/* File Upload Button */}
            {allowFileUpload && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowFileUpload(!showFileUpload)}
                className="p-2 flex-shrink-0"
                disabled={disabled}
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            )}

            {/* Text Input */}
            <div className="flex-1 relative">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                rows={1}
                autoResize={true}
                maxRows={6}
                className="pr-12"
              />
            </div>

            {/* Voice Input Button */}
            {allowVoiceInput && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="p-2 flex-shrink-0"
                disabled={disabled}
              >
                <Mic className="w-4 h-4" />
              </Button>
            )}

            {/* Send/Stop Button */}
            <Button
              type="submit"
              variant={canInteract ? 'primary' : 'ghost'}
              size="sm"
              disabled={!canInteract}
              className="p-2 flex-shrink-0"
              title={isStreaming ? 'Parar geração' : 'Enviar mensagem'}
            >
              {isStreaming ? (
                <Square className="w-4 h-4" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* File Attachments Preview */}
          {attachedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {attachedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-2 px-3 py-2 bg-neutral-100 rounded-lg text-xs border border-neutral-200"
                >
                  <div className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0 bg-orange-100 text-orange-600">
                    {getFileIcon(file.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-neutral-900 truncate max-w-32">
                      {file.name}
                    </div>
                    <div className="text-neutral-500">
                      {getFileTypeLabel(file.type)} • {formatFileSize(file.size)}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFileRemove(index)}
                    className="p-1 h-auto min-h-0 flex-shrink-0 hover:bg-neutral-200 rounded"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;