'use client';
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { IMovie } from '@/types/media';

interface HoverState {
  isVisible: boolean;
  position: { x: number; y: number };
  movie: IMovie | null;
}

interface HoverContextType {
  hoverState: HoverState;
  showHover: (event: React.MouseEvent, movie: IMovie) => void;
  hideHover: () => void;
}

const HoverContext = createContext<HoverContextType | undefined>(undefined);

export const useHoverContext = () => {
  const context = useContext(HoverContext);
  if (!context) {
    throw new Error('useHoverContext must be used within a HoverProvider');
  }
  return context;
};

export const HoverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hoverState, setHoverState] = useState<HoverState>({
    isVisible: false,
    position: { x: 0, y: 0 },
    movie: null,
  });

  const hoverTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const currentCardRef = useRef<HTMLElement | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

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
    
    // Adjust horizontal position if it goes off-screen
    let adjustedX = x;
    if (adjustedX < 20) {
      adjustedX = 20;
    } else if (adjustedX + hoverWidth > viewportWidth - 20) {
      adjustedX = viewportWidth - hoverWidth - 20;
    }
    
    return { x: adjustedX, y };
  }, []);

  const showHover = useCallback((event: React.MouseEvent, movie: IMovie) => {
    const cardElement = event.currentTarget as HTMLElement;
    currentCardRef.current = cardElement;
    
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
    
    // Set a delay before showing the hover (300ms for better UX)
    hoverTimeoutRef.current = setTimeout(() => {
      setHoverState({
        isVisible: true,
        position,
        movie,
      });
    }, 300);
  }, [calculatePosition]);

  const hideHover = useCallback(() => {
    // Clear any existing show timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Clear any existing hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    
    // Set a delay before hiding to prevent flickering
    hideTimeoutRef.current = setTimeout(() => {
      setHoverState({
        isVisible: false,
        position: { x: 0, y: 0 },
        movie: null,
      });
      currentCardRef.current = null;
    }, 150);
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

  const contextValue: HoverContextType = {
    hoverState,
    showHover,
    hideHover,
  };

  return (
    <HoverContext.Provider value={contextValue}>
      {children}
    </HoverContext.Provider>
  );
}; 