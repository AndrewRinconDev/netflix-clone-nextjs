'use client';
import React, { memo, useRef, useState, useCallback, useEffect } from "react";

import Card from "../card/Card";
import { IMovie } from "@/hooks/useCategories";
import CarouselSkeleton from "@/components/skeletons/carouselSkeleton/CarouselSkeleton";
import CarouselNavigationButton from "../carouselNavigationButton/CarouselNavigationButton";
import { useHoverContext } from "@/contexts/HoverContext";

import "./Carousel.styles.css";

interface ICarouselProps {
  category?: string;
  movies: IMovie[];
}

const Carousel = ({ category, movies }: ICarouselProps) => {
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { showHover, hideHover, forceHideHover, resetHoverState } = useHoverContext();

  const checkScrollState = useCallback(() => {
    if (!cardsRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = cardsRef.current;
    const tolerance = 1;
    
    const newCanScrollLeft = scrollLeft > tolerance;
    const newCanScrollRight = scrollLeft < (scrollWidth - clientWidth - tolerance);
    
    if (newCanScrollLeft !== canScrollLeft || newCanScrollRight !== canScrollRight) {
      setCanScrollLeft(newCanScrollLeft);
      setCanScrollRight(newCanScrollRight);
    }
  }, [canScrollLeft, canScrollRight]);

  const scrollTo = useCallback((direction: 'left' | 'right') => {
    if (!cardsRef.current) return;

    // Force hide hover immediately when scrolling
    forceHideHover();
    
    const container = cardsRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    
    if (direction === 'left') {
      container.scrollTo({
        left: Math.max(0, container.scrollLeft - scrollAmount),
        behavior: 'smooth'
      });
    } else {
      container.scrollTo({
        left: Math.min(
          container.scrollWidth - container.clientWidth,
          container.scrollLeft + scrollAmount
        ),
        behavior: 'smooth'
      });
    }

    // Check scroll state after smooth scroll completes
    setTimeout(checkScrollState, 500);
  }, [checkScrollState, forceHideHover]);

  // Single useEffect to handle scroll events and initial setup
  useEffect(() => {
    const container = cardsRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      // Hide hover on scroll to prevent positioning issues
      forceHideHover();
      
      clearTimeout(scrollTimeout);
      checkScrollState();
      
      scrollTimeout = setTimeout(() => {
        checkScrollState();
      }, 100);
    };
    
    container.addEventListener('scroll', handleScroll);
    
    // Initial check and data change check
    const initialTimer = setTimeout(checkScrollState, 100);
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
      clearTimeout(initialTimer);
    };
  }, [checkScrollState, forceHideHover]);

  // Check scroll state when data changes
  useEffect(() => {
    if (movies) {
      const timer = setTimeout(checkScrollState, 100);
      return () => clearTimeout(timer);
    }
  }, [movies, checkScrollState]);

  // Reset hover state when component unmounts or movies change
  useEffect(() => {
    return () => {
      resetHoverState();
    };
  }, [resetHoverState]);

  // Show skeleton while movies are loading
  if (!movies || movies.length === 0) {
    return <CarouselSkeleton />;
  }

  return (
    <div className="carousel-container">
      <h2 className="carousel-title">{category}</h2>
      
      <div className="carousel-wrapper">
        <div className="card-list" ref={cardsRef}>
          {movies.map((movie) => (
            <Card
              key={movie.id}
              movie={movie}
              onMouseEnter={(e) => showHover(e, movie)}
            />
          ))}
        </div>
        
        {/* Navigation Buttons */}
        {canScrollLeft && (
          <CarouselNavigationButton
            direction="left"
            scrollTo={scrollTo}
            category={category}
          />
        )}
        
        {canScrollRight && (
          <CarouselNavigationButton
            direction="right"
            scrollTo={scrollTo}
            category={category}
          />
        )}
      </div>
    </div>
  );
};

export default memo(Carousel); 