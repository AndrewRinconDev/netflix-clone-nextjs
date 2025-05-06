import { useState } from "react";

import BackButton from "../backButton/BackButton";

import IVideoPlayerProps from "./VideoPlayer.interfaces";
import "./VideoPlayer.styles.css";

function VideoPlayer({
  movie,
  autoPlay = true,
  loop = true,
  controls = true,
  muted = false,
  onBackClick,
}: IVideoPlayerProps) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [timeOutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const onShowOverlay = () => {
    setShowOverlay(true);
    clearTimeoutId();
    
    // Set a timeout to hide the overlay after 2.9 seconds
    // This is to ensure that the overlay is visible for a short time even if the mouse moves quickly
    const id = setTimeout(() => {
      setShowOverlay(false);
    }, 2900);
    setTimeoutId(id);
  };

  const clearTimeoutId = () => {
    if (timeOutId) {
      clearTimeout(timeOutId);
      setTimeoutId(null);
    }
  };

  const handleMouseLeave = () => {
    clearTimeoutId();
    setShowOverlay(false);
  };

  return (
    <div
      className="video-player-container"
      onMouseEnter={onShowOverlay}
      onMouseMove={onShowOverlay}
      onMouseLeave={handleMouseLeave}
    >
      <div className="video-player-wrapper">
        {showOverlay && (
          <div className="video-player-overlay">
            {onBackClick && <BackButton onBackClick={onBackClick} />}
            <h1>{movie.title}</h1>
          </div>
        )}
        <video
          className="video-player"
          controls={controls}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          poster={`/images/movies/${movie.imagePath}`}
        >
          <source src={movie.thumbnail} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

export default VideoPlayer;
