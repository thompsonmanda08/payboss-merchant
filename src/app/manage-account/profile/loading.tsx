"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading({}) {
  return (
    <div className="w-full mx-auto p-4 space-y-4">
      {/* Short title skeleton */}
      <Skeleton className="h-9 w-1/4" />

      {/* Longer subtitle skeleton */}
      <Skeleton className="h-6 w-3/4" />

      {/* Full width divider */}
      <Skeleton className="h-5 w-full" />

      {/* First content block */}
      <Skeleton className="h-32 w-full" />

      {/* Second content block */}
      <Skeleton className="h-60 w-full" />
      {/* Second content block */}
      <Skeleton className="h-48 w-full" />
      {/* Second content block */}
    </div>
  );
}
