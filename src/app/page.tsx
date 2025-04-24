"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebase";
import TitleCards from "@/components/navigation/titileCards/TitleCards";
import hero_banner from '@/assets/hero_banner.jpg'
import hero_title from '@/assets/hero_title.png'
import play_icon from '@/assets/icons/play_icon.png'
import info_icon from '@/assets/icons/info_icon.png'
import { GET_ALL_GENRES } from "@/lib/apollo/queries";
import LoadingSpinner from "@/components/loadingSpinner/LoadingSpinner";

import "./page.style.css";

const App = () => {
  const router = useRouter();
  const { loading, error, data } = useQuery(GET_ALL_GENRES, {
    variables: { limit: "4" },
  });

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }
    });
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) {
    console.error("Error fetching genres:", error);
    return <div>Error fetching genres</div>;
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
          <TitleCards />
        </div>
      </div>
      <div className="more-cards">
        {data.reference_list.values.map((item: any) => (
          <TitleCards key={`${item.value}-carousel`} category={item.value} />
        ))}
        {/* <TitleCards title={"Blockbuster Movies"} category={"top_rated"} />
        <TitleCards title={"Only on Netflix"} category={"popular"} />
        <TitleCards title={"Upcoming"} category={"upcoming"} />
        <TitleCards title={"Top Pics for You"} category={"now_playing"} /> */}
      </div>
    </>
  );
};

export default App;
