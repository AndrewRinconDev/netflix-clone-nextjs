import { useState, useCallback, useRef } from 'react';

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

  const showHover = useCallback((event: React.MouseEvent, movieId: string) => {
    const cardRect = event.currentTarget.getBoundingClientRect();
    
    // Use fixed positioning relative to the viewport
    // Calculate the center position over the card
    const cardWidth = 240; // Original card width
    const hoverWidth = 280; // Hover card width
    const offsetX = (hoverWidth - cardWidth) / 2;
    
    // Position the hover card centered over the original card
    const x = cardRect.left + (cardWidth / 2) - (hoverWidth / 2);
    const y = cardRect.top - 50; // 20px above the card
    
    console.log('Card position:', {
      cardLeft: cardRect.left,
      cardTop: cardRect.top,
      cardWidth,
      hoverWidth,
      calculatedX: x,
      calculatedY: y
    });
    
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
    if (adjustedY < 20) {
      adjustedY = cardRect.bottom - 50; // Show below the card instead
    }
    
    console.log('Final position:', {
      adjustedX,
      adjustedY,
      viewportWidth,
      viewportHeight
    });
    
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Set a small delay to prevent flickering
    hoverTimeoutRef.current = setTimeout(() => {
      setHoverState({
        isVisible: true,
        position: { x: adjustedX, y: adjustedY },
        movieId,
      });
    }, 300);
  }, []);

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
  }, []);

  const handleMouseEnter = useCallback((event: React.MouseEvent, movieId: string) => {
    showHover(event, movieId);
  }, [showHover]);

  const handleMouseLeave = useCallback(() => {
    hideHover();
  }, [hideHover]);

  return {
    hoverState,
    handleMouseEnter,
    handleMouseLeave,
  };
}; 