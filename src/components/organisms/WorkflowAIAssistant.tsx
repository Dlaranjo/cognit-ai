import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Lightbulb, 
  Code, 
  Zap,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Paperclip,
  X
} from 'lucide-react';
import { Button, Textarea } from '../atoms';
import { MessageBubble } from '../molecules';

interface AIMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  codeExample?: string;
  workflowPreview?: {
    nodes: string[];
    description: string;
  };
}

interface WorkflowAIAssistantProps {
  isExpanded: boolean;
  onToggle: () => void;
  onCreateWorkflow?: (description: string) => void;
}

export const WorkflowAIAssistant: React.FC<WorkflowAIAssistantProps> = ({
  isExpanded,
  onToggle,
  onCreateWorkflow
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Olá! Sou seu assistente de workflows de IA. Posso te ajudar a:

• **Criar workflows** através de comandos naturais
• **Explicar conceitos** do n8n e automação
• **Otimizar** workflows existentes
• **Resolver problemas** de configuração

Como posso te ajudar hoje?`,
      timestamp: new Date(),
      suggestions: [
        'Crie um workflow que monitore emails e crie tarefas',
        'Como conectar uma API externa?',
        'Explique como funcionam os triggers',
        'Otimize meu workflow atual'
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(message);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string): AIMessage => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('workflow') && (lowerMessage.includes('email') || lowerMessage.includes('tarefa'))) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: `Perfeito! Vou criar um workflow que monitora emails e cria tarefas automaticamente.

**Workflow sugerido:**

1. **Trigger**: Webhook ou Email Trigger
2. **Condição**: Verificar se o email contém palavras-chave
3. **Ação**: Criar tarefa no sistema de projetos
4. **Notificação**: Enviar confirmação por email

Quer que eu crie este workflow para você?`,
        timestamp: new Date(),
        workflowPreview: {
          nodes: ['Email Trigger', 'IF Condition', 'Create Task', 'Send Notification'],
          description: 'Monitora emails e cria tarefas baseado em critérios específicos'
        },
        suggestions: [
          'Sim, criar este workflow',
          'Modificar as condições',
          'Adicionar mais ações',
          'Explicar cada etapa'
        ]
      };
    }

    if (lowerMessage.includes('api') || lowerMessage.includes('conectar')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: `Para conectar APIs externas no n8n, você pode usar:

**HTTP Request Node:**
- Método: GET, POST, PUT, DELETE
- Headers: Autenticação, Content-Type
- Body: Dados a enviar

**Exemplo de configuração:**`,
        timestamp: new Date(),
        codeExample: `{
  "method": "POST",
  "url": "https://api.exemplo.com/data",
  "headers": {
    "Authorization": "Bearer {{$node.Webhook.json.token}}",
    "Content-Type": "application/json"
  },
  "body": {
    "title": "{{$node.Webhook.json.title}}",
    "description": "{{$node.Webhook.json.description}}"
  }
}`,
        suggestions: [
          'Como autenticar com API key?',
          'Tratar erros de API',
          'Exemplo com webhook',
          'Testar conexão'
        ]
      };
    }

    if (lowerMessage.includes('trigger')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: `**Triggers** são o ponto de partida dos workflows. Eles "escutam" eventos e iniciam a execução:

**Tipos principais:**

• **Webhook Trigger**: Recebe dados via HTTP
• **Cron Trigger**: Executa em horários programados  
• **Manual Trigger**: Execução manual
• **File Trigger**: Monitora arquivos
• **Email Trigger**: Monitora emails

**Dica**: Sempre teste seus triggers antes de ativar o workflow!`,
        timestamp: new Date(),
        suggestions: [
          'Como configurar webhook?',
          'Agendar execução diária',
          'Monitorar pasta de arquivos',
          'Trigger de email'
        ]
      };
    }

    // Default response
    return {
      id: Date.now().toString(),
      type: 'assistant',
      content: `Entendi sua pergunta! Vou te ajudar com isso.

Para workflows de automação, é importante pensar em:

1. **Trigger**: O que inicia o processo?
2. **Condições**: Quando executar as ações?
3. **Ações**: O que fazer com os dados?
4. **Tratamento de erros**: Como lidar com falhas?

Pode me dar mais detalhes sobre o que você quer automatizar?`,
      timestamp: new Date(),
      suggestions: [
        'Automatizar emails',
        'Integrar sistemas',
        'Processar dados',
        'Criar notificações'
      ]
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    textareaRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`bg-white border-l border-gray-200 flex flex-col transition-all duration-300 ${
      isExpanded ? 'w-96' : 'w-12'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {isExpanded ? (
          <>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                <p className="text-xs text-gray-500">Workflow Helper</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <Button variant="ghost" size="sm" onClick={onToggle} className="w-full">
            <ChevronUp className="w-4 h-4" />
          </Button>
        )}
      </div>

      {isExpanded && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id}>
                <MessageBubble
                  content={msg.content}
                  role={msg.type}
                  timestamp={msg.timestamp}
                  model="Workflow AI"
                  onCopy={() => navigator.clipboard.writeText(msg.content)}
                />

                {/* Code Example */}
                {msg.codeExample && (
                  <div className="mt-3 ml-12">
                    <div className="bg-gray-900 rounded-lg p-4 relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">JSON</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigator.clipboard.writeText(msg.codeExample!)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <pre className="text-sm text-gray-100 overflow-x-auto">
                        <code>{msg.codeExample}</code>
                      </pre>
                    </div>
                  </div>
                )}

                {/* Workflow Preview */}
                {msg.workflowPreview && (
                  <div className="mt-3 ml-12">
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <Zap className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-900">
                          Preview do Workflow
                        </span>
                      </div>
                      <p className="text-sm text-orange-800 mb-3">
                        {msg.workflowPreview.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        {msg.workflowPreview.nodes.map((node, index) => (
                          <React.Fragment key={node}>
                            <div className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-md">
                              {node}
                            </div>
                            {index < msg.workflowPreview!.nodes.length - 1 && (
                              <div className="w-4 h-px bg-orange-300" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 text-orange-700 border-orange-300 hover:bg-orange-100"
                        onClick={() => onCreateWorkflow?.(msg.workflowPreview!.description)}
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        Criar Workflow
                      </Button>
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {msg.suggestions && (
                  <div className="mt-3 ml-12 space-y-2">
                    {msg.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="block w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-2xl px-4 py-3 max-w-xs">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <Textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Descreva o workflow que você quer criar..."
                  rows={2}
                  className="resize-none"
                />
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={handleSendMessage}
                disabled={!message.trim() || isTyping}
                className="flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2 mt-3">
              <Button variant="ghost" size="sm" className="text-xs">
                <Lightbulb className="w-3 h-3 mr-1" />
                Exemplos
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                <Code className="w-3 h-3 mr-1" />
                Documentação
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                <MessageSquare className="w-3 h-3 mr-1" />
                Suporte
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};