import { useState, useCallback, useEffect, useRef } from 'react';
import { useCategoriesCache } from '@/contexts/CategoriesCacheContext';

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
  
  // local state
  const [data, setData] = useState<IGenreResponse | null>(initialData || cachedData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(initialData?.genres.hasMore || cachedData?.genres.hasMore || false);
  const [pageState, setPageState] = useState<string | null>(initialData?.genres.pageState || cachedData?.genres.pageState || null);
  
  // Ref to avoid duplicate calls
  const loadingRef = useRef(false);
  const initialLoadDone = useRef(!!initialData);

  const fetchCategories = useCallback(async (pageSize: number, currentPageState: string | null = null) => {
    if (loadingRef.current) return;
    
    try {
      loadingRef.current = true;
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        pageSize: pageSize.toString(),
        ...(currentPageState && { pageState: currentPageState })
      });

      const response = await fetch(`/api/categories?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: IGenreResponse = await response.json();
      
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
      setError(err instanceof Error ? err.message : 'An error occurred');
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

  // Initial fetch only if no initial data and no cached data
  useEffect(() => {
    if (!initialLoadDone.current && !isDataCached && !initialData) {
      initialLoadDone.current = true;
      fetchCategories(initialPageSize);
    }
  }, [fetchCategories, initialPageSize, isDataCached, initialData]);

  // Update local state when cache changes
  useEffect(() => {
    if (cachedData && !data) {
      setData(cachedData);
      setHasMore(cachedData.genres.hasMore);
      setPageState(cachedData.genres.pageState);
      setLoading(false);
    }
  }, [cachedData, data]);

  // Cleanup effect - don't clear cache on unmount to preserve data between navigations
  useEffect(() => {
    return () => {
      // Keep the cache when component unmounts to preserve data between navigations
      // The cache will be cleared only when explicitly called or when the app is refreshed
    };
  }, []);

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    refetch: () => fetchCategories(initialPageSize),
    forceRefresh
  };
};

