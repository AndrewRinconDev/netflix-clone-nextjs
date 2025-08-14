"use client";
import React, { Suspense, useEffect } from "react";

import CarouselSectionSkeleton from "@/components/skeletons/carouselSection.tsx/CarouselSectionSkeleton";
import CarouselSection from "@/components/carouselSection/CarouselSection";
import HeroBanner from "@/components/heroBanner/HeroBanner";
import { useCardHover } from "@/hooks/useCardHover";

function HomePage() {
  const { hideHover } = useCardHover();

  useEffect(() => {
    hideHover();
  }, [hideHover]);

  return (
    <>
      <HeroBanner />
          
      <Suspense fallback={<CarouselSectionSkeleton rows={4} />}>
        <CarouselSection />
      </Suspense>
    </>
  );
};

export default HomePage;
