import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, MessageSquare, Sparkles, Bot, User, Copy, ThumbsUp, ThumbsDown, RotateCcw, Trash2, Settings } from 'lucide-react';
import { ConversationSidebar } from './ConversationSidebar';
import { ModelSelector } from './ModelSelector';
import { MessageBubble } from './MessageBubble';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  model?: string;
  tokens?: number;
  regenerating?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  model: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface LLMModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  contextWindow: number;
  pricing: {
    input: number;
    output: number;
  };
  capabilities: string[];
  color: string;
}

const availableModels: LLMModel[] = [
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    description: 'Most capable GPT-4 model with 128k context window',
    contextWindow: 128000,
    pricing: { input: 0.01, output: 0.03 },
    capabilities: ['Text', 'Code', 'Analysis', 'Creative Writing'],
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: 'Most powerful Claude model for complex tasks',
    contextWindow: 200000,
    pricing: { input: 0.015, output: 0.075 },
    capabilities: ['Text', 'Code', 'Analysis', 'Math', 'Creative Writing'],
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    description: 'Balanced performance and speed',
    contextWindow: 200000,
    pricing: { input: 0.003, output: 0.015 },
    capabilities: ['Text', 'Code', 'Analysis'],
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    description: 'Google\'s most capable multimodal model',
    contextWindow: 32000,
    pricing: { input: 0.0005, output: 0.0015 },
    capabilities: ['Text', 'Code', 'Multimodal'],
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'llama-2-70b',
    name: 'Llama 2 70B',
    provider: 'Meta',
    description: 'Open source large language model',
    contextWindow: 4096,
    pricing: { input: 0.0007, output: 0.0009 },
    capabilities: ['Text', 'Code'],
    color: 'from-teal-500 to-cyan-600'
  }
];

const mockConversations: Conversation[] = [
  {
    id: '1',
    title: 'React Performance Optimization',
    model: 'gpt-4-turbo',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
    messages: [
      {
        id: '1',
        type: 'user',
        content: 'Como posso otimizar a performance de uma aplicação React?',
        timestamp: '2024-01-20T10:00:00Z'
      },
      {
        id: '2',
        type: 'assistant',
        content: 'Existem várias estratégias para otimizar a performance de uma aplicação React:\n\n1. **Memoização com React.memo()**: Evita re-renderizações desnecessárias de componentes\n2. **useMemo e useCallback**: Para memoizar valores computados e funções\n3. **Code Splitting**: Dividir o código em chunks menores usando React.lazy()\n4. **Virtualização**: Para listas grandes, use bibliotecas como react-window\n5. **Otimização de imagens**: Lazy loading e formatos modernos como WebP\n\nQual dessas áreas você gostaria que eu detalhe mais?',
        timestamp: '2024-01-20T10:01:00Z',
        model: 'gpt-4-turbo',
        tokens: 156
      }
    ]
  },
  {
    id: '2',
    title: 'Machine Learning Concepts',
    model: 'claude-3-opus',
    createdAt: '2024-01-19T14:00:00Z',
    updatedAt: '2024-01-19T14:45:00Z',
    messages: [
      {
        id: '3',
        type: 'user',
        content: 'Explique os conceitos básicos de machine learning',
        timestamp: '2024-01-19T14:00:00Z'
      },
      {
        id: '4',
        type: 'assistant',
        content: 'Machine Learning é um subcampo da inteligência artificial que permite aos computadores aprender e tomar decisões sem serem explicitamente programados para cada tarefa específica.\n\n**Tipos principais:**\n\n🔹 **Aprendizado Supervisionado**: Treina com dados rotulados (ex: classificação de emails como spam/não-spam)\n\n🔹 **Aprendizado Não-Supervisionado**: Encontra padrões em dados sem rótulos (ex: segmentação de clientes)\n\n🔹 **Aprendizado por Reforço**: Aprende através de tentativa e erro com recompensas (ex: jogos, robótica)\n\n**Processo típico:**\n1. Coleta de dados\n2. Preparação e limpeza\n3. Escolha do algoritmo\n4. Treinamento do modelo\n5. Avaliação e ajustes\n6. Implementação\n\nQue área específica te interessa mais?',
        timestamp: '2024-01-19T14:02:00Z',
        model: 'claude-3-opus',
        tokens: 203
      }
    ]
  }
];

export const StudioInterface: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(conversations[0]);
  const [selectedModel, setSelectedModel] = useState<LLMModel>(availableModels[0]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'Nova Conversa',
      model: selectedModel.id,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
  };

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString()
    };

    let conversation = currentConversation;
    
    // Se não há conversa atual, criar uma nova
    if (!conversation) {
      conversation = {
        id: Date.now().toString(),
        title: message.trim().slice(0, 50) + (message.length > 50 ? '...' : ''),
        model: selectedModel.id,
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setConversations(prev => [conversation!, ...prev]);
      setCurrentConversation(conversation);
    }

    // Adicionar mensagem do usuário
    const updatedConversation = {
      ...conversation,
      messages: [...conversation.messages, userMessage],
      updatedAt: new Date().toISOString(),
      title: conversation.messages.length === 0 ? message.trim().slice(0, 50) + (message.length > 50 ? '...' : '') : conversation.title
    };

    setCurrentConversation(updatedConversation);
    setConversations(prev => prev.map(c => c.id === conversation!.id ? updatedConversation : c));
    setMessage('');
    setIsLoading(true);

    // Simular resposta da IA
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateMockResponse(message, selectedModel),
        timestamp: new Date().toISOString(),
        model: selectedModel.id,
        tokens: Math.floor(Math.random() * 200) + 50
      };

      const finalConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, assistantMessage],
        updatedAt: new Date().toISOString()
      };

      setCurrentConversation(finalConversation);
      setConversations(prev => prev.map(c => c.id === conversation!.id ? finalConversation : c));
      setIsLoading(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateMockResponse = (userMessage: string, model: LLMModel): string => {
    const responses = [
      `Como ${model.name}, posso ajudar você com essa questão. Baseado na sua pergunta sobre "${userMessage.slice(0, 30)}...", aqui está uma resposta detalhada:\n\nEsta é uma simulação de resposta do modelo ${model.name} da ${model.provider}. Em uma implementação real, esta resposta viria da API do modelo selecionado.\n\n**Pontos importantes:**\n• Resposta contextualizada\n• Baseada no modelo selecionado\n• Formatação adequada\n\nPosso elaborar mais sobre algum ponto específico?`,
      
      `Excelente pergunta! Usando o ${model.name}, vou fornecer uma análise abrangente:\n\n🔍 **Análise do contexto:**\nSua questão toca em pontos importantes que posso abordar com base no meu treinamento.\n\n💡 **Resposta estruturada:**\n1. Primeiro aspecto relevante\n2. Considerações adicionais\n3. Recomendações práticas\n\n📊 **Conclusão:**\nEsta resposta foi gerada pelo ${model.name} e representa uma simulação de como o modelo real responderia.`,
      
      `Entendo sua questão. Como ${model.name} da ${model.provider}, posso oferecer insights valiosos:\n\n**Contexto:** ${userMessage.slice(0, 50)}...\n\n**Resposta detalhada:**\nEm uma implementação real, eu acessaria meu conhecimento extensivo para fornecer uma resposta precisa e útil. Esta é uma demonstração de como a interface funcionaria com o modelo real.\n\n**Próximos passos:**\n- Posso elaborar qualquer ponto\n- Fornecer exemplos específicos\n- Sugerir recursos adicionais\n\nO que gostaria de explorar mais?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));
    if (currentConversation?.id === conversationId) {
      const remaining = conversations.filter(c => c.id !== conversationId);
      setCurrentConversation(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const regenerateResponse = async (messageId: string) => {
    if (!currentConversation || isLoading) return;

    const messageIndex = currentConversation.messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1 || messageIndex === 0) return;

    const userMessage = currentConversation.messages[messageIndex - 1];
    if (userMessage.type !== 'user') return;

    // Marcar como regenerando
    const updatedMessages = [...currentConversation.messages];
    updatedMessages[messageIndex] = { ...updatedMessages[messageIndex], regenerating: true };
    
    const updatedConversation = {
      ...currentConversation,
      messages: updatedMessages
    };
    
    setCurrentConversation(updatedConversation);
    setIsLoading(true);

    // Simular nova resposta
    setTimeout(() => {
      const newResponse: Message = {
        ...updatedMessages[messageIndex],
        content: generateMockResponse(userMessage.content, selectedModel),
        timestamp: new Date().toISOString(),
        regenerating: false
      };

      const finalMessages = [...updatedMessages];
      finalMessages[messageIndex] = newResponse;

      const finalConversation = {
        ...updatedConversation,
        messages: finalMessages,
        updatedAt: new Date().toISOString()
      };

      setCurrentConversation(finalConversation);
      setConversations(prev => prev.map(c => c.id === currentConversation.id ? finalConversation : c));
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
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
        onConversationSelect={setCurrentConversation}
        onNewConversation={createNewConversation}
        onDeleteConversation={deleteConversation}
      />

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <svg width="24" height="14" viewBox="0 0 474 175" xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(-131 -563)">
                      <g>
                        <g>
                          <text fill="white" fontFamily="Sundry,Sundry_MSFontService,sans-serif" fontWeight="400" fontSize="96" transform="matrix(0.999702 0 0 0.994943 140.089 687)">Cognit</text>
                          <path d="M503.45 629.884 503.832 629.884 511.558 655.829 495.724 655.829ZM545.737 617.102 545.737 683.872 561 683.872 561 617.102ZM494.007 617.102 471.21 683.872 487.426 683.872 491.718 669.565 515.565 669.565 519.857 683.872 536.072 683.872 513.275 617.102ZM452.699 579.057 586.021 579.057 586.021 712.379 452.699 712.379Z" fill="white" fillRule="evenodd" transform="matrix(1.00478 0 0 1 -0.124693 3.84206)"/>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Cognit Studio</h1>
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
          {currentConversation && currentConversation.messages.length > 0 ? (
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
              {currentConversation.messages.map((message, index) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  model={availableModels.find(m => m.id === message.model)}
                  onRegenerate={() => regenerateResponse(message.id)}
                  showRegenerate={message.type === 'assistant' && index === currentConversation.messages.length - 1 && !isLoading}
                />
              ))}
              
              {isLoading && (
                <div className="flex items-start space-x-4">
                  <div className={`w-8 h-8 bg-gradient-to-br ${selectedModel.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                        </div>
                        <span className="text-sm text-gray-600">{selectedModel.name} está pensando...</span>
                      </div>
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
                  <svg width="40" height="24" viewBox="0 0 474 175" xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(-131 -563)">
                      <g>
                        <g>
                          <text fill="white" fontFamily="Sundry,Sundry_MSFontService,sans-serif" fontWeight="400" fontSize="96" transform="matrix(0.999702 0 0 0.994943 140.089 687)">Cognit</text>
                          <path d="M503.45 629.884 503.832 629.884 511.558 655.829 495.724 655.829ZM545.737 617.102 545.737 683.872 561 683.872 561 617.102ZM494.007 617.102 471.21 683.872 487.426 683.872 491.718 669.565 515.565 669.565 519.857 683.872 536.072 683.872 513.275 617.102ZM452.699 579.057 586.021 579.057 586.021 712.379 452.699 712.379Z" fill="white" fillRule="evenodd" transform="matrix(1.00478 0 0 1 -0.124693 3.84206)"/>
                        </g>
                      </g>
                    </g>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Bem-vindo ao Cognit Studio</h2>
                <p className="text-gray-600 mb-6">
                  Converse com os melhores modelos de IA em um só lugar. Escolha seu modelo preferido e comece uma nova conversa.
                </p>
                <div className="bg-orange-50 rounded-xl p-4">
                  <div className="flex items-center space-x-2 text-orange-700 mb-2">
                    <Bot className="w-5 h-5" />
                    <span className="font-medium">Modelo Atual: {selectedModel.name}</span>
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
            <div className="flex items-end space-x-4">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Converse com ${selectedModel.name}...`}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none min-h-[48px] max-h-[200px]"
                  rows={1}
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {message.length > 0 && `${message.length} chars`}
                </div>
              </div>
              <button
                onClick={sendMessage}
                disabled={!message.trim() || isLoading}
                className="bg-orange-600 text-white p-3 rounded-xl hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span>Modelo: {selectedModel.name}</span>
                <span>•</span>
                <span>Contexto: {selectedModel.contextWindow.toLocaleString()} tokens</span>
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