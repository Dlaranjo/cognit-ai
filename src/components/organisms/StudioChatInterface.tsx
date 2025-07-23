import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Paperclip, X, ChevronDown, Sparkles, Square, Wrench, ArrowDown, Calculator, Globe, FileText, Image, Code, BarChart3, Database } from 'lucide-react';
import { MessageBubble, TypingIndicator, StreamingMessage } from '../molecules';
import { ToolsDropdown } from '../molecules/ToolsDropdown';
import { useChat } from '../../hooks/useChat';
import { useStreaming } from '../../hooks/useStreaming';
import { useAppSelector, useAppDispatch } from '../../redux/store';
import { selectStreamingMessage } from '../../redux/chat/chatSelectors';
import { removeLastAssistantMessage } from '../../redux/chat/chatReducer';
import { createAvailableModels, logger } from '../../shared/utils';
import { formatFileSize, getFileIcon, getFileTypeLabel } from '../../shared/utils/fileUtils';
import { mockTools } from '../../api/mock/mockData';
import type { LLMModel, Message, Tool } from '../../types';

interface StudioChatInterfaceProps {
  className?: string;
}

export const StudioChatInterface: React.FC<StudioChatInterfaceProps> = ({ 
  className = '' 
}) => {
  // Redux hooks
  const dispatch = useAppDispatch();
  const {
    currentConversation,
    messages,
    isLoading,
    selectedModel: reduxSelectedModel,
    sendQuickMessage,
    regenerateLastMessage,
    changeModel,
    addNewMessage,
    updateChatMessage,
    removeMessagesAfterMessage,
  } = useChat();

  const { isStreaming, startStreaming, stopStreaming } = useStreaming();
  const streamingMessage = useAppSelector(selectStreamingMessage);

  // Local UI state
  const availableModels = createAvailableModels();
  const [selectedModel, setSelectedModel] = useState<LLMModel>(availableModels[0]);
  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [focusedModelIndex, setFocusedModelIndex] = useState(-1);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  // Scroll state
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);



  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Simple scroll to bottom function
  const scrollToBottom = () => {
    if (!messagesContainerRef.current) return;

    const container = messagesContainerRef.current;
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth'
    });
  };

  // Check if user is near bottom of scroll
  const checkIfNearBottom = () => {
    if (!messagesContainerRef.current) return true;

    const container = messagesContainerRef.current;
    const threshold = 100; // pixels from bottom
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;

    return isNearBottom;
  };

  // Handle manual scroll by user
  const handleScroll = () => {
    const isNearBottom = checkIfNearBottom();

    // If user scrolled away from bottom, disable auto scroll
    if (!isNearBottom) {
      setShouldAutoScroll(false);
      setShowScrollButton(true);
    } else {
      // If user scrolled back to bottom, enable auto scroll
      setShouldAutoScroll(true);
      setShowScrollButton(false);
    }
  };

  // Handle scroll button click
  const handleScrollButtonClick = () => {
    scrollToBottom();
    setShouldAutoScroll(true);
    setShowScrollButton(false);
  };

  // Auto scroll when user sends a message
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];

      // If user sent a message, enable auto scroll and scroll to bottom
      // This will position for the upcoming assistant response
      if (lastMessage.role === 'user') {
        setShouldAutoScroll(true);
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      }
    }
  }, [messages]);

  // Auto scroll during streaming (if auto scroll is enabled)
  useEffect(() => {
    if (shouldAutoScroll && streamingMessage) {
      // Execute scroll immediately instead of using timeout that gets cancelled
      scrollToBottom();
    }
  }, [streamingMessage, shouldAutoScroll]);



  // Sync model selection with Redux
  useEffect(() => {
    const model = availableModels.find((m) => m.id === reduxSelectedModel);
    if (model && model.id !== selectedModel.id) {
      setSelectedModel(model);
    }
  }, [reduxSelectedModel, selectedModel.id, availableModels]);

  const handleModelSelect = useCallback((model: LLMModel) => {
    setSelectedModel(model);
    changeModel(model.id);
  }, [changeModel]);


  const handleSendOrStop = () => {
    if (isStreaming || streamingMessage) {
      stopStreaming();
    } else {
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || isLoading || isStreaming) return;

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
      attachments: files.length > 0 ? files.map((file, index) => ({
        id: `attachment-${Date.now()}-${index}`,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file), // URL temporária para visualização
      })) : undefined,
    };

    addNewMessage(userMessage);

    try {
      // Start streaming the response (this will handle both sending and receiving)
      await startStreaming(
        messageContent,
        {
          model: selectedModel.name,
          provider: selectedModel.provider.toLowerCase(),
          onStart: () => {
            logger.mock('Streaming started');
          },
          onComplete: () => {
            logger.mock('Streaming completed');
          },
          onError: async (error) => {
            logger.error('Streaming error:', error);
            // If streaming fails, fall back to regular message sending
            try {
              await sendQuickMessage(messageContent, files);
            } catch (fallbackError) {
              logger.error('Fallback message sending failed:', fallbackError);
            }
          },
        }
      );
    } catch (error) {
      logger.error('Failed to send message:', error);
      // If streaming fails completely, fall back to regular message sending
      try {
        await sendQuickMessage(messageContent, files);
      } catch (fallbackError) {
        logger.error('Fallback message sending also failed:', fallbackError);
      }
    }
  };

  const handleRegenerateResponse = async () => {
    if (isLoading || isStreaming) return;

    // Find the last assistant message and the user message that prompted it
    const assistantMessages = messages.filter((m: Message) => m.role === 'assistant');
    const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];
    if (!lastAssistantMessage) return;

    const assistantIndex = messages.findIndex((m: Message) => m.id === lastAssistantMessage.id);
    const userMessage = messages[assistantIndex - 1];

    if (!userMessage || userMessage.role !== 'user') return;

    try {
      // Remove the last assistant message before regenerating
      dispatch(removeLastAssistantMessage());

      // Use streaming for regeneration just like regular messages
      await startStreaming(
        userMessage.content,
        {
          model: selectedModel.name,
          provider: selectedModel.provider.toLowerCase(),
          isRegeneration: false, // Now we use false since we removed the message
          onStart: () => {
            logger.mock('Regeneration streaming started');
          },
          onComplete: () => {
            logger.mock('Regeneration streaming completed');
          },
          onError: async (error) => {
            logger.error('Regeneration streaming error:', error);
            // Fallback to regular regeneration
            try {
              await regenerateLastMessage();
            } catch (fallbackError) {
              logger.error('Fallback regeneration failed:', fallbackError);
            }
          },
        }
      );
    } catch (error) {
      logger.error('Failed to regenerate message with streaming:', error);
      // Fallback to regular regeneration
      try {
        await regenerateLastMessage();
      } catch (fallbackError) {
        logger.error('Fallback regeneration also failed:', fallbackError);
      }
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


  const handleToolSelect = (tool: Tool) => {
    console.log('Tool selected:', tool);
    setSelectedTool(tool);
    setShowToolsMenu(false);
  };
  const handleCopyMessage = (messageContent: string) => {
    navigator.clipboard.writeText(messageContent).then(() => {
      logger.mock('Message copied to clipboard');
    }).catch((error) => {
      logger.error('Failed to copy message:', error);
    });
  };
  
  const handleLikeMessage = (messageId: string) => {
    // TODO: Implementar sistema de feedback quando API estiver disponível
    logger.mock('Message liked:', messageId);
  };
  
  const handleDislikeMessage = (messageId: string) => {
    // TODO: Implementar sistema de feedback quando API estiver disponível
    logger.mock('Message disliked:', messageId);
  };

  const handleEditMessage = async (messageId: string, newContent: string) => {
    try {
      // Find the message being edited
      const messageIndex = messages.findIndex(msg => msg.id === messageId);
      if (messageIndex === -1) return;

      const editedMessage = messages[messageIndex];

      // Update the message content
      updateChatMessage(messageId, newContent);

      // Remove all messages after the edited message (including assistant responses)
      removeMessagesAfterMessage(messageId);

      // If it's a user message, send the edited content as a new message to get a new response
      if (editedMessage.role === 'user') {
        // Wait a bit for the state to update
        setTimeout(async () => {
          try {
            await startStreaming(
              newContent,
              {
                model: selectedModel.name,
                provider: selectedModel.provider.toLowerCase(),
                isRegeneration: false,
                onStart: () => {
                  logger.mock('Streaming started for edited message');
                },
                onComplete: () => {
                  logger.mock('Streaming completed for edited message');
                },
                onError: (error) => {
                  logger.error('Streaming error for edited message:', error);
                },
              }
            );
          } catch (error) {
            logger.error('Failed to send edited message:', error);
          }
        }, 100);
      }
    } catch (error) {
      logger.error('Failed to edit message:', error);
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  // Navegação por teclado no seletor de modelos
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showModelSelector) return;

      switch (e.key) {
        case 'Escape':
          setShowModelSelector(false);
          setFocusedModelIndex(-1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedModelIndex(prev => 
            prev < availableModels.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedModelIndex(prev => 
            prev > 0 ? prev - 1 : availableModels.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedModelIndex >= 0 && availableModels[focusedModelIndex]) {
            handleModelSelect(availableModels[focusedModelIndex]);
            setShowModelSelector(false);
            setFocusedModelIndex(-1);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showModelSelector, focusedModelIndex, availableModels, handleModelSelect]);

  // Reset focused index when dropdown closes
  useEffect(() => {
    if (!showModelSelector) {
      setFocusedModelIndex(-1);
    }
  }, [showModelSelector]);

  const hasMessages = messages && Array.isArray(messages) && messages.length > 0;

  return (
    <div className={`h-full relative ${className}`}>
      {/* Messages Area - Now takes full height */}
      <div
        ref={messagesContainerRef}
        className="absolute inset-0 overflow-y-auto"
        style={{ paddingBottom: hasMessages ? '110px' : '160px' }}
        onScroll={handleScroll}

      >
        {hasMessages ? (
          <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
            {messages.map((message: Message, index: number) => (
              <div key={message.id} className="group">
                <MessageBubble
                  content={message.content}
                  role={message.role as 'user' | 'assistant'}
                  timestamp={new Date(message.timestamp)}
                  model={message.model}
                  attachments={message.attachments}
                  isStreaming={isStreaming}
                  onCopy={() => handleCopyMessage(message.content)}
                  onLike={() => handleLikeMessage(message.id)}
                  onDislike={() => handleDislikeMessage(message.id)}
                  onEdit={
                    message.role === 'user'
                      ? (newContent: string) => handleEditMessage(message.id, newContent)
                      : undefined
                  }
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
              />
            ) : (isLoading || isStreaming) && (
              <TypingIndicator
                modelName={selectedModel.name}
              />
            )}

            <div ref={messagesEndRef} />
          </div>
        ) : (
          /* Welcome Screen */
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-2xl px-4">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-400 to-red-400 rounded-full animate-pulse"></div>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Cognit <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Studio</span>
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                Sua IA pessoal está pronta para ajudar
              </p>
              
              <div className="text-sm text-orange-600 bg-orange-50 px-6 py-3 rounded-full inline-block border border-orange-100">
                ✨ Comece digitando sua pergunta abaixo
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Input Area */}
      <div className="absolute bottom-0 left-0 right-0 px-6 py-6 pointer-events-none">
        <div className="pointer-events-auto max-w-5xl mx-auto">
          {/* Main Input Container - Enhanced floating effect */}
          <div className="relative bg-white/20 backdrop-blur-xl rounded-2xl border border-white/20 focus-within:border-orange-500 focus-within:shadow-2xl focus-within:bg-white/30 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:bg-white/25 hover:focus-within:border-orange-500">
            {/* File Attachments - Inside the input container */}
            {selectedFiles.length > 0 && (
              <div className="px-4 pt-4 pb-2">
                <div className="flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center gap-2 bg-white/50 backdrop-blur-sm text-gray-700 px-3 py-2 rounded-lg text-sm border border-white/30 hover:bg-white/70 hover:border-white/40 transition-all duration-200 shadow-sm"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                        {getFileIcon(file.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate max-w-32">{file.name}</div>
                        <div className="text-xs text-gray-500">
                          {getFileTypeLabel(file.type)} • {formatFileSize(file.size)}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-gray-600 ml-1 hover:bg-white/60 rounded-full p-1 transition-all duration-200 flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between px-4 pb-4">
              {/* Left side controls */}
              <div className="flex items-center space-x-2">
                {/* File Upload */}
                <button
                  onClick={handleFileSelect}
                  disabled={Boolean(isLoading)}
                  className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Anexar arquivo"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                {/* Tools Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowToolsMenu(!showToolsMenu)}
                    disabled={Boolean(isLoading)}
                    className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Ferramentas"
                  >
                    <Wrench className="w-5 h-5" />
                  </button>

                  {/* Tools Dropdown */}
                  <ToolsDropdown
                    isOpen={showToolsMenu}
                    onClose={() => setShowToolsMenu(false)}
                    onToolSelect={handleToolSelect}
                    tools={mockTools}
                  />
                </div>

                {/* Selected Tool Badge */}
                {selectedTool && (
                  <div className="flex items-center space-x-2 text-orange-600 px-2 py-1 rounded-md text-sm font-medium hover:bg-orange-50 transition-colors cursor-pointer">
                    <div className="w-4 h-4 flex items-center justify-center">
                      {selectedTool.icon === 'Calculator' ? <Calculator className="w-3.5 h-3.5" /> :
                       selectedTool.icon === 'Globe' ? <Globe className="w-3.5 h-3.5" /> :
                       selectedTool.icon === 'FileText' ? <FileText className="w-3.5 h-3.5" /> :
                       selectedTool.icon === 'Image' ? <Image className="w-3.5 h-3.5" /> :
                       selectedTool.icon === 'Code' ? <Code className="w-3.5 h-3.5" /> :
                       selectedTool.icon === 'BarChart3' ? <BarChart3 className="w-3.5 h-3.5" /> :
                       selectedTool.icon === 'Database' ? <Database className="w-3.5 h-3.5" /> : 
                       <Wrench className="w-3.5 h-3.5" />}
                    </div>
                    <span>{selectedTool.name}</span>
                    <button
                      onClick={() => setSelectedTool(null)}
                      className="w-4 h-4 rounded hover:bg-orange-100 flex items-center justify-center transition-colors"
                      title="Remover ferramenta"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Right side controls */}
              <div className="flex items-center space-x-3">
                {/* Model Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowModelSelector(!showModelSelector)}
                    className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    <span>{selectedModel.name}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${showModelSelector ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Model Dropdown */}
                  {showModelSelector && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowModelSelector(false)} />
                      <div className="absolute bottom-full left-0 mb-2 w-80 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden animate-fade-in">
                        {/* Models List */}
                        <div className="max-h-80 overflow-y-auto">
                          <div className="p-1">
                            {availableModels.map((model, index) => {
                              const isFocused = index === focusedModelIndex;
                              const isSelected = selectedModel.id === model.id;
                              
                              return (
                              <button
                                key={model.id}
                                onClick={() => {
                                  handleModelSelect(model);
                                  setShowModelSelector(false);
                                  setFocusedModelIndex(-1);
                                }}
                                onMouseEnter={() => setFocusedModelIndex(index)}
                                className={`group/model relative w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 ${
                                  isFocused || isSelected
                                    ? 'bg-orange-50 text-orange-700'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                                  isFocused || isSelected
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                  <div className="text-xs font-bold">
                                    {model.provider === 'OpenAI' ? 'AI' :
                                     model.provider === 'Anthropic' ? 'AN' :
                                     model.provider === 'Google' ? 'GO' : 'ME'}
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm truncate">{model.name}</div>
                                </div>
                              </button>
                              );
                            })}
                          </div>
                        </div>

                      </div>
                    </>
                  )}
                </div>

                {/* Send/Stop Button */}
                <button
                  onClick={handleSendOrStop}
                  disabled={Boolean(
                    !(isStreaming || streamingMessage) && (
                      !message.trim() ||
                      isLoading
                    )
                  )}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-2 rounded-lg hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                  title={(isStreaming || streamingMessage) ? 'Parar geração' : 'Enviar mensagem'}
                >
                  {(isStreaming || streamingMessage) ? (
                    <Square className="w-5 h-5" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
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

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <div className="absolute bottom-44 left-1/2 transform -translate-x-1/2 z-40">
          <button
            onClick={handleScrollButtonClick}
            className="bg-white/20 backdrop-blur-xl border border-white/20 hover:bg-white/30 hover:border-white/30 text-gray-600 hover:text-gray-700 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
