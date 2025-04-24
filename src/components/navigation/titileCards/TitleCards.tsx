import React, { useEffect, useRef } from "react";
import Link from "next/link";

import { Media } from "@/types/media";
import { useQuery } from "@apollo/client";
import { GET_MOVIES_BY_GENRE } from "@/lib/apollo/queries";

import "./TitleCards.style.css";

interface ITitleCardsProps {
  category?: string;
}

const TitleCards = ({ category }: ITitleCardsProps) => {
  const cardsRef = useRef<HTMLDivElement | null>(null);

  const { loading, error, data } = useQuery(GET_MOVIES_BY_GENRE, {
    variables: { genre: category, pageState: null },
  });

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    console.log('***********', cardsRef.current);
    if (!cardsRef.current) return;

    cardsRef.current.scrollLeft += event.deltaY;
  };

  useEffect(() => {
    console.log('***********2', cardsRef.current);
    if (!cardsRef.current) return;
    cardsRef.current?.addEventListener("wheel", handleWheel as EventListener);
  }, [cardsRef.current]);
  
  if (loading || error) return;

  return (
    <div className="title-cards">
      <h2>{category}</h2>
      <div className="card-list" ref={cardsRef}>
        {data.movies_by_genre.values.map((movie: Media, index: number) => {
          return (
            <Link href={`/player/${movie.id}`} className="card" key={index}>
              <video className="video">
                <source src={movie.thumbnail} type="video/mp4" />
              </video>
              {/* <img
                src="/background_banner.jpg"
                alt={`${movie.title}-thumbnail`}
              /> */}
              <p>{movie.title}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TitleCards;
