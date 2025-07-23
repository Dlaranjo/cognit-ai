import { useEffect, useRef } from 'react';

export interface UseAutoResizeOptions {
  value: string;
  enabled?: boolean;
  minRows?: number;
  maxRows?: number;
}

/**
 * Hook customizado para auto-resize de textarea
 * 
 * Extrai a lógica de redimensionamento automático do componente Textarea
 * seguindo o princípio de separação de responsabilidades do Atomic Design.
 */
export const useAutoResize = ({
  value,
  enabled = false,
  minRows = 3,
  maxRows
}: UseAutoResizeOptions) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!enabled || !textareaRef.current) {
      return;
    }

    const textarea = textareaRef.current;
    
    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';
    
    // Calculate new height
    const scrollHeight = textarea.scrollHeight;
    const computedStyle = getComputedStyle(textarea);
    const lineHeight = parseFloat(computedStyle.lineHeight);
    const paddingTop = parseFloat(computedStyle.paddingTop);
    const paddingBottom = parseFloat(computedStyle.paddingBottom);
    
    // Calculate min and max heights
    const minHeight = (lineHeight * minRows) + paddingTop + paddingBottom;
    const maxHeight = maxRows 
      ? (lineHeight * maxRows) + paddingTop + paddingBottom 
      : Infinity;
    
    // Apply constrained height
    const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
    textarea.style.height = `${newHeight}px`;
    
  }, [value, enabled, minRows, maxRows]);

  return textareaRef;
};