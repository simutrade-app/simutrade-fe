import React from 'react';

interface LoadingFallbackProps {
  message?: string;
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  message = 'Loading...',
}) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <span className="loading-text">{message}</span>
    </div>
  );
};

export default LoadingFallback;
