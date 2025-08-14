import React from "react";

import "./CarouselSectionSkeleton.styles.css";

interface CarouselSectionSkeletonProps {
  rows?: number;
}

const CarouselSectionSkeleton: React.FC<CarouselSectionSkeletonProps> = ({ rows = 4 }) => {
  return (
    <div className="carousel-skeleton-container">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="carousel-skeleton-row">
          <div className="carousel-skeleton-title">
            <div className="skeleton-title-bar"></div>
          </div>
          <div className="carousel-skeleton-cards">
            {Array.from({ length: 6 }).map((_, cardIndex) => (
              <div key={cardIndex} className="skeleton-card">
                <div className="skeleton-image"></div>
                <div className="skeleton-text">
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CarouselSectionSkeleton;
