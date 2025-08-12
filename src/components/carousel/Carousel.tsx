'use client';
import React, { memo, useRef, useState, useCallback, useEffect } from "react";

import { IMovie } from "@/types/media";
import { useQuery } from "@apollo/client";
import { GET_MOVIES_BY_GENRE } from "@/lib/gql/queries";
import CarouselSkeleton from "@/components/skeletons/carouselSkeleton/CarouselSkeleton";
import CarouselNavigationButton from "../carouselNavigationButton/CarouselNavigationButton";
import Card from "../card/Card";

import "./Carousel.styles.css";

interface ICarouselProps {
  category?: string;
}

const Carousel = ({ category }: ICarouselProps) => {
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { loading, data } = useQuery(GET_MOVIES_BY_GENRE, {
    variables: { genre: category, pageState: null },
  });

  const checkScrollState = useCallback(() => {
    if (!cardsRef.current) {
      return;
    }
    
    const { scrollLeft, scrollWidth, clientWidth } = cardsRef.current;
    
    // Add small tolerance for better button behavior
    const tolerance = 1;
    
    const newCanScrollLeft = scrollLeft > tolerance;
    const newCanScrollRight = scrollLeft < (scrollWidth - clientWidth - tolerance);
    
    // Only update state if values actually changed
    if (newCanScrollLeft !== canScrollLeft || newCanScrollRight !== canScrollRight) {      
      setCanScrollLeft(newCanScrollLeft);
      setCanScrollRight(newCanScrollRight);
    }
  }, [category, canScrollLeft, canScrollRight]);

  const scrollTo = useCallback((direction: 'left' | 'right') => {
    if (!cardsRef.current) return;
    
    const container = cardsRef.current;
    const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of visible width
    
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

    // Force check scroll state after smooth scroll completes
    setTimeout(() => {
      checkScrollState();
    }, 500); // Restored to 500ms to ensure smooth scroll completes
  }, [category, checkScrollState]);

  // Add scroll event listener with debouncing
  useEffect(() => {
    const container = cardsRef.current;
    if (container) {
      let scrollTimeout: NodeJS.Timeout;
      
      const handleScroll = () => {
        // Clear previous timeout
        clearTimeout(scrollTimeout);
        
        // Check scroll state immediately for better responsiveness
        checkScrollState();
        
        // Set new timeout to check scroll state after scroll ends (for final position)
        scrollTimeout = setTimeout(() => {
          checkScrollState();
        }, 100);
      };
      
      container.addEventListener('scroll', handleScroll);
      
      // Initial check only once
      setTimeout(checkScrollState, 100);
      
      return () => {
        container.removeEventListener('scroll', handleScroll);
        clearTimeout(scrollTimeout);
      };
    }
  }, [checkScrollState]);

  // Check when data changes
  useEffect(() => {
    if (data?.movies?.values) {
      setTimeout(checkScrollState, 200);
    }
  }, [data, checkScrollState]);

  // Force check on mount
  useEffect(() => {
    setTimeout(checkScrollState, 500);
  }, [checkScrollState]);

  // Listen for window resize to recheck scroll state
  useEffect(() => {
    const handleResize = () => {
      if (cardsRef.current) {
        setTimeout(checkScrollState, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [checkScrollState]);
  
  if (loading || !data || !data.movies) return (
    <CarouselSkeleton />
  );

  return (
    <div className="title-cards">
      <h2>{category}</h2>
      <div className="carousel-container">
        <div className="carousel-wrapper">
          <div className="card-list" ref={cardsRef}>
            {data.movies.values.map((movie: IMovie, index: number) => {
              return (
                <Card
                  linkUrl={`/detail/${movie.id}`}
                  key={`card-${category}-${index}`}
                  imageSource={`/images/movies/${movie.imagePath}`}
                  title={`${movie.title}-thumbnail`}
                />
              );
            })}
          </div>
          
          {/* Navigation Buttons */}
          {canScrollLeft && (
            <CarouselNavigationButton direction="left" scrollTo={scrollTo} category={category} />
          )}
          
          {canScrollRight && (
            <CarouselNavigationButton direction="right" scrollTo={scrollTo} category={category} />
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(Carousel); 