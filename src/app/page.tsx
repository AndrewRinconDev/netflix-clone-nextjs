"use client";
import React, { Suspense } from "react";
import { useQuery } from "@apollo/client";

import CarouselSectionSkeleton from "@/components/skeletons/carouselSection.tsx/CarouselSectionSkeleton";
import { GET_ALL_GENRES } from "@/lib/gql/queries";
import CarouselSection from "@/components/carouselSection/CarouselSection";
import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import HeroBanner from "@/components/heroBanner/HeroBanner";

function HomePage() {
  const { data, loading } = useQuery(GET_ALL_GENRES, {
      variables: { pageSize: 4, pageState: null },
      context: {
        fetchOptions: {
          next: { revalidate: 60 }
        }
      }
    });

  if (loading) return <LoadingSpinner width={150} height={135} />;
  if (!data || !data.genres) return <div>No data available</div>;

  return (
    <>
      <HeroBanner />
          
      <Suspense fallback={<CarouselSectionSkeleton rows={4} />}>
        <CarouselSection initialData={data} />
      </Suspense>
    </>
  );
};

export default HomePage;
