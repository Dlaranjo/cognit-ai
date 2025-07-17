import React from 'react';
import { ChevronRight, Zap } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  capabilities: string[];
  examples: string[];
}

interface AgentSelectorProps {
  agents: Agent[];
  selectedAgent: Agent | null;
  onAgentSelect: (agent: Agent) => void;
  onExampleClick: (example: string) => void;
}

export const AgentSelector: React.FC<AgentSelectorProps> = ({
  agents,
  selectedAgent,
  onAgentSelect,
  onExampleClick
}) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 space-y-3">
        {agents.map(agent => (
          <div key={agent.id} className="space-y-3">
            <button
              onClick={() => onAgentSelect(agent)}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left group ${
                selectedAgent?.id === agent.id
                  ? 'border-orange-500 bg-orange-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm bg-white'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${agent.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <agent.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 truncate">{agent.name}</h3>
                    <ChevronRight className={`w-4 h-4 transition-transform ${
                      selectedAgent?.id === agent.id ? 'rotate-90 text-orange-500' : 'text-gray-400'
                    }`} />
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{agent.description}</p>
                  
                  {/* Capabilities */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {agent.capabilities.slice(0, 2).map((capability, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md"
                      >
                        {capability}
                      </span>
                    ))}
                    {agent.capabilities.length > 2 && (
                      <span className="inline-block px-2 py-1 text-xs text-gray-500">
                        +{agent.capabilities.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>

            {/* Examples - Show when selected */}
            {selectedAgent?.id === agent.id && (
              <div className="ml-4 space-y-2">
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>Quick Examples</span>
                </div>
                {agent.examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => onExampleClick(example)}
                    className="w-full text-left p-3 text-sm bg-white border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 group-hover:text-orange-700">{example}</span>
                      <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-orange-500" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};