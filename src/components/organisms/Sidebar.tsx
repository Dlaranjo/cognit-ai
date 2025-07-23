import React from 'react';
import { useNavigation } from '../../hooks/useNavigation';
import { useSidebarState } from '../../hooks/useSidebarState';
import { SidebarHeader, SidebarNavItem, SidebarUserProfile } from '../molecules';
import type { User } from '../../types';

interface SidebarProps {
  currentUser: User;
  currentView?: string;
  onViewChange?: (view: 'studio' | 'agents') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentUser }) => {
  const { navigationItems, isActive } = useNavigation();
  const { isExpanded, expand, collapse } = useSidebarState();

  return (
    <div
      className={`${isExpanded ? 'w-48' : 'w-16'} bg-gray-50 border-r border-gray-200 flex flex-col h-full transition-[width] duration-200 ease-out group`}
      onMouseEnter={expand}
      onMouseLeave={collapse}
    >
      {/* Header */}
      <SidebarHeader isExpanded={isExpanded} />

      {/* Navigation */}
      <div className={`flex-1 ${isExpanded ? 'px-3' : 'px-2'} py-4 space-y-2 transition-[padding] duration-200`}>
        {navigationItems.map((item) => (
          <SidebarNavItem
            key={item.id}
            item={item}
            isExpanded={isExpanded}
            isActive={isActive}
          />
        ))}
      </div>

      {/* User Profile */}
      <SidebarUserProfile user={currentUser} isExpanded={isExpanded} />
    </div>
  );
};