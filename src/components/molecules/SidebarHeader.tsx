import React from 'react';

interface SidebarHeaderProps {
  isExpanded: boolean;
  className?: string;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isExpanded,
  className = ''
}) => {
  return (
    <div className={`p-4 border-b border-gray-200 transition-[padding] duration-200 ${className}`}>
      <div className={`flex items-center ${isExpanded ? 'space-x-3' : 'justify-center'} transition-[gap,justify-content] duration-200 h-8`}>
        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">AI</span>
          </div>
        </div>
        {isExpanded && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-75 flex items-center h-8">
            <h1 className="text-lg font-semibold text-gray-900 leading-none">Cognit</h1>
          </div>
        )}
      </div>
    </div>
  );
};
