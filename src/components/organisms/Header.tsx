import React from 'react';
import { Button, Icon } from '../atoms';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>

        <div className="flex items-center space-x-4">
          {actions}
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-600"
          >
            <Icon name="bell" />
          </Button>
        </div>
      </div>
    </div>
  );
};
