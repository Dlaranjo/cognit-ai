import React from 'react';
import { Plus, History, Settings } from 'lucide-react';

interface StudioHeaderProps {
  onNewConversation: () => void;
  onShowHistory: () => void;
  className?: string;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  onNewConversation,
  onShowHistory,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between px-6 py-4 ${className}`}>
      <div className="flex items-center space-x-4">
        {/* New Chat Button */}
        <button
          onClick={onNewConversation}
          className="group/btn relative flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:ring-offset-1"
        >
          <Plus className="w-4 h-4 transition-transform duration-200 group-hover/btn:scale-110" />
          <span className="text-sm font-medium">Nova</span>
          
          {/* Tooltip */}
          <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
            Nova conversa
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800"></div>
          </div>
        </button>

        {/* History Button */}
        <button
          onClick={onShowHistory}
          className="group/btn relative flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:ring-offset-1"
        >
          <History className="w-4 h-4 transition-transform duration-200 group-hover/btn:scale-110" />
          <span className="text-sm font-medium">Histórico</span>
          
          {/* Tooltip */}
          <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
            Ver histórico de conversas
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800"></div>
          </div>
        </button>
      </div>

      {/* Settings */}
      <button className="group/btn relative p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:ring-offset-1">
        <Settings className="w-5 h-5 transition-transform duration-200 group-hover/btn:scale-110 group-hover/btn:rotate-90" />
        
        {/* Tooltip */}
        <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
          Configurações
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800"></div>
        </div>
      </button>
    </div>
  );
};
