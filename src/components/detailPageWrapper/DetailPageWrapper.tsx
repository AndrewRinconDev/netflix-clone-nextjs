'use client'
import { useState } from "react";

import { IMovie } from "@/types/media";
import HeroDetail from "../heroDetail/HeroDetail";
import VideoPlayer from "../videoPlayer/VideoPlayer";

import "./DetailPageWrapper.styles.css";

interface IDetailPageWrapperProps {
  movie: IMovie;
}

function DetailPageWrapper({ movie }: IDetailPageWrapperProps) {
  const [showPlayer, setShowPlayer] = useState(false);

  return (
    <div className="detail-page-wrapper">
      {!showPlayer ? (
        <HeroDetail movie={movie} onPlayClick={() => setShowPlayer(true)} />
      ) : (
        <VideoPlayer
          movie={movie}
          autoPlay
          loop
          controls
          onBackClick={() => setShowPlayer(false)}
        />
      )}
    </div>
  );
}

export default DetailPageWrapper;
