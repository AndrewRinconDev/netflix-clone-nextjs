"use client";
import React, { Suspense } from "react";
import { useQuery } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";

import hero_banner from "@/assets/hero_banner.jpg";
import hero_title from "@/assets/hero_title.png";
import play_icon from "@/assets/icons/play_icon.png";
import info_icon from "@/assets/icons/info_icon.png";
import Carousel from "@/components/carousel/Carousel";
import CarouselSectionSkeleton from "@/components/skeletons/carouselSection.tsx/CarouselSectionSkeleton";
import { GET_ALL_GENRES } from "@/lib/gql/queries";
import CarouselSection from "@/components/carouselSection/CarouselSection";
import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";

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
            <Link href="/detail/e3fe8d54-9457-4340-8b22-2285761c21e1" className="btn text-black">
              <Image src={play_icon} alt="" />
              Play
            </Link>
            <Link href="/detail/e3fe8d54-9457-4340-8b22-2285761c21e1" className="btn dark-btn">
              <Image src={info_icon} alt="" />
              More Info
            </Link>
          </div>
          <Carousel category="Action" />
        </div>
      </div>
          
      <Suspense fallback={<CarouselSectionSkeleton rows={4} />}>
        <CarouselSection initialData={data} />
      </Suspense>
    </>
  );
};

export default HomePage;
