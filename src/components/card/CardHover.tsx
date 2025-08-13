"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";

import { IMovie } from "@/types/media";
import "./CardHover.styles.css";
import LinkButton from "../detailLink/DetailLink";

interface CardHoverProps {
  movie: IMovie;
  isVisible: boolean;
  position: { x: number; y: number };
  onMouseLeave: () => void;
}

const CardHover: React.FC<CardHoverProps> = ({
  movie,
  isVisible,
  position,
  onMouseLeave,
}) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const detailLink = `/detail/${movie.id}`;

  // Reset video state when movie changes
  useEffect(() => {
    setIsVideoLoaded(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }, [movie.id]);

  useEffect(() => {
    if (isVisible && videoRef.current) {
      // Start video when hover becomes visible
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Handle autoplay restrictions
        console.error("Video autoplay blocked");
      });
    } else if (videoRef.current) {
      // Pause video when hover is hidden
      videoRef.current.pause();
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVideoLoaded(true);
        // Ensure video plays after loading
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.play().catch(() => {
              console.error("Video autoplay blocked after loading");
            });
          }
        }, 100); // Small delay to ensure video is ready
      }, 500); // Show video after 1 second of hover

      return () => clearTimeout(timer);
    } else {
      setIsVideoLoaded(false);
    }
  }, [isVisible, movie.title]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="card-hover"
      style={{
        left: position.x,
        top: position.y,
      }}
      onMouseLeave={onMouseLeave}
    >
      {/* Video Preview */}
      <LinkButton href={detailLink}>
        <div className="video-container">
            {isVideoLoaded && (
              <video
                key={`video-${movie.id}`} // Force re-render when movie changes
                ref={videoRef}
                className="hover-video"
                autoPlay={true}
                loop={true}
                muted={true}
                poster={`/images/movies/${movie.imagePath}`}
              >
                <source src={movie.thumbnail} type="video/mp4" />
              </video>
            )}
            {!isVideoLoaded && (
              <img
                src={`/images/movies/${movie.imagePath}`}
                alt={movie.title}
                className="hover-image"
              />
            )}
        </div>
      </LinkButton>

      {/* Content Overlay */}
      <div className="hover-content">
        <div className="hover-header">
          <h3 className="hover-title">{movie.title}</h3>
          <div className="hover-meta">
            <span className="hover-year">{movie.year}</span>
            <span className="hover-duration">{movie.duration}m</span>
            <span className="hover-rating">
              ★ {movie.voteAverage.toFixed(1)}
            </span>
          </div>
        </div>

        {/* <p className="hover-synopsis">{movie.synopsis}</p> */}

        <div className="hover-actions">
          <LinkButton href={detailLink} className="hover-play-btn">▶ Play</LinkButton>
          <LinkButton href={detailLink} className="hover-info-btn">ℹ More Info</LinkButton>
        </div>
      </div>
    </div>
  );
};
export default CardHover;
