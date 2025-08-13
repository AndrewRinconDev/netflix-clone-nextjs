import React from "react";
import Link from "next/link";
import { IMovie } from "@/types/media";

interface ICardProps {
  movie: IMovie;
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
}

const Card: React.FC<ICardProps> = ({ movie, onMouseEnter, onMouseLeave }) => {
  return (
    <div 
      className="card"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
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
