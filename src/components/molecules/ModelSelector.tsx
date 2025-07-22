import React, { useState } from 'react';
import { Dropdown, Button, Badge, Card, Icon } from '../atoms';

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
  onModelSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'OpenAI':
        return '🤖';
      case 'Anthropic':
        return '🧠';
      case 'Google':
        return '🔍';
      case 'Meta':
        return '🦙';
      default:
        return '⚡';
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(4)}/1K tokens`;
  };

  return (
    <Dropdown
      isOpen={isOpen}
      onToggle={setIsOpen}
      position="bottom-right"
      trigger={
        <Button variant="outline" className="flex items-center space-x-3">
          <div className="text-left">
            <div className="font-medium text-gray-900">{selectedModel.name}</div>
            <div className="text-xs text-gray-500">{selectedModel.provider}</div>
          </div>
          <Icon name="chevron-down" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      }
    >
      <div className="w-96 max-h-96 overflow-y-auto">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-1">
            Selecionar Modelo
          </h3>
          <p className="text-sm text-gray-600">
            Escolha o modelo de IA para sua conversa
          </p>
        </div>

        <div className="p-2">
          {models.map((model) => (
            <Card
              key={model.id}
              onClick={() => {
                onModelSelect(model);
                setIsOpen(false);
              }}
              variant={selectedModel.id === model.id ? 'outlined' : 'default'}
              className={`mb-2 ${
                selectedModel.id === model.id
                  ? 'bg-orange-50 border-orange-200'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <Badge
                  className={`w-10 h-10 bg-gradient-to-br ${model.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-white text-lg">
                    {getProviderIcon(model.provider)}
                  </span>
                </Badge>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">
                      {model.name}
                    </h4>
                    {selectedModel.id === model.id && (
                      <Icon name="check" className="text-orange-600" />
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    {model.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Icon name="cpu" size="sm" />
                      <span>
                        {model.contextWindow.toLocaleString()} tokens
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Icon name="dollar-sign" size="sm" />
                      <span>{formatPrice(model.pricing.input)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {model.capabilities.slice(0, 3).map((capability) => (
                      <Badge 
                        key={capability}
                        variant="neutral" 
                        size="sm"
                      >
                        {capability}
                      </Badge>
                    ))}
                    {model.capabilities.length > 3 && (
                      <span className="px-2 py-1 text-gray-500 text-xs">
                        +{model.capabilities.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <Icon name="zap" className="text-yellow-500" />
            <span>Os preços são estimados e podem variar</span>
          </div>
        </div>
      </div>
    </Dropdown>
  );
};
