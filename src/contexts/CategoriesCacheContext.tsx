import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { IGenreResponse } from '@/hooks/useCategories';

interface CategoriesCacheContextType {
  cachedData: IGenreResponse | null;
  setCachedData: (data: IGenreResponse | null) => void;
  isDataCached: boolean;
  clearCache: () => void;
  updateCache: (updater: (prev: IGenreResponse | null) => IGenreResponse | null) => void;
}

const CategoriesCacheContext = createContext<CategoriesCacheContextType | undefined>(undefined);

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
