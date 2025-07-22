import { useState, useRef, useEffect } from 'react';

export const useTypingEffect = (text: string, speed: number = 7) => {
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