import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Save,
  Play,
  AlertCircle,
  CheckCircle,
  Settings,
  Zap,
  Mail,
  FileText
} from 'lucide-react';
import { Input, Textarea, Toggle } from '../atoms';
import { useWorkflows } from '../../hooks/useWorkflows';
import { logger } from '../../shared/utils';
import type {
  TriggerNodeProperties,
  ActionNodeProperties,
  ConditionNodeProperties
} from '../../redux/workflows/workflowsTypes';

interface WorkflowNodeModalProps {
  className?: string;
}

interface NodeFormProperties {
  name: string;
  description: string;
  enabled: boolean;
  // Trigger properties
  emailAddress: string;
  // Condition properties
  condition: string;
  // Action properties
  taskTitle: string;
  projectId: string;
}

/**
 * WorkflowNodeModal - Organism Component (Atomic Design)
 *
 * Responsabilidade: Lógica de negócio + composição de molecules/atoms
 * - Conectado ao Redux para gerenciar estado do nó selecionado
 * - Contém lógica de edição e salvamento de propriedades do nó
 * - Gerencia estado local do formulário
 * - Otimizado com React.memo e useCallback
 */
const WorkflowNodeModalComponent: React.FC<WorkflowNodeModalProps> = () => {
  const {
    selectedNode,
    selectNode,
    modifyNode,
  } = useWorkflows();

  const [properties, setProperties] = useState<NodeFormProperties>({
    name: '',
    description: '',
    enabled: true,
    // Node-specific properties
    emailAddress: 'support@cognit.com',
    condition: 'subject.includes("urgent")',
    taskTitle: 'Urgent: {{email.subject}}',
    projectId: 'main-project'
  });

  // Update form when selected node changes
  useEffect(() => {
    if (selectedNode) {
      setProperties({
        name: selectedNode.title || '',
        description: selectedNode.description || '',
        enabled: selectedNode.enabled ?? true,
        emailAddress: (selectedNode.properties as TriggerNodeProperties)?.emailAddress || 'support@cognit.com',
        condition: (selectedNode.properties as ConditionNodeProperties)?.condition || 'subject.includes("urgent")',
        taskTitle: (selectedNode.properties as ActionNodeProperties)?.taskTitle || 'Urgent: {{email.subject}}',
        projectId: (selectedNode.properties as ActionNodeProperties)?.projectId || 'main-project',
      });
    }
  }, [selectedNode]);

  const handleClose = useCallback(() => {
    logger.dev('Closing node modal');
    selectNode(null);
  }, [selectNode]);

  const handleSave = useCallback(() => {
    if (selectedNode) {
      logger.dev('Saving node properties:', { nodeId: selectedNode.id, properties });
      modifyNode(selectedNode.id, {
        title: properties.name,
        description: properties.description,
        enabled: properties.enabled,
        properties: {
          emailAddress: properties.emailAddress,
          condition: properties.condition,
          taskTitle: properties.taskTitle,
          projectId: properties.projectId,
        },
      });
      handleClose();
    }
  }, [selectedNode, properties, modifyNode, handleClose]);

  const getNodeIcon = (): React.ComponentType<{ className?: string }> => {
    if (!selectedNode) return Settings;

    switch (selectedNode.type) {
      case 'trigger':
        return Mail;
      case 'condition':
        return Zap;
      case 'action':
        return FileText;
      default:
        return Settings;
    }
  };

  const getNodeTypeLabel = (): string => {
    if (!selectedNode) return 'Nó';

    switch (selectedNode.type) {
      case 'trigger':
        return 'Gatilho';
      case 'condition':
        return 'Condição';
      case 'action':
        return 'Ação';
      default:
        return 'Nó';
    }
  };

  const renderNodeConfiguration = (): React.ReactNode => {
    if (!selectedNode) return null;

    switch (selectedNode.type) {
      case 'trigger':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address to Monitor
              </label>
              <Input
                value={properties.emailAddress}
                onChange={(e) => setProperties(prev => ({ ...prev, emailAddress: e.target.value }))}
                placeholder="support@cognit.com"
                type="email"
              />
              <p className="text-xs text-gray-500 mt-1">
                O endereço de email que irá disparar este workflow
              </p>
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
              <Input
                value={properties.condition}
                onChange={(e) => setProperties(prev => ({ ...prev, condition: e.target.value }))}
                placeholder='subject.includes("urgent")'
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Expressão JavaScript para avaliar
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Variáveis disponíveis:</p>
                  <ul className="text-xs space-y-1">
                    <li><code>subject</code> - Assunto do email</li>
                    <li><code>body</code> - Conteúdo do email</li>
                    <li><code>from</code> - Email do remetente</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'action':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título da Tarefa
              </label>
              <Input
                value={properties.taskTitle}
                onChange={(e) => setProperties(prev => ({ ...prev, taskTitle: e.target.value }))}
                placeholder="Urgent: {{email.subject}}"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use {`{{variável}}`} para conteúdo dinâmico
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Projeto
              </label>
              <select 
                value={properties.projectId}
                onChange={(e) => setProperties(prev => ({ ...prev, projectId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="main-project">Projeto Principal</option>
                <option value="support">Suporte</option>
                <option value="development">Desenvolvimento</option>
              </select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!selectedNode) return null;

  const NodeIcon = getNodeIcon();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-red-50">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 bg-gradient-to-r ${selectedNode.color} rounded-xl flex items-center justify-center shadow-lg`}>
              <NodeIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{selectedNode.title}</h2>
              <p className="text-sm text-gray-600">{getNodeTypeLabel()}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-100 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Basic Properties */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <Settings className="w-5 h-5 text-gray-500" />
              <span>Configurações Gerais</span>
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome
              </label>
              <Input
                value={properties.name}
                onChange={(e) => setProperties(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome do nó"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <Textarea
                value={properties.description}
                onChange={(e) => setProperties(prev => ({ ...prev, description: e.target.value }))}
                placeholder="O que este nó faz"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Habilitado
                </label>
                <p className="text-xs text-gray-500">
                  O nó será executado no workflow
                </p>
              </div>
              <Toggle
                checked={properties.enabled}
                onChange={(checked) => setProperties(prev => ({ ...prev, enabled: checked }))}
              />
            </div>
          </div>

          {/* Node Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <NodeIcon className="w-5 h-5 text-gray-500" />
              <span>Configuração Específica</span>
            </h3>
            {renderNodeConfiguration()}
          </div>

          {/* Execution Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Execuções Recentes</h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Sucesso</p>
                    <p className="text-xs text-green-700">2 minutos atrás</p>
                  </div>
                </div>
                <span className="text-xs text-green-600 font-mono">0.8s</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Sucesso</p>
                    <p className="text-xs text-green-700">15 minutos atrás</p>
                  </div>
                </div>
                <span className="text-xs text-green-600 font-mono">1.2s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-all duration-200"
            >
              Cancelar
            </button>
            
            <button
              className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Testar</span>
            </button>
            
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2 shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const WorkflowNodeModal = React.memo(WorkflowNodeModalComponent);
WorkflowNodeModal.displayName = 'WorkflowNodeModal';