"use client";
import React, { useCallback, useEffect, useRef, useMemo } from "react";

import Carousel from "@/components/carousel/Carousel";
import CardHover from "@/components/card/CardHover";
import { useCategories, IGenre } from "@/hooks/useCategories";
import { useHoverContext } from "@/contexts/HoverContext";

import "./CarouselSection.styles.css";

function CarouselSection() {
  const pageSize = 4;
  
  const loaderRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { hoverState, hideHover } = useHoverContext();

  const { data, loading, error, hasMore, loadMore } = useCategories(pageSize);

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
    threshold: 0.5,
    rootMargin: "400px 0px",
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
      />
    ) : null,
    [loading, hasMore]
  );

  if (loading && !data) {
    return <div className="flex justify-center py-8">Loading categories...</div>;
  }

  if (error) {
    return <div className="flex justify-center py-8 text-red-500">Error: {error}</div>;
  }

  if (!data || !data.genres.values.length) {
    return <div className="flex justify-center py-8">No categories available</div>;
  }

  return (
    <>
      <div className="more-cards">
        {data?.genres.values.map((genre: IGenre, index: number) => (
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
