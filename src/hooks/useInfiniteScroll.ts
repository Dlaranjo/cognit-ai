import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

interface UseInfiniteScrollReturn {
  isFetching: boolean;
  setIsFetching: (fetching: boolean) => void;
  lastElementRef: (node: HTMLElement | null) => void;
}

export const useInfiniteScroll = (
  fetchMore: () => Promise<void> | void,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn => {
  const {
    threshold = 1.0,
    rootMargin = '0px',
    enabled = true,
  } = options;

  const [isFetching, setIsFetching] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLElement | null>(null);

  const handleObserver = useCallback(
    async (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      if (entry.isIntersecting && enabled && !isFetching) {
        setIsFetching(true);
        try {
          await fetchMore();
        } catch (error) {
          console.error('Error fetching more data:', error);
        } finally {
          setIsFetching(false);
        }
      }
    },
    [enabled, isFetching, fetchMore]
  );

  const setLastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isFetching) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (node) {
        observerRef.current = new IntersectionObserver(handleObserver, {
          threshold,
          rootMargin,
        });
        observerRef.current.observe(node);
        lastElementRef.current = node;
      }
    },
    [handleObserver, isFetching, threshold, rootMargin]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    isFetching,
    setIsFetching,
    lastElementRef: setLastElementRef,
  };
};

// Hook for scroll-based infinite scroll (alternative approach)
export const useScrollInfiniteScroll = (
  fetchMore: () => Promise<void> | void,
  options: UseInfiniteScrollOptions & { container?: HTMLElement } = {}
): UseInfiniteScrollReturn => {
  const {
    threshold = 200, // pixels from bottom
    enabled = true,
    container,
  } = options;

  const [isFetching, setIsFetching] = useState(false);

  const handleScroll = useCallback(
    async (event: Event) => {
      if (!enabled || isFetching) return;

      const target = event.target as HTMLElement;
      const { scrollTop, scrollHeight, clientHeight } = target;

      // Check if user has scrolled to near the bottom
      if (scrollHeight - scrollTop <= clientHeight + threshold) {
        setIsFetching(true);
        try {
          await fetchMore();
        } catch (error) {
          console.error('Error fetching more data:', error);
        } finally {
          setIsFetching(false);
        }
      }
    },
    [enabled, isFetching, fetchMore, threshold]
  );

  useEffect(() => {
    const targetElement = container || window;

    if (targetElement) {
      targetElement.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
        targetElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll, container]);

  return {
    isFetching,
    setIsFetching,
    lastElementRef: () => {}, // Not used in scroll-based approach
  };
};