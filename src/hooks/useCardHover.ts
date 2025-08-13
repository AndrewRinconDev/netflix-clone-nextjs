import { useState, useCallback, useRef, useEffect } from 'react';

interface HoverState {
  isVisible: boolean;
  position: { x: number; y: number };
  movieId: string | null;
}

export const useCardHover = () => {
  const [hoverState, setHoverState] = useState<HoverState>({
    isVisible: false,
    position: { x: 0, y: 0 },
    movieId: null,
  });

  const hoverTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const currentCardRef = useRef<HTMLElement | null>(null);

  const calculatePosition = useCallback((cardElement: HTMLElement) => {
    const cardRect = cardElement.getBoundingClientRect();
    
    // Calculate the center position over the card
    const cardWidth = 240; // Original card width
    const hoverWidth = 280; // Hover card width
    
    // Position the hover card centered over the original card
    const x = cardRect.left + (cardWidth / 2) - (hoverWidth / 2);
    const y = cardRect.top - 50; // 50px above the card
    
    // Ensure the hover card doesn't go off-screen
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Adjust horizontal position if it goes off-screen
    let adjustedX = x;
    if (adjustedX < 20) {
      adjustedX = 20;
    } else if (adjustedX + hoverWidth > viewportWidth - 20) {
      adjustedX = viewportWidth - hoverWidth - 20;
    }
    
    // Adjust vertical position if it goes above the viewport
    let adjustedY = y;
    // if (adjustedY < 20) {
    //   adjustedY = cardRect.bottom - 50; // Show below the card instead
    // }
    
    return { x: adjustedX, y: adjustedY };
  }, []);

  const showHover = useCallback((event: React.MouseEvent, movieId: string) => {
    const cardElement = event.currentTarget as HTMLElement;
    currentCardRef.current = cardElement;
    
    // Calculate position immediately
    const position = calculatePosition(cardElement);
    
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Set a delay before showing the hover (500ms for better UX)
    hoverTimeoutRef.current = setTimeout(() => {  
      setHoverState({
        isVisible: true,
        position,
        movieId,
      });
    }, 500);
  }, [calculatePosition, hoverState]);

  const hideHover = useCallback(() => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    setHoverState({
      isVisible: false,
      position: { x: 0, y: 0 },
      movieId: null,
    });
    
    currentCardRef.current = null;
  }, []);

  // Update position on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (hoverState.isVisible && currentCardRef.current) {
        const newPosition = calculatePosition(currentCardRef.current);
        setHoverState(prev => ({
          ...prev,
          position: newPosition,
        }));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hoverState.isVisible, calculatePosition]);

  const handleMouseEnter = useCallback((event: React.MouseEvent, movieId: string) => {
    showHover(event, movieId);
  }, [showHover]);

  const handleMouseLeave = useCallback(() => {
    // Add a small delay before hiding to prevent flickering
    // setTimeout(() => {
      hideHover();
    // }, 100);
  }, [hideHover]);

  return {
    hoverState,
    handleMouseEnter,
    handleMouseLeave,
  };
}; 