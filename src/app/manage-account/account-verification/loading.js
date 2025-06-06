"use client";

import { Skeleton } from "@heroui/react";

export default function AccountVerificationLoading({}) {
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-9 w-80 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
        {/* Progress Tracker Skeleton */}
        <div className="relative">
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-100" />
          <div className="space-y-12 relative">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="flex items-start gap-4 relative">
                <Skeleton className="w-12 h-12 rounded-full z-10" />
                <div className="pt-2 space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="bg-white rounded-lg border p-6">
          {/* Header Section */}
          <div className="mb-6">
            <Skeleton className="h-6 w-80 mb-2" />
            <Skeleton className="h-4 w-full max-w-2xl" />
          </div>

          {/* Document Upload Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Regular Document Cards */}
            {Array.from({ length: 9 }).map((_, index) => (
              <DocumentCardSkeleton key={index} />
            ))}

            {/* Drag & Drop Area */}
            <div className="col-span-2">
              <Skeleton className="h-4 w-32 mb-2" />
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center">
                <Skeleton className="w-8 h-8 rounded mb-2" />
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>

          {/* Confirmation Section */}
          <div className="mt-8 flex items-start gap-3">
            <Skeleton className="w-4 h-4 mt-1 rounded" />
            <div className="space-y-1 flex-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <Skeleton className="h-10 w-36 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 relative">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <Skeleton className="h-5 w-12 rounded mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex gap-1">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
      <Skeleton className="h-4 w-20 mt-2" />
    </div>
  );
}
