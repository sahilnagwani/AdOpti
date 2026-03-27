import React from 'react';
import { Skeleton } from './Skeleton';

const SkeletonChart = () => {
  return (
    <div className="space-y-4">
      <Skeleton width="w-32" height="h-4" />
      <div className="min-h-[280px] space-y-2">
        <Skeleton height="h-8" />
        <Skeleton height="h-6" />
        <Skeleton height="h-10" />
        <Skeleton height="h-4" />
      </div>
    </div>
  );
};

export { SkeletonChart };