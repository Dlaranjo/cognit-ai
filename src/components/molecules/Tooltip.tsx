import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  disabled?: boolean;
  className?: string;
}

export const Tooltip = React.memo<TooltipProps>(
  ({
    content,
    children,
    position = 'top',
    delay = 300,
    disabled = false,
    className = '',
  }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const timeoutRef = useRef<NodeJS.Timeout>();
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const showTooltip = () => {
      if (disabled) return;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
        updatePosition();
      }, delay);
    };

    const hideTooltip = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsVisible(false);
    };

    const updatePosition = React.useCallback(() => {
      if (!triggerRef.current || !tooltipRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      let x = 0;
      let y = 0;

      switch (position) {
        case 'top':
          x = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          y = triggerRect.top - tooltipRect.height - 8;
          break;
        case 'bottom':
          x = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
          y = triggerRect.bottom + 8;
          break;
        case 'left':
          x = triggerRect.left - tooltipRect.width - 8;
          y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          break;
        case 'right':
          x = triggerRect.right + 8;
          y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
          break;
      }

      // Ensure tooltip stays within viewport
      const margin = 8;
      x = Math.max(
        margin,
        Math.min(x, window.innerWidth - tooltipRect.width - margin)
      );
      y = Math.max(
        margin,
        Math.min(y, window.innerHeight - tooltipRect.height - margin)
      );

      setCoords({ x, y });
    }, [position]);

    useEffect(() => {
      if (isVisible) {
        updatePosition();
      }
    }, [isVisible, position, updatePosition]);

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    const getArrowClasses = () => {
      const base = 'absolute w-2 h-2 bg-gray-900 transform rotate-45';

      switch (position) {
        case 'top':
          return `${base} -bottom-1 left-1/2 -translate-x-1/2`;
        case 'bottom':
          return `${base} -top-1 left-1/2 -translate-x-1/2`;
        case 'left':
          return `${base} -right-1 top-1/2 -translate-y-1/2`;
        case 'right':
          return `${base} -left-1 top-1/2 -translate-y-1/2`;
        default:
          return base;
      }
    };

    return (
      <>
        <div
          ref={triggerRef}
          className={`inline-block ${className}`}
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
          onFocus={showTooltip}
          onBlur={hideTooltip}
        >
          {children}
        </div>

        {isVisible && content && (
          <div
            ref={tooltipRef}
            className="fixed z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded-md shadow-lg pointer-events-none"
            style={{
              left: coords.x,
              top: coords.y,
            }}
          >
            <div className={getArrowClasses()} />
            {content}
          </div>
        )}
      </>
    );
  }
);
