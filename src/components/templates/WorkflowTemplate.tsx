import React, { useState } from 'react';
import { WorkflowCanvas } from '../organisms/WorkflowCanvas';
import { WorkflowPropertiesPanel } from '../organisms/WorkflowPropertiesPanel';
import { WorkflowAIAssistant } from '../organisms/WorkflowAIAssistant';

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

export const WorkflowTemplate: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [isAIAssistantExpanded, setIsAIAssistantExpanded] = useState(true);

  const handleNodeSelect = (node: WorkflowNode | null) => {
    setSelectedNode(node);
  };

  const handleNodeSave = (nodeId: string, properties: Record<string, any>) => {
    console.log('Saving node properties:', nodeId, properties);
    // Here you would update the node properties in your state/backend
  };

  const handleCreateWorkflow = (description: string) => {
    console.log('Creating workflow:', description);
    // Here you would create a new workflow based on the AI description
  };

  const toggleAIAssistant = () => {
    setIsAIAssistantExpanded(!isAIAssistantExpanded);
  };

  return (
    <div className="h-full flex">
      {/* Main Canvas Area */}
      <div className="flex-1 flex">
        <WorkflowCanvas
          onNodeSelect={handleNodeSelect}
          selectedNode={selectedNode}
        />
        
        {/* Properties Panel */}
        {selectedNode && (
          <WorkflowPropertiesPanel
            selectedNode={selectedNode}
            onClose={() => setSelectedNode(null)}
            onSave={handleNodeSave}
          />
        )}
      </div>

      {/* AI Assistant */}
      <WorkflowAIAssistant
        isExpanded={isAIAssistantExpanded}
        onToggle={toggleAIAssistant}
        onCreateWorkflow={handleCreateWorkflow}
      />
    </div>
  );
};