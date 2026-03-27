import React from 'react';
import { Skeleton } from './Skeleton';

interface SkeletonTableRowProps {
  cols?: number;
}

const SkeletonTableRow = ({ cols = 6 }: SkeletonTableRowProps) => {
  const widths = ['w-20', 'w-24', 'w-16', 'w-28', 'w-12', 'w-18'];
  return (
    <div className="flex space-x-4">
      {Array.from({ length: cols }, (_, i) => (
        <Skeleton key={i} height="h-4" width={widths[i % widths.length]} />
      ))}
    </div>
  );
};

export { SkeletonTableRow };