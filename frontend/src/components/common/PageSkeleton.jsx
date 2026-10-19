import React from "react";
import Skeleton from "./Skeleton";
import { ProductCardSkeleton } from "./ProductCardSkeleton";

/**
 * Full page loading skeleton for smooth route transitions and initial loads
 */
export const PageSkeleton = () => {
  return (
    <div className="w-full min-h-screen bg-[#FEFAF8] flex flex-col justify-between">
      {/* Top simulated announcement + nav */}
      <div className="w-full border-b border-gray-100 bg-white/70 backdrop-blur-xs py-3 px-4 sm:px-8">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <Skeleton variant="rounded" className="h-8 w-36 sm:w-44" />
          <div className="hidden md:flex items-center gap-6">
            <Skeleton variant="text" className="h-4 w-16" />
            <Skeleton variant="text" className="h-4 w-16" />
            <Skeleton variant="text" className="h-4 w-16" />
            <Skeleton variant="text" className="h-4 w-16" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton variant="circular" className="w-8 h-8" />
            <Skeleton variant="circular" className="w-8 h-8" />
            <Skeleton variant="circular" className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Hero Banner Skeleton */}
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        <div className="h-48 sm:h-64 rounded-3xl overflow-hidden relative shadow-xs">
          <Skeleton variant="rectangular" className="w-full h-full" />
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 space-y-3 pointer-events-none">
            <Skeleton variant="rounded" className="h-5 w-24 rounded-full bg-white/70" />
            <Skeleton variant="text" className="h-8 sm:h-10 w-64 sm:w-96 bg-white/80" />
            <Skeleton variant="text" className="h-4 w-48 sm:w-72 bg-white/70" />
          </div>
        </div>

        {/* Section Heading Skeleton */}
        <div className="flex items-center justify-center gap-3 py-4">
          <Skeleton variant="circular" className="w-6 h-6" />
          <Skeleton variant="text" className="h-7 w-48" />
          <Skeleton variant="circular" className="w-6 h-6" />
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <ProductCardSkeleton key={i} viewMode="grid" />
          ))}
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="border-t border-gray-200/80 bg-white py-8 px-4 sm:px-8 mt-12">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Skeleton variant="text" className="h-4 w-48" />
          <div className="flex gap-4">
            <Skeleton variant="text" className="h-3 w-16" />
            <Skeleton variant="text" className="h-3 w-16" />
            <Skeleton variant="text" className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageSkeleton;
