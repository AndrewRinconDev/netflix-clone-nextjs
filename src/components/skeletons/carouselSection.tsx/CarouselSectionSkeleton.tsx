import React from "react";
import CarouselSkeleton from "../carouselSkeleton/CarouselSkeleton";

import "./CarouselSectionSkeleton.styles.css";

interface CarouselSectionSkeletonProps {
  rows?: number;
  cardsPerRow?: number;
}

const CarouselSectionSkeleton: React.FC<CarouselSectionSkeletonProps> = ({ 
  rows = 4, 
  cardsPerRow = 6 
}) => {
  return (
    <div className="carousel-section-skeleton">
      {Array.from({ length: rows }).map((_, index) => (
        <CarouselSkeleton 
          key={index} 
          cards={cardsPerRow} 
          category={`Loading Category ${index + 1}...`}
        />
      ))}
    </div>
  );
};

export default CarouselSectionSkeleton;
