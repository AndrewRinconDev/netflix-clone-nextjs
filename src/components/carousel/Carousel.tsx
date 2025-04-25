import React, { memo, useEffect, useRef } from "react";
import Link from "next/link";

import { Movie } from "@/types/media";
import { useQuery } from "@apollo/client";
import { GET_MOVIES_BY_GENRE } from "@/lib/gql/queries";
import CarouselSkeleton from "@/components/skeletons/carousel/CarouselSkeleton";

import "./Carousel.styles.css";

interface ICarouselProps {
  category?: string;
}

const Carousel = ({ category }: ICarouselProps) => {
  const cardsRef = useRef<HTMLDivElement | null>(null);

  const { loading, data } = useQuery(GET_MOVIES_BY_GENRE, {
    variables: { genre: category, pageState: null },
  });

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    if (!cardsRef.current) return;

    // cardsRef.current.scrollLeft += event.deltaY;
  };

  useEffect(() => {
    if (!cardsRef.current) return;
    cardsRef.current?.addEventListener("wheel", handleWheel as EventListener);
  }, [cardsRef.current]);
  
  if (loading || !data || !data.movies_by_genre) return (
    <CarouselSkeleton />
  );

  return (
    <div className="title-cards">
      <h2>{category}</h2>
      <div className="card-list" ref={cardsRef}>
        {data.movies_by_genre.values.map((movie: Movie, index: number) => {
          return (
            <Link href={`/detail/${movie.id}`} className="card" key={index}>
              <video className="video">
                <source src={movie.thumbnail} type="video/mp4" />
              </video>
              {/* <img
                src="/images/movies/creed_1.jpg"
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

export default memo(Carousel);
