import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  Zap,
  X
} from 'lucide-react';
import { Button, Textarea } from '../atoms';

interface AIMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
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
      content: `Hi! I'm your workflow AI assistant. I can help you create automation workflows using natural language.

Try saying something like:
"Create a workflow that monitors emails and creates tasks for urgent ones"`,
      timestamp: new Date(),
      suggestions: [
        'Monitor emails and create tasks',
        'Send notifications when files are uploaded',
        'Sync data between two systems',
        'Process form submissions'
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

    if (lowerMessage.includes('email') && (lowerMessage.includes('task') || lowerMessage.includes('urgent'))) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: `Perfect! I'll create a workflow that monitors emails and creates tasks for urgent ones.

Here's what the workflow will do:
1. **Email Trigger** - Monitor incoming emails
2. **Check Priority** - Look for "urgent" in subject
3. **Create Task** - Add task to your project

Would you like me to create this workflow?`,
        timestamp: new Date(),
        workflowPreview: {
          nodes: ['Email Trigger', 'Check Priority', 'Create Task'],
          description: 'Monitors emails and creates tasks for urgent messages'
        },
        suggestions: [
          'Yes, create this workflow',
          'Modify the conditions',
          'Add email notifications',
          'Show me other examples'
        ]
      };
    }

    if (lowerMessage.includes('file') || lowerMessage.includes('upload')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: `Great idea! I can help you create a workflow that responds to file uploads.

This workflow could:
- Monitor a specific folder or cloud storage
- Send notifications to team members
- Process or analyze the uploaded files
- Move files to appropriate folders

What specific action would you like to take when files are uploaded?`,
        timestamp: new Date(),
        suggestions: [
          'Send email notifications',
          'Process images automatically',
          'Backup to cloud storage',
          'Create approval workflow'
        ]
      };
    }

    // Default response
    return {
      id: Date.now().toString(),
      type: 'assistant',
      content: `I understand you want to create an automation workflow. 

To help you better, could you describe:
- What should trigger the workflow?
- What actions should it perform?
- Any specific conditions or rules?

For example: "When a form is submitted, send an email and save to database"`,
      timestamp: new Date(),
      suggestions: [
        'Monitor emails for keywords',
        'Process form submissions',
        'Sync data between apps',
        'Schedule regular reports'
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
      isExpanded ? 'w-96' : 'w-16'
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
                <p className="text-xs text-gray-500">Create workflows with natural language</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <div className="w-full flex justify-center">
            <Button variant="ghost" size="sm" onClick={onToggle} className="w-full flex justify-center">
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {isExpanded && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.type === 'user' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {/* Workflow Preview */}
            {messages[messages.length - 1]?.workflowPreview && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Zap className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-900">
                    Workflow Preview
                  </span>
                </div>
                <p className="text-sm text-orange-800 mb-3">
                  {messages[messages.length - 1].workflowPreview!.description}
                </p>
                <div className="flex items-center space-x-2 mb-3">
                  {messages[messages.length - 1].workflowPreview!.nodes.map((node, index) => (
                    <React.Fragment key={node}>
                      <div className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-md">
                        {node}
                      </div>
                      {index < messages[messages.length - 1].workflowPreview!.nodes.length - 1 && (
                        <ChevronRight className="w-3 h-3 text-orange-600" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-orange-700 border-orange-300 hover:bg-orange-100"
                  onClick={() => onCreateWorkflow?.(messages[messages.length - 1].workflowPreview!.description)}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Create This Workflow
                </Button>
              </div>
            )}

            {/* Suggestions */}
            {messages[messages.length - 1]?.suggestions && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-medium">Suggestions:</p>
                {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
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

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
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
                  placeholder="Describe the workflow you want to create..."
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

            {/* Quick Examples */}
            <div className="flex items-center space-x-2 mt-3">
              <Lightbulb className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">Try: "Monitor emails and create tasks"</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};