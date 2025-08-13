'use client';
import React, { memo, useRef, useState, useCallback, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_MOVIES_BY_GENRE } from "@/lib/gql/queries";

import Card from "../card/Card";
import { IMovie } from "@/types/media";
import CarouselSkeleton from "@/components/skeletons/carouselSkeleton/CarouselSkeleton";
import CarouselNavigationButton from "../carouselNavigationButton/CarouselNavigationButton";
import { useHoverContext } from "@/contexts/HoverContext";

import "./Carousel.styles.css";

interface ICarouselProps {
  category?: string;
}

const Carousel = ({ category }: ICarouselProps) => {
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const { showHover, hideHover } = useHoverContext();

  const { loading, data } = useQuery(GET_MOVIES_BY_GENRE, {
    variables: { genre: category, pageState: null },
  });

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

    hideHover();
    
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
  }, [checkScrollState]);

  // Single useEffect to handle scroll events and initial setup
  useEffect(() => {
    const container = cardsRef.current;
    if (!container) return;

    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
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
  }, [checkScrollState]);

  // Check scroll state when data changes
  useEffect(() => {
    if (data?.movies?.values) {
      setTimeout(checkScrollState, 200);
    }
  }, [data, checkScrollState]);
  
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
                  key={`card-${category}-${index}`}
                  movie={movie}
                  onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => showHover(e, movie)}
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