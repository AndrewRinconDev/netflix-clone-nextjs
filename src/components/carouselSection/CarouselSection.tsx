"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSuspenseQuery } from "@apollo/client";

import Carousel from "@/components/carousel/Carousel";
import { GET_ALL_GENRES } from "@/lib/apollo/queries";
import { IGenre, IGenreResponse } from "@/types/media";

import "./CarouselSection.styles.css";

interface ICarouselSectionProps {
  currentLimit: number;
  setCurrentLimit: React.Dispatch<React.SetStateAction<number>>;
}
function CarouselSection({currentLimit, setCurrentLimit}: ICarouselSectionProps) {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const totalRecords = 15;

  const { data, fetchMore, error } = useSuspenseQuery<IGenreResponse>(
    GET_ALL_GENRES,
    {
      variables: { limit: 4 },
    }
  );

  const loadMoreData = useCallback(async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);

    try {
      const newLimit = currentLimit + 4;

      await fetchMore({
        variables: { limit: newLimit },
        updateQuery: (prev, { fetchMoreResult }) => {
          return fetchMoreResult || prev;
        },
      });

      setCurrentLimit(newLimit);

    } catch (error) {
      console.error("Error loading more categories:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentLimit, fetchMore, hasMore]);

  useEffect(() => {
    if (
      data?.reference_list.values &&
      data.reference_list.values.length >= totalRecords
    ) {
      setHasMore(false);
    }
  }, [data]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          loadMoreData();
        }
      },
      { threshold: 0.1 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader && hasMore) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [loadMoreData, hasMore, isLoadingMore]);

  if (error) return <div>Error loading categories</div>;

  return (
    <>
      <div className="more-cards">
        {data.reference_list.values.map(
          (genre: IGenre, index: number) =>
            index > 0 && (
              <Carousel
                key={`${genre.value}-carousel`}
                category={genre.value}
              />
            )
        )}
      </div>
      <div ref={loaderRef} className="flex justify-center py-8 min-h-20">
        {isLoadingMore && (
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        )}
      </div>
    </>
  );
}

export default CarouselSection;
