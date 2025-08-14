"use client";
import { memo, useCallback, useMemo } from "react";
import { FaCalendarAlt, FaPlay, FaRegClock } from "react-icons/fa";
import { MdOutlineLocalMovies } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { IoIosStar } from "react-icons/io";

import { IMovie } from "@/types/media";
import { formatDuration, formatVoteAverage } from "@/services/detailPageService";

import "./HeroDetail.styles.css";

interface IHeroDetailProps {
  movie: IMovie;
  onPlayClick?: () => void;
}

const HeroDetail = ({ movie, onPlayClick }: IHeroDetailProps) => {
  const router = useRouter();

  // Memoize event handlers
  const handleBackClick = useCallback(() => {
    router.back();
  }, [router]);

  const handlePlayClick = useCallback(() => {
    onPlayClick?.();
  }, [onPlayClick]);

  // Memoize computed values
  const imageSrc = useMemo(() => `/images/movies/${movie.imagePath}`, [movie.imagePath]);
  
  const badges = useMemo(() => [
    { icon: <MdOutlineLocalMovies />, text: movie.genre },
    { icon: <FaCalendarAlt />, text: movie.year.toString() },
    { icon: <FaRegClock />, text: formatDuration(movie.duration) },
    { icon: <IoIosStar />, text: formatVoteAverage(movie.voteAverage) }
  ], [movie.genre, movie.year, movie.duration, movie.voteAverage]);

  return (
    <>
      <div className="image-container">
        <img
          src={imageSrc}
          alt={`${movie.title}-thumbnail`}
          loading="eager"
          decoding="async"
        />
        <div className="overlay"></div>
      </div>

      <div className="detail-container">
        <h1>{movie.title}</h1>
        <div className="detail-badges">
          {badges.map((badge, index) => (
            <span key={index} className="badge">
              {badge.icon}
              {badge.text}
            </span>
          ))}
        </div>
        <p>{movie.synopsis}</p>
        <div className="detail-buttons">
          <button className="play-button" onClick={handlePlayClick}>
            <FaPlay className="play-icon" />
            Watch Now
          </button>
          <button className="back-button" onClick={handleBackClick}>
            <IoIosArrowBack className="back-icon" size={20} />
            Home
          </button>
        </div>
      </div>
    </>
  );
};

export default memo(HeroDetail);
