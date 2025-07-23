import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  Play,
  Pause,
  Save,
  Plus,
  Zap,
  Mail,
  FileText,
  MessageSquare,
  Bot,
  MoreHorizontal
} from 'lucide-react';
import { useWorkflows } from '../../hooks/useWorkflows';
import { logger } from '../../shared/utils';

// Icon mapping for serializable workflow nodes
const iconMap = {
  Mail,
  Zap,
  FileText,
  MessageSquare,
  Bot,
  MoreHorizontal,
};

interface WorkflowCanvasProps {
  className?: string;
}

/**
 * WorkflowCanvas - Organism Component (Atomic Design)
 *
 * Responsabilidade: Lógica de negócio + composição de molecules/atoms
 * - Conectado ao Redux para gerenciar estado
 * - Contém lógica de drag & drop, seleção de nós, execução
 * - Gerencia interações complexas do usuário
 * - Otimizado com React.memo e useMemo/useCallback
 */
const WorkflowCanvasComponent: React.FC<WorkflowCanvasProps> = () => {
  const {
    activeWorkflow,
    selectedNode,
    activeWorkflowNodes,
    isExecuting,
    canExecuteWorkflow,
    selectNode,
    repositionNode,
    runWorkflow,
    loadWorkflows,
  } = useWorkflows();

  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Load workflows on component mount
  useEffect(() => {
    loadWorkflows();
  }, [loadWorkflows]);

  // Use nodes from Redux state
  const nodes = activeWorkflowNodes;

  // Memoize nodes to prevent unnecessary re-renders
  const memoizedNodes = useMemo(() => nodes, [nodes]);

  // Memoized node component for better performance
  const WorkflowNodeComponent = React.memo<{
    node: import('../../redux/workflows/workflowsTypes').WorkflowNode;
    isSelected: boolean;
    isDragged: boolean;
    onMouseDown: (e: React.MouseEvent, node: import('../../redux/workflows/workflowsTypes').WorkflowNode) => void;
    onClick: (node: import('../../redux/workflows/workflowsTypes').WorkflowNode) => void;
  }>(({ node, isSelected, isDragged, onMouseDown, onClick }) => {
    const IconComponent = iconMap[node.icon as keyof typeof iconMap] || MoreHorizontal;

    return (
      <div
        className={`absolute min-w-[180px] max-w-[220px] h-[72px] rounded-xl border-2 transition-all duration-200 group hover:scale-102 ${
          isDragged
            ? 'cursor-grabbing z-20 scale-105 shadow-2xl border-orange-500 bg-orange-50/50'
            : isSelected
              ? 'border-orange-500 shadow-lg shadow-orange-200/50 scale-105 z-10 bg-orange-50/30 cursor-grab'
              : 'border-gray-200 hover:border-orange-300 hover:shadow-lg hover:shadow-gray-200/50 z-0 hover:bg-gray-50/50 cursor-grab'
        }`}
        style={{
          left: node.position.x,
          top: node.position.y,
        }}
        onMouseDown={(e) => onMouseDown(e, node)}
        onClick={(e) => {
          e.stopPropagation();
          if (!isDragging) {
            onClick(node);
          }
        }}
      >
        <div className="h-full bg-white rounded-xl p-3 relative overflow-hidden border border-gray-100">
          {/* Running indicator */}
          {isExecuting && node.connected && (
            <div className="absolute top-2 right-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          )}

          <div className="flex items-center space-x-3 h-full">
            <div className={`w-10 h-10 bg-gradient-to-r ${node.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <IconComponent className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 truncate leading-tight">{node.title}</h4>
              <p className="text-xs text-gray-500 truncate mt-0.5">{node.description}</p>
            </div>
          </div>

          {/* Connection points */}
          {node.type !== 'trigger' && (
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1.5">
              <div className={`w-4 h-4 rounded-full border-2 border-white shadow-md transition-colors duration-200 ${
                isExecuting && node.connected ? 'bg-green-500' : 'bg-slate-400'
              }`} />
            </div>
          )}

          {node.connected && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1.5">
              <div className={`w-4 h-4 rounded-full border-2 border-white shadow-md transition-colors duration-200 ${
                isExecuting ? 'bg-green-500' : 'bg-slate-400'
              }`} />
            </div>
          )}
        </div>
      </div>
    );
  });



  const handleNodeClick = useCallback((node: import('../../redux/workflows/workflowsTypes').WorkflowNode) => {
    logger.dev('Node clicked:', { nodeId: node.id, nodeTitle: node.title });
    selectNode(node);
  }, [selectNode]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isDragging) {
      logger.dev('Canvas clicked - clearing selection');
      selectNode(null);
    }
  }, [selectNode, isDragging]);

  const handleMouseDown = useCallback((e: React.MouseEvent, node: import('../../redux/workflows/workflowsTypes').WorkflowNode) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const offsetX = e.clientX - rect.left - node.position.x;
    const offsetY = e.clientY - rect.top - node.position.y;

    setIsDragging(true);
    setDraggedNodeId(node.id);
    setDragOffset({ x: offsetX, y: offsetY });

    logger.dev('Started dragging node:', { nodeId: node.id, offset: { x: offsetX, y: offsetY } });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !draggedNodeId || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;

    // Constrain to canvas bounds
    const nodeWidth = 220; // max-w-[220px]
    const nodeHeight = 72; // h-[72px]
    const constrainedX = Math.max(0, Math.min(newX, rect.width - nodeWidth));
    const constrainedY = Math.max(0, Math.min(newY, rect.height - nodeHeight));

    // Update node position via Redux
    repositionNode(draggedNodeId, { x: constrainedX, y: constrainedY });
  }, [isDragging, draggedNodeId, dragOffset, repositionNode]);

  const handleMouseUp = useCallback(() => {
    if (draggedNodeId) {
      logger.dev('Finished dragging node:', { nodeId: draggedNodeId });
    }
    setIsDragging(false);
    setDraggedNodeId(null);
    setDragOffset({ x: 0, y: 0 });
  }, [draggedNodeId]);

  const renderConnection = useCallback((from: import('../../redux/workflows/workflowsTypes').WorkflowNode, to: import('../../redux/workflows/workflowsTypes').WorkflowNode) => {
    const startX = from.position.x + 200; // Adjusted for new node width
    const startY = from.position.y + 36; // Center of node height
    const endX = to.position.x;
    const endY = to.position.y + 36;

    // Calculate control points for a smooth curve
    const midX = startX + (endX - startX) / 2;
    const curve1X = midX - 20;
    const curve2X = midX + 20;

    return (
      <svg
        key={`${from.id}-${to.id}`}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <defs>
          {/* Gradient for connection */}
          <linearGradient id={`gradient-${from.id}-${to.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isExecuting ? "#22c55e" : "#94a3b8"} />
            <stop offset="100%" stopColor={isExecuting ? "#16a34a" : "#64748b"} />
          </linearGradient>
          
          {/* Arrow marker */}
          <marker
            id={`arrowhead-${from.id}-${to.id}`}
            markerWidth="10"
            markerHeight="8"
            refX="9"
            refY="4"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon
              points="0 0, 10 4, 0 8"
              fill={isExecuting ? "#16a34a" : "#64748b"}
            />
          </marker>
        </defs>
        
        {/* Main connection path */}
        <path
          d={`M ${startX} ${startY} C ${curve1X} ${startY}, ${curve2X} ${endY}, ${endX} ${endY}`}
          stroke={`url(#gradient-${from.id}-${to.id})`}
          strokeWidth="3"
          fill="none"
          markerEnd={`url(#arrowhead-${from.id}-${to.id})`}
          className={`transition-all duration-300 ${isExecuting ? 'drop-shadow-sm' : ''}`}
          strokeDasharray={isExecuting ? "8,4" : "none"}
          style={{
            filter: isExecuting ? 'drop-shadow(0 0 4px rgba(34, 197, 94, 0.3))' : 'none'
          }}
        />
        
        {/* Animated flow dots when running */}
        {isExecuting && (
          <>
            <circle r="3" fill="#22c55e" className="opacity-80">
              <animateMotion
                dur="2s"
                repeatCount="indefinite"
                path={`M ${startX} ${startY} C ${curve1X} ${startY}, ${curve2X} ${endY}, ${endX} ${endY}`}
              />
            </circle>
            <circle r="2" fill="#16a34a" className="opacity-60">
              <animateMotion
                dur="2s"
                repeatCount="indefinite"
                path={`M ${startX} ${startY} C ${curve1X} ${startY}, ${curve2X} ${endY}, ${endX} ${endY}`}
                begin="0.5s"
              />
            </circle>
          </>
        )}
      </svg>
    );
  }, [isExecuting]);

  return (
    <div className="h-full relative bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">

      {/* Floating Status Badge */}
      <div className="absolute top-4 left-4 z-40">
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl shadow-lg backdrop-blur-sm border transition-all duration-300 ${
          isExecuting
            ? 'bg-green-50/90 border-green-200/50 text-green-700'
            : 'bg-white/90 border-gray-200/50 text-gray-600'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
            isExecuting ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
          }`} />
          <span className="text-sm font-medium">{activeWorkflow?.name || 'No Workflow'}</span>
          <span className="text-xs">•</span>
          <span className="text-xs">{isExecuting ? 'Running' : 'Stopped'}</span>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-50">
        {/* Run/Stop Button */}
        <button
          onClick={() => {
            if (activeWorkflow && canExecuteWorkflow) {
              logger.dev('Executing workflow:', { workflowId: activeWorkflow.id });
              runWorkflow(activeWorkflow.id);
            } else {
              logger.warn('Cannot execute workflow:', {
                hasActiveWorkflow: !!activeWorkflow,
                canExecute: canExecuteWorkflow
              });
            }
          }}
          disabled={!canExecuteWorkflow}
          className={`group relative p-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
            isExecuting
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
          }`}
          title={isExecuting ? 'Workflow executando...' : 'Executar workflow'}
        >
          {isExecuting ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}

          {/* Tooltip */}
          <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-900/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-150 whitespace-nowrap pointer-events-none delay-75">
            {isExecuting ? 'Workflow executando...' : 'Executar workflow'}
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-2 border-transparent border-l-gray-900/90"></div>
          </div>
        </button>

        {/* Save Button */}
        <button
          className="group relative bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:bg-white/90 hover:border-gray-300/60 text-gray-600 hover:text-gray-700 p-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
          title="Salvar workflow"
        >
          <Save className="w-4 h-4" />

          {/* Tooltip */}
          <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-900/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-150 whitespace-nowrap pointer-events-none delay-75">
            Salvar workflow
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-2 border-transparent border-l-gray-900/90"></div>
          </div>
        </button>

        {/* More Options Button */}
        <button
          className="group relative bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:bg-white/90 hover:border-gray-300/60 text-gray-600 hover:text-gray-700 p-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
          title="Mais opções"
        >
          <MoreHorizontal className="w-4 h-4" />

          {/* Tooltip */}
          <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-900/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-150 whitespace-nowrap pointer-events-none delay-75">
            Mais opções
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-2 border-transparent border-l-gray-900/90"></div>
          </div>
        </button>
      </div>

      {/* Canvas */}
      <div 
        ref={canvasRef}
        className="h-full relative overflow-hidden select-none"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'default' }}
      >
        {/* Elegant Grid Background */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to right, #f3f4f6 1px, transparent 1px),
              linear-gradient(to bottom, #f3f4f6 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* Subtle Radial Gradient Overlay */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(circle at 50% 50%, rgba(234, 88, 12, 0.05) 0%, transparent 50%)`
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
        {memoizedNodes.map((node) => (
          <WorkflowNodeComponent
            key={node.id}
            node={node}
            isSelected={selectedNode?.id === node.id}
            isDragged={draggedNodeId === node.id}
            onMouseDown={handleMouseDown}
            onClick={handleNodeClick}
          />
        ))}

        {/* Add Node Button */}
        <div className="absolute bottom-8 right-8 z-40">
          <button
            className="group relative bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
            title="Adicionar nó"
          >
            <Plus className="w-5 h-5" />

            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-150 whitespace-nowrap pointer-events-none delay-75">
              Adicionar nó
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-2 border-transparent border-t-gray-900/90"></div>
            </div>
          </button>
        </div>

        {/* Empty State */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="text-center max-w-lg px-8">
              {/* Glass morphism container */}
              <div className="bg-white/30 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Bot className="w-12 h-12 text-white" />
                </div>
                
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  Crie Seu Primeiro Workflow
                </h3>
                
                <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                  Use linguagem natural para descrever o que você quer automatizar, e eu vou te ajudar a construir visualmente.
                </p>
                
                <button className="group bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 text-lg font-medium">
                  <MessageSquare className="w-6 h-6 mr-3 inline" />
                  Começar com IA Assistant
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const WorkflowCanvas = React.memo(WorkflowCanvasComponent);
WorkflowCanvas.displayName = 'WorkflowCanvas';