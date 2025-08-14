import { useState, useCallback, useEffect } from 'react';

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

export const useCategories = (initialPageSize: number = 4) => {
  const [data, setData] = useState<IGenreResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [pageState, setPageState] = useState<string | null>(null);

  const fetchCategories = useCallback(async (pageSize: number, currentPageState: string | null = null) => {
    try {
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
        setData(prev => prev ? {
          genres: {
            values: [...prev.genres.values, ...result.genres.values],
            pageState: result.genres.pageState,
            hasMore: result.genres.hasMore
          }
        } : result);
      } else {
        // Initial load
        setData(result);
      }
      
      setPageState(result.genres.pageState);
      setHasMore(result.genres.hasMore);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (!hasMore || loading || !pageState) return;
    fetchCategories(initialPageSize, pageState);
  }, [hasMore, loading, pageState, fetchCategories, initialPageSize]);

  // Initial fetch
  useEffect(() => {
    fetchCategories(initialPageSize);
  }, [fetchCategories, initialPageSize]);

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    refetch: () => fetchCategories(initialPageSize)
  };
};

