import { useState, useCallback, useRef } from 'react';
import { useStreamProcessor } from './useStreamProcessor';
import { useMessageStreaming } from './useMessageStreaming';
import { config } from '../shared/config';

interface StreamingOptions {
  model: string;
  provider: string;
  isRegeneration?: boolean;
  onStart?: () => void;
  onComplete?: (message: string) => void;
  onError?: (error: Error) => void;
}

export const useStreaming = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { processRealStream, simulateStream, createAbortController, abortStream } = useStreamProcessor();
  const {
    startStreaming,
    handleStreamChunk,
    handleStreamComplete,
    clearStreaming
  } = useMessageStreaming();

  const currentContentRef = useRef('');
  const currentOptionsRef = useRef<StreamingOptions | null>(null);

  // Handle stream abort - preserve partial content as a complete message
  const handleStreamAbort = useCallback(() => {
    const partialContent = currentContentRef.current;
    const options = currentOptionsRef.current;

    if (partialContent.trim() && options) {
      // Complete the message with the partial content using current options
      handleStreamComplete(partialContent, options.provider, options.model, { isRegeneration: false });
    } else {
      // If no content, just clear streaming
      clearStreaming();
    }
    currentContentRef.current = '';
  }, [handleStreamComplete, clearStreaming]);


  const makeStreamRequest = useCallback(async (
    message: string,
    options: StreamingOptions,
    abortController: AbortController
  ): Promise<Response> => {
    const requestBody = {
      message,
      provider: options.provider,
      model: options.model,
      stream: true,
    };

    return fetch(`${config.API_BASE_URL}/api/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: abortController.signal,
    });
  }, []);

  const handleStreamingResponse = useCallback(async (
    response: Response,
    options: StreamingOptions
  ) => {
    const contentType = response.headers.get('content-type') || '';
    
    // Detecta se é uma resposta JSON do mock server
    if (contentType.includes('application/json')) {
      const data = await response.json();
      const content = data.content || '';
      
      // Simula streaming para respostas do mock server
      currentContentRef.current = '';
      
      await simulateStream(
        content,
        (chunk) => {
          currentContentRef.current = handleStreamChunk(chunk, currentContentRef.current);
        },
        (fullMessage) => {
          handleStreamComplete(fullMessage, options.provider, options.model, {
            isRegeneration: options.isRegeneration,
          });
          // Call onComplete after streaming is done
          options.onComplete?.(fullMessage);
        },
        () => {
          // onAbort callback - preserve partial content
          handleStreamAbort();
        }
      );
    } else {
      // Processa streaming real
      currentContentRef.current = '';
      
      await processRealStream(
        response,
        (chunk) => {
          currentContentRef.current = handleStreamChunk(chunk, currentContentRef.current);
        },
        (fullMessage) => {
          handleStreamComplete(fullMessage, options.provider, options.model, {
            isRegeneration: options.isRegeneration,
          });
          // Call onComplete after streaming is done
          options.onComplete?.(fullMessage);
        },
        (error) => {
          throw error;
        }
      );
    }
  }, [processRealStream, simulateStream, handleStreamChunk, handleStreamComplete, handleStreamAbort]);

  const startStreamingMessage = useCallback(async (
    message: string,
    options: StreamingOptions
  ) => {
    if (isStreaming) return;

    try {
      setIsStreaming(true);
      setError(null);
      currentContentRef.current = '';
      currentOptionsRef.current = options;

      options.onStart?.();
      startStreaming();

      const abortController = createAbortController();
      const response = await makeStreamRequest(message, options, abortController);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await handleStreamingResponse(response, options);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Streaming failed');
      
      if (error.name === 'AbortError') {
        console.log('Streaming aborted');
      } else {
        console.error('Streaming error:', error);
        setError(error.message);
        options.onError?.(error);
        clearStreaming();
      }
    } finally {
      setIsStreaming(false);
      currentOptionsRef.current = null;
    }
  }, [
    isStreaming,
    startStreaming,
    createAbortController,
    makeStreamRequest,
    handleStreamingResponse,
    clearStreaming
  ]);

  const stopStreaming = useCallback(() => {
    if (isStreaming) {
      abortStream();
      setIsStreaming(false);
      clearStreaming();
    }
  }, [isStreaming, abortStream, clearStreaming]);

  return {
    isStreaming,
    error,
    startStreaming: startStreamingMessage,
    stopStreaming,
  };
};

// Re-export useTypingEffect from its new location
export { useTypingEffect } from './useTypingEffect';