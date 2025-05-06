"use client";
import { FaCalendarAlt, FaPlay, FaRegClock } from "react-icons/fa";
import { MdOutlineLocalMovies } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { IoIosStar } from "react-icons/io";

import { IMovie } from "@/types/media";

import "./HeroDetail.styles.css";

interface IHeroDetailProps {
  movie: IMovie;
  onPlayClick?: () => void;
}

function HeroDetail({ movie, onPlayClick }: IHeroDetailProps) {
   const router = useRouter()

  const onBackClick = () => {
    router.back();
  };

  return (
    <>
    <div className="image-container">
        <img
          src={`/images/movies/${movie.imagePath}`}
          alt={`${movie.title}-thumbnail`}
        />
        <div className="overlay"></div>
      </div>

      <div className="detail-container">
        <h1>{movie.title}</h1>
        <div className="detail-badges">
          <span className="badge">
            <MdOutlineLocalMovies />
            {movie.genre}
          </span>
          <span className="badge">
            <FaCalendarAlt />
            {movie.year}
          </span>
          <span className="badge">
            <FaRegClock />
            {movie.duration} min
          </span>
          <span className="badge">
            <IoIosStar />
            {movie.voteAverage}
          </span>
        </div>
        <p>{movie.synopsis}</p>
        <div className="detail-buttons">
          <button className="play-button" onClick={onPlayClick}>
            <FaPlay className="play-icon" />
            Watch Now
          </button>
          <button
            className="back-button"
            onClick={onBackClick}
          >
            <IoIosArrowBack className="back-icon" size={20} />
            Home
          </button>
        </div>
      </div>
    </>
  );
}

export default HeroDetail;
