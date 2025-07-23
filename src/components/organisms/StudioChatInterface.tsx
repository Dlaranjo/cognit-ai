import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Paperclip, X, ChevronDown, Sparkles, Search, Square, ArrowDown, Wrench, Calculator, Globe, FileText, Image, Code, Database, BarChart3 } from 'lucide-react';
import { MessageBubble } from '../molecules/MessageBubble';
import { useChat } from '../../hooks/useChat';
import { useStreaming } from '../../hooks/useStreaming';
import { useAppSelector, useAppDispatch } from '../../redux/store';
import { selectStreamingMessage } from '../../redux/chat/chatSelectors';
import { removeLastAssistantMessage } from '../../redux/chat/chatReducer';
import { createAvailableModels, formatFileSize, getPriceBadgeColor, logger } from '../../shared/utils';
import type { LLMModel, Message } from '../../types';

// Componente para animação de digitação melhorada
const TypingIndicator: React.FC<{ modelName: string }> = ({
  modelName
}) => {
  // Use orange theme for typing indicator
  const orangeColor = 'from-orange-500 to-red-500';

  return (
  <div className="flex items-start space-x-4 animate-fade-in">
    <div className={`w-10 h-10 bg-gradient-to-br ${orangeColor} rounded-full flex items-center justify-center shadow-lg`}>
      <Sparkles className="w-5 h-5 text-white animate-pulse" />
    </div>
    <div className="flex-1">
      <div className="mb-2">
        <span className="text-sm font-semibold text-gray-700">{modelName}</span>
      </div>
      {/* Typing Indicator - No Bubble, Direct Text */}
      <div className="mr-8 text-base leading-relaxed text-gray-800">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-200"></div>
          </div>
          <span className="text-sm text-gray-600 font-medium">
            está pensando...
          </span>
        </div>
      </div>
    </div>
  </div>
  );
};

// Componente para mensagem em streaming com cursor de digitação
const StreamingMessage: React.FC<{
  content: string;
  modelName: string;
}> = ({ content, modelName }) => {
  return (
    <div className="flex items-start space-x-4 animate-fade-in">
      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
        <Sparkles className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1">
        <div className="mb-2">
          <span className="text-sm font-semibold text-gray-700">{modelName}</span>
        </div>
        {/* Streaming Message - No Bubble, Direct Text */}
        <div className="mr-8 text-base leading-relaxed text-gray-800">
          <div className="prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-800 prose-strong:text-gray-900 prose-code:text-orange-600 prose-code:bg-orange-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-50 prose-pre:border prose-ul:text-gray-800 prose-ol:text-gray-800 prose-li:text-gray-800 prose-ol:list-decimal prose-ul:list-disc prose-li:list-item">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
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
            <span className="inline-flex items-center ml-1">
              <span className="w-0.5 h-4 bg-orange-500 animate-pulse"></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
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
  const [searchQuery, setSearchQuery] = useState('');
  const [showToolsMenu, setShowToolsMenu] = useState(false);

  // Smart scroll states
  const [autoScroll, setAutoScroll] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [userScrolled, setUserScrolled] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  const scrollToLatestAssistantMessage = useCallback(() => {
    if (!messagesContainerRef.current) return;

    const container = messagesContainerRef.current;

    // Procurar por elementos com classe 'animate-fade-in' que indicam mensagens
    const messageElements = container.querySelectorAll('.animate-fade-in');
    let lastAssistantMessage = null;

    // Procurar de trás para frente pela última mensagem que contém "Gpt"
    for (let i = messageElements.length - 1; i >= 0; i--) {
      const messageElement = messageElements[i];

      // Verificar se esta mensagem contém "Gpt" (indicador de mensagem do assistente)
      if (messageElement.textContent?.includes('Gpt') && messageElement.textContent?.includes('Turbo')) {
        lastAssistantMessage = messageElement;
        break;
      }
    }

    if (lastAssistantMessage) {
      // Calcular a posição do elemento em relação ao container
      const containerRect = container.getBoundingClientRect();
      const elementRect = lastAssistantMessage.getBoundingClientRect();

      // Calcular o scroll necessário para posicionar o elemento no topo
      const scrollTop = container.scrollTop + (elementRect.top - containerRect.top);

      // Fazer scroll suave para a posição calculada
      container.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    } else {
      // Fallback: scroll para o final
      scrollToBottom();
    }
  }, []);

  const checkScrollPosition = useCallback(() => {
    if (!messagesContainerRef.current) return;

    const container = messagesContainerRef.current;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;

    setShowScrollButton(!isNearBottom && messages.length > 0);
  }, [messages.length]);

  const handleScroll = () => {
    // Marcar que usuário fez scroll manual (isso vai parar o auto-scroll)
    setUserScrolled(true);

    // Se estava em auto-scroll, desativar
    if (autoScroll) {
      setAutoScroll(false);
    }

    checkScrollPosition();
  };

  const scrollToBottomButton = () => {
    // Apenas fazer scroll para o final, sem ativar auto-scroll
    scrollToBottom();
    setShowScrollButton(false);
  };

  // ChatGPT-style scroll logic - position assistant response at top of viewport
  useEffect(() => {
    if (messages.length > 0 && !userScrolled) {
      const lastMessage = messages[messages.length - 1];

      // Se a última mensagem é do assistente, posicionar no topo da viewport
      if (lastMessage.role === 'assistant') {
        // Usar timeout para garantir que o DOM foi renderizado
        setTimeout(() => {
          scrollToLatestAssistantMessage();
        }, 300);
      }
    }

    // Verificar a posição do scroll para mostrar/esconder o botão
    setTimeout(() => {
      checkScrollPosition();
    }, 400);
  }, [messages, userScrolled, checkScrollPosition, scrollToLatestAssistantMessage]);

  // Handle streaming messages - keep assistant response visible during streaming
  useEffect(() => {
    if (streamingMessage && !userScrolled) {
      // Durante o streaming, manter a mensagem do assistente visível
      setTimeout(() => {
        scrollToLatestAssistantMessage();
      }, 100);
    }
  }, [streamingMessage, userScrolled, scrollToLatestAssistantMessage]);

  // Reset user scroll state when starting new conversation
  useEffect(() => {
    if (messages.length === 0) {
      setUserScrolled(false);
      setShowScrollButton(false);
    }
  }, [messages.length]);

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
    setSearchQuery('');
  };

  // Filter models based on search query
  const filteredModels = availableModels.filter(model => 
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
    model.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  // Mock tools data
  const mockTools = [
    {
      id: 'calculator',
      name: 'Calculadora',
      description: 'Realizar cálculos matemáticos complexos',
      icon: Calculator,
      color: 'from-blue-500 to-blue-600',
      category: 'Matemática'
    },
    {
      id: 'web-search',
      name: 'Busca Web',
      description: 'Pesquisar informações atualizadas na internet',
      icon: Globe,
      color: 'from-green-500 to-green-600',
      category: 'Pesquisa'
    },
    {
      id: 'document-analyzer',
      name: 'Analisador de Documentos',
      description: 'Analisar e extrair informações de documentos',
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      category: 'Documentos'
    },
    {
      id: 'image-generator',
      name: 'Gerador de Imagens',
      description: 'Criar imagens usando IA generativa',
      icon: Image,
      color: 'from-pink-500 to-pink-600',
      category: 'Criativo'
    },
    {
      id: 'code-executor',
      name: 'Executor de Código',
      description: 'Executar e testar código em várias linguagens',
      icon: Code,
      color: 'from-indigo-500 to-indigo-600',
      category: 'Desenvolvimento'
    },
    {
      id: 'data-analyzer',
      name: 'Analisador de Dados',
      description: 'Analisar dados e criar visualizações',
      icon: BarChart3,
      color: 'from-orange-500 to-orange-600',
      category: 'Dados'
    },
    {
      id: 'database-query',
      name: 'Consulta de Banco',
      description: 'Executar consultas em bancos de dados',
      icon: Database,
      color: 'from-teal-500 to-teal-600',
      category: 'Dados'
    }
  ];

  const handleToolSelect = (tool: typeof mockTools[0]) => {
    console.log('Tool selected:', tool);
    // TODO: Implementar lógica de seleção de ferramenta
    setShowToolsMenu(false);
  };
  const handleCopyMessage = () => {};
  const handleLikeMessage = () => {};
  const handleDislikeMessage = () => {};

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

  const hasMessages = messages && Array.isArray(messages) && messages.length > 0;

  return (
    <div className={`h-full relative ${className}`}>
      {/* Messages Area - Now takes full height */}
      <div
        ref={messagesContainerRef}
        className="absolute inset-0 overflow-y-auto"
        style={{ paddingBottom: hasMessages ? '180px' : '160px' }}
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
                  onCopy={handleCopyMessage}
                  onLike={handleLikeMessage}
                  onDislike={handleDislikeMessage}
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
                        <Paperclip className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate max-w-32">{file.name}</div>
                        <div className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
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
                  {showToolsMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowToolsMenu(false)} />
                      <div className="absolute bottom-full left-0 mb-2 w-80 bg-white rounded-xl border border-gray-200 shadow-xl z-20 max-h-96 overflow-hidden">
                        {/* Header */}
                        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-red-50">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                              <Wrench className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Ferramentas</h3>
                              <p className="text-xs text-gray-600">Selecione uma ferramenta para usar</p>
                            </div>
                          </div>
                        </div>

                        {/* Tools List */}
                        <div className="overflow-y-auto max-h-80">
                          <div className="p-2">
                            {mockTools.map((tool) => (
                              <button
                                key={tool.id}
                                onClick={() => handleToolSelect(tool)}
                                className="w-full p-3 rounded-lg text-left transition-all mb-1 hover:bg-orange-50 hover:text-orange-600 group"
                              >
                                <div className="flex items-start space-x-3">
                                  <div className={`w-10 h-10 bg-gradient-to-br ${tool.color} rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow`}>
                                    <tool.icon className="w-5 h-5 text-white" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <div className="font-medium text-gray-900 text-sm">{tool.name}</div>
                                      <div className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                                        {tool.category}
                                      </div>
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1 leading-relaxed">
                                      {tool.description}
                                    </div>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="p-3 border-t border-gray-100 bg-gray-50">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Sparkles className="w-3 h-3" />
                            <span>Mais ferramentas serão adicionadas em breve</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
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
                      <div className="fixed inset-0 z-10" onClick={() => setShowModelSelector(false)} />
                      <div className="absolute bottom-full left-0 mb-2 w-80 bg-white rounded-xl border border-gray-200 shadow-xl z-20 max-h-80 overflow-hidden">
                        {/* Search Header */}
                        <div className="p-3 border-b border-gray-100">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Pesquisar modelo..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              autoFocus
                            />
                          </div>
                        </div>

                        {/* Models List */}
                        <div className="overflow-y-auto max-h-64">
                          {filteredModels.length > 0 ? (
                            <div className="p-2">
                              {filteredModels.map((model) => (
                                <button
                                  key={model.id}
                                  onClick={() => {
                                    handleModelSelect(model);
                                    setShowModelSelector(false);
                                  }}
                                  className={`w-full p-3 rounded-lg text-left transition-all mb-1 ${
                                    selectedModel.id === model.id
                                      ? 'bg-orange-50 text-orange-700 border border-orange-200'
                                      : 'hover:bg-orange-50 hover:text-orange-600'
                                  }`}
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <div className="font-medium text-gray-900 text-sm">{model.name}</div>
                                        <div className="text-xs text-gray-500 flex items-center space-x-2">
                                          <span>{model.provider}</span>
                                          <span>•</span>
                                          <span title="Janela de contexto">📄 {(model.contextWindow / 1000).toFixed(0)}K</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <div className={`text-xs px-2 py-0.5 rounded-full ${getPriceBadgeColor(model.priceCategory)}`}>
                                          {model.pricing.input === 0 ? 'Gratuito' : 
                                           model.priceCategory === 'low' ? '💰' :
                                           model.priceCategory === 'medium' ? '💰💰' : '💰💰💰'}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1 truncate" title={model.description}>
                                      {model.description}
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 text-center text-gray-500 text-sm">
                              Nenhum modelo encontrado para "{searchQuery}"
                            </div>
                          )}
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

      {/* Smart Scroll Button - ChatGPT Style */}
      {showScrollButton && (
        <div className="absolute bottom-44 left-1/2 transform -translate-x-1/2 z-40">
          <button
            onClick={scrollToBottomButton}
            className="bg-white/20 backdrop-blur-xl border border-white/20 hover:bg-white/30 hover:border-white/30 text-gray-600 hover:text-gray-700 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
