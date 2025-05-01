"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSuspenseQuery } from "@apollo/client";

import Carousel from "@/components/carousel/Carousel";
import { GET_ALL_GENRES } from "@/lib/gql/queries";
import { IGenre, IGenreResponse } from "@/types/media";

import "./CarouselSection.styles.css";

function CarouselSection({ initialData }: { initialData: IGenreResponse }) {
  const [dataState, setDataState] = useState({
    items: initialData.reference_list.values,
    isLoading: false,
    hasMore: true,
    pageState: initialData.reference_list.pageState,
    pageSize: 4,
  });
  const TOTAL_RESULTS = 15;
  const loaderRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);


  const { fetchMore } = useSuspenseQuery<IGenreResponse>(GET_ALL_GENRES, {
    variables: { pageSize: dataState.pageSize, pageState: dataState.pageState },
    skip: true,
  });

  const loadMoreData = useCallback(async () => {
    if (!dataState.hasMore || dataState.isLoading) return;

    setDataState((prev) => ({ ...prev, loading: true }));

    try {
      const { data } = await fetchMore({
        variables: {
          pageSize: dataState.pageSize,
          pageState: dataState.pageState,
        },
      });

      if (!data) return;

      setDataState((prev) => ({
        items: [...prev.items, ...data.reference_list.values],
        isLoading: false,
        hasMore:
          (data.reference_list.pageState &&
          [...prev.items, ...data.reference_list.values].length < TOTAL_RESULTS) || false,
        pageState: data.reference_list.pageState,
        pageSize: prev.pageSize,
      }));
    } catch (error) {
      setDataState((prev) => ({ ...prev, loading: false }));
      console.error("Error loading more categories:", error);
    }
  }, [
    dataState.pageSize,
    dataState.pageState,
    dataState.hasMore,
    dataState.isLoading,
    fetchMore,
  ]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !dataState.isLoading &&
          dataState.hasMore
        ) {
          loadMoreData();
        }
      },
      {
        threshold: 0.5,
        rootMargin: "400px 0px",
      }
    );

    if (loaderRef.current && dataState.hasMore) {
      observerRef.current.observe(loaderRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreData, dataState.hasMore, dataState.isLoading]);

  return (
    <>
      <div className="more-cards">
        {dataState.items.map(
          (genre: IGenre, index: number) =>
            index > 0 && (
              <Carousel
                key={`${genre.value}-carousel`}
                category={genre.value}
              />
            )
        )}
      </div>

      {!dataState.isLoading && dataState.hasMore && (
        <div
          ref={loaderRef}
          className="flex justify-center py-8 min-h-20"
        ></div>
      )}
    </>
  );
}

export default CarouselSection;
