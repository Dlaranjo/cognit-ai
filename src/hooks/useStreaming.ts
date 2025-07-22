import { useState, useCallback, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import {
  setStreamingMessage,
  addMessage,
  clearStreamingMessage,
} from '../redux/chat/chatReducer';
import { selectCurrentConversation } from '../redux/chat/chatSelectors';
import { config } from '../shared/config';

interface StreamingOptions {
  model: string;
  provider: string;
  onStart?: () => void;
  onComplete?: (message: string) => void;
  onError?: (error: Error) => void;
}

export const useStreaming = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const dispatch = useAppDispatch();
  const currentConversation = useAppSelector(selectCurrentConversation);

  const startStreaming = useCallback(
    async (message: string, options: StreamingOptions) => {
      if (isStreaming) {
        console.warn('Streaming already in progress');
        return;
      }

      try {
        setIsStreaming(true);
        setError(null);
        dispatch(clearStreamingMessage());

        // Create new AbortController for this request
        abortControllerRef.current = new AbortController();

        options.onStart?.();

        console.log('🚀 Starting streaming request:', {
          url: `${config.API_BASE_URL}/api/chat/stream`,
          message,
          model: options.model,
          provider: options.provider,
          conversationId: currentConversation?.id,
        });

        const response = await fetch(`${config.API_BASE_URL}/api/chat/stream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            message,
            model: options.model,
            provider: options.provider,
            conversationId: currentConversation?.id,
          }),
          signal: abortControllerRef.current.signal,
        });

        console.log('📡 Response received:', {
          ok: response.ok,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Check if this is a streaming response or a regular JSON response
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
          // Handle regular JSON response (for mock server)
          const jsonResponse = await response.json();

          if (jsonResponse.content) {
            // Simulate streaming by adding the message directly
            dispatch(clearStreamingMessage());
            dispatch(
              addMessage({
                id: Date.now().toString(),
                content: jsonResponse.content,
                role: 'assistant',
                timestamp: new Date().toISOString(),
                model: options.model,
                provider: options.provider,
                conversationId: currentConversation?.id,
              })
            );
            options.onComplete?.(jsonResponse.content);
          }
          return;
        }

        if (!response.body) {
          throw new Error('No response body');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullMessage = '';

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.trim() === '') continue;

            if (line.startsWith('data: ')) {
              const data = line.slice(6);

              if (data === '[DONE]') {
                // Streaming complete
                dispatch(clearStreamingMessage());
                dispatch(
                  addMessage({
                    id: Date.now().toString(),
                    content: fullMessage,
                    role: 'assistant',
                    timestamp: new Date().toISOString(),
                    model: options.model,
                    provider: options.provider,
                  })
                );
                options.onComplete?.(fullMessage);
                return;
              }

              try {
                const parsed = JSON.parse(data);

                if (parsed.content) {
                  fullMessage += parsed.content;
                  dispatch(setStreamingMessage(fullMessage));
                }

                if (parsed.error) {
                  throw new Error(parsed.error);
                }
              } catch (parseError) {
                // Skip invalid JSON lines
                console.warn('Failed to parse streaming data:', parseError);
              }
            }
          }
        }
      } catch (error) {
        console.error('🔴 Streaming error caught:', error);
        console.error('🔴 Error details:', {
          name: error instanceof Error ? error.name : 'Unknown',
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });

        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            console.log('🛑 Streaming aborted by user');
            // Handle abortion gracefully
          } else {
            console.error('💥 Streaming error:', error);
            setError(error.message);
            options.onError?.(error);
          }
        }
      } finally {
        setIsStreaming(false);
        dispatch(clearStreamingMessage());
        abortControllerRef.current = null;
      }
    },
    [isStreaming, dispatch, currentConversation]
  );

  const stopStreaming = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    dispatch(clearStreamingMessage());
  }, [dispatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    isStreaming,
    error,
    startStreaming,
    stopStreaming,
  };
};
