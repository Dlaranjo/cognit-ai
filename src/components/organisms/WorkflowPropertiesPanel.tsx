import React from 'react';
import { 
  Settings, 
  Code, 
  Database, 
  Zap, 
  Mail, 
  Calendar,
  X,
  Save,
  Play,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Button, Input, Textarea, Toggle } from '../atoms';

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'data';
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  position: { x: number; y: number };
  connected: boolean;
}

interface WorkflowPropertiesPanelProps {
  selectedNode: WorkflowNode | null;
  onClose: () => void;
  onSave: (nodeId: string, properties: Record<string, any>) => void;
}

export const WorkflowPropertiesPanel: React.FC<WorkflowPropertiesPanelProps> = ({
  selectedNode,
  onClose,
  onSave
}) => {
  const [properties, setProperties] = React.useState({
    name: selectedNode?.title || '',
    description: selectedNode?.description || '',
    enabled: true,
    retryOnFailure: true,
    maxRetries: 3,
    timeout: 30,
    // Node-specific properties
    webhookUrl: 'https://api.cognit.com/webhook/abc123',
    httpMethod: 'POST',
    emailTo: 'admin@cognit.com',
    emailSubject: 'Notificação Urgente',
    condition: 'email.subject.includes("urgente")',
    taskTitle: 'Nova tarefa criada automaticamente',
    taskProject: 'Projeto Principal'
  });

  const handleSave = () => {
    if (selectedNode) {
      onSave(selectedNode.id, properties);
    }
  };

  const renderNodeSpecificProperties = () => {
    if (!selectedNode) return null;

    switch (selectedNode.type) {
      case 'trigger':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Webhook URL
              </label>
              <Input
                value={properties.webhookUrl}
                onChange={(e) => setProperties(prev => ({ ...prev, webhookUrl: e.target.value }))}
                placeholder="https://api.cognit.com/webhook/..."
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                URL que receberá os dados do webhook
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Método HTTP
              </label>
              <select 
                value={properties.httpMethod}
                onChange={(e) => setProperties(prev => ({ ...prev, httpMethod: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="POST">POST</option>
                <option value="GET">GET</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
          </div>
        );

      case 'condition':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condição
              </label>
              <Textarea
                value={properties.condition}
                onChange={(e) => setProperties(prev => ({ ...prev, condition: e.target.value }))}
                placeholder="email.subject.includes('urgente')"
                rows={3}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Expressão JavaScript para avaliar a condição
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Variáveis disponíveis:</p>
                  <ul className="text-xs space-y-1">
                    <li><code>email.subject</code> - Assunto do email</li>
                    <li><code>email.body</code> - Corpo do email</li>
                    <li><code>email.from</code> - Remetente</li>
                    <li><code>data.*</code> - Dados do webhook</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'action':
        if (selectedNode.title.includes('Email')) {
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Para
                </label>
                <Input
                  value={properties.emailTo}
                  onChange={(e) => setProperties(prev => ({ ...prev, emailTo: e.target.value }))}
                  placeholder="admin@cognit.com"
                  type="email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assunto
                </label>
                <Input
                  value={properties.emailSubject}
                  onChange={(e) => setProperties(prev => ({ ...prev, emailSubject: e.target.value }))}
                  placeholder="Notificação do sistema"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Corpo do email
                </label>
                <Textarea
                  value="Nova mensagem urgente recebida:\n\n{{email.subject}}\n\nDe: {{email.from}}"
                  onChange={() => {}}
                  rows={4}
                  placeholder="Conteúdo do email..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Use {{variavel}} para inserir dados dinâmicos
                </p>
              </div>
            </div>
          );
        } else {
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título da tarefa
                </label>
                <Input
                  value={properties.taskTitle}
                  onChange={(e) => setProperties(prev => ({ ...prev, taskTitle: e.target.value }))}
                  placeholder="Nova tarefa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Projeto
                </label>
                <select 
                  value={properties.taskProject}
                  onChange={(e) => setProperties(prev => ({ ...prev, taskProject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="Projeto Principal">Projeto Principal</option>
                  <option value="Suporte">Suporte</option>
                  <option value="Desenvolvimento">Desenvolvimento</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <Textarea
                  value="Tarefa criada automaticamente pelo workflow.\n\nDetalhes: {{email.body}}"
                  onChange={() => {}}
                  rows={3}
                  placeholder="Descrição da tarefa..."
                />
              </div>
            </div>
          );
        }

      default:
        return null;
    }
  };

  if (!selectedNode) return null;

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 bg-gradient-to-r ${selectedNode.color} rounded-lg flex items-center justify-center`}>
            <selectedNode.icon className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{selectedNode.title}</h3>
            <p className="text-xs text-gray-500 capitalize">{selectedNode.type}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Basic Properties */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Configurações Gerais
          </h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome
            </label>
            <Input
              value={properties.name}
              onChange={(e) => setProperties(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nome do node"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <Textarea
              value={properties.description}
              onChange={(e) => setProperties(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição do que este node faz"
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Ativo
              </label>
              <p className="text-xs text-gray-500">
                Node será executado no workflow
              </p>
            </div>
            <Toggle
              checked={properties.enabled}
              onChange={(checked) => setProperties(prev => ({ ...prev, enabled: checked }))}
            />
          </div>
        </div>

        {/* Node-specific Properties */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center">
            <Code className="w-4 h-4 mr-2" />
            Configurações Específicas
          </h4>
          {renderNodeSpecificProperties()}
        </div>

        {/* Error Handling */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            Tratamento de Erros
          </h4>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Tentar novamente em caso de erro
              </label>
              <p className="text-xs text-gray-500">
                Reexecutar automaticamente se falhar
              </p>
            </div>
            <Toggle
              checked={properties.retryOnFailure}
              onChange={(checked) => setProperties(prev => ({ ...prev, retryOnFailure: checked }))}
            />
          </div>

          {properties.retryOnFailure && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Máximo de tentativas
              </label>
              <Input
                type="number"
                value={properties.maxRetries}
                onChange={(e) => setProperties(prev => ({ ...prev, maxRetries: parseInt(e.target.value) }))}
                min="1"
                max="10"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeout (segundos)
            </label>
            <Input
              type="number"
              value={properties.timeout}
              onChange={(e) => setProperties(prev => ({ ...prev, timeout: parseInt(e.target.value) }))}
              min="5"
              max="300"
            />
          </div>
        </div>

        {/* Execution History */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Histórico de Execução
          </h4>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900">Sucesso</p>
                  <p className="text-xs text-green-700">Há 2 minutos</p>
                </div>
              </div>
              <span className="text-xs text-green-600">0.8s</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900">Sucesso</p>
                  <p className="text-xs text-green-700">Há 15 minutos</p>
                </div>
              </div>
              <span className="text-xs text-green-600">1.2s</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <X className="w-4 h-4 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-900">Erro</p>
                  <p className="text-xs text-red-700">Há 1 hora</p>
                </div>
              </div>
              <span className="text-xs text-red-600">Timeout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Button
          variant="primary"
          size="md"
          onClick={handleSave}
          className="w-full"
        >
          <Save className="w-4 h-4 mr-2" />
          Salvar Configurações
        </Button>
        
        <Button
          variant="outline"
          size="md"
          className="w-full"
        >
          <Play className="w-4 h-4 mr-2" />
          Testar Node
        </Button>
      </div>
    </div>
  );
};