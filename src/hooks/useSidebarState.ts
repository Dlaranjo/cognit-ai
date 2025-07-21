import { useState, useCallback } from 'react';

export const useSidebarState = (initialExpanded: boolean = false) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const expand = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const collapse = useCallback(() => {
    setIsExpanded(false);
  }, []);

  const toggle = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return {
    isExpanded,
    expand,
    collapse,
    toggle,
  };
};
