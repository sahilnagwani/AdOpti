import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  rounded?: string;
}

const Skeleton = ({ className, width, height, rounded, ...props }: SkeletonProps) => {
  const style = {
    width: width,
    height: height,
    borderRadius: rounded,
  };
  return (
    <div
      className={cn('animate-pulse rounded-md bg-gray-200 dark:bg-gray-800', className)}
      style={style}
      {...props}
    />
  );
};

export { Skeleton };
