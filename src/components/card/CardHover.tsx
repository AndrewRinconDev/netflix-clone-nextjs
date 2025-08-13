'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

import { IMovie } from '@/types/media';
import './CardHover.styles.css';

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
  onMouseLeave 
}) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && videoRef.current) {
      // Start video when hover becomes visible
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Handle autoplay restrictions
        console.log('Video autoplay blocked');
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
      }, 1000); // Show video after 1 second of hover

      return () => clearTimeout(timer);
    } else {
      setIsVideoLoaded(false);
    }
  }, [isVisible]);

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
      <div className="video-container">
        {isVideoLoaded && (
          <video
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

      {/* Content Overlay */}
      <div className="hover-content">
        <div className="hover-header">
          <h3 className="hover-title">{movie.title}</h3>
          <div className="hover-meta">
            <span className="hover-year">{movie.year}</span>
            <span className="hover-duration">{movie.duration}m</span>
            <span className="hover-rating">★ {movie.voteAverage.toFixed(1)}</span>
          </div>
        </div>
        
        {/* <p className="hover-synopsis">{movie.synopsis}</p> */}
        
        <div className="hover-actions">
          <Link 
            href={`/detail/${movie.id}`}
            className="hover-play-btn"
          >
            ▶ Play
          </Link>
          <Link 
            href={`/detail/${movie.id}`}
            className="hover-info-btn"
          >
            ℹ More Info
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardHover; 