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
    const rect = event.currentTarget.getBoundingClientRect();
    const cardWidth = 320; // Width of hover card
    const cardHeight = 400; // Approximate height of hover card
    
    // Calculate position to center the hover card over the original card
    let x = rect.left + (rect.width / 2) - (cardWidth / 2);
    let y = rect.top - cardHeight - 20; // 20px above the card
    
    // Ensure the hover card doesn't go off-screen
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Adjust horizontal position if it goes off-screen
    if (x < 20) {
      x = 20;
    } else if (x + cardWidth > viewportWidth - 20) {
      x = viewportWidth - cardWidth - 20;
    }
    
    // Adjust vertical position if it goes above the viewport
    if (y < 20) {
      y = rect.bottom + 20; // Show below the card instead
    }
    
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Set a small delay to prevent flickering
    hoverTimeoutRef.current = setTimeout(() => {
      setHoverState({
        isVisible: true,
        position: { x, y },
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