import React from 'react';
import { PropriedadesHeader } from '../Header/Header.types';
import { PropriedadesSidebar } from '../Sidebar/Sidebar.types';
import { PropriedadesContainer } from '../Container/Container.types';

export interface PropriedadesLayout {
  children: React.ReactNode;
  header?: PropriedadesHeader;
  sidebar?: PropriedadesSidebar;
  container?: PropriedadesContainer;
  temHeader?: boolean;
  temSidebar?: boolean;
  sidebarColapsada?: boolean;
  sidebarColapsavel?: boolean;
  fixarHeader?: boolean;
  fixarSidebar?: boolean;
  tema?: 'claro' | 'escuro';
  responsivo?: boolean;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  htmlProps?: React.HTMLAttributes<HTMLDivElement>;
  aoColapsar?: (colapsado: boolean) => void;
} 