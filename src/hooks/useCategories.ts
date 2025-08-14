import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
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
      
      if (currentPageState) {
        // Append new data for pagination
        const updatedData = {
          genres: {
            values: [...(data?.genres.values || []), ...result.genres.values],
            pageState: result.genres.pageState,
            hasMore: result.genres.hasMore
          }
        };
        
        setData(updatedData);
        setCachedData(updatedData);
      } else {
        // Initial load
        setData(result);
        setCachedData(result);
      }
      
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
  }, [data?.genres.values, setCachedData]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading || !pageState || loadingRef.current) return;
    fetchCategories(initialPageSize, pageState);
  }, [hasMore, loading, pageState, fetchCategories, initialPageSize]);

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

  /**
   * Refetches the current page of categories
   * Useful for refreshing data without clearing cache
   */
  const refetch = useCallback(() => {
    fetchCategories(initialPageSize);
  }, [fetchCategories, initialPageSize]);

  // Memoized values for performance optimization
  const memoizedData = useMemo(() => data, [data]);
  const memoizedHasMore = useMemo(() => hasMore, [hasMore]);
  const memoizedPageState = useMemo(() => pageState, [pageState]);

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

  // Cleanup effect - preserves cache between component unmounts
  useEffect(() => {
    return () => {
      // Keep the cache when component unmounts to preserve data between navigations
      // The cache will be cleared only when explicitly called or when the app is refreshed
    };
  }, []);

  return {
    data: memoizedData,
    loading,
    error,
    hasMore: memoizedHasMore,
    pageState: memoizedPageState,
    loadMore,
    refetch,
    forceRefresh
  };
};

