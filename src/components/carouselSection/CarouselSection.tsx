"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useSuspenseQuery } from "@apollo/client";

import Carousel from "@/components/carousel/Carousel";
import { GET_ALL_GENRES } from "@/lib/apollo/queries";
import { IGenre, IGenreResponse } from "@/types/media";

import "./CarouselSection.styles.css";

function CarouselSection() {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const PAGE_SIZE = 5;

  const { data, fetchMore, error } = useSuspenseQuery<IGenreResponse>(
    GET_ALL_GENRES,
    {
      variables: { pageSize: PAGE_SIZE, pageState: null },
    }
  );

  const loadMoreData = useCallback(async () => {
    if (!hasMore || isLoadingMore) return;

    setIsLoadingMore(true);

    try {
      await fetchMore({
        variables: {
          pageSize: PAGE_SIZE,
          pageState: data?.reference_list.pageState,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          if (!fetchMoreResult.reference_list.pageState) {
            setHasMore(false);
          }
          return {
            reference_list: {
              values: [
                ...prev.reference_list.values,
                ...fetchMoreResult.reference_list.values,
              ],
              pageState: fetchMoreResult.reference_list.pageState,
            },
          };
        },
      });
    } catch (error) {
      console.error("Error loading more categories:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [fetchMore, hasMore, isLoadingMore, data]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          loadMoreData();
        }
      },
      { threshold: 0.5 }
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
        {data &&
          data.reference_list.values.map(
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
