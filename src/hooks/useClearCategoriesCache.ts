import { useCallback } from 'react';
import { useCategoriesCache } from '@/contexts/CategoriesCacheContext';

/**
 * Hook to clear the categories cache
 * @returns Object with clearCategoriesCache function
 */
export const useClearCategoriesCache = () => {
  const { clearCache } = useCategoriesCache();

  const clearCategoriesCache = useCallback(() => {
    clearCache();
  }, [clearCache]);

  return { clearCategoriesCache };
};
