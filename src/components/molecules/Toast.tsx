import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
  showCloseButton?: boolean;
}

export const Toast = React.memo<ToastProps>(
  ({
    id,
    type,
    title,
    message,
    duration = 5000,
    onClose,
    showCloseButton = true,
  }) => {
    // Auto-close after duration
    useEffect(() => {
      if (duration > 0) {
        const timer = setTimeout(() => {
          onClose(id);
        }, duration);

        return () => clearTimeout(timer);
      }
    }, [id, duration, onClose]);

    const config = {
      success: {
        icon: CheckCircle,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        iconColor: 'text-green-600',
        titleColor: 'text-green-900',
        messageColor: 'text-green-700',
      },
      error: {
        icon: XCircle,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        iconColor: 'text-red-600',
        titleColor: 'text-red-900',
        messageColor: 'text-red-700',
      },
      warning: {
        icon: AlertTriangle,
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        iconColor: 'text-yellow-600',
        titleColor: 'text-yellow-900',
        messageColor: 'text-yellow-700',
      },
      info: {
        icon: Info,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        iconColor: 'text-blue-600',
        titleColor: 'text-blue-900',
        messageColor: 'text-blue-700',
      },
    };

    const {
      icon: Icon,
      bgColor,
      borderColor,
      iconColor,
      titleColor,
      messageColor,
    } = config[type];

    return (
      <div
        className={`${bgColor} ${borderColor} border rounded-lg p-4 shadow-lg max-w-sm w-full transform transition-all duration-300 ease-in-out`}
      >
        <div className="flex items-start space-x-3">
          <Icon className={`w-5 h-5 ${iconColor} mt-0.5 flex-shrink-0`} />
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-medium ${titleColor}`}>{title}</h4>
            {message && (
              <p className={`mt-1 text-sm ${messageColor}`}>{message}</p>
            )}
          </div>
          {showCloseButton && (
            <button
              onClick={() => onClose(id)}
              className="flex-shrink-0 p-0.5 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

// Toast Container Component
interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
  }>;
  onClose: (id: string) => void;
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center';
}

export const ToastContainer = React.memo<ToastContainerProps>(
  ({ toasts, onClose, position = 'top-right' }) => {
    const positionClasses = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
    };

    if (toasts.length === 0) return null;

    return (
      <div
        className={`fixed ${positionClasses[position]} z-50 space-y-2 pointer-events-none`}
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              id={toast.id}
              type={toast.type}
              title={toast.title}
              message={toast.message}
              duration={toast.duration}
              onClose={onClose}
            />
          </div>
        ))}
      </div>
    );
  }
);
