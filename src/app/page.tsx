import React, { Suspense } from "react";
import CarouselSectionSkeleton from "@/components/skeletons/carouselSection.tsx/CarouselSectionSkeleton";
import CarouselSection from "@/components/carouselSection/CarouselSection";
import HeroBanner from "@/components/heroBanner/HeroBanner";
import { getInitialCategories } from "@/services/categoriesService";

async function HomePage() {
  // Preload initial categories for faster content display
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
