import React, { Suspense } from "react";
import CarouselSectionSkeleton from "@/components/skeletons/carouselSection.tsx/CarouselSectionSkeleton";
import CarouselSection from "@/components/carouselSection/CarouselSection";
import HeroBanner from "@/components/heroBanner/HeroBanner";
import { config, buildApiUrl } from "@/utils/config";

// Function to fetch initial categories
async function getInitialCategories() {
  try {
    const url = buildApiUrl(config.api.categories, {
      pageSize: config.pagination.initialLoadSize.toString()
    });

    const response = await fetch(url, {
      cache: 'no-store' // Ensure fresh data
    });

    if (!response.ok) {
      console.error('Failed to fetch initial categories');
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching initial categories:', error);
    return null;
  }
}

async function HomePage() {
  // Preload initial categories
  const initialData = await getInitialCategories();

  return (
    <>
      <HeroBanner />
      
      <Suspense fallback={<CarouselSectionSkeleton rows={4} />}>
        <CarouselSection initialData={initialData} />
      </Suspense>
    </>
  );
}

export default HomePage;
