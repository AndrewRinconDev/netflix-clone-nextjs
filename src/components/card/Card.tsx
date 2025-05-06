'use client';
import React, { memo, useRef } from "react";
import Link from "next/link";

import { IMovie } from "@/types/media";
import { useQuery } from "@apollo/client";
import { GET_MOVIES_BY_GENRE } from "@/lib/gql/queries";
import CarouselSkeleton from "@/components/skeletons/card/CardSkeleton";

import "./Card.styles.css";

interface ICarouselProps {
  category?: string;
}

const Card = ({ category }: ICarouselProps) => {
  const cardsRef = useRef<HTMLDivElement | null>(null);

  const { loading, data } = useQuery(GET_MOVIES_BY_GENRE, {
    variables: { genre: category, pageState: null },
  });

  // const handleWheel = (event: WheelEvent) => {
  //   event.preventDefault();
  //   if (!cardsRef.current) return;

  //   // TODO: Add button to scroll left and right
  //   // cardsRef.current.scrollLeft += event.deltaY;
  // };

  // useEffect(() => {
  //   if (!cardsRef.current) return;
  //   cardsRef.current?.addEventListener("wheel", handleWheel as EventListener);
  // }, [cardsRef.current]);
  
  if (loading || !data || !data.movies) return (
    <CarouselSkeleton />
  );

  return (
    <div className="title-cards">
      <h2>{category}</h2>
      <div className="card-list" ref={cardsRef}>
        {data.movies.values.map((movie: IMovie, index: number) => {
          return (
            <Link href={`/detail/${movie.id}`} className="card" key={index}>
              <img
                src={`/images/movies/${movie.imagePath}`}
                alt={`${movie.title}-thumbnail`}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default memo(Card);
