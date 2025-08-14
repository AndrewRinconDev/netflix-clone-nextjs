import React, { useCallback } from "react";

import { IMovie } from "@/hooks/useCategories";
import DetailLink from "../detailLink/DetailLink";

interface ICardProps {
  movie: IMovie;
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>, movie: IMovie) => void;
}

const Card: React.FC<ICardProps> = ({ movie, onMouseEnter }) => {
  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    onMouseEnter(e, movie);
  }, [movie, onMouseEnter]);

  return (
    <div 
      className="card"
      onMouseEnter={handleMouseEnter}
    >
      <DetailLink href={`/detail/${movie.id}`}>
        <img 
          src={`/images/movies/${movie.imagePath}`} 
          alt={movie.title} 
          loading="lazy"
          decoding="async"
        />
      </DetailLink>
    </div>
  );
};

export default Card;
