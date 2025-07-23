import React from 'react';
import { ChevronDown, Settings, LogOut } from 'lucide-react';
import { Avatar, Button, Badge } from '../atoms';

export interface UserProfileProps {
  name: string;
  email?: string;
  avatar?: string;
  role?: 'owner' | 'editor' | 'viewer';
  onSettings?: () => void;
  onLogout?: () => void;
  showDropdown?: boolean;
  className?: string;
}

export const UserProfile = React.memo<UserProfileProps>(
  ({
    name,
    email,
    avatar,
    role,
    onSettings,
    onLogout,
    showDropdown = false,
    className = '',
  }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const getRoleBadgeVariant = (role?: string) => {
      switch (role) {
        case 'owner':
          return 'primary';
        case 'editor':
          return 'success';
        case 'viewer':
          return 'neutral';
        default:
          return 'neutral';
      }
    };

    const getRoleLabel = (role?: string) => {
      switch (role) {
        case 'owner':
          return 'Owner';
        case 'editor':
          return 'Editor';
        case 'viewer':
          return 'Viewer';
        default:
          return '';
      }
    };

    return (
      <div className={`relative ${className}`}>
        <Button
          variant="ghost"
          size="md"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-start p-2 h-auto"
        >
          <div className="flex items-center gap-3 w-full">
            <Avatar src={avatar} name={name} size="md" />

            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-neutral-900 truncate">
                  {name}
                </span>
                {role && (
                  <Badge variant={getRoleBadgeVariant(role)} size="sm">
                    {getRoleLabel(role)}
                  </Badge>
                )}
              </div>
              {email && (
                <p className="text-xs text-neutral-500 truncate">{email}</p>
              )}
            </div>

            {showDropdown && (
              <ChevronDown
                className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            )}
          </div>
        </Button>

        {/* Dropdown Menu */}
        {showDropdown && isOpen && (
          <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-neutral-200 rounded-md shadow-lg z-50">
            <div className="py-1">
              {onSettings && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onSettings();
                    setIsOpen(false);
                  }}
                  className="w-full justify-start px-3 py-2 text-left"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </Button>
              )}

              {onLogout && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="w-full justify-start px-3 py-2 text-left text-error hover:bg-error/10"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default UserProfile;
