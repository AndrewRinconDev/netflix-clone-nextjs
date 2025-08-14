"use client";
import React, { useCallback, useEffect, useRef, useMemo } from "react";

import Carousel from "@/components/carousel/Carousel";
import CardHover from "@/components/card/CardHover";
import { useCategories, IGenre, IGenreResponse } from "@/hooks/useCategories";
import { useHoverContext } from "@/contexts/HoverContext";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";

import "./CarouselSection.styles.css";

interface CarouselSectionProps {
  initialData?: IGenreResponse | null;
}

function CarouselSection({ initialData }: CarouselSectionProps) {
  const pageSize = 4;
  
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { hoverState, hideHover } = useHoverContext();

  // Categories data management with initial data support
  const { data, loading, error, hasMore, pageState, loadMore } = useCategories(pageSize, initialData);

  // Determine which data to display - prioritize hook data over initialData when available
  // Use useMemo to prevent unnecessary re-renders
  const displayData = useMemo(() => {
    return data || initialData;
  }, [data, initialData]);
  
  const isLoading = !displayData && loading;

  const loadMoreData = useCallback(async () => {
    if (!hasMore || loading) {
      return;
    }
    loadMore();
  }, [hasMore, loading, loadMore, pageState]);

  // Memoize the intersection observer callback
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    
    if (entry.isIntersecting && !loading && hasMore && pageState) {
      loadMoreData();
    }
  }, [loading, hasMore, pageState, loadMoreData]);

  // Memoize the intersection observer options
  const observerOptions = useMemo(() => ({
    threshold: 0.1, // Trigger when 10% of element is visible
    rootMargin: "300px 0px", // Start loading 300px before reaching the loader
  }), []);

  // Set up and manage the intersection observer for lazy loading
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(handleIntersection, observerOptions);

    // Solo observar si hay más datos para cargar y no está cargando
    if (loaderRef.current && hasMore && !loading && pageState) {
      observerRef.current.observe(loaderRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, observerOptions, hasMore, pageState, loading]);

  // Memoize the loader element for infinite scroll
  const loaderElement = useMemo(() => {
    // Solo mostrar el loader si hay más datos y no está cargando
    return !loading && hasMore && pageState ? (
      <div
        ref={loaderRef}
        className="flex justify-center py-8 min-h-20"
      >
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <p>Loading more categories...</p>
        </div>
      </div>
    ) : null;
  }, [loading, hasMore, pageState]);

  // Memoize the carousel content to prevent unnecessary re-renders
  const carouselContent = useMemo(() => (
    <div className="more-cards">
      {displayData?.genres.values.map((genre: IGenre, index: number) => (
        <Carousel
          key={`${genre.value}-carousel-${index + 1}`}
          category={genre.value}
          movies={genre.movies}
        />
      ))}
    </div>
  ), [displayData?.genres.values]);

  // Loading state - shows spinner when no data available and currently loading
  if (isLoading) {
    return <LoadingSpinner width={100} height={100} />;
  }

  // Error state - shows user-friendly error message with retry option
  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="retry-button"
            aria-label="Retry loading categories"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state - shows when no categories are available
  if (!displayData || !displayData.genres.values.length) {
    return (
      <div className="empty-state">
        <h3>No categories available</h3>
        <p>Please try refreshing the page</p>
      </div>
    );
  }

  return (
    <>
      {/* Main carousel content */}
      {carouselContent}
      
      {/* Infinite scroll loader */}
      {loaderElement}
      
      {/* Global hover card for movie details */}
      {hoverState.movie && (
        <CardHover
          movie={hoverState.movie}
          isVisible={hoverState.isVisible}
          position={hoverState.position}
          onMouseLeave={hideHover}
        />
      )}
    </>
  );
}

export default CarouselSection;
