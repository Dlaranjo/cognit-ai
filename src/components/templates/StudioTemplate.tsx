import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Paperclip, X, MessageSquare, Settings, Zap, ChevronDown, Plus, History, Search } from 'lucide-react';
import { MessageBubble } from '../molecules/MessageBubble';
import { ConversationList } from '../organisms/ConversationList';
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
  const streamingMessage = useAppSelector(selectStreamingMessage);

  // Local UI state
  const [selectedModel, setSelectedModel] = useState<LLMModel>(availableModels[0]);
  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  
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
    if ((!message.trim() && selectedFiles.length === 0) || isLoading || isStreaming) return;

    const messageContent = message.trim();
    const files = [...selectedFiles];

    setMessage('');
    setSelectedFiles([]);

    if (files.length > 0) {
      await sendQuickMessage(
        messageContent || `[${files.length} arquivo${files.length > 1 ? 's' : ''} enviado${files.length > 1 ? 's' : ''}]`
      );
    } else {
      await sendQuickMessage(messageContent);
    }

    try {
      await startStreaming(
        messageContent || `Analyze these ${files.length} file${files.length > 1 ? 's' : ''}`,
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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleCopyMessage = () => {};
  const handleLikeMessage = () => {};
  const handleDislikeMessage = () => {};

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Top Header - Grok Style */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          {/* New Chat Button */}
          <button
            onClick={createNewConversation}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            title="Nova conversa"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Nova</span>
          </button>

          {/* History Button */}
          <button
            onClick={() => setShowHistoryModal(true)}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            title="Histórico"
          >
            <History className="w-4 h-4" />
            <span className="text-sm font-medium">Histórico</span>
          </button>
        </div>

        {/* Settings */}
        <button className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {currentConversation && messages.length > 0 ? (
            <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
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
                  <div className={`w-10 h-10 bg-gradient-to-br ${selectedModel.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-2xl px-6 py-4 shadow-sm">
                      {streamingMessage ? (
                        <div className="prose max-w-none">
                          <div className="text-gray-900 whitespace-pre-wrap">
                            {streamingMessage}
                            <span className="inline-block w-2 h-5 bg-orange-500 ml-1 animate-pulse"></span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
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
            /* Welcome Screen - Grok Style */
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-2xl px-4">
                {/* Simple but Striking Logo */}
                <div className="relative mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <span className="text-white text-2xl font-bold">AI</span>
                  </div>
                </div>

                {/* Clean Title */}
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Cognit <span className="text-orange-600">Studio</span>
                </h1>
                
                {/* Simple Subtitle */}
                <p className="text-lg text-gray-600 mb-8">
                  O que você quer saber?
                </p>
                
                {/* Subtle Call to Action */}
                <div className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full inline-block">
                  Comece digitando sua pergunta abaixo
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area - Grok Style */}
        <div className="border-t border-gray-100 px-6 py-6 bg-white">
          <div className="max-w-4xl mx-auto">
            {/* File Attachments */}
            {selectedFiles.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-2 rounded-full text-sm"
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

            {/* Main Input Container */}
            <div className="relative bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-orange-300 focus-within:bg-white transition-all">
              {/* Input Area */}
              <div className="flex items-end p-4">
                <div className="flex-1 relative">
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="O que você quer saber?"
                    className="w-full bg-transparent resize-none border-none outline-none text-gray-900 placeholder-gray-500 text-lg min-h-[24px] max-h-[200px]"
                    rows={1}
                  />
                </div>

                {/* Controls */}
                <div className="flex items-center space-x-2 ml-4">
                  {/* File Upload */}
                  <button
                    onClick={handleFileSelect}
                    disabled={isLoading || isStreaming}
                    className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-100 rounded-lg transition-colors disabled:opacity-50"
                    title="Anexar arquivo"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>

                  {/* Send Button */}
                  <button
                    onClick={sendMessage}
                    disabled={
                      (!message.trim() && selectedFiles.length === 0) ||
                      isLoading ||
                      isStreaming
                    }
                    className="bg-orange-600 text-white p-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                    className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
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
                                setSelectedModel(model);
                                setShowModelSelector(false);
                              }}
                              className={`w-full p-3 rounded-lg text-left transition-all ${
                                selectedModel.id === model.id
                                  ? 'bg-orange-50 text-orange-700'
                                  : 'hover:bg-orange-50 hover:text-orange-600'
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
                  Enter para enviar
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

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <History className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">Histórico de Conversas</h2>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-hidden">
              <ConversationList
                conversations={conversations.map(conv => ({
                  id: conv.id,
                  title: conv.title,
                  lastMessage: conv.messages[conv.messages.length - 1]?.content,
                  timestamp: new Date(conv.updatedAt),
                  model: selectedModel.name,
                  messageCount: conv.messages.length,
                }))}
                selectedConversationId={currentConversation?.id}
                onConversationSelect={(conversationId) => {
                  const conversation = conversations.find(c => c.id === conversationId);
                  if (conversation) {
                    setConversation(conversation);
                    setShowHistoryModal(false);
                  }
                }}
                onConversationDelete={handleDeleteConversation}
                showSearch={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};