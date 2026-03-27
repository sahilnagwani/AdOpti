import React from 'react';
import { Skeleton } from './Skeleton';
import { SkeletonTableRow } from './SkeletonTableRow';

interface SkeletonTableProps {
  rows?: number;
  cols?: number;
}

const SkeletonTable = ({ rows = 5, cols = 6 }: SkeletonTableProps) => {
  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        {Array.from({ length: cols }, (_, i) => (
          <Skeleton key={i} height="h-4" width="w-20" />
        ))}
      </div>
      {Array.from({ length: rows }, (_, i) => (
        <SkeletonTableRow key={i} cols={cols} />
      ))}
    </div>
  );
};

export { SkeletonTable };