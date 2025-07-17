import React, { useState } from 'react';
import { ChevronDown, Zap, Clock, DollarSign, Cpu, Check } from 'lucide-react';

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

interface ModelSelectorProps {
  models: LLMModel[];
  selectedModel: LLMModel;
  onModelSelect: (model: LLMModel) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModel,
  onModelSelect
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'OpenAI': return '🤖';
      case 'Anthropic': return '🧠';
      case 'Google': return '🔍';
      case 'Meta': return '🦙';
      default: return '⚡';
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(4)}/1K tokens`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:border-gray-400 transition-colors"
      >
        <div className={`w-8 h-8 bg-gradient-to-br ${selectedModel.color} rounded-lg flex items-center justify-center`}>
          <span className="text-white text-sm font-bold">
            {getProviderIcon(selectedModel.provider)}
          </span>
        </div>
        <div className="text-left">
          <div className="font-medium text-gray-900">{selectedModel.name}</div>
          <div className="text-xs text-gray-500">{selectedModel.provider}</div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-xl border border-gray-200 shadow-xl z-20 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-1">Selecionar Modelo</h3>
              <p className="text-sm text-gray-600">Escolha o modelo de IA para sua conversa</p>
            </div>
            
            <div className="p-2">
              {models.map(model => (
                <button
                  key={model.id}
                  onClick={() => {
                    onModelSelect(model);
                    setIsOpen(false);
                  }}
                  className={`w-full p-4 rounded-lg text-left transition-all ${
                    selectedModel.id === model.id
                      ? 'bg-orange-50 border border-orange-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${model.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white text-lg">
                        {getProviderIcon(model.provider)}
                      </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900">{model.name}</h4>
                        {selectedModel.id === model.id && (
                          <Check className="w-4 h-4 text-orange-600" />
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{model.description}</p>
                      
                      {/* Model Stats */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Cpu className="w-3 h-3" />
                          <span>{model.contextWindow.toLocaleString()} tokens</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <DollarSign className="w-3 h-3" />
                          <span>{formatPrice(model.pricing.input)}</span>
                        </div>
                      </div>
                      
                      {/* Capabilities */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {model.capabilities.slice(0, 3).map(capability => (
                          <span
                            key={capability}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                          >
                            {capability}
                          </span>
                        ))}
                        {model.capabilities.length > 3 && (
                          <span className="px-2 py-1 text-gray-500 text-xs">
                            +{model.capabilities.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span>Os preços são estimados e podem variar</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};