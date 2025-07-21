import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Paperclip, X } from 'lucide-react';
import { ConversationSidebar } from '../organisms/ConversationSidebar';
import { ModelSelector } from '../molecules/ModelSelector';
import { MessageBubble } from '../molecules/MessageBubble';
import { useChat } from '../../hooks/useChat';
import { useConversations } from '../../hooks/useConversations';
import { useStreaming } from '../../hooks/useStreaming';
import { useAppSelector } from '../../redux/store';
import { selectStreamingMessage } from '../../redux/chat/chatSelectors';
import { config } from '../../shared/config';
import type { LLMModel } from '../../types';

// Convert config providers to LLMModel format
const availableModels: LLMModel[] = config.LLM_PROVIDERS.flatMap((provider) =>
  provider.models.map((model) => ({
    id: model,
    name: model.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    provider: provider.name,
    description: `${provider.name} ${model} model`,
    contextWindow: getContextWindow(model),
    pricing: getPricing(model),
    capabilities: getCapabilities(model),
    color: getProviderColor(provider.id),
  }))
);

function getContextWindow(model: string): number {
  if (model.includes('gpt-4')) return 128000;
  if (model.includes('claude-3')) return 200000;
  if (model.includes('gemini')) return 32000;
  if (model.includes('llama')) return 4000;
  return 8000;
}

function getPricing(model: string): { input: number; output: number } {
  if (model.includes('gpt-4-turbo')) return { input: 0.01, output: 0.03 };
  if (model.includes('claude-3-opus')) return { input: 0.015, output: 0.075 };
  if (model.includes('claude-3-sonnet')) return { input: 0.003, output: 0.015 };
  if (model.includes('gemini-pro')) return { input: 0.0005, output: 0.0015 };
  if (model.includes('llama-2-70b')) return { input: 0.0007, output: 0.0009 };
  return { input: 0.001, output: 0.002 };
}

function getCapabilities(model: string): string[] {
  const base = ['Text', 'Code'];
  if (model.includes('gpt-4')) return [...base, 'Analysis', 'Creative Writing'];
  if (model.includes('claude-3'))
    return [...base, 'Analysis', 'Complex Reasoning'];
  if (model.includes('gemini')) return [...base, 'Images', 'Multimodal'];
  return base;
}

function getProviderColor(providerId: string): string {
  const colors = {
    openai: 'from-green-500 to-emerald-600',
    anthropic: 'from-purple-500 to-indigo-600',
    google: 'from-yellow-500 to-orange-600',
    meta: 'from-red-500 to-pink-600',
  };
  return (
    colors[providerId as keyof typeof colors] || 'from-gray-500 to-gray-600'
  );
}

export const StudioTemplate: React.FC = () => {
  // Redux hooks
  const {
    currentConversation,
    messages,
    isLoading,
    selectedModel: reduxSelectedModel,
    sendQuickMessage,
    regenerateLastMessage,
    startNewConversation,
    setConversation,
    changeModel,
  } = useChat();

  const { conversations, removeConversation } = useConversations();

  const { isStreaming, startStreaming } = useStreaming();

  // Get streaming message from Redux
  const streamingMessage = useAppSelector(selectStreamingMessage);

  // Local UI state
  const [selectedModel, setSelectedModel] = useState<LLMModel>(
    availableModels[0]
  );
  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Sync model selection with Redux
  useEffect(() => {
    if (selectedModel.id !== reduxSelectedModel) {
      changeModel(selectedModel.id);
    }
  }, [selectedModel.id, reduxSelectedModel, changeModel]);

  // Update local model when Redux model changes
  useEffect(() => {
    const model = availableModels.find((m) => m.id === reduxSelectedModel);
    if (model && model.id !== selectedModel.id) {
      setSelectedModel(model);
    }
  }, [reduxSelectedModel, selectedModel.id]);

  const createNewConversation = () => {
    startNewConversation();
  };

  const sendMessage = async () => {
    if (
      (!message.trim() && selectedFiles.length === 0) ||
      isLoading ||
      isStreaming
    )
      return;

    const messageContent = message.trim();
    const files = [...selectedFiles];

    // Clear inputs
    setMessage('');
    setSelectedFiles([]);

    // Add user message immediately (sendQuickMessage handles files if provided)
    if (files.length > 0) {
      // If files are attached, use a different approach
      // For now, just send the text message and note files were attached
      await sendQuickMessage(
        messageContent ||
          `[${files.length} arquivo${files.length > 1 ? 's' : ''} enviado${files.length > 1 ? 's' : ''}]`
      );
    } else {
      await sendQuickMessage(messageContent);
    }

    try {
      // Start streaming response
      await startStreaming(
        messageContent ||
          `Analyze these ${files.length} file${files.length > 1 ? 's' : ''}`,
        {
          model: selectedModel.id,
          provider: selectedModel.provider.toLowerCase(),
          onStart: () => {},
          onComplete: () => {},
          onError: (error) => {
            console.error('Streaming error:', error);
          },
        }
      );
    } catch (error) {
      console.error('Failed to start streaming:', error);
    }
  };

  const handleDeleteConversation = (conversationId: string) => {
    removeConversation(conversationId);
    if (currentConversation?.id === conversationId) {
      const remaining = conversations.filter((c) => c.id !== conversationId);
      setConversation(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const handleRegenerateResponse = async () => {
    if (isLoading || isStreaming) return;

    try {
      await regenerateLastMessage();
    } catch (error) {
      console.error('Failed to regenerate message:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  };

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Message actions
  const handleCopyMessage = () => {};

  const handleLikeMessage = () => {};

  const handleDislikeMessage = () => {};

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  return (
    <div className="h-full flex bg-gray-50">
      {/* Conversation Sidebar */}
      <ConversationSidebar
        conversations={conversations}
        currentConversation={currentConversation}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onConversationSelect={setConversation}
        onNewConversation={createNewConversation}
        onDeleteConversation={handleDeleteConversation}
      />

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <svg
                    width="24"
                    height="14"
                    viewBox="0 0 474 175"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g transform="translate(-131 -563)">
                      <g>
                        <g>
                          <text
                            fill="white"
                            fontFamily="Sundry,Sundry_MSFontService,sans-serif"
                            fontWeight="400"
                            fontSize="96"
                            transform="matrix(0.999702 0 0 0.994943 140.089 687)"
                          >
                            Cognit
                          </text>
                          <path
                            d="M503.45 629.884 503.832 629.884 511.558 655.829 495.724 655.829ZM545.737 617.102 545.737 683.872 561 683.872 561 617.102ZM494.007 617.102 471.21 683.872 487.426 683.872 491.718 669.565 515.565 669.565 519.857 683.872 536.072 683.872 513.275 617.102ZM452.699 579.057 586.021 579.057 586.021 712.379 452.699 712.379Z"
                            fill="white"
                            fillRule="evenodd"
                            transform="matrix(1.00478 0 0 1 -0.124693 3.84206)"
                          />
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Cognit Studio
                  </h1>
                  <p className="text-sm text-gray-600">Agregador de LLMs</p>
                </div>
              </div>
            </div>

            <ModelSelector
              models={availableModels}
              selectedModel={selectedModel}
              onModelSelect={setSelectedModel}
            />
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {currentConversation && messages.length > 0 ? (
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
              {messages.map((message, index) => (
                <MessageBubble
                  key={message.id}
                  content={message.content}
                  role={message.role}
                  timestamp={new Date(message.timestamp)}
                  model={message.model}
                  onCopy={handleCopyMessage}
                  onLike={handleLikeMessage}
                  onDislike={handleDislikeMessage}
                  onRegenerate={
                    message.role === 'assistant' &&
                    index === messages.length - 1 &&
                    !isLoading &&
                    !isStreaming
                      ? handleRegenerateResponse
                      : undefined
                  }
                />
              ))}

              {(isLoading || isStreaming || streamingMessage) && (
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-8 h-8 bg-gradient-to-br ${selectedModel.color} rounded-full flex items-center justify-center flex-shrink-0`}
                  >
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
                      {streamingMessage ? (
                        <div className="prose max-w-none">
                          <div className="text-gray-900 whitespace-pre-wrap">
                            {streamingMessage}
                            <span className="inline-block w-2 h-5 bg-orange-500 ml-1 animate-pulse"></span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                          </div>
                          <span className="text-sm text-gray-600">
                            {selectedModel.name} está pensando...
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          ) : (
            /* Welcome Screen */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md px-4">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <svg
                    width="40"
                    height="24"
                    viewBox="0 0 474 175"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g transform="translate(-131 -563)">
                      <g>
                        <g>
                          <text
                            fill="white"
                            fontFamily="Sundry,Sundry_MSFontService,sans-serif"
                            fontWeight="400"
                            fontSize="96"
                            transform="matrix(0.999702 0 0 0.994943 140.089 687)"
                          >
                            Cognit
                          </text>
                          <path
                            d="M503.45 629.884 503.832 629.884 511.558 655.829 495.724 655.829ZM545.737 617.102 545.737 683.872 561 683.872 561 617.102ZM494.007 617.102 471.21 683.872 487.426 683.872 491.718 669.565 515.565 669.565 519.857 683.872 536.072 683.872 513.275 617.102ZM452.699 579.057 586.021 579.057 586.021 712.379 452.699 712.379Z"
                            fill="white"
                            fillRule="evenodd"
                            transform="matrix(1.00478 0 0 1 -0.124693 3.84206)"
                          />
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Bem-vindo ao Cognit Studio
                </h2>
                <p className="text-gray-600 mb-6">
                  Converse com os melhores modelos de IA em um só lugar. Escolha
                  seu modelo preferido e comece uma nova conversa.
                </p>
                <div className="bg-orange-50 rounded-xl p-4">
                  <div className="flex items-center space-x-2 text-orange-700 mb-2">
                    <Bot className="w-5 h-5" />
                    <span className="font-medium">
                      Modelo Atual: {selectedModel.name}
                    </span>
                  </div>
                  <p className="text-sm text-orange-600">
                    {selectedModel.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="max-w-4xl mx-auto">
            {/* File Attachments */}
            {selectedFiles.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-sm"
                  >
                    <Paperclip className="w-3 h-3" />
                    <span className="truncate max-w-32">{file.name}</span>
                    <span className="text-orange-500">
                      ({formatFileSize(file.size)})
                    </span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-orange-500 hover:text-orange-700 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-end space-x-4">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    selectedFiles.length > 0
                      ? `Analise estes arquivos com ${selectedModel.name}...`
                      : `Converse com ${selectedModel.name}...`
                  }
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none min-h-[48px] max-h-[200px]"
                  rows={1}
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {message.length > 0 && `${message.length} chars`}
                </div>
              </div>

              {/* File Upload Button */}
              <button
                onClick={handleFileSelect}
                disabled={isLoading || isStreaming}
                className="bg-gray-100 text-gray-600 p-3 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                title="Anexar arquivo"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              <button
                onClick={sendMessage}
                disabled={
                  (!message.trim() && selectedFiles.length === 0) ||
                  isLoading ||
                  isStreaming
                }
                className="bg-orange-600 text-white p-3 rounded-xl hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt,.md,.jpg,.jpeg,.png,.gif"
              className="hidden"
            />

            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span>Modelo: {selectedModel.name}</span>
                <span>•</span>
                <span>
                  Contexto: {selectedModel.contextWindow.toLocaleString()}{' '}
                  tokens
                </span>
              </div>
              <div>
                Pressione Enter para enviar, Shift+Enter para nova linha
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
