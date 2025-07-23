import React, { useState, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Save, 
  Download, 
  Upload, 
  Settings, 
  Plus,
  Zap,
  Database,
  Mail,
  Calendar,
  FileText,
  Globe,
  MessageSquare,
  Bot,
  ArrowRight,
  Trash2,
  Copy,
  Edit3,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '../atoms';

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

interface WorkflowCanvasProps {
  onNodeSelect?: (node: WorkflowNode | null) => void;
  selectedNode?: WorkflowNode | null;
  isRunning?: boolean;
  onToggleRun?: () => void;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  onNodeSelect,
  selectedNode,
  isRunning = false,
  onToggleRun
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  // Simplified mock workflow nodes
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    {
      id: 'trigger-1',
      type: 'trigger',
      title: 'Email Received',
      description: 'Quando um email é recebido',
      icon: Mail,
      color: 'from-blue-500 to-blue-600',
      position: { x: 100, y: 200 },
      connected: true
    },
    {
      id: 'condition-1',
      type: 'condition',
      title: 'Check Priority',
      description: 'Se contém "urgente"',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      position: { x: 350, y: 200 },
      connected: true
    },
    {
      id: 'action-1',
      type: 'action',
      title: 'Create Task',
      description: 'Criar tarefa no projeto',
      icon: FileText,
      color: 'from-green-500 to-green-600',
      position: { x: 600, y: 200 },
      connected: false
    }
  ]);

  const handleNodeClick = useCallback((node: WorkflowNode) => {
    onNodeSelect?.(node);
  }, [onNodeSelect]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onNodeSelect?.(null);
    }
  }, [onNodeSelect]);

  const renderConnection = (from: WorkflowNode, to: WorkflowNode) => {
    const startX = from.position.x + 140;
    const startY = from.position.y + 35;
    const endX = to.position.x;
    const endY = to.position.y + 35;

    return (
      <svg
        key={`${from.id}-${to.id}`}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#9ca3af"
            />
          </marker>
        </defs>
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="#d1d5db"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
          className={isRunning ? 'animate-pulse' : ''}
        />
      </svg>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Simplified Toolbar */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-semibold text-gray-900">Email to Task Workflow</h2>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
            isRunning 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            }`} />
            <span>{isRunning ? 'Running' : 'Stopped'}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={isRunning ? "secondary" : "primary"}
            size="sm"
            onClick={onToggleRun}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run
              </>
            )}
          </Button>
          
          <Button variant="outline" size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div 
        ref={canvasRef}
        className="flex-1 relative overflow-hidden"
        onClick={handleCanvasClick}
      >
        {/* Subtle Grid Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Connections */}
        {nodes.map((node, index) => {
          const nextNode = nodes[index + 1];
          if (nextNode && node.connected) {
            return renderConnection(node, nextNode);
          }
          return null;
        })}

        {/* Nodes */}
        {nodes.map((node) => (
          <div
            key={node.id}
            className={`absolute w-35 h-18 rounded-xl border-2 transition-all duration-200 cursor-pointer group ${
              selectedNode?.id === node.id 
                ? 'border-orange-500 shadow-lg scale-105 z-10' 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md z-0'
            }`}
            style={{
              left: node.position.x,
              top: node.position.y,
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleNodeClick(node);
            }}
          >
            <div className="h-full bg-white rounded-xl p-4 relative overflow-hidden border border-gray-100">
              {/* Running indicator */}
              {isRunning && node.connected && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
              )}
              
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${node.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <node.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">{node.title}</h4>
                  <p className="text-xs text-gray-500 truncate mt-1">{node.description}</p>
                </div>
              </div>

              {/* Connection points */}
              {node.type !== 'trigger' && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1">
                  <div className="w-3 h-3 bg-gray-300 rounded-full border-2 border-white" />
                </div>
              )}
              
              {node.connected && (
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1">
                  <div className="w-3 h-3 bg-gray-300 rounded-full border-2 border-white" />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Add Node Button */}
        <div className="absolute bottom-8 right-8">
          <Button
            variant="primary"
            size="lg"
            className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow duration-200"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>

        {/* Empty State */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Bot className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Create Your First Workflow
              </h3>
              <p className="text-gray-600 mb-6">
                Use natural language to describe what you want to automate, and I'll help you build it.
              </p>
              <Button variant="primary" size="lg">
                <MessageSquare className="w-5 h-5 mr-2" />
                Start with AI Assistant
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};