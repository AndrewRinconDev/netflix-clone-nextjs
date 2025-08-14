import React from "react";
import "./DetailPageSkeleton.styles.css";

const DetailPageSkeleton = () => {
  return (
    <div className="detail-page-skeleton">
      {/* Image skeleton */}
      <div className="image-skeleton">
        <div className="skeleton-image"></div>
        <div className="skeleton-overlay"></div>
      </div>

      {/* Content skeleton */}
      <div className="content-skeleton">
        {/* Title skeleton */}
        <div className="skeleton-title"></div>
        
        {/* Badges skeleton */}
        <div className="skeleton-badges">
          <div className="skeleton-badge"></div>
          <div className="skeleton-badge"></div>
          <div className="skeleton-badge"></div>
          <div className="skeleton-badge"></div>
        </div>
        
        {/* Synopsis skeleton */}
        <div className="skeleton-synopsis">
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
        </div>
        
        {/* Buttons skeleton */}
        <div className="skeleton-buttons">
          <div className="skeleton-button skeleton-play"></div>
          <div className="skeleton-button skeleton-back"></div>
        </div>
      </div>
    </div>
  );
};

export default DetailPageSkeleton;
