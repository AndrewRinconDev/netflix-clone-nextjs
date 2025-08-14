import React from "react";
import "./VideoPlayerSkeleton.styles.css";

const VideoPlayerSkeleton = () => {
  return (
    <div className="video-player-skeleton">
      {/* Video container skeleton */}
      <div className="video-container-skeleton">
        <div className="video-placeholder">
          <div className="play-icon-skeleton"></div>
        </div>
        
        {/* Overlay skeleton similar to VideoPlayer */}
        <div className="overlay-skeleton">
          <div className="back-button-skeleton">
            <div className="back-icon-skeleton"></div>
          </div>
          <div className="title-skeleton"></div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerSkeleton;
