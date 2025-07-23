import React, { useState, useRef, useEffect } from 'react';
import { 
  Calculator, 
  Globe, 
  FileText, 
  Image, 
  Code, 
  BarChart3, 
  Database,
  Wrench
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

export interface ToolsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onToolSelect: (tool: Tool) => void;
  tools: Tool[];
  className?: string;
}

// Mapeamento de ícones
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Calculator,
  Globe,
  FileText,
  Image,
  Code,
  BarChart3,
  Database,
};

export const ToolsDropdown: React.FC<ToolsDropdownProps> = ({
  isOpen,
  onClose,
  onToolSelect,
  tools,
  className = '',
}) => {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);


  // Navegação por teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => 
            prev < tools.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : tools.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (focusedIndex >= 0 && tools[focusedIndex]) {
            onToolSelect(tools[focusedIndex]);
            onClose();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, focusedIndex, tools, onToolSelect, onClose]);

  // Fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || Calculator;
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      
      {/* Dropdown */}
      <div
        ref={dropdownRef}
        className={`absolute bottom-full left-0 mb-2 w-80 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden animate-fade-in ${className}`}
      >

        {/* Lista de ferramentas */}
        <div className="max-h-80 overflow-y-auto">
          {tools.length > 0 ? (
            <div className="p-1">
              {tools.map((tool, index) => {
                const IconComponent = getIconComponent(tool.icon);
                const isFocused = index === focusedIndex;
                
                return (
                  <button
                    key={tool.id}
                    onClick={() => {
                      onToolSelect(tool);
                      onClose();
                    }}
                    onMouseEnter={() => setFocusedIndex(index)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 ${
                      isFocused 
                        ? 'bg-orange-50 text-orange-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                      isFocused 
                        ? 'bg-orange-500 text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {tool.name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-6 text-center">
              <Wrench className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                Nenhuma ferramenta encontrada
              </p>
            </div>
          )}
        </div>

      </div>
    </>
  );
};

export default ToolsDropdown;
