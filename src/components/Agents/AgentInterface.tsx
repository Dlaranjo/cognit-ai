import React, { useState } from 'react';
import { Bot, Sparkles, FileText, Presentation, Code, BarChart3, PenTool, Send, Loader2 } from 'lucide-react';
import { AgentSelector } from './AgentSelector';
import { ConversationHistory } from './ConversationHistory';

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  color: string;
  capabilities: string[];
  examples: string[];
}

interface Message {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string;
  agentId?: string;
  attachments?: File[];
  actions?: ActionResult[];
}

interface ActionResult {
  id: string;
  type: 'file' | 'analysis' | 'summary';
  title: string;
  description: string;
  downloadUrl?: string;
  previewUrl?: string;
  status: 'completed' | 'processing' | 'failed';
}

const availableAgents: Agent[] = [
  {
    id: 'presentation-expert',
    name: 'Presentation Expert',
    description: 'Creates professional PowerPoint presentations from your documents and data',
    icon: Presentation,
    color: 'from-orange-500 to-red-500',
    capabilities: ['PowerPoint Creation', 'Slide Design', 'Data Visualization', 'Content Structuring'],
    examples: [
      'Create a presentation about our Q4 results',
      'Build slides summarizing the AI research findings',
      'Make a pitch deck for the new product launch'
    ]
  },
  {
    id: 'document-analyst',
    name: 'Document Analyst',
    description: 'Analyzes documents, extracts insights, and provides comprehensive summaries',
    icon: FileText,
    color: 'from-blue-500 to-indigo-500',
    capabilities: ['Document Analysis', 'Content Extraction', 'Insight Generation', 'Summarization'],
    examples: [
      'Analyze the contract terms and highlight key points',
      'Summarize all research papers in the ML workspace',
      'Extract action items from meeting notes'
    ]
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    description: 'Processes data, creates visualizations, and generates analytical reports',
    icon: BarChart3,
    color: 'from-green-500 to-emerald-500',
    capabilities: ['Data Analysis', 'Statistical Modeling', 'Visualization', 'Report Generation'],
    examples: [
      'Create charts from the sales data spreadsheet',
      'Analyze user behavior patterns',
      'Generate a data quality report'
    ]
  },
  {
    id: 'code-assistant',
    name: 'Code Assistant',
    description: 'Reviews code, generates documentation, and creates technical specifications',
    icon: Code,
    color: 'from-purple-500 to-pink-500',
    capabilities: ['Code Review', 'Documentation', 'API Specs', 'Technical Writing'],
    examples: [
      'Generate API documentation from the codebase',
      'Review the authentication module',
      'Create technical specifications for the new feature'
    ]
  },
  {
    id: 'content-writer',
    name: 'Content Writer',
    description: 'Creates engaging content, reports, and marketing materials',
    icon: PenTool,
    color: 'from-teal-500 to-cyan-500',
    capabilities: ['Content Creation', 'Copywriting', 'Report Writing', 'Marketing Materials'],
    examples: [
      'Write a blog post about our latest features',
      'Create marketing copy for the product launch',
      'Draft a comprehensive project report'
    ]
  }
];

const mockConversation: Message[] = [
  {
    id: '1',
    type: 'user',
    content: 'Create a presentation about our AI research findings from the Machine Learning workspace',
    timestamp: '2024-01-20T10:30:00Z'
  },
  {
    id: '2',
    type: 'agent',
    content: 'I\'ll create a comprehensive presentation based on your AI research documents. I found 12 relevant documents in the Machine Learning workspace and will structure them into a professional presentation.',
    timestamp: '2024-01-20T10:31:00Z',
    agentId: 'presentation-expert',
    actions: [
      {
        id: 'ppt-1',
        type: 'file',
        title: 'AI Research Findings - Presentation.pptx',
        description: '15-slide presentation covering neural networks, training methodologies, and performance metrics',
        downloadUrl: '#',
        status: 'completed'
      }
    ]
  },
  {
    id: '3',
    type: 'user',
    content: 'Can you also create a summary document of the key findings?',
    timestamp: '2024-01-20T10:35:00Z'
  },
  {
    id: '4',
    type: 'agent',
    content: 'I\'ve created a comprehensive summary document highlighting the key findings from your AI research. The document includes executive summary, methodology overview, and actionable insights.',
    timestamp: '2024-01-20T10:36:00Z',
    agentId: 'document-analyst',
    actions: [
      {
        id: 'doc-1',
        type: 'file',
        title: 'AI Research Key Findings - Summary.docx',
        description: '8-page executive summary with key insights and recommendations',
        downloadUrl: '#',
        status: 'completed'
      }
    ]
  }
];

export const AgentInterface: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Message[]>(mockConversation);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedAgent) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setIsProcessing(true);

    // Simulate agent processing
    setTimeout(() => {
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: `I'll help you with that request. Let me process the relevant documents and create what you need.`,
        timestamp: new Date().toISOString(),
        agentId: selectedAgent.id,
        actions: [
          {
            id: `action-${Date.now()}`,
            type: 'file',
            title: 'Generated Content',
            description: 'Processing your request...',
            status: 'processing'
          }
        ]
      };

      setConversation(prev => [...prev, agentResponse]);
      setIsProcessing(false);
    }, 2000);
  };

  const handleExampleClick = (example: string) => {
    setMessage(example);
  };

  return (
    <div className="h-full flex">
      {/* Agent Selector Sidebar */}
      <div className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">AI Agents</h2>
              <p className="text-sm text-gray-600">Choose your assistant</p>
            </div>
          </div>
        </div>

        <AgentSelector
          agents={availableAgents}
          selectedAgent={selectedAgent}
          onAgentSelect={setSelectedAgent}
          onExampleClick={handleExampleClick}
        />
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col">
        {selectedAgent ? (
          <>
            {/* Agent Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${selectedAgent.color} rounded-xl flex items-center justify-center`}>
                  <selectedAgent.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedAgent.name}</h3>
                  <p className="text-sm text-gray-600">{selectedAgent.description}</p>
                </div>
                <div className="ml-auto">
                  <div className="flex items-center space-x-1 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Online</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Conversation Area */}
            <div className="flex-1 overflow-y-auto">
              <ConversationHistory
                messages={conversation}
                agents={availableAgents}
                isProcessing={isProcessing}
              />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-gray-200 bg-white">
              <div className="flex items-end space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder={`Ask ${selectedAgent.name} to help you...`}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      rows={3}
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                      Press Enter to send
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isProcessing}
                  className="bg-orange-600 text-white p-3 rounded-xl hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Quick Actions */}
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedAgent.examples.slice(0, 2).map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(example)}
                    className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Welcome Screen */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Choose an AI Agent</h3>
              <p className="text-gray-600 mb-6">
                Select an AI agent from the sidebar to start creating presentations, analyzing documents, 
                processing data, and much more.
              </p>
              <div className="bg-orange-50 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-orange-700 mb-2">
                  <Bot className="w-5 h-5" />
                  <span className="font-medium">Pro Tip</span>
                </div>
                <p className="text-sm text-orange-600">
                  Each agent specializes in different tasks. Choose the one that best matches your needs!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};