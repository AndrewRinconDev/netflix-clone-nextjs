"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

import { IMovie } from "@/hooks/useCategories";
import DetailLink from "../detailLink/DetailLink";
import info_icon from "@/assets/icons/info_icon.png";
import play_icon from "@/assets/icons/play_icon.png";

import "./CardHover.styles.css";

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
  const mouseLeaveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastMovieIdRef = useRef<string | null>(null);
  const detailLink = `/detail/${movie.id}`;

  // Reset video state when movie changes
  useEffect(() => {
    if (lastMovieIdRef.current !== movie.id) {
      setIsVideoLoaded(false);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
      lastMovieIdRef.current = movie.id;
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
        }, 30); // Reduced delay for better responsiveness
      }, 200); // Reduced from 300ms to 200ms for faster video loading

      return () => clearTimeout(timer);
    } else {
      setIsVideoLoaded(false);
    }
  }, [isVisible, movie.title]);

  // Enhanced mouse leave handling with shorter delay
  const handleMouseLeave = useCallback(() => {
    // Clear any existing timeout
    if (mouseLeaveTimeoutRef.current) {
      clearTimeout(mouseLeaveTimeoutRef.current);
    }

    // Set a very small delay to prevent flickering when moving between elements
    mouseLeaveTimeoutRef.current = setTimeout(() => {
      onMouseLeave();
    }, 20); // Reduced from 30ms to 20ms for better responsiveness
  }, [onMouseLeave]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mouseLeaveTimeoutRef.current) {
        clearTimeout(mouseLeaveTimeoutRef.current);
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="card-hover"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video Preview */}
      <DetailLink href={detailLink}>
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
      </DetailLink>

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
          <DetailLink href={detailLink} className="hover-play-btn">
            <Image src={play_icon} alt="" />
            Play
          </DetailLink>
          <DetailLink href={detailLink} className="hover-info-btn">
            <Image src={info_icon} alt="" />
            More Info
          </DetailLink>
        </div>
      </div>
    </div>
  );
};
export default CardHover;
