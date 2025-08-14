'use client';
import React, { createContext, useContext } from 'react';

import { IMovie } from '@/types/media';
import { useCardHover } from '@/hooks/useCardHover';

interface HoverState {
  isVisible: boolean;
  position: { x: number; y: number };
  movie: IMovie | null;
}

interface HoverContextType {
  hoverState: HoverState;
  showHover: (event: React.MouseEvent, movie: IMovie) => void;
  hideHover: () => void;
  forceHideHover: () => void;
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
  const { hoverState, showHover, hideHover, forceHideHover } = useCardHover()

  return (
    <HoverContext.Provider value={{ hoverState, showHover, hideHover, forceHideHover }}>
      {children}
    </HoverContext.Provider>
  );
}; 