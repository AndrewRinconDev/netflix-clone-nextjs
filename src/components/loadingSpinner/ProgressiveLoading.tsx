import React, { useState, useEffect } from "react";
import "./ProgressiveLoading.styles.css";

interface ProgressiveLoadingProps {
  totalCategories: number;
  loadedCategories: number;
  onComplete?: () => void;
}

const ProgressiveLoading: React.FC<ProgressiveLoadingProps> = ({ 
  totalCategories, 
  loadedCategories, 
  onComplete 
}) => {
  const [progress, setProgress] = useState(0);
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    const percentage = (loadedCategories / totalCategories) * 100;
    setProgress(percentage);

    if (percentage >= 100) {
      setShowComplete(true);
      setTimeout(() => {
        onComplete?.();
      }, 1000);
    }
  }, [loadedCategories, totalCategories, onComplete]);

  return (
    <div className="progressive-loading">
      <div className="loading-header">
        <h2>Loading Categories</h2>
        <p>{loadedCategories} of {totalCategories} categories loaded</p>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="loading-status">
        {showComplete ? (
          <div className="complete-message">
            <span className="checkmark">✓</span>
            All categories loaded successfully!
          </div>
        ) : (
          <div className="loading-message">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            Loading amazing content...
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressiveLoading;
