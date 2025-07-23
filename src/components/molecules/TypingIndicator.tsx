import React from 'react';
import { Sparkles } from 'lucide-react';

interface TypingIndicatorProps {
  modelName: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  modelName
}) => {
  // Use orange theme for typing indicator
  const orangeColor = 'from-orange-500 to-red-500';

  return (
    <div className="flex items-start space-x-4 animate-fade-in">
      <div className={`w-10 h-10 bg-gradient-to-br ${orangeColor} rounded-full flex items-center justify-center shadow-lg`}>
        <Sparkles className="w-5 h-5 text-white animate-pulse" />
      </div>
      <div className="flex-1">
        <div className="mb-2">
          <span className="text-sm font-semibold text-gray-700">{modelName}</span>
        </div>
        {/* Typing Indicator - No Bubble, Direct Text */}
        <div className="mr-8 text-base leading-relaxed text-gray-800">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-200"></div>
            </div>
            <span className="text-sm text-gray-600 font-medium">
              está pensando...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};