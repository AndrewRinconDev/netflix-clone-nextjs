'use client'
import { useState, lazy, Suspense, useMemo } from "react";

import { IMovie } from "@/types/media";
import HeroDetail from "../heroDetail/HeroDetail";
import VideoPlayerSkeleton from "../skeletons/videoPlayerSkeleton/VideoPlayerSkeleton";

import "./DetailPageWrapper.styles.css";

// Lazy load VideoPlayer component for better performance
const VideoPlayer = lazy(() => import("../videoPlayer/VideoPlayer"));

interface IDetailPageWrapperProps {
  movie: IMovie;
}

function DetailPageWrapper({ movie }: IDetailPageWrapperProps) {
  const [showPlayer, setShowPlayer] = useState(false);

  // Memoize the movie data to prevent unnecessary re-renders
  const memoizedMovie = useMemo(() => movie, [movie]);

  // Memoize the HeroDetail component to prevent unnecessary re-renders
  const heroDetailComponent = useMemo(() => (
    <HeroDetail movie={memoizedMovie} onPlayClick={() => setShowPlayer(true)} />
  ), [memoizedMovie]);

  // Memoize the VideoPlayer component to prevent unnecessary re-renders
  const videoPlayerComponent = useMemo(() => (
    <Suspense fallback={<VideoPlayerSkeleton />}>
      <VideoPlayer
        movie={memoizedMovie}
        autoPlay
        loop
        controls
        onBackClick={() => setShowPlayer(false)}
      />
    </Suspense>
  ), [memoizedMovie]);

  return (
    <div className="detail-page-wrapper">
      {!showPlayer ? heroDetailComponent : videoPlayerComponent}
    </div>
  );
}

export default DetailPageWrapper;
