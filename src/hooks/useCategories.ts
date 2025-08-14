import { useState, useCallback, useEffect, useRef } from 'react';
import { useCategoriesCache } from '@/contexts/CategoriesCacheContext';
import { getCategories } from '@/services/categoriesService';

export interface IMovie {
  id: string;
  title: string;
  year: number;
  duration: number;
  voteAverage: number;
  synopsis: string;
  imagePath: string;
  thumbnail: string;
  genre: string;
}

export interface IGenre {
  id: number;
  value: string;
  label: string;
  movies: IMovie[];
}

export interface IGenreResponse {
  genres: {
    values: IGenre[];
    pageState: string | null;
    hasMore: boolean;
  };
}

export const useCategories = (initialPageSize: number = 4, initialData?: IGenreResponse | null) => {
  const { cachedData, setCachedData, isDataCached, clearCache } = useCategoriesCache();
  
  // Local state management - start with initialData if available
  const [data, setData] = useState<IGenreResponse | null>(initialData || cachedData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(initialData?.genres.hasMore || cachedData?.genres.hasMore || false);
  const [pageState, setPageState] = useState<string | null>(initialData?.genres.pageState || cachedData?.genres.pageState || null);
  
  // Refs to prevent duplicate calls and track initialization
  const loadingRef = useRef(false);
  const initialLoadDone = useRef(!!initialData);

  const fetchCategories = useCallback(async (pageSize: number, currentPageState: string | null = null) => {
    if (loadingRef.current) return;
    
    try {
      loadingRef.current = true;
      setLoading(true);
      setError(null);

      const result = await getCategories(pageSize, currentPageState);
      
      if (!result) {
        throw new Error('Failed to fetch categories from API');
      }
      
      if (currentPageState && data) {
        // Append new data for pagination - concatenate with existing data
        const updatedData = {
          genres: {
            values: [...data.genres.values, ...result.genres.values],
            pageState: result.genres.pageState,
            hasMore: result.genres.hasMore
          }
        };
        
        setData(updatedData);
        setCachedData(updatedData);
      } else {
        // Initial load or refresh - this will replace initialData
        setData(result);
        setCachedData(result);
      }
      
      // Update pagination state
      setPageState(result.genres.pageState);
      setHasMore(result.genres.hasMore);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error in fetchCategories:', err);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [data, setCachedData, initialData]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading || !pageState || loadingRef.current) {
      return;
    }
    
    fetchCategories(initialPageSize, pageState);
  }, [hasMore, loading, pageState, fetchCategories, initialPageSize, data?.genres.values.length]);

  const forceRefresh = useCallback(() => {
    clearCache();
    setData(null);
    setLoading(true);
    setError(null);
    setHasMore(false);
    setPageState(null);
    initialLoadDone.current = false;
    fetchCategories(initialPageSize);
  }, [clearCache, fetchCategories, initialPageSize]);

  const refetch = useCallback(() => {
    fetchCategories(initialPageSize);
  }, [fetchCategories, initialPageSize]);

  // Initial fetch effect - only runs if no initial data and no cached data
  useEffect(() => {
    if (!initialLoadDone.current && !isDataCached && !initialData) {
      initialLoadDone.current = true;
      fetchCategories(initialPageSize);
    }
  }, [fetchCategories, initialPageSize, isDataCached, initialData]);

  // Cache synchronization effect - updates local state when cache changes
  useEffect(() => {
    if (cachedData && !data) {
      setData(cachedData);
      setHasMore(cachedData.genres.hasMore);
      setPageState(cachedData.genres.pageState);
      setLoading(false);
    }
  }, [cachedData, data]);

  return {
    data,
    loading,
    error,
    hasMore,
    pageState,
    loadMore,
    refetch,
    forceRefresh
  };
};

