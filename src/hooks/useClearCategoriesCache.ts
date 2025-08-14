import { useCallback } from 'react';
import { useCategoriesCache } from '@/contexts/CategoriesCacheContext';

export const useClearCategoriesCache = () => {
  const { clearCache } = useCategoriesCache();

  const clearCategoriesCache = useCallback(() => {
    clearCache();
  }, [clearCache]);

  return { clearCategoriesCache };
};
