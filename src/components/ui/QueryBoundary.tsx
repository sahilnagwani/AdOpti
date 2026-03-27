import React from 'react';
import { ErrorBanner } from './ErrorBanner';

interface QueryBoundaryProps<T> {
  isLoading: boolean;
  error: unknown;
  data: T | null | undefined;
  isEmpty?: (data: T) => boolean;
  skeleton: React.ReactNode;
  emptyState: React.ReactNode;
  onRetry?: () => void;
  children: (data: T) => React.ReactNode;
}

const QueryBoundary = <T,>({
  isLoading,
  error,
  data,
  isEmpty,
  skeleton,
  emptyState,
  onRetry,
  children,
}: QueryBoundaryProps<T>) => {
  if (isLoading) {
    return <>{skeleton}</>;
  }

  if (error) {
    return <ErrorBanner message="Failed to load data. Please try again." onRetry={onRetry} />;
  }

  if (!data || (isEmpty && isEmpty(data))) {
    return <>{emptyState}</>;
  }

  return <>{children(data)}</>;
};

export { QueryBoundary };