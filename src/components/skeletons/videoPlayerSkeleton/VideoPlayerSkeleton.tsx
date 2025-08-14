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
      </div>
      
      {/* Controls skeleton */}
      <div className="controls-skeleton">
        <div className="progress-bar-skeleton">
          <div className="progress-fill-skeleton"></div>
        </div>
        
        <div className="control-buttons-skeleton">
          <div className="control-button-skeleton"></div>
          <div className="control-button-skeleton"></div>
          <div className="control-button-skeleton"></div>
          <div className="control-button-skeleton"></div>
        </div>
      </div>
      
      {/* Back button skeleton */}
      <div className="back-button-skeleton">
        <div className="back-icon-skeleton"></div>
        <div className="back-text-skeleton"></div>
      </div>
    </div>
  );
};

export default VideoPlayerSkeleton;
