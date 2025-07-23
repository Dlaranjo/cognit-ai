import React from 'react';
import { 
  Settings, 
  X,
  Save,
  Play,
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
  Zap,
  FileText
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
    // Node-specific properties
    emailAddress: 'support@cognit.com',
    condition: 'subject.includes("urgent")',
    taskTitle: 'Urgent: {{email.subject}}',
    projectId: 'main-project'
  });

  const handleSave = () => {
    if (selectedNode) {
      onSave(selectedNode.id, properties);
    }
  };

  const renderNodeConfiguration = () => {
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
                The email address that will trigger this workflow
              </p>
            </div>
          </div>
        );

      case 'condition':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition
              </label>
              <Input
                value={properties.condition}
                onChange={(e) => setProperties(prev => ({ ...prev, condition: e.target.value }))}
                placeholder='subject.includes("urgent")'
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                JavaScript expression to evaluate
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Available variables:</p>
                  <ul className="text-xs space-y-1">
                    <li><code>subject</code> - Email subject</li>
                    <li><code>body</code> - Email content</li>
                    <li><code>from</code> - Sender email</li>
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
                Task Title
              </label>
              <Input
                value={properties.taskTitle}
                onChange={(e) => setProperties(prev => ({ ...prev, taskTitle: e.target.value }))}
                placeholder="Urgent: {{email.subject}}"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use {{variable}} for dynamic content
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project
              </label>
              <select 
                value={properties.projectId}
                onChange={(e) => setProperties(prev => ({ ...prev, projectId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="main-project">Main Project</option>
                <option value="support">Support</option>
                <option value="development">Development</option>
              </select>
            </div>
          </div>
        );

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
          <h4 className="font-medium text-gray-900">General Settings</h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <Input
              value={properties.name}
              onChange={(e) => setProperties(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Node name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Textarea
              value={properties.description}
              onChange={(e) => setProperties(prev => ({ ...prev, description: e.target.value }))}
              placeholder="What this node does"
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Enabled
              </label>
              <p className="text-xs text-gray-500">
                Node will execute in workflow
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
          <h4 className="font-medium text-gray-900">Configuration</h4>
          {renderNodeConfiguration()}
        </div>

        {/* Execution Status */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Recent Executions</h4>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900">Success</p>
                  <p className="text-xs text-green-700">2 minutes ago</p>
                </div>
              </div>
              <span className="text-xs text-green-600">0.8s</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900">Success</p>
                  <p className="text-xs text-green-700">15 minutes ago</p>
                </div>
              </div>
              <span className="text-xs text-green-600">1.2s</span>
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
          Save Changes
        </Button>
        
        <Button
          variant="outline"
          size="md"
          className="w-full"
        >
          <Play className="w-4 h-4 mr-2" />
          Test Node
        </Button>
      </div>
    </div>
  );
};