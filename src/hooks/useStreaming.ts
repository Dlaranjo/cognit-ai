import { useState, useCallback, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import {
  setStreamingMessage,
  addMessage,
  replaceLastAssistantMessage,
  clearStreamingMessage,
} from '../redux/chat/chatReducer';
import { selectCurrentConversation } from '../redux/chat/chatSelectors';
import { config } from '../shared/config';

// Hook para efeito de digitação
export const useTypingEffect = (text: string, speed: number = 30) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const currentIndexRef = useRef(0);
  const isTypingRef = useRef(false);

  useEffect(() => {
    if (!text) {
      setDisplayedText('');
      setIsTyping(false);
      currentIndexRef.current = 0;
      isTypingRef.current = false;
      return;
    }

    // Se o texto mudou e é diferente do que estamos exibindo
    if (text !== displayedText && !isTypingRef.current) {
      setIsTyping(true);
      isTypingRef.current = true;

      const typeNextCharacter = () => {
        if (currentIndexRef.current < text.length) {
          const nextText = text.slice(0, currentIndexRef.current + 1);
          setDisplayedText(nextText);
          currentIndexRef.current += 1;

          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          timeoutRef.current = setTimeout(typeNextCharacter, speed);
        } else {
          setIsTyping(false);
          isTypingRef.current = false;
          // Garantir que o texto completo seja exibido
          setDisplayedText(text);
        }
      };

      // Se o novo texto é uma extensão do atual, continue de onde parou
      if (text.startsWith(displayedText) && displayedText.length > 0) {
        currentIndexRef.current = displayedText.length;
      } else {
        // Se o texto mudou completamente, reinicie
        currentIndexRef.current = 0;
        setDisplayedText('');
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(typeNextCharacter, speed);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, speed, displayedText]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      isTypingRef.current = false;
    };
  }, []);

  return { displayedText, isTyping };
};

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
            if (jsonResponse.isStreaming) {
              // Simulate streaming by updating the streaming message progressively
              const content = jsonResponse.content;
              let currentIndex = 0;

              const streamCharacters = () => {
                if (currentIndex < content.length) {
                  // Stream in chunks of 2-3 characters for better performance with Markdown
                  const chunkSize = Math.floor(Math.random() * 2) + 2; // 2-3 characters
                  const nextIndex = Math.min(currentIndex + chunkSize, content.length);
                  const partialContent = content.slice(0, nextIndex);
                  dispatch(setStreamingMessage(partialContent));
                  currentIndex = nextIndex;

                  // Fast typing speed - 7ms per chunk
                  setTimeout(streamCharacters, 7);
                } else {
                  // Streaming complete
                  dispatch(clearStreamingMessage());

                  const messageData = {
                    id: Date.now().toString(),
                    content: content,
                    role: 'assistant' as const,
                    timestamp: new Date().toISOString(),
                    model: options.model,
                    provider: options.provider,
                    conversationId: currentConversation?.id,
                  };

                  if (options.isRegeneration) {
                    dispatch(replaceLastAssistantMessage(messageData));
                  } else {
                    dispatch(addMessage(messageData));
                  }

                  options.onComplete?.(content);
                }
              };

              // Start streaming simulation
              streamCharacters();
            } else {
              // Regular response without streaming
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

                const messageData = {
                  id: Date.now().toString(),
                  content: fullMessage,
                  role: 'assistant' as const,
                  timestamp: new Date().toISOString(),
                  model: options.model,
                  provider: options.provider,
                  conversationId: currentConversation?.id,
                };

                if (options.isRegeneration) {
                  dispatch(replaceLastAssistantMessage(messageData));
                } else {
                  dispatch(addMessage(messageData));
                }

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
