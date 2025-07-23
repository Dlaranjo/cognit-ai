import React from 'react';
import {
  WorkflowCanvas,
  WorkflowNodeModal,
  WorkflowAIAssistant
} from '../organisms';

/**
 * WorkflowTemplate - Template Component (Atomic Design)
 *
 * Responsabilidade: Apenas estrutura de layout e composição de organisms
 * - Não deve conter lógica de negócio
 * - Não deve gerenciar estado complexo
 * - Apenas define a estrutura visual da página
 * - Otimizado com React.memo (componente puro)
 */
const WorkflowTemplateComponent: React.FC = () => {
  return (
    <div className="h-full flex bg-gray-50">
      {/* Main Canvas Area */}
      <div className="flex-1">
        <WorkflowCanvas />
      </div>

      {/* AI Assistant - Always visible but collapsible */}
      <div className="flex-shrink-0">
        <WorkflowAIAssistant />
      </div>

      {/* Node Configuration Modal */}
      <WorkflowNodeModal />
    </div>
  );
};

export const WorkflowTemplate = React.memo(WorkflowTemplateComponent);
WorkflowTemplate.displayName = 'WorkflowTemplate';