"use client";
import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useSuspenseQuery } from "@apollo/client";

import Carousel from "@/components/carousel/Carousel";
import { GET_ALL_GENRES } from "@/lib/gql/queries";
import { IGenre, IGenreResponse } from "@/types/media";

import "./CarouselSection.styles.css";

function CarouselSection({ initialData }: { initialData: IGenreResponse }) {
  const TOTAL_RESULTS = 15;
  const [items, setItems] = useState(initialData.genres.values);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState<boolean | null>(initialData.genres.values.length < TOTAL_RESULTS);
  const [pageState, setPageState] = useState<string | null>(initialData.genres.pageState);
  const pageSize = 4;
  
  const loaderRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const { fetchMore } = useSuspenseQuery<IGenreResponse>(GET_ALL_GENRES, {
    variables: { pageSize, pageState },
    skip: true,
  });

  const loadMoreData = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);

    try {
      const { data } = await fetchMore({
        variables: { pageSize, pageState },
      });

      if (!data) return;

      const newItems = [...items, ...data.genres.values];
      const newHasMore = !!data.genres.pageState && newItems.length < TOTAL_RESULTS;

      setItems(newItems);
      setHasMore(newHasMore);
      setPageState(data.genres.pageState);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error loading more categories:", error);
    }
  }, [hasMore, isLoading, items, pageState, pageSize, fetchMore]);

  // Memoize the intersection observer callback
  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && !isLoading && hasMore) {
      loadMoreData();
    }
  }, [isLoading, hasMore, loadMoreData]);

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

  // Memoize the filtered items to avoid unnecessary re-renders
  const filteredItems = useMemo(() => 
    items.filter((_, index) => index > 0),
    [items]
  );

  // Memoize the loader element
  const loaderElement = useMemo(() => 
    !isLoading && hasMore ? (
      <div
        ref={loaderRef}
        className="flex justify-center py-8 min-h-20"
      />
    ) : null,
    [isLoading, hasMore]
  );

  return (
    <>
      <div className="more-cards">
        {filteredItems.map((genre: IGenre, index: number) => (
          <Carousel
            key={`${genre.value}-carousel-${index + 1}`}
            category={genre.value}
          />
        ))}
      </div>
      {loaderElement}
    </>
  );
}

export default CarouselSection;
