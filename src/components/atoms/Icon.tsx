import React from 'react';
import {
  LucideIcon,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  ChevronDown,
  Zap,
  DollarSign,
  Cpu,
  Check,
  Users,
  Calendar,
  FolderOpen,
  Settings,
  Bell,
  MessageSquare,
  MoreHorizontal,
  Edit,
  Star,
  Trash2
} from 'lucide-react';

// Icon name mapping
const iconMap = {
  'copy': Copy,
  'thumbs-up': ThumbsUp,
  'thumbs-down': ThumbsDown,
  'rotate-ccw': RotateCcw,
  'chevron-down': ChevronDown,
  'zap': Zap,
  'dollar-sign': DollarSign,
  'cpu': Cpu,
  'check': Check,
  'users': Users,
  'calendar': Calendar,
  'folder-open': FolderOpen,
  'settings': Settings,
  'bell': Bell,
  'message-square': MessageSquare,
  'more-horizontal': MoreHorizontal,
  'edit': Edit,
  'star': Star,
  'trash-2': Trash2,
} as const;

export interface IconProps {
  name?: keyof typeof iconMap;
  icon?: LucideIcon;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'neutral'
    | 'current';
  className?: string;
}

const sizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

const colorClasses = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
  neutral: 'text-neutral-500',
  current: 'text-current',
};

export const Icon = React.memo<IconProps>(
  ({ name, icon, size = 'md', color = 'current', className = '' }) => {
    const classes = [sizeClasses[size], colorClasses[color], className].join(
      ' '
    );

    // Use the provided icon prop or get from name mapping
    const IconComponent = icon || (name ? iconMap[name] : null);

    if (!IconComponent) {
      console.warn(`Icon not found: ${name}`);
      return null;
    }

    return <IconComponent className={classes} />;
  }
);

export default Icon;
