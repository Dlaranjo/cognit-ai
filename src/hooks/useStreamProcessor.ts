import { useCallback, useRef } from 'react';

export const useStreamProcessor = () => {
  const abortControllerRef = useRef<AbortController | null>(null);

  const processRealStream = useCallback(async (
    response: Response,
    onChunk: (chunk: string) => void,
    onComplete: (fullMessage: string) => void,
    onError: (error: Error) => void
  ) => {
    try {
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Stream reader not available');
      }

      const decoder = new TextDecoder();
      let fullMessage = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.trim()) {
            // Parse Server-Sent Events format
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              
              if (data === '[DONE]') {
                onComplete(fullMessage);
                return;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content || '';
                
                if (content) {
                  fullMessage += content;
                  onChunk(content);
                }
              } catch {
                // Se não conseguir fazer parse, trata como texto simples
                fullMessage += data;
                onChunk(data);
              }
            }
          }
        }
      }

      onComplete(fullMessage);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Stream aborted');
      } else {
        onError(error instanceof Error ? error : new Error('Stream processing failed'));
      }
    }
  }, []);

  const simulateStream = useCallback(async (
    content: string,
    onChunk: (chunk: string) => void,
    onComplete: (fullMessage: string) => void,
    onAbort?: () => void,
    speed: number = 20
  ) => {
    return new Promise<void>((resolve) => {
      let currentIndex = 0;
      let timeoutId: number | null = null;

      // Listen for abort signal
      const abortHandler = () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        onAbort?.();
        resolve();
      };

      // Add abort listener
      abortControllerRef.current?.signal.addEventListener('abort', abortHandler);

      const streamNext = () => {
        // Double check for abort
        if (abortControllerRef.current?.signal.aborted) {
          abortHandler();
          return;
        }

        if (currentIndex < content.length) {
          // Stream multiple characters at once for better visibility
          const chunkSize = Math.min(5, content.length - currentIndex);
          const chunk = content.slice(currentIndex, currentIndex + chunkSize);
          onChunk(chunk);
          currentIndex += chunkSize;

          timeoutId = setTimeout(() => {
            timeoutId = null;
            streamNext();
          }, speed);
        } else {
          // Remove abort listener
          abortControllerRef.current?.signal.removeEventListener('abort', abortHandler);
          onComplete(content);
          resolve();
        }
      };

      streamNext();
    });
  }, []);

  const createAbortController = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const controller = new AbortController();
    abortControllerRef.current = controller;
    return controller;
  }, []);

  const abortStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return {
    processRealStream,
    simulateStream,
    createAbortController,
    abortStream,
  };
};