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
  Edit3
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
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  onNodeSelect,
  selectedNode
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isRunning, setIsRunning] = useState(false);

  // Mock workflow nodes
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    {
      id: 'trigger-1',
      type: 'trigger',
      title: 'Webhook Trigger',
      description: 'Recebe dados via HTTP',
      icon: Globe,
      color: 'from-green-500 to-emerald-600',
      position: { x: 100, y: 200 },
      connected: true
    },
    {
      id: 'condition-1',
      type: 'condition',
      title: 'IF Condition',
      description: 'Verifica se email contém "urgente"',
      icon: Zap,
      color: 'from-yellow-500 to-orange-600',
      position: { x: 350, y: 200 },
      connected: true
    },
    {
      id: 'action-1',
      type: 'action',
      title: 'Send Email',
      description: 'Envia notificação por email',
      icon: Mail,
      color: 'from-blue-500 to-indigo-600',
      position: { x: 600, y: 150 },
      connected: true
    },
    {
      id: 'action-2',
      type: 'action',
      title: 'Create Task',
      description: 'Cria tarefa no projeto',
      icon: FileText,
      color: 'from-purple-500 to-pink-600',
      position: { x: 600, y: 250 },
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

  const toggleWorkflow = () => {
    setIsRunning(!isRunning);
  };

  const renderConnection = (from: WorkflowNode, to: WorkflowNode) => {
    const startX = from.position.x + 120; // Node width
    const startY = from.position.y + 40; // Half node height
    const endX = to.position.x;
    const endY = to.position.y + 40;

    const midX = (startX + endX) / 2;

    return (
      <svg
        key={`${from.id}-${to.id}`}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <path
          d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
          stroke="#e5e7eb"
          strokeWidth="2"
          fill="none"
          className="transition-colors duration-200"
        />
        <circle
          cx={endX}
          cy={endY}
          r="4"
          fill="#6b7280"
          className="transition-colors duration-200"
        />
      </svg>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Button
            variant={isRunning ? "secondary" : "primary"}
            size="sm"
            onClick={toggleWorkflow}
            className="flex items-center space-x-2"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Executar</span>
              </>
            )}
          </Button>
          
          <div className="w-px h-6 bg-gray-300" />
          
          <Button variant="outline" size="sm">
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Importar
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span>{isRunning ? 'Executando' : 'Parado'}</span>
          </div>
          
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div 
        ref={canvasRef}
        className="flex-1 relative overflow-hidden cursor-grab active:cursor-grabbing"
        onClick={handleCanvasClick}
      >
        {/* Grid Background */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
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
            className={`absolute w-30 h-20 rounded-lg border-2 transition-all duration-200 cursor-pointer group ${
              selectedNode?.id === node.id 
                ? 'border-orange-500 shadow-lg scale-105' 
                : 'border-gray-300 hover:border-gray-400 hover:shadow-md'
            }`}
            style={{
              left: node.position.x,
              top: node.position.y,
              zIndex: selectedNode?.id === node.id ? 10 : 2
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleNodeClick(node);
            }}
          >
            <div className={`h-full bg-gradient-to-r ${node.color} rounded-md p-3 text-white relative overflow-hidden`}>
              {/* Running indicator */}
              {isRunning && node.connected && (
                <div className="absolute top-1 right-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              )}
              
              <div className="flex items-start space-x-2">
                <node.icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold truncate">{node.title}</h4>
                  <p className="text-xs opacity-90 truncate">{node.description}</p>
                </div>
              </div>

              {/* Connection points */}
              {node.type !== 'trigger' && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1">
                  <div className="w-2 h-2 bg-white rounded-full border border-gray-300" />
                </div>
              )}
              
              {node.connected && (
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1">
                  <div className="w-2 h-2 bg-white rounded-full border border-gray-300" />
                </div>
              )}
            </div>

            {/* Node actions (visible on hover) */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex items-center space-x-1 bg-white rounded-lg shadow-lg border border-gray-200 px-2 py-1">
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Copy className="w-3 h-3 text-gray-600" />
                </button>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <Edit3 className="w-3 h-3 text-gray-600" />
                </button>
                <button className="p-1 hover:bg-red-100 rounded">
                  <Trash2 className="w-3 h-3 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add Node Button */}
        <div className="absolute bottom-6 right-6">
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
                Crie seu primeiro workflow
              </h3>
              <p className="text-gray-600 mb-6">
                Use o assistente de IA para criar workflows automatizados através de comandos naturais.
              </p>
              <Button variant="primary" size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Novo Workflow
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};