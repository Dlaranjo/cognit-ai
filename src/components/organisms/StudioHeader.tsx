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
          className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
          title="Nova conversa"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Nova</span>
        </button>

        {/* History Button */}
        <button
          onClick={onShowHistory}
          className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
          title="Histórico"
        >
          <History className="w-4 h-4" />
          <span className="text-sm font-medium">Histórico</span>
        </button>
      </div>

      {/* Settings */}
      <button className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">
        <Settings className="w-5 h-5" />
      </button>
    </div>
  );
};
