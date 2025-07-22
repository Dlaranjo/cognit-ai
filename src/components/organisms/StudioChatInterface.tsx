import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Paperclip, X, ChevronDown, Sparkles } from 'lucide-react';
import { MessageBubble } from '../molecules/MessageBubble';
import { useChat } from '../../hooks/useChat';
import { useStreaming } from '../../hooks/useStreaming';
import { useAppSelector } from '../../redux/store';
import { selectStreamingMessage } from '../../redux/chat/chatSelectors';
import { createAvailableModels, formatFileSize } from '../../shared/utils/modelUtils';
import type { LLMModel, Message } from '../../types';

// Componente para animação de digitação melhorada
const TypingIndicator: React.FC<{ modelName: string; modelColor: string }> = ({ 
  modelName, 
  modelColor 
}) => (
  <div className="flex items-start space-x-4 animate-fade-in">
    <div className={`w-10 h-10 bg-gradient-to-br ${modelColor} rounded-full flex items-center justify-center shadow-lg`}>
      <Sparkles className="w-5 h-5 text-white animate-pulse" />
    </div>
    <div className="flex-1">
      <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-200 max-w-xs">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
          </div>
          <span className="text-sm text-gray-600 font-medium">
            {modelName} está pensando...
          </span>
        </div>
      </div>
    </div>
  </div>
);

// Componente para mensagem em streaming com animação
const StreamingMessage: React.FC<{ 
  content: string; 
  modelName: string; 
  modelColor: string;
}> = ({ content, modelName, modelColor }) => (
  <div className="flex items-start space-x-4 animate-fade-in">
    <div className={`w-10 h-10 bg-gradient-to-br ${modelColor} rounded-full flex items-center justify-center shadow-lg`}>
      <Sparkles className="w-5 h-5 text-white" />
    </div>
    <div className="flex-1">
      <div className="mb-2">
        <span className="text-sm font-semibold text-gray-700">{modelName}</span>
      </div>
      <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-200 mr-8">
        <div className="prose max-w-none">
          <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
            {content}
            <span className="inline-flex items-center ml-2">
              <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce"></span>
              <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce delay-100 ml-1"></span>
              <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce delay-200 ml-1"></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
interface StudioChatInterfaceProps {
  className?: string;
}

export const StudioChatInterface: React.FC<StudioChatInterfaceProps> = ({ 
  className = '' 
}) => {
  // Redux hooks
  const {
    currentConversation,
    messages,
    isLoading,
    selectedModel: reduxSelectedModel,
    sendQuickMessage,
    regenerateLastMessage,
    changeModel,
    addNewMessage,
  } = useChat();

  const { isStreaming, startStreaming } = useStreaming();
  const streamingMessage = useAppSelector(selectStreamingMessage);

  // Local UI state
  const availableModels = createAvailableModels();
  const [selectedModel, setSelectedModel] = useState<LLMModel>(availableModels[0]);
  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showModelSelector, setShowModelSelector] = useState(false);
  
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
    const model = availableModels.find((m) => m.id === reduxSelectedModel);
    if (model && model.id !== selectedModel.id) {
      setSelectedModel(model);
    }
  }, [reduxSelectedModel, selectedModel.id, availableModels]);

  const handleModelSelect = (model: LLMModel) => {
    setSelectedModel(model);
    changeModel(model.id);
  };

  const sendMessage = async () => {
    if ((!message.trim() && selectedFiles.length === 0) || isLoading || isStreaming) return;

    const messageContent = message.trim();
    const files = [...selectedFiles];

    // Clear input immediately
    setMessage('');
    setSelectedFiles([]);

    // Add user message immediately to show it in the UI
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: messageContent,
      role: 'user',
      timestamp: new Date().toISOString(),
      conversationId: currentConversation?.id || 'temp',
    };

    addNewMessage(userMessage);

    try {
      // Start streaming the response (this will handle both sending and receiving)
      await startStreaming(
        messageContent,
        {
          model: selectedModel.id,
          provider: selectedModel.provider.toLowerCase(),
          onStart: () => {
            console.log('Streaming started');
          },
          onComplete: () => {
            console.log('Streaming completed');
          },
          onError: async (error) => {
            console.error('Streaming error:', error);
            // If streaming fails, fall back to regular message sending
            try {
              await sendQuickMessage(messageContent, files);
            } catch (fallbackError) {
              console.error('Fallback message sending failed:', fallbackError);
            }
          },
        }
      );
    } catch (error) {
      console.error('Failed to send message:', error);
      // If streaming fails completely, fall back to regular message sending
      try {
        await sendQuickMessage(messageContent, files);
      } catch (fallbackError) {
        console.error('Fallback message sending also failed:', fallbackError);
      }
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
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCopyMessage = () => {};
  const handleLikeMessage = () => {};
  const handleDislikeMessage = () => {};

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const hasMessages = messages && Array.isArray(messages) && messages.length > 0;

  return (
    <div className={`h-full flex flex-col bg-gradient-to-b from-gray-50 to-white ${className}`}>
      {/* Messages Area */}
      <div className={`flex-1 overflow-y-auto ${hasMessages ? 'pb-6' : ''}`}>
        {hasMessages ? (
          <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
            {messages.map((message: Message, index: number) => (
              <div key={message.id} className="group">
                <MessageBubble
                  content={message.content}
                  role={message.role as 'user' | 'assistant'}
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
              </div>
            ))}

            {streamingMessage ? (
              <StreamingMessage 
                content={String(streamingMessage || '')}
                modelName={selectedModel.name}
                modelColor={selectedModel.color}
              />
            ) : (isLoading || isStreaming) && (
              <TypingIndicator 
                modelName={selectedModel.name}
                modelColor={selectedModel.color}
              />
            )}

            <div ref={messagesEndRef} />
          </div>
        ) : (
          /* Welcome Screen */
          <div className="flex items-center justify-center h-full bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="text-center max-w-2xl px-4">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-pulse"></div>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Cognit <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Studio</span>
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                Sua IA pessoal está pronta para ajudar
              </p>
              
              <div className="text-sm text-indigo-600 bg-indigo-50 px-6 py-3 rounded-full inline-block border border-indigo-100">
                ✨ Comece digitando sua pergunta abaixo
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className={`${hasMessages ? 'sticky bottom-0 z-10' : ''} border-t border-gray-200 px-6 py-6 bg-white/80 backdrop-blur-sm shadow-lg`}>
        <div className="max-w-5xl mx-auto">
          {/* File Attachments */}
          {selectedFiles.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-full text-sm border border-indigo-200"
                >
                  <Paperclip className="w-3 h-3" />
                  <span className="truncate max-w-32">{file.name}</span>
                  <span className="text-indigo-500">
                    ({formatFileSize(file.size)})
                  </span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-indigo-500 hover:text-indigo-700 ml-1 hover:bg-indigo-100 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Main Input Container */}
          <div className="relative bg-white rounded-2xl border-2 border-gray-200 focus-within:border-indigo-400 focus-within:shadow-lg transition-all duration-200">
            {/* Input Area */}
            <div className="flex items-end p-4">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Digite sua mensagem..."
                  className="w-full bg-transparent resize-none border-none outline-none text-gray-900 placeholder-gray-500 text-lg min-h-[24px] max-h-[200px]"
                  rows={1}
                />
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-2 ml-4">
                {/* File Upload */}
                <button
                  onClick={handleFileSelect}
                  disabled={Boolean(isLoading || isStreaming)}
                  className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Anexar arquivo"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                {/* Send Button */}
                <button
                  onClick={sendMessage}
                  disabled={Boolean(
                    (!message.trim() && selectedFiles.length === 0) ||
                    isLoading ||
                    isStreaming
                  )}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between px-4 pb-4">
              {/* Model Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowModelSelector(!showModelSelector)}
                  className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <div className={`w-3 h-3 bg-gradient-to-br ${selectedModel.color} rounded-full`}></div>
                  <span>{selectedModel.name}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showModelSelector ? 'rotate-180' : ''}`} />
                </button>

                {/* Model Dropdown */}
                {showModelSelector && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowModelSelector(false)} />
                    <div className="absolute bottom-full left-0 mb-2 w-80 bg-white rounded-xl border border-gray-200 shadow-xl z-20 max-h-64 overflow-y-auto">
                      <div className="p-2">
                        {availableModels.map((model) => (
                          <button
                            key={model.id}
                            onClick={() => {
                              handleModelSelect(model);
                              setShowModelSelector(false);
                            }}
                            className={`w-full p-3 rounded-lg text-left transition-all ${
                              selectedModel.id === model.id
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                : 'hover:bg-indigo-50 hover:text-indigo-600'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-4 h-4 bg-gradient-to-br ${model.color} rounded-full`}></div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{model.name}</div>
                                <div className="text-sm text-gray-500">{model.provider}</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Keyboard Shortcut */}
              <div className="text-xs text-gray-400">
                ⏎ Enter para enviar
              </div>
            </div>
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
        </div>
      </div>
    </div>
  );
};
