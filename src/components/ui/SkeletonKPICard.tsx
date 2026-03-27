import React from 'react';
import { Skeleton } from './Skeleton';
import { Card, CardContent, CardHeader } from './card';

const SkeletonKPICard = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton height="40px" width="40px" rounded="100%" />
        <Skeleton height="h-3" width="w-24" />
      </CardHeader>
      <CardContent>
        <Skeleton height="h-8" width="w-36" className="mt-2" />
        <Skeleton height="h-3" width="w-20" className="mt-3" />
      </CardContent>
    </Card>
  );
};

export { SkeletonKPICard };
