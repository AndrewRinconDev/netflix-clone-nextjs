import { useState, useCallback, useRef, useEffect } from 'react';

import { IMovie } from '@/types/media';

interface HoverState {
  isVisible: boolean;
  position: { x: number; y: number };
  movie: IMovie | null;
}

export const useCardHover = () => {
  const [hoverState, setHoverState] = useState<HoverState>({
    isVisible: false,
    position: { x: 0, y: 0 },
    movie: null,
  });

  const hoverTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const currentCardRef = useRef<HTMLElement | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastHoverTimeRef = useRef<number>(0);
  const isMouseOverCardRef = useRef<boolean>(false);
  const lastMovieIdRef = useRef<string | null>(null);
  const isTransitioningRef = useRef<boolean>(false);

  const calculatePosition = useCallback((cardElement: HTMLElement) => {
    const cardRect = cardElement.getBoundingClientRect();
    
    // Card dimensions
    const cardWidth = 240; // Original card width
    const hoverWidth = 280; // Hover card width
    
    // Position the hover card centered over the original card
    let x = cardRect.left + (cardWidth / 2) - (hoverWidth / 2);
    const y = cardRect.top - 50; // 50px above the card
    
    // Ensure the hover card doesn't go off-screen
    const viewportWidth = window.innerWidth;
    
    // Adjust horizontal position if it goes off-screen
    if (x < 20) {
      x = 20;
    } else if (x + hoverWidth > viewportWidth - 20) {
      x = viewportWidth - hoverWidth - 20;
    }
    
    
    return { x: Math.round(x), y: Math.round(y) };
  }, []);

  const showHover = useCallback((event: React.MouseEvent, movie: IMovie) => {
    const cardElement = event.currentTarget as HTMLElement;
    const currentTime = Date.now();
    
    // If it's the same movie, just update position (no debounce needed)
    if (lastMovieIdRef.current === movie.id) {
      const position = calculatePosition(cardElement);
      setHoverState(prev => ({
        ...prev,
        position,
      }));
      return;
    }
    
    // For different movies, use a shorter debounce (30ms instead of 50ms)
    if (currentTime - lastHoverTimeRef.current < 30) {
      return;
    }
    
    // Mark that we're transitioning between cards
    isTransitioningRef.current = true;
    
    // Update current card reference
    currentCardRef.current = cardElement;
    isMouseOverCardRef.current = true;
    lastHoverTimeRef.current = currentTime;
    lastMovieIdRef.current = movie.id;
    
    // Clear any existing hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = undefined;
    }
    
    // Calculate position immediately
    const position = calculatePosition(cardElement);
    
    // Clear any existing show timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Set a very short delay before showing the hover (100ms for better responsiveness)
    hoverTimeoutRef.current = setTimeout(() => {
      // Double-check that mouse is still over the card
      if (isMouseOverCardRef.current && currentCardRef.current === cardElement) {
        setHoverState({
          isVisible: true,
          position,
          movie,
        });
        // Reset transition flag after showing
        isTransitioningRef.current = false;
      }
    }, 100);
  }, [calculatePosition]);

  const hideHover = useCallback(() => {
    // If we're transitioning between cards, don't hide immediately
    if (isTransitioningRef.current) {
      return;
    }
    
    isMouseOverCardRef.current = false;
    
    // Clear any existing show timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = undefined;
    }
    
    // Clear any existing hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    
    // Set a delay before hiding to prevent flickering
    hideTimeoutRef.current = setTimeout(() => {
      // Only hide if mouse is still not over any card
      if (!isMouseOverCardRef.current) {
        setHoverState(prev => ({
          ...prev,
          isVisible: false,
          movie: null,
        }));
        currentCardRef.current = null;
        lastMovieIdRef.current = null;
        isTransitioningRef.current = false;
      }
    }, 80);
  }, []);

  // Enhanced hide function for immediate hiding (e.g., on scroll)
  const forceHideHover = useCallback(() => {
    isMouseOverCardRef.current = false;
    isTransitioningRef.current = false;
    
    // Clear all timeouts
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = undefined;
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = undefined;
    }
    
    // Hide immediately
    setHoverState(prev => ({
      ...prev,
      isVisible: false,
      movie: null,
    }));
    currentCardRef.current = null;
    lastMovieIdRef.current = null;
  }, []);

  // Reset hover state when navigating away (e.g., to detail page)
  const resetHoverState = useCallback(() => {
    isMouseOverCardRef.current = false;
    isTransitioningRef.current = false;
    
    // Clear all timeouts
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = undefined;
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = undefined;
    }
    
    // Reset state completely
    setHoverState({
      isVisible: false,
      position: { x: 0, y: 0 },
      movie: null,
    });
    currentCardRef.current = null;
    lastMovieIdRef.current = null;
  }, []);

  // Update position on scroll and resize
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

    const handleResize = () => {
      if (hoverState.isVisible && currentCardRef.current) {
        const newPosition = calculatePosition(currentCardRef.current);
        setHoverState(prev => ({
          ...prev,
          position: newPosition,
        }));
      }
    };

    // Handle page visibility changes (when returning from detail page)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden (navigating away), reset hover state
        resetHoverState();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [hoverState.isVisible, calculatePosition, resetHoverState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  return {
    hoverState,
    showHover,
    hideHover,
    forceHideHover,
    resetHoverState,
  };
}; 