import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { IGenreResponse } from '@/hooks/useCategories';

/**
 * Context interface for categories cache management
 */
interface CategoriesCacheContextType {
  cachedData: IGenreResponse | null;
  setCachedData: (data: IGenreResponse | null) => void;
  isDataCached: boolean;
  clearCache: () => void;
  updateCache: (updater: (prev: IGenreResponse | null) => IGenreResponse | null) => void;
}

const CategoriesCacheContext = createContext<CategoriesCacheContextType | undefined>(undefined);

/**
 * Hook to use the categories cache context
 * @returns CategoriesCacheContextType
 * @throws Error if used outside of CategoriesCacheProvider
 */
export const useCategoriesCache = () => {
  const context = useContext(CategoriesCacheContext);
  if (context === undefined) {
    throw new Error('useCategoriesCache must be used within a CategoriesCacheProvider');
  }
  return context;
};

interface CategoriesCacheProviderProps {
  children: ReactNode;
}

/**
 * Provider component for categories cache context
 * Manages global state for cached categories data
 */
export const CategoriesCacheProvider: React.FC<CategoriesCacheProviderProps> = ({ children }) => {
  const [cachedData, setCachedData] = useState<IGenreResponse | null>(null);

  const updateCache = useCallback((updater: (prev: IGenreResponse | null) => IGenreResponse | null) => {
    setCachedData(updater);
  }, []);

  const clearCache = useCallback(() => {
    setCachedData(null);
  }, []);

  const value: CategoriesCacheContextType = {
    cachedData,
    setCachedData,
    isDataCached: !!cachedData,
    clearCache,
    updateCache,
  };

  return (
    <CategoriesCacheContext.Provider value={value}>
      {children}
    </CategoriesCacheContext.Provider>
  );
};
