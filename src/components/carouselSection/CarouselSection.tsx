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

  // Use initialData if available, otherwise use data from the hook
  const { data, loading, error, hasMore, loadMore } = useCategories(pageSize, initialData);

  const displayData = initialData || data;
  const isLoading = !initialData && loading;

  const loadMoreData = useCallback(async () => {
    if (!hasMore || loading) return;
    loadMore();
  }, [hasMore, loading, loadMore]);

  // Memoize the intersection observer callback
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && !loading && hasMore) {
      loadMoreData();
    }
  }, [loading, hasMore, loadMoreData]);

  // Memoize the intersection observer options
  const observerOptions = useMemo(() => ({
    threshold: 0.1, // Trigger earlier for better UX
    rootMargin: "300px 0px", // Start loading 300px before reaching the loader
  }), []);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(handleIntersection, observerOptions);

    if (loaderRef.current && hasMore) {
      observerRef.current.observe(loaderRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, observerOptions, hasMore]);

  // Memoize the loader element
  const loaderElement = useMemo(() => 
    !loading && hasMore ? (
      <div
        ref={loaderRef}
        className="flex justify-center py-8 min-h-20"
      >
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <p>Loading more categories...</p>
        </div>
      </div>
    ) : null,
    [loading, hasMore]
  );

  // Si no hay datos iniciales y está cargando, mostrar loading
  if (isLoading && !displayData) {
    return <LoadingSpinner width={100} height={100} />;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="retry-button"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
      <div className="more-cards">
        {displayData?.genres.values.map((genre: IGenre, index: number) => (
          <Carousel
            key={`${genre.value}-carousel-${index + 1}`}
            category={genre.value}
            movies={genre.movies}
          />
        ))}
      </div>
      
      {loaderElement}
      
      {/* Global Hover Card */}
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
