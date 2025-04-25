"use client";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";
import hero_banner from "@/assets/hero_banner.jpg";
import hero_title from "@/assets/hero_title.png";
import play_icon from "@/assets/icons/play_icon.png";
import info_icon from "@/assets/icons/info_icon.png";
import { auth } from "@/firebase/firebase";
import Carousel from "@/components/carousel/Carousel";
import CarouselSectionSkeleton from "@/components/skeletons/carouselSection.tsx/CarouselSectionSkeleton";

const HomePage = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [currentLimit, setCurrentLimit] = useState(4);
  const LazyCarouselSection = lazy(
    () => import("@/components/carouselSection/CarouselSection")
  );

  useEffect(() => {
    setIsClient(true);
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }
    });
  }, []);

  if (!isClient) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="hero">
        <Image src={hero_banner} alt="" className="banner-img" />
        <div className="hero-caption">
          <Image src={hero_title} alt="" className="caption-img" />
          <p>
            Discovering his ties to a secret ancient order, a young man living
            in modern Istanbul embarks on a quest to save the city from an
            immortal enemy.
          </p>
          <div className="hero-btns">
            <button className="btn text-black">
              <Image src={play_icon} alt="" />
              Play
            </button>
            <button className="btn dark-btn">
              <Image src={info_icon} alt="" />
              More Info
            </button>
          </div>
          <Carousel category="Action" />
        </div>
      </div>
      <Suspense fallback={<CarouselSectionSkeleton rows={currentLimit} />}>
        <LazyCarouselSection currentLimit={currentLimit} setCurrentLimit={setCurrentLimit} />
      </Suspense>
    </>
  );
};

export default HomePage;
