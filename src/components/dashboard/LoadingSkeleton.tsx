import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  className = '', 
  width, 
  height 
}) => {
  return (
    <div 
      className={`animate-pulse bg-gray-200 rounded-md ${className}`}
      style={{ width, height: height || '100%' }}
    />
  );
};
