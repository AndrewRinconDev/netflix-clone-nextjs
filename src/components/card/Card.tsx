import React from "react";
import Link from "next/link";
import { IMovie } from "@/types/media";

interface ICardProps {
  movie: IMovie;
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>, movie: IMovie) => void;
}

const Card: React.FC<ICardProps> = ({ movie, onMouseEnter }) => {
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log('Card mouse enter:', movie.title);
    onMouseEnter(e, movie);
  };

  return (
    <div 
      className="card"
      onMouseEnter={handleMouseEnter}
    >
      <Link href={`/detail/${movie.id}`}>
        <img 
          src={`/images/movies/${movie.imagePath}`} 
          alt={movie.title} 
        />
      </Link>
    </div>
  );
};

export default Card;
